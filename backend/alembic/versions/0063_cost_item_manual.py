"""Allow manual rows on fair_stand_cost_items.

Revision ID: 0063_cost_item_manual
Revises: 0062_cost_items

Existing rows stay and become ITEM. item_key becomes nullable.
MANUAL rows store name and a unit_key foreign key. ITEM rows leave both null.
The organization + item_key unique key stays. No name/unit unique key is added.
Downgrade deletes MANUAL rows and restores the ITEM-only shape.
"""

import sqlalchemy as sa
from alembic import op


revision = "0063_cost_item_manual"
down_revision = "0062_cost_items"
branch_labels = None
depends_on = None

_TABLE = "fair_stand_cost_items"
_TYPE_CHECK = "cost_item_type IN ('ITEM', 'MANUAL')"
_SHAPE_CHECK = (
    "(cost_item_type = 'ITEM' AND item_key IS NOT NULL AND name IS NULL AND unit IS NULL) "
    "OR (cost_item_type = 'MANUAL' AND item_key IS NULL AND name IS NOT NULL "
    "AND trim(name) <> '' AND unit IS NOT NULL)"
)


def upgrade() -> None:
    op.add_column(
        _TABLE,
        sa.Column("cost_item_type", sa.String(length=16), nullable=False, server_default="ITEM"),
    )
    op.add_column(_TABLE, sa.Column("name", sa.String(length=256), nullable=True))
    op.add_column(_TABLE, sa.Column("unit", sa.String(length=64), nullable=True))
    with op.batch_alter_table(_TABLE) as batch:
        batch.alter_column("item_key", existing_type=sa.String(length=128), nullable=True)
        batch.alter_column("cost_item_type", existing_type=sa.String(length=16), server_default=None)
        batch.create_foreign_key(
            "fk_fair_stand_cost_items_unit_key",
            "fair_stand_units",
            ["unit"],
            ["unit_key"],
            ondelete="CASCADE",
            onupdate="CASCADE",
        )
        batch.create_check_constraint("ck_fair_stand_cost_items_cost_item_type", _TYPE_CHECK)
        batch.create_check_constraint("ck_fair_stand_cost_items_entry_shape", _SHAPE_CHECK)


def downgrade() -> None:
    op.execute(sa.text(f"DELETE FROM {_TABLE} WHERE cost_item_type = 'MANUAL'"))
    with op.batch_alter_table(_TABLE) as batch:
        batch.drop_constraint("ck_fair_stand_cost_items_entry_shape", type_="check")
        batch.drop_constraint("ck_fair_stand_cost_items_cost_item_type", type_="check")
        batch.drop_constraint("fk_fair_stand_cost_items_unit_key", type_="foreignkey")
        batch.alter_column("item_key", existing_type=sa.String(length=128), nullable=False)
        batch.drop_column("unit")
        batch.drop_column("name")
        batch.drop_column("cost_item_type")
