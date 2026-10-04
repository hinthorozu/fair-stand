"""0055 maps m2 to metre_kare and adds the unit foreign key."""

from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

import pytest
from alembic.operations import Operations
from alembic.runtime.migration import MigrationContext
from sqlalchemy import create_engine, event, inspect, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.pool import StaticPool


def _load_migration():
    path = Path(__file__).resolve().parents[3] / "alembic" / "versions" / "0055_item_unit_fk.py"
    spec = spec_from_file_location("fair_stand_0055_item_unit_fk", path)
    assert spec is not None and spec.loader is not None
    migration = module_from_spec(spec)
    spec.loader.exec_module(migration)
    return migration


def _engine():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    @event.listens_for(engine, "connect")
    def _fk(dbapi_connection, _connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    return engine


def _create_legacy_tables(connection, *, seed_units: bool = True) -> None:
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
            CREATE TABLE fair_stand_items (
                item_key VARCHAR(128) PRIMARY KEY,
                unit VARCHAR(32)
            )
            """
        )
    )
    if not seed_units:
        return
    connection.execute(
        text(
            """
            INSERT INTO fair_stand_units (id, unit_key, name, symbol, is_active, created_at, updated_at)
            VALUES
                (1, 'adet', 'Adet', 'adet', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                (2, 'metre_kare', 'Metre Kare', 'm2', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            """
        )
    )


def _insert_items(connection, *, unresolved: bool) -> None:
    rows = [
        ("panel_98", "adet"),
        ("hali", "m2"),
        ("parke-sari", "m2"),
        ("digital_print", "metre_kare"),
        ("mesh_fabric", "metre_kare"),
        ("lightbox_fabric", "metre_kare"),
        ("base_top_107_50", None),
    ]
    if unresolved:
        rows.append(("mystery", "paket"))
    connection.execute(
        text("INSERT INTO fair_stand_items (item_key, unit) VALUES (:item_key, :unit)"),
        [{"item_key": key, "unit": unit} for key, unit in rows],
    )


def _run(connection, direction: str) -> None:
    migration = _load_migration()
    context = MigrationContext.configure(connection)
    with Operations.context(context):
        getattr(migration, direction)()


def test_empty_catalog_inserts_only_referenced_canonical_units():
    engine = _engine()
    with engine.connect() as connection:
        _create_legacy_tables(connection, seed_units=False)
        _insert_items(connection, unresolved=False)
        connection.commit()

        _run(connection, "upgrade")
        connection.commit()

        units = {
            row.unit_key: (row.name, row.symbol, bool(row.is_active))
            for row in connection.execute(
                text("SELECT unit_key, name, symbol, is_active FROM fair_stand_units ORDER BY unit_key")
            )
        }
        assert units == {
            "adet": ("Adet", "adet", True),
            "metre_kare": ("Metre Kare", "m2", True),
        }
        assert connection.execute(
            text("SELECT unit FROM fair_stand_items WHERE item_key = 'hali'")
        ).scalar_one() == "metre_kare"
        assert connection.execute(
            text("SELECT COUNT(*) FROM fair_stand_items WHERE unit = 'm2'")
        ).scalar_one() == 0
        fk = inspect(connection).get_foreign_keys("fair_stand_items")
        assert [item["name"] for item in fk] == ["fk_fair_stand_items_unit_key"]


def test_inactive_metre_kare_still_blocks_the_foreign_key():
    engine = _engine()
    with engine.connect() as connection:
        _create_legacy_tables(connection, seed_units=False)
        connection.execute(
            text(
                """
                INSERT INTO fair_stand_units (id, unit_key, name, symbol, is_active, created_at, updated_at)
                VALUES (1, 'metre_kare', 'Metre Kare', 'm2', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """
            )
        )
        _insert_items(connection, unresolved=False)
        with pytest.raises(RuntimeError, match="inactive"):
            _run(connection, "upgrade")
        assert inspect(connection).get_foreign_keys("fair_stand_items") == []
        assert connection.execute(
            text("SELECT unit FROM fair_stand_items WHERE item_key = 'hali'")
        ).scalar_one() == "m2"
        assert connection.execute(
            text("SELECT COUNT(*) FROM fair_stand_units WHERE unit_key = 'adet'")
        ).scalar_one() == 0


def test_unresolved_unit_fails_before_the_foreign_key():
    engine = _engine()
    with engine.connect() as connection:
        _create_legacy_tables(connection)
        _insert_items(connection, unresolved=True)
        with pytest.raises(RuntimeError, match="paket"):
            _run(connection, "upgrade")
        assert inspect(connection).get_foreign_keys("fair_stand_items") == []


def test_upgrade_cascade_restrict_and_downgrade_keep_canonical_units():
    engine = _engine()
    with engine.connect() as connection:
        _create_legacy_tables(connection)
        _insert_items(connection, unresolved=False)
        connection.commit()

        _run(connection, "upgrade")
        connection.commit()

        units = dict(
            connection.execute(text("SELECT item_key, unit FROM fair_stand_items")).all()
        )
        assert units["panel_98"] == "adet"
        assert units["hali"] == "metre_kare"
        assert units["parke-sari"] == "metre_kare"
        assert units["digital_print"] == "metre_kare"
        assert units["mesh_fabric"] == "metre_kare"
        assert units["lightbox_fabric"] == "metre_kare"
        assert units["base_top_107_50"] is None
        assert "m2" not in units.values()

        fk = next(
            item
            for item in inspect(connection).get_foreign_keys("fair_stand_items")
            if item["name"] == "fk_fair_stand_items_unit_key"
        )
        assert fk["referred_table"] == "fair_stand_units"
        assert fk["referred_columns"] == ["unit_key"]
        assert fk["options"]["onupdate"] == "CASCADE"
        assert fk["options"]["ondelete"] == "RESTRICT"

        with pytest.raises(IntegrityError):
            connection.execute(
                text("UPDATE fair_stand_units SET unit_key = 'adet' WHERE unit_key = 'metre_kare'")
            )
        connection.rollback()
        assert connection.execute(
            text("SELECT unit FROM fair_stand_items WHERE item_key = 'digital_print'")
        ).scalar_one() == "metre_kare"
        assert connection.execute(
            text("SELECT unit FROM fair_stand_items WHERE item_key = 'panel_98'")
        ).scalar_one() == "adet"

        connection.execute(
            text("UPDATE fair_stand_units SET unit_key = 'metrekare' WHERE unit_key = 'metre_kare'")
        )
        cascaded = {
            row.item_key: row.unit
            for row in connection.execute(
                text(
                    """
                    SELECT item_key, unit FROM fair_stand_items
                    WHERE item_key IN ('hali', 'digital_print', 'mesh_fabric', 'lightbox_fabric')
                    """
                )
            )
        }
        assert set(cascaded.values()) == {"metrekare"}
        assert connection.execute(
            text("SELECT unit FROM fair_stand_items WHERE item_key = 'panel_98'")
        ).scalar_one() == "adet"

        with pytest.raises(IntegrityError):
            connection.execute(text("DELETE FROM fair_stand_units WHERE unit_key = 'adet'"))
        connection.rollback()

        assert connection.execute(
            text("SELECT unit FROM fair_stand_items WHERE item_key = 'panel_98'")
        ).scalar_one() == "adet"
        assert connection.execute(
            text("SELECT COUNT(*) FROM fair_stand_units WHERE unit_key = 'adet'")
        ).scalar_one() == 1

        _run(connection, "downgrade")
        connection.commit()
        assert inspect(connection).get_foreign_keys("fair_stand_items") == []
        kept = connection.execute(
            text("SELECT unit FROM fair_stand_items WHERE item_key = 'digital_print'")
        ).scalar_one()
        assert kept == "metre_kare"
        assert connection.execute(
            text("SELECT COUNT(*) FROM fair_stand_items WHERE unit = 'm2'")
        ).scalar_one() == 0
