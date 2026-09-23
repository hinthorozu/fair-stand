"""Restore stand frame_width_cm / frame_depth_cm (legacy visual cross-section)."""

from alembic import op
import sqlalchemy as sa

revision = "0023_restore_stand_frame_columns"
down_revision = "0022_drop_stand_frame_columns"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "fair_stand_dimensions",
        sa.Column("frame_width_cm", sa.Numeric(10, 3), nullable=False, server_default="5.5"),
    )
    op.add_column(
        "fair_stand_dimensions",
        sa.Column("frame_depth_cm", sa.Numeric(10, 3), nullable=False, server_default="10"),
    )
    op.alter_column("fair_stand_dimensions", "frame_width_cm", server_default=None)
    op.alter_column("fair_stand_dimensions", "frame_depth_cm", server_default=None)
    op.create_check_constraint(
        "ck_fair_stand_dimensions_frame_width",
        "fair_stand_dimensions",
        "frame_width_cm > 0",
    )
    op.create_check_constraint(
        "ck_fair_stand_dimensions_frame_depth",
        "fair_stand_dimensions",
        "frame_depth_cm > 0",
    )


def downgrade() -> None:
    op.drop_constraint("ck_fair_stand_dimensions_frame_width", "fair_stand_dimensions", type_="check")
    op.drop_constraint("ck_fair_stand_dimensions_frame_depth", "fair_stand_dimensions", type_="check")
    op.drop_column("fair_stand_dimensions", "frame_width_cm")
    op.drop_column("fair_stand_dimensions", "frame_depth_cm")
