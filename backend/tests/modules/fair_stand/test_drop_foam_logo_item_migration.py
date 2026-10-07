"""0061 removes foam_logo and keeps illuminated-foam as the square-meter item."""

from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path

from alembic.operations import Operations
from alembic.runtime.migration import MigrationContext
from sqlalchemy import create_engine, text
from sqlalchemy.pool import StaticPool


def _load_migration():
    path = Path(__file__).resolve().parents[3] / "alembic" / "versions" / "0061_drop_foam_logo_item.py"
    spec = spec_from_file_location("fair_stand_0061_drop_foam_logo_item", path)
    assert spec is not None and spec.loader is not None
    migration = module_from_spec(spec)
    spec.loader.exec_module(migration)
    return migration


def test_drop_foam_logo_keeps_illuminated_foam_unit():
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
                    ('illuminated-foam', 'Işıklı Strafor / Logo', 'illuminated-foam', NULL, 0, 1, 0, 0, 0, 0, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                    ('foam_logo', 'Strafor Logo', 'production', 'metre_kare', 0, 0, 0, 0, 0, 0, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
                    ('digital_print', 'Dijital Baskı', 'production', 'metre_kare', 0, 0, 0, 0, 0, 0, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """
            )
        )
        connection.commit()

        context = MigrationContext.configure(connection)
        with Operations.context(context):
            migration.upgrade()
        connection.commit()

        assert connection.execute(
            text("SELECT COUNT(*) FROM fair_stand_items WHERE item_key = 'foam_logo'")
        ).scalar_one() == 0
        foam = connection.execute(
            text("SELECT item_type, unit, is_render FROM fair_stand_items WHERE item_key = 'illuminated-foam'")
        ).one()
        assert foam.item_type == "illuminated-foam"
        assert foam.unit == "metre_kare"
        assert bool(foam.is_render) is True
        assert connection.execute(
            text("SELECT item_key FROM fair_stand_items WHERE item_key = 'digital_print'")
        ).scalar_one() == "digital_print"

        context = MigrationContext.configure(connection)
        with Operations.context(context):
            migration.downgrade()
        connection.commit()
        restored = connection.execute(
            text("SELECT item_type, unit FROM fair_stand_items WHERE item_key = 'foam_logo'")
        ).one()
        assert restored.item_type == "production"
        assert restored.unit == "metre_kare"
