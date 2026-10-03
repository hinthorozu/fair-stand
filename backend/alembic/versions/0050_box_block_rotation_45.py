"""Set box_block rotation step to 45 degrees.

Revision ID: 0050_box_block_rotation_45
Revises: 0049_box_block_surface_flags

default_rotation_deg and side_insert_rotation stay unchanged.
"""

from alembic import op
import sqlalchemy as sa


revision = "0050_box_block_rotation_45"
down_revision = "0049_box_block_surface_flags"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.get_bind().execute(
        sa.text(
            """
            UPDATE fair_stand_items SET
              rotation_step_deg = 45
            WHERE item_key = 'box_block'
            """
        )
    )


def downgrade() -> None:
    op.get_bind().execute(
        sa.text(
            """
            UPDATE fair_stand_items SET
              rotation_step_deg = 90
            WHERE item_key = 'box_block'
            """
        )
    )
