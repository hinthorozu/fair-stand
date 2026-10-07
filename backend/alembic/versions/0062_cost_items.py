"""Rename fair_stand_item_prices to fair_stand_cost_items.

Revision ID: 0062_cost_items
Revises: 0061_drop_foam_logo_item

Columns, the organization + item_key unique key, and the item foreign key stay.
Existing rows are kept. This revision only changes the table name.
"""

import sqlalchemy as sa
from alembic import op


revision = "0062_cost_items"
down_revision = "0061_drop_foam_logo_item"
branch_labels = None
depends_on = None

_OLD_TABLE = "fair_stand_item_prices"
_NEW_TABLE = "fair_stand_cost_items"
_CONSTRAINTS = (
    ("fk_fair_stand_item_prices_item_key", "fk_fair_stand_cost_items_item_key"),
    (
        "uq_fair_stand_item_prices_organization_id_item_key",
        "uq_fair_stand_cost_items_organization_id_item_key",
    ),
    ("ck_fair_stand_item_prices_purchase_price", "ck_fair_stand_cost_items_purchase_price"),
    ("ck_fair_stand_item_prices_sale_price", "ck_fair_stand_cost_items_sale_price"),
)
_INDEX = (
    "ix_fair_stand_item_prices_organization_id",
    "ix_fair_stand_cost_items_organization_id",
)


def _rename_postgres_identifiers(table: str, constraints: tuple[tuple[str, str], ...], index: tuple[str, str]) -> None:
    bind = op.get_bind()
    if bind.dialect.name != "postgresql":
        return
    for old_name, new_name in constraints:
        op.execute(sa.text(f"ALTER TABLE {table} RENAME CONSTRAINT {old_name} TO {new_name}"))
    op.execute(sa.text(f"ALTER INDEX {index[0]} RENAME TO {index[1]}"))


def upgrade() -> None:
    op.rename_table(_OLD_TABLE, _NEW_TABLE)
    _rename_postgres_identifiers(_NEW_TABLE, _CONSTRAINTS, _INDEX)


def downgrade() -> None:
    _rename_postgres_identifiers(
        _NEW_TABLE,
        tuple((new_name, old_name) for old_name, new_name in _CONSTRAINTS),
        (_INDEX[1], _INDEX[0]),
    )
    op.rename_table(_NEW_TABLE, _OLD_TABLE)
