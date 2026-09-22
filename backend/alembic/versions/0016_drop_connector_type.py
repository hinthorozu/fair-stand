"""Drop unused fair_stand_items.connector_type (BOM uses composition itemKey).

Revision ID: 0016_drop_connector_type
Revises: 0015_drop_panel_role
"""

from alembic import op
import sqlalchemy as sa

revision = "0016_drop_connector_type"
down_revision = "0015_drop_panel_role"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint("ck_fair_stand_items_connector_type", "fair_stand_items", type_="check")
    op.drop_column("fair_stand_items", "connector_type")


def downgrade() -> None:
    op.add_column(
        "fair_stand_items",
        sa.Column("connector_type", sa.String(length=32), nullable=True),
    )
    op.create_check_constraint(
        "ck_fair_stand_items_connector_type",
        "fair_stand_items",
        "connector_type IS NULL OR connector_type IN ('start', 'single', 'double', 'corner')",
    )
