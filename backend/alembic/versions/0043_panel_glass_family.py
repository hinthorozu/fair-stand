"""Cam panel twins for the straight panel family.

Revision ID: 0043_panel_glass_family
Revises: 0042_box_block_default_opacity

panel_48_5 / panel_98 / panel_147_5 / panel_197 → panel_cam_*
Type panel-glass, material cam, is_render false. Not catalog-visible.
"""

from __future__ import annotations

from datetime import UTC, datetime

import sqlalchemy as sa
from alembic import op

revision = "0043_panel_glass_family"
down_revision = "0042_box_block_default_opacity"
branch_labels = None
depends_on = None

_PANELS = (
    ("panel_cam_48_5", "Cam Panel 48,5 × 47 cm", "48.5"),
    ("panel_cam_98", "Cam Panel 98 × 47 cm", "98"),
    ("panel_cam_147_5", "Cam Panel 147,5 × 47 cm", "147.5"),
    ("panel_cam_197", "Cam Panel 197 × 47 cm", "197"),
)


def _now() -> datetime:
    return datetime.now(tz=UTC)


def upgrade() -> None:
    bind = op.get_bind()
    now = _now()
    bind.execute(
        sa.text(
            """
            INSERT INTO fair_stand_item_type (
              key, display_name, placement, collision, move_snap_cm,
              magnetic_snap, allow_side_insert, supports_wall_overlay_mount, wall_capacity,
              connection_endpoint, collision_depth, endpoint_contact, boundary_snap,
              collision_height, ghost_kind, ghost_renderer, ghost_opacity,
              is_active, created_at, updated_at
            )
            SELECT
              'panel-glass', 'Cam panel', placement, collision, move_snap_cm,
              magnetic_snap, allow_side_insert, supports_wall_overlay_mount, wall_capacity,
              connection_endpoint, collision_depth, endpoint_contact, boundary_snap,
              collision_height, ghost_kind, ghost_renderer, ghost_opacity,
              true, :now, :now
            FROM fair_stand_item_type
            WHERE key = 'panel'
            ON CONFLICT (key) DO NOTHING
            """
        ),
        {"now": now},
    )
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
              'panel_cam_48_5', 'panel_cam_98', 'panel_cam_147_5', 'panel_cam_197'
            )
            """
        )
    )
    bind.execute(sa.text("DELETE FROM fair_stand_item_type WHERE key = 'panel-glass'"))
