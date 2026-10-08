"""Organization-scoped Item purchase and sale prices.

Revision ID: 0060_item_prices
Revises: 0059_elektrik_panosu_item

One row per organization and item_key. The catalog item row stays unpriced.
Currency is fixed TL for this revision and is not stored.
"""

import sqlalchemy as sa
from alembic import op


revision = "0060_item_prices"
down_revision = "0059_elektrik_panosu_item"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "fair_stand_item_prices",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("item_key", sa.String(length=128), nullable=False),
        sa.Column("purchase_price", sa.Numeric(14, 2), nullable=False),
        sa.Column("sale_price", sa.Numeric(14, 2), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["item_key"],
            ["fair_stand_items.item_key"],
            name="fk_fair_stand_item_prices_item_key",
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        sa.UniqueConstraint(
            "organization_id",
            "item_key",
            name="uq_fair_stand_item_prices_organization_id_item_key",
        ),
        sa.CheckConstraint(
            "purchase_price >= 0",
            name="ck_fair_stand_item_prices_purchase_price",
        ),
        sa.CheckConstraint(
            "sale_price >= 0",
            name="ck_fair_stand_item_prices_sale_price",
        ),
    )
    op.create_index(
        "ix_fair_stand_item_prices_organization_id",
        "fair_stand_item_prices",
        ["organization_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_fair_stand_item_prices_organization_id",
        table_name="fair_stand_item_prices",
    )
    op.drop_table("fair_stand_item_prices")
