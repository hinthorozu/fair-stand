"""Drop legacy length_cm and thickness_cm from fair_stand_item_dimensions.

Revision ID: 0021_drop_item_length_thickness
Revises: 0020_item_dims_wh_d_fill
Create Date: 2026-09-22
"""

from alembic import op
import sqlalchemy as sa

revision = "0021_drop_item_length_thickness"
down_revision = "0020_item_dims_wh_d_fill"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint("ck_fair_stand_item_dimensions_present", "fair_stand_item_dimensions", type_="check")
    op.drop_column("fair_stand_item_dimensions", "length_cm")
    op.drop_column("fair_stand_item_dimensions", "thickness_cm")
    op.create_check_constraint(
        "ck_fair_stand_item_dimensions_present",
        "fair_stand_item_dimensions",
        "width_cm IS NOT NULL OR depth_cm IS NOT NULL OR height_cm IS NOT NULL "
        "OR mount_height_cm IS NOT NULL OR wall_gap_cm IS NOT NULL",
    )


def downgrade() -> None:
    op.drop_constraint("ck_fair_stand_item_dimensions_present", "fair_stand_item_dimensions", type_="check")
    op.add_column("fair_stand_item_dimensions", sa.Column("length_cm", sa.Numeric(8, 2), nullable=True))
    op.add_column("fair_stand_item_dimensions", sa.Column("thickness_cm", sa.Numeric(8, 2), nullable=True))
    op.create_check_constraint(
        "ck_fair_stand_item_dimensions_present",
        "fair_stand_item_dimensions",
        "width_cm IS NOT NULL OR depth_cm IS NOT NULL OR height_cm IS NOT NULL "
        "OR length_cm IS NOT NULL OR thickness_cm IS NOT NULL "
        "OR mount_height_cm IS NOT NULL OR wall_gap_cm IS NOT NULL",
    )
