"""0056 renames mesh_print to mesh_fabric and keeps the item fields."""

from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

from alembic.operations import Operations
from alembic.runtime.migration import MigrationContext
from sqlalchemy import create_engine, text
from sqlalchemy.pool import StaticPool


def _load_migration():
    path = Path(__file__).resolve().parents[3] / "alembic" / "versions" / "0056_mesh_fabric_key.py"
    spec = spec_from_file_location("fair_stand_0056_mesh_fabric_key", path)
    assert spec is not None and spec.loader is not None
    migration = module_from_spec(spec)
    spec.loader.exec_module(migration)
    return migration


def test_mesh_print_renames_to_mesh_fabric_and_downgrade_restores_the_key():
    migration = _load_migration()
    engine = create_engine("sqlite://", poolclass=StaticPool, connect_args={"check_same_thread": False})
    with engine.connect() as connection:
        connection.execute(
            text(
                """
                CREATE TABLE fair_stand_items (
                    item_key VARCHAR(128) PRIMARY KEY,
                    name VARCHAR(256) NOT NULL,
                    item_type VARCHAR(64) NOT NULL,
                    unit VARCHAR(64),
                    catalog_visible BOOLEAN NOT NULL,
                    is_render BOOLEAN NOT NULL,
                    is_active BOOLEAN NOT NULL
                )
                """
            )
        )
        connection.execute(
            text(
                """
                INSERT INTO fair_stand_items
                    (item_key, name, item_type, unit, catalog_visible, is_render, is_active)
                VALUES
                    ('mesh_print', 'Mesh Baskı', 'production', 'metre_kare', 0, 0, 1),
                    ('digital_print', 'Dijital Baskı', 'production', 'metre_kare', 0, 0, 1)
                """
            )
        )
        connection.commit()

        context = MigrationContext.configure(connection)
        with Operations.context(context):
            migration.upgrade()
        connection.commit()

        renamed = connection.execute(
            text(
                """
                SELECT name, item_type, unit, catalog_visible, is_render, is_active
                FROM fair_stand_items WHERE item_key = 'mesh_fabric'
                """
            )
        ).one()
        assert renamed.name == "Mesh Baskı"
        assert renamed.item_type == "production"
        assert renamed.unit == "metre_kare"
        assert bool(renamed.catalog_visible) is False
        assert bool(renamed.is_render) is False
        assert bool(renamed.is_active) is True
        assert connection.execute(
            text("SELECT COUNT(*) FROM fair_stand_items WHERE item_key = 'mesh_print'")
        ).scalar_one() == 0
        assert connection.execute(
            text("SELECT item_key FROM fair_stand_items WHERE item_key = 'digital_print'")
        ).scalar_one() == "digital_print"

        context = MigrationContext.configure(connection)
        with Operations.context(context):
            migration.downgrade()
        connection.commit()
        assert connection.execute(
            text("SELECT COUNT(*) FROM fair_stand_items WHERE item_key = 'mesh_fabric'")
        ).scalar_one() == 0
        restored = connection.execute(
            text("SELECT name, unit FROM fair_stand_items WHERE item_key = 'mesh_print'")
        ).one()
        assert restored.name == "Mesh Baskı"
        assert restored.unit == "metre_kare"
