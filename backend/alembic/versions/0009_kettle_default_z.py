"""Kettle drop Z comes from item.default_z_cm, not renderer fridge lift.

Revision ID: 0009_kettle_default_z
Revises: 0008_item_scene_pose
"""

from alembic import op

from app.modules.fair_stand.infrastructure.item_default_z_seed import fill_kettle_default_z_column

revision = "0009_kettle_default_z"
down_revision = "0008_item_scene_pose"
branch_labels = None
depends_on = None


def upgrade() -> None:
    fill_kettle_default_z_column(op.get_bind())


def downgrade() -> None:
    from sqlalchemy import text

    op.get_bind().execute(text("UPDATE fair_stand_items SET default_z_cm = 0 WHERE item_key = 'kettle'"))
