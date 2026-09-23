"""Drop obsolete stand envelope strip grid columns.

Revision ID: 0019_drop_stand_strip_grid
Revises: 0018_stand_dimensions_cm
Create Date: 2026-09-22

Panel band pitch and slot counts live on items (BOM) and WALL_PANEL_BAND_PITCH_CM.
"""

from alembic import op
import sqlalchemy as sa

revision = "0019_drop_stand_strip_grid"
down_revision = "0018_stand_dimensions_cm"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint("ck_fair_stand_dimensions_strip_count", "fair_stand_dimensions", type_="check")
    op.drop_constraint("ck_fair_stand_dimensions_strip_height", "fair_stand_dimensions", type_="check")
    op.drop_column("fair_stand_dimensions", "strip_count")
    op.drop_column("fair_stand_dimensions", "strip_height_cm")


def downgrade() -> None:
    op.add_column(
        "fair_stand_dimensions",
        sa.Column("strip_count", sa.Integer(), nullable=False, server_default="7"),
    )
    op.add_column(
        "fair_stand_dimensions",
        sa.Column("strip_height_cm", sa.Numeric(10, 3), nullable=False, server_default="50"),
    )
    op.alter_column("fair_stand_dimensions", "strip_count", server_default=None)
    op.alter_column("fair_stand_dimensions", "strip_height_cm", server_default=None)
    op.create_check_constraint(
        "ck_fair_stand_dimensions_strip_count",
        "fair_stand_dimensions",
        "strip_count > 0",
    )
    op.create_check_constraint(
        "ck_fair_stand_dimensions_strip_height",
        "fair_stand_dimensions",
        "strip_height_cm > 0",
    )
