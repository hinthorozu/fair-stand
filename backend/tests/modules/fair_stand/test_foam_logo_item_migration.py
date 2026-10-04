"""0057 inserts the hidden Strafor Logo production item."""

from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

from alembic.operations import Operations
from alembic.runtime.migration import MigrationContext
from sqlalchemy import create_engine, text
from sqlalchemy.pool import StaticPool


def _load_migration():
    path = Path(__file__).resolve().parents[3] / "alembic" / "versions" / "0057_foam_logo_item.py"
    spec = spec_from_file_location("fair_stand_0057_foam_logo_item", path)
    assert spec is not None and spec.loader is not None
    migration = module_from_spec(spec)
    spec.loader.exec_module(migration)
    return migration


def test_foam_logo_inserts_once_and_downgrade_removes_only_that_item():
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
                    accepts_color BOOLEAN NOT NULL,
                    accepts_image BOOLEAN NOT NULL,
                    accepts_lightbox BOOLEAN NOT NULL,
                    accepts_glass BOOLEAN NOT NULL,
                    accepts_mesh BOOLEAN NOT NULL,
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
                INSERT INTO fair_stand_items (
                    item_key, name, item_type, unit, catalog_visible, is_render,
                    accepts_color, accepts_image, accepts_lightbox, accepts_glass, accepts_mesh,
                    is_active, created_at, updated_at
                ) VALUES
                    ('digital_print', 'Dijital Baskı', 'production', 'metre_kare', 0, 0, 0, 0, 0, 0, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                    ('mesh_fabric', 'Mesh Baskı', 'production', 'metre_kare', 0, 0, 0, 0, 0, 0, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                    ('lightbox_fabric', 'Lightbox Bezi', 'production', 'metre_kare', 0, 0, 0, 0, 0, 0, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """
            )
        )
        connection.commit()

        context = MigrationContext.configure(connection)
        with Operations.context(context):
            migration.upgrade()
            migration.upgrade()
        connection.commit()

        row = connection.execute(
            text(
                """
                SELECT name, item_type, unit, catalog_visible, is_render, is_active
                FROM fair_stand_items WHERE item_key = 'foam_logo'
                """
            )
        ).one()
        assert row.name == "Strafor Logo"
        assert row.item_type == "production"
        assert row.unit == "metre_kare"
        assert bool(row.catalog_visible) is False
        assert bool(row.is_render) is False
        assert bool(row.is_active) is True
        assert connection.execute(text("SELECT COUNT(*) FROM fair_stand_items")).scalar_one() == 4
        assert connection.execute(
            text("SELECT item_key FROM fair_stand_items WHERE item_key = 'digital_print'")
        ).scalar_one() == "digital_print"

        context = MigrationContext.configure(connection)
        with Operations.context(context):
            migration.downgrade()
        connection.commit()
        assert connection.execute(
            text("SELECT COUNT(*) FROM fair_stand_items WHERE item_key = 'foam_logo'")
        ).scalar_one() == 0
        assert connection.execute(text("SELECT COUNT(*) FROM fair_stand_items")).scalar_one() == 3
