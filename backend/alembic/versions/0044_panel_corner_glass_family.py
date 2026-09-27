"""Cam twins for the inner-corner panel family.

Revision ID: 0044_panel_corner_glass_family
Revises: 0043_panel_glass_family

panel_corner_42_5 / 92 / 142_5 / 192 → panel_corner_cam_*
Type panel-glass (created in 0043), material cam, is_render false.
"""

from __future__ import annotations

from datetime import UTC, datetime

import sqlalchemy as sa
from alembic import op

revision = "0044_panel_corner_glass_family"
down_revision = "0043_panel_glass_family"
branch_labels = None
depends_on = None

_PANELS = (
    ("panel_corner_cam_42_5", "Cam İç Köşe Paneli 42,5 × 47 cm", "42.5"),
    ("panel_corner_cam_92", "Cam İç Köşe Paneli 92 × 47 cm", "92"),
    ("panel_corner_cam_142_5", "Cam İç Köşe Paneli 142,5 × 47 cm", "142.5"),
    ("panel_corner_cam_192", "Cam İç Köşe Paneli 192 × 47 cm", "192"),
)


def _now() -> datetime:
    return datetime.now(tz=UTC)


def upgrade() -> None:
    bind = op.get_bind()
    now = _now()
    for item_key, name, width_cm in _PANELS:
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
                  'cam', NULL, 0,
                  false, false, false,
                  false, false, false,
                  true, :now, :now
                WHERE NOT EXISTS (
                  SELECT 1 FROM fair_stand_items WHERE item_key = :item_key
                )
                """
            ),
            {"item_key": item_key, "name": name, "now": now},
        )
        bind.execute(
            sa.text(
                """
                INSERT INTO fair_stand_item_dimensions (
                  item_key, width_cm, depth_cm, height_cm
                )
                SELECT :item_key, :width_cm, 0.8, 47
                WHERE EXISTS (
                  SELECT 1 FROM fair_stand_items WHERE item_key = :item_key
                )
                ON CONFLICT (item_key) DO NOTHING
                """
            ),
            {"item_key": item_key, "width_cm": width_cm},
        )


def downgrade() -> None:
    bind = op.get_bind()
    bind.execute(
        sa.text(
            """
            DELETE FROM fair_stand_items
            WHERE item_key IN (
              'panel_corner_cam_42_5', 'panel_corner_cam_92',
              'panel_corner_cam_142_5', 'panel_corner_cam_192'
            )
            """
        )
    )
