"""Store fair_stand_dimensions lengths in centimeters (was meters).

Revision ID: 0018_stand_dimensions_cm
Revises: 0017_stand_height_envelope
Create Date: 2026-09-22

"""

from alembic import op

revision = "0018_stand_dimensions_cm"
down_revision = "0017_stand_height_envelope"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column("fair_stand_dimensions", "height_m", new_column_name="height_cm")
    op.alter_column("fair_stand_dimensions", "depth_m", new_column_name="depth_cm")
    op.alter_column("fair_stand_dimensions", "strip_height_m", new_column_name="strip_height_cm")
    op.alter_column("fair_stand_dimensions", "frame_width_m", new_column_name="frame_width_cm")
    op.alter_column("fair_stand_dimensions", "frame_depth_m", new_column_name="frame_depth_cm")
    op.execute(
        """
        UPDATE fair_stand_dimensions SET
          height_cm = height_cm * 100,
          depth_cm = depth_cm * 100,
          strip_height_cm = strip_height_cm * 100,
          frame_width_cm = frame_width_cm * 100,
          frame_depth_cm = frame_depth_cm * 100
        """
    )


def downgrade() -> None:
    op.execute(
        """
        UPDATE fair_stand_dimensions SET
          height_cm = height_cm / 100,
          depth_cm = depth_cm / 100,
          strip_height_cm = strip_height_cm / 100,
          frame_width_cm = frame_width_cm / 100,
          frame_depth_cm = frame_depth_cm / 100
        """
    )
    op.alter_column("fair_stand_dimensions", "height_cm", new_column_name="height_m")
    op.alter_column("fair_stand_dimensions", "depth_cm", new_column_name="depth_m")
    op.alter_column("fair_stand_dimensions", "strip_height_cm", new_column_name="strip_height_m")
    op.alter_column("fair_stand_dimensions", "frame_width_cm", new_column_name="frame_width_m")
    op.alter_column("fair_stand_dimensions", "frame_depth_cm", new_column_name="frame_depth_m")
