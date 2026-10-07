"""0062 renames the price table without dropping rows or changing columns."""

from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from uuid import uuid4

from alembic.operations import Operations
from alembic.runtime.migration import MigrationContext
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.pool import StaticPool


def _load_migration():
    path = Path(__file__).resolve().parents[3] / "alembic" / "versions" / "0062_cost_items.py"
    spec = spec_from_file_location("fair_stand_0062_cost_items", path)
    assert spec is not None and spec.loader is not None
    migration = module_from_spec(spec)
    spec.loader.exec_module(migration)
    return migration


def test_rename_keeps_price_row_and_columns():
    migration = _load_migration()
    engine = create_engine("sqlite://", poolclass=StaticPool, connect_args={"check_same_thread": False})
    row_id = str(uuid4())
    organization_id = str(uuid4())
    with engine.connect() as connection:
        connection.execute(
            text(
                """
                CREATE TABLE fair_stand_item_prices (
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
                INSERT INTO fair_stand_item_prices (
                    id, organization_id, item_key, purchase_price, sale_price, created_at, updated_at
                ) VALUES (
                    :id, :organization_id, 'askilik', 200, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
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

        assert inspect(connection).has_table("fair_stand_cost_items")
        assert inspect(connection).has_table("fair_stand_item_prices") is False
        columns = {column["name"] for column in inspect(connection).get_columns("fair_stand_cost_items")}
        assert columns == {
            "id",
            "organization_id",
            "item_key",
            "purchase_price",
            "sale_price",
            "created_at",
            "updated_at",
        }
        assert "unit" not in columns
        row = connection.execute(
            text(
                """
                SELECT item_key, purchase_price, sale_price
                FROM fair_stand_cost_items
                WHERE id = :id
                """
            ),
            {"id": row_id},
        ).one()
        assert row.item_key == "askilik"
        assert float(row.purchase_price) == 200
        assert float(row.sale_price) == 0

        with Operations.context(context):
            migration.downgrade()
        connection.commit()
        assert inspect(connection).has_table("fair_stand_item_prices")
        assert inspect(connection).has_table("fair_stand_cost_items") is False
        restored = connection.execute(
            text("SELECT item_key FROM fair_stand_item_prices WHERE id = :id"),
            {"id": row_id},
        ).scalar_one()
        assert restored == "askilik"
