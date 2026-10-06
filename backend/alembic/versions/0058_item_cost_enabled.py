"""Add the item cost-inclusion flag.

Revision ID: 0058_item_cost_enabled
Revises: 0057_foam_logo_item

is_cost_enabled says whether an item may be included in a later cost
calculation. Existing rows stay excluded. This column has no price.
"""

import sqlalchemy as sa
from alembic import op


revision = "0058_item_cost_enabled"
down_revision = "0057_foam_logo_item"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "fair_stand_items",
        sa.Column("is_cost_enabled", sa.Boolean(), nullable=False, server_default=sa.false()),
    )


def downgrade() -> None:
    op.drop_column("fair_stand_items", "is_cost_enabled")
