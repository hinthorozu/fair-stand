"""Item is_cost_enabled is metadata. It does not change unit, type, or BOM identity."""

from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

from alembic.operations import Operations
from alembic.runtime.migration import MigrationContext
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.pool import StaticPool

from app.modules.fair_stand.api.dependencies import (
    PERMISSION_ITEMS_CREATE,
    PERMISSION_ITEMS_READ,
    PERMISSION_ITEMS_UPDATE,
    get_authorization_adapter,
)
from app.modules.fair_stand.infrastructure.seed_catalog import seed_fair_stand_catalog
from tests.modules.fair_stand.test_admin_items_api import SelectiveAuthorization


def _allow(client, codes: set[str]):
    client.app.dependency_overrides[get_authorization_adapter] = lambda: SelectiveAuthorization(
        allowed=codes
    )


def test_item_cost_enabled_column_is_required(test_engine):
    column = next(
        item
        for item in inspect(test_engine).get_columns("fair_stand_items")
        if item["name"] == "is_cost_enabled"
    )
    assert column["nullable"] is False
    assert column["default"] is not None


def test_seeded_items_start_excluded_from_cost(db_session):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    rows = db_session.execute(
        text(
            """
            SELECT item_key, item_type, unit, is_cost_enabled
            FROM fair_stand_items
            WHERE item_key IN ('digital_print', 'mesh_fabric', 'lightbox_fabric', 'wall_200_350')
            """
        )
    ).mappings().all()
    assert {row["item_key"] for row in rows} == {
        "digital_print",
        "mesh_fabric",
        "lightbox_fabric",
        "wall_200_350",
    }
    for row in rows:
        assert bool(row["is_cost_enabled"]) is False
    digital = next(row for row in rows if row["item_key"] == "digital_print")
    assert digital["item_type"] == "production"
    assert digital["unit"] == "metre_kare"
    enabled_keys = db_session.execute(
        text("SELECT item_key FROM fair_stand_items WHERE is_cost_enabled ORDER BY item_key")
    ).scalars().all()
    assert enabled_keys == ["metal_separator", "tulle_fabric"]


def test_admin_item_cost_flag_round_trip_leaves_other_fields(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    _allow(client, {PERMISSION_ITEMS_CREATE, PERMISSION_ITEMS_READ, PERMISSION_ITEMS_UPDATE})

    created = client.post(
        "/api/v1/fair-stand/admin/item-records",
        headers=auth_headers,
        json={"item_key": "cost_flag_sku", "name": "Cost Flag", "item_type": "panel", "unit": "adet"},
    )
    assert created.status_code == 201, created.text
    created_body = created.json()
    assert created_body["isCostEnabled"] is False
    assert created_body["unit"] == "adet"
    assert created_body["name"] == "Cost Flag"
    assert created_body["acceptsMesh"] is False

    enabled = client.put(
        "/api/v1/fair-stand/admin/item-records/cost_flag_sku",
        headers=auth_headers,
        json={"is_cost_enabled": True},
    )
    assert enabled.status_code == 200, enabled.text
    enabled_body = enabled.json()
    assert enabled_body["isCostEnabled"] is True
    assert enabled_body["name"] == "Cost Flag"
    assert enabled_body["unit"] == "adet"
    assert enabled_body["type"] == "panel"
    assert enabled_body["acceptsMesh"] is False
    assert enabled_body["isRender"] is False

    read = client.get("/api/v1/fair-stand/admin/item-records/cost_flag_sku", headers=auth_headers)
    assert read.status_code == 200
    assert read.json()["isCostEnabled"] is True
    assert read.json()["unit"] == "adet"

    disabled = client.put(
        "/api/v1/fair-stand/admin/item-records/cost_flag_sku",
        headers=auth_headers,
        json={"is_cost_enabled": False},
    )
    assert disabled.status_code == 200, disabled.text
    assert disabled.json()["isCostEnabled"] is False
    assert disabled.json()["name"] == "Cost Flag"
    assert disabled.json()["unit"] == "adet"

    catalog = client.get("/api/v1/fair-stand/catalog/bootstrap", headers=auth_headers)
    assert catalog.status_code == 200
    leaf = next(item for item in catalog.json()["items"] if item["itemKey"] == "digital_print")
    assert leaf["isCostEnabled"] is False
    assert leaf["unit"] == "metre_kare"
    assert leaf["type"] == "production"


def test_admin_item_list_exposes_and_sorts_cost_flag(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    _allow(client, {PERMISSION_ITEMS_READ, PERMISSION_ITEMS_UPDATE})
    enabled = client.put(
        "/api/v1/fair-stand/admin/item-records/digital_print",
        headers=auth_headers,
        json={"is_cost_enabled": True},
    )
    assert enabled.status_code == 200, enabled.text
    assert enabled.json()["unit"] == "metre_kare"
    assert enabled.json()["type"] == "production"

    listed = client.get(
        "/api/v1/fair-stand/admin/item-records",
        headers=auth_headers,
        params={"sort_by": "isCostEnabled", "sort_order": "desc", "pageSize": 25},
    )
    assert listed.status_code == 200, listed.text
    body = listed.json()
    assert body["sorting"]["field"] == "isCostEnabled"
    assert body["sorting"]["direction"] == "desc"
    assert [item["itemKey"] for item in body["items"][:3]] == [
        "digital_print",
        "metal_separator",
        "tulle_fabric",
    ]
    assert body["items"][0]["isCostEnabled"] is True
    assert body["items"][0]["name"] == "Dijital Baskı"
    assert body["items"][0]["type"] == "production"
    assert body["items"][1]["isCostEnabled"] is True
    assert body["items"][1]["name"] == "Metal Separatör"
    assert body["items"][2]["isCostEnabled"] is True
    assert body["items"][2]["name"] == "Tül"
    assert all(item["isCostEnabled"] is False for item in body["items"][3:])


def _load_migration():
    path = Path(__file__).resolve().parents[3] / "alembic" / "versions" / "0058_item_cost_enabled.py"
    spec = spec_from_file_location("fair_stand_0058_item_cost_enabled", path)
    assert spec is not None and spec.loader is not None
    migration = module_from_spec(spec)
    spec.loader.exec_module(migration)
    return migration


def test_item_cost_enabled_migration_backfills_false_and_downgrade_drops_column():
    migration = _load_migration()
    engine = create_engine("sqlite://", poolclass=StaticPool, connect_args={"check_same_thread": False})
    with engine.connect() as connection:
        connection.execute(
            text(
                """
                CREATE TABLE fair_stand_items (
                    item_key VARCHAR(128) PRIMARY KEY,
                    name VARCHAR(256) NOT NULL,
                    unit VARCHAR(64)
                )
                """
            )
        )
        connection.execute(
            text(
                """
                INSERT INTO fair_stand_items (item_key, name, unit)
                VALUES ('digital_print', 'Dijital Baskı', 'metre_kare')
                """
            )
        )
        connection.commit()

        context = MigrationContext.configure(connection)
        with Operations.context(context):
            migration.upgrade()
        connection.commit()

        row = connection.execute(
            text("SELECT name, unit, is_cost_enabled FROM fair_stand_items WHERE item_key = 'digital_print'")
        ).one()
        assert row.name == "Dijital Baskı"
        assert row.unit == "metre_kare"
        assert bool(row.is_cost_enabled) is False
        column = next(
            item for item in inspect(connection).get_columns("fair_stand_items") if item["name"] == "is_cost_enabled"
        )
        assert column["nullable"] is False

        with Operations.context(context):
            migration.downgrade()
        connection.commit()

        names = {item["name"] for item in inspect(connection).get_columns("fair_stand_items")}
        assert "is_cost_enabled" not in names
        remaining = connection.execute(text("SELECT unit FROM fair_stand_items WHERE item_key = 'digital_print'")).one()
        assert remaining.unit == "metre_kare"
