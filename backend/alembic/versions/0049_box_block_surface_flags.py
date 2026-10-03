"""Enable image, lightbox, and mesh on box_block.

Revision ID: 0049_box_block_surface_flags
Revises: 0048_wall_short_display_names

Color, glass, and default opacity stay as they are.
"""

from alembic import op
import sqlalchemy as sa


revision = "0049_box_block_surface_flags"
down_revision = "0048_wall_short_display_names"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.get_bind().execute(
        sa.text(
            """
            UPDATE fair_stand_items SET
              accepts_image = true,
              accepts_lightbox = true,
              accepts_mesh = true
            WHERE item_key = 'box_block'
            """
        )
    )


def downgrade() -> None:
    op.get_bind().execute(
        sa.text(
            """
            UPDATE fair_stand_items SET
              accepts_image = false,
              accepts_lightbox = false,
              accepts_mesh = false
            WHERE item_key = 'box_block'
            """
        )
    )
