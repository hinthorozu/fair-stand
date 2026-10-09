"""Add the metal separator panel item.

Revision ID: 0065_metal_separator
Revises: 0064_tulle_fabric

One hidden row, same shape as a cam panel. The scene flag on a wall
strip points the BOM at this item. An existing row is left as saved.
"""

from datetime import UTC, datetime

import sqlalchemy as sa
from alembic import op


revision = "0065_metal_separator"
down_revision = "0064_tulle_fabric"
branch_labels = None
depends_on = None

_ITEM_KEY = "metal_separator"


def upgrade() -> None:
    bind = op.get_bind()
    now = datetime.now(tz=UTC)
    bind.execute(
        sa.text(
            """
            INSERT INTO fair_stand_items (
              item_key, name, item_type, unit, catalog_visible,
              material, default_color, default_z_cm,
              is_render, accepts_color, accepts_image,
              accepts_lightbox, accepts_glass, accepts_mesh,
              is_active, created_at, updated_at
            )
            SELECT
              :item_key, :name, 'panel-glass', 'adet', false,
              'metal', NULL, 0,
              false, false, false,
              false, false, false,
              true, :now, :now
            WHERE NOT EXISTS (
              SELECT 1 FROM fair_stand_items WHERE item_key = :item_key
            )
            """
        ),
        {"item_key": _ITEM_KEY, "name": "Metal Separatör", "now": now},
    )
    bind.execute(
        sa.text(
            """
            INSERT INTO fair_stand_item_dimensions (
              item_key, width_cm, depth_cm, height_cm
            )
            SELECT :item_key, 98, 0.8, 47
            WHERE NOT EXISTS (
              SELECT 1 FROM fair_stand_item_dimensions WHERE item_key = :item_key
            )
            """
        ),
        {"item_key": _ITEM_KEY},
    )


def downgrade() -> None:
    bind = op.get_bind()
    bind.execute(
        sa.text("DELETE FROM fair_stand_items WHERE item_key = :item_key"),
        {"item_key": _ITEM_KEY},
    )
