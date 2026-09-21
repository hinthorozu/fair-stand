"""Profile rail height + short-up height/Z. Unglue from stand ceiling.

Revision ID: 0008_item_scene_pose
Revises: 0007_item_snap
"""

from alembic import op
import sqlalchemy as sa

from app.modules.fair_stand.infrastructure.item_scene_pose_seed import fill_item_scene_pose_columns

revision = "0008_item_scene_pose"
down_revision = "0007_item_snap"
branch_labels = None
depends_on = None


def upgrade() -> None:
    fill_item_scene_pose_columns(op.get_bind())


def downgrade() -> None:
    bind = op.get_bind()
    bind.execute(
        sa.text(
            "UPDATE fair_stand_item_scene_dimensions SET height_cm = 350 "
            "WHERE item_key IN (SELECT item_key FROM fair_stand_items WHERE item_type = 'profile')"
        )
    )
    bind.execute(
        sa.text(
            "UPDATE fair_stand_items SET default_z_cm = 0 "
            "WHERE item_type = 'profile' OR variant IN ('short-up-1', 'short-up-2')"
        )
    )
    bind.execute(
        sa.text(
            "UPDATE fair_stand_item_scene_dimensions SET height_cm = NULL "
            "WHERE item_key IN (SELECT item_key FROM fair_stand_items "
            "WHERE variant IN ('short-up-1', 'short-up-2'))"
        )
    )
