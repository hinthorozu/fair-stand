"""Drop unused fair_stand_items.panel_role (scene never reads it).

Revision ID: 0015_drop_panel_role
Revises: 0014_drop_comp_mod_type
"""

from alembic import op
import sqlalchemy as sa

revision = "0015_drop_panel_role"
down_revision = "0014_drop_comp_mod_type"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint("ck_fair_stand_items_panel_role", "fair_stand_items", type_="check")
    op.drop_column("fair_stand_items", "panel_role")


def downgrade() -> None:
    op.add_column(
        "fair_stand_items",
        sa.Column("panel_role", sa.String(length=32), nullable=True),
    )
    op.create_check_constraint(
        "ck_fair_stand_items_panel_role",
        "fair_stand_items",
        "panel_role IS NULL OR panel_role IN ('straight', 'inner-corner')",
    )
