"""0063 keeps existing Item rows and adds the manual cost-item shape."""

from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from uuid import uuid4

from alembic.operations import Operations
from alembic.runtime.migration import MigrationContext
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.pool import StaticPool


def _load_migration():
    path = Path(__file__).resolve().parents[3] / "alembic" / "versions" / "0063_cost_item_manual.py"
    spec = spec_from_file_location("fair_stand_0063_cost_item_manual", path)
    assert spec is not None and spec.loader is not None
    migration = module_from_spec(spec)
    spec.loader.exec_module(migration)
    return migration


def test_manual_migration_backfills_item_rows_and_downgrades():
    migration = _load_migration()
    engine = create_engine("sqlite://", poolclass=StaticPool, connect_args={"check_same_thread": False})
    row_id = str(uuid4())
    organization_id = str(uuid4())
    with engine.connect() as connection:
        connection.execute(
            text(
                """
                CREATE TABLE fair_stand_units (
                    id INTEGER PRIMARY KEY,
                    unit_key VARCHAR(64) NOT NULL UNIQUE,
                    name VARCHAR(128) NOT NULL,
                    symbol VARCHAR(32) NOT NULL,
                    is_active BOOLEAN NOT NULL,
                    created_at TIMESTAMP NOT NULL,
                    updated_at TIMESTAMP NOT NULL
                )
                """
            )
        )
        connection.execute(
            text(
                """
                CREATE TABLE fair_stand_cost_items (
                    id VARCHAR(36) PRIMARY KEY,
                    organization_id VARCHAR(36) NOT NULL,
                    item_key VARCHAR(128) NOT NULL,
                    purchase_price NUMERIC(14, 2) NOT NULL,
                    sale_price NUMERIC(14, 2) NOT NULL DEFAULT 0,
                    created_at TIMESTAMP NOT NULL,
                    updated_at TIMESTAMP NOT NULL,
                    UNIQUE (organization_id, item_key)
                )
                """
            )
        )
        connection.execute(
            text(
                """
                INSERT INTO fair_stand_cost_items (
                    id, organization_id, item_key, purchase_price, sale_price, created_at, updated_at
                ) VALUES (
                    :id, :organization_id, 'askilik', 12.5, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                )
                """
            ),
            {"id": row_id, "organization_id": organization_id},
        )
        connection.commit()

        context = MigrationContext.configure(connection)
        with Operations.context(context):
            migration.upgrade()
        connection.commit()

        columns = {column["name"]: column for column in inspect(connection).get_columns("fair_stand_cost_items")}
        assert columns["item_key"]["nullable"] is True
        assert columns["cost_item_type"]["nullable"] is False
        assert columns["name"]["nullable"] is True
        assert columns["unit"]["nullable"] is True
        unique_columns = [
            tuple(item["column_names"] or [])
            for item in inspect(connection).get_unique_constraints("fair_stand_cost_items")
        ]
        assert ("name",) not in unique_columns
        assert ("organization_id", "name", "unit") not in unique_columns
        assert ("name", "unit") not in unique_columns
        row = connection.execute(
            text(
                """
                SELECT cost_item_type, item_key, name, unit, purchase_price, sale_price
                FROM fair_stand_cost_items
                WHERE id = :id
                """
            ),
            {"id": row_id},
        ).one()
        assert row.cost_item_type == "ITEM"
        assert row.item_key == "askilik"
        assert row.name is None
        assert row.unit is None
        assert float(row.purchase_price) == 12.5
        assert float(row.sale_price) == 0

        with Operations.context(context):
            migration.downgrade()
        connection.commit()
        restored_columns = {column["name"] for column in inspect(connection).get_columns("fair_stand_cost_items")}
        assert "cost_item_type" not in restored_columns
        assert "name" not in restored_columns
        assert "unit" not in restored_columns
        restored = connection.execute(
            text("SELECT item_key, purchase_price FROM fair_stand_cost_items WHERE id = :id"),
            {"id": row_id},
        ).one()
        assert restored.item_key == "askilik"
        assert float(restored.purchase_price) == 12.5
