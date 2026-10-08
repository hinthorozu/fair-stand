"""Add the parametric Tül scene item.

Revision ID: 0064_tulle_fabric
Revises: 0063_cost_item_manual

One catalog row is both the scene plate and the square-metre BOM leaf.
Thickness stays on the item master. An existing row is left as saved.
"""

from datetime import UTC, datetime
from decimal import Decimal

import sqlalchemy as sa
from alembic import op


revision = "0064_tulle_fabric"
down_revision = "0063_cost_item_manual"
branch_labels = None
depends_on = None

_ITEM_KEY = "tulle_fabric"
_TYPE_KEY = "tulle-fabric"


def upgrade() -> None:
    bind = op.get_bind()
    now = datetime.now(tz=UTC)
    bind.execute(
        sa.text(
            """
            INSERT INTO fair_stand_item_type (key, display_name, is_active, created_at, updated_at)
            SELECT :type_key, :display_name, :is_active, :now, :now
            WHERE NOT EXISTS (
              SELECT 1 FROM fair_stand_item_type WHERE key = :type_key
            )
            """
        ),
        {"type_key": _TYPE_KEY, "display_name": "Tül", "is_active": True, "now": now},
    )
    type_id = bind.execute(
        sa.text("SELECT id FROM fair_stand_item_type WHERE key = :type_key"),
        {"type_key": _TYPE_KEY},
    ).scalar_one()
    bind.execute(
        sa.text(
            """
            INSERT INTO fair_stand_item_type_scene_behavior (
              item_type_id, placement, collision, move_snap_cm,
              magnetic_snap, allow_side_insert, supports_wall_overlay_mount, wall_capacity,
              connection_endpoint, collision_depth, endpoint_contact, boundary_snap, collision_height,
              ghost_kind, ghost_renderer, ghost_opacity
            )
            SELECT
              :type_id, 'free', 'none', 50,
              'none', :allow_side, :supports_overlay, 'include',
              'segment', 'physical', 'standard', 'stand-edge', 'full',
              'silhouette', 'module-silhouette', :ghost_opacity
            WHERE NOT EXISTS (
              SELECT 1 FROM fair_stand_item_type_scene_behavior WHERE item_type_id = :type_id
            )
            """
        ),
        {
            "type_id": type_id,
            "allow_side": True,
            "supports_overlay": False,
            "ghost_opacity": Decimal("0.380"),
            "now": now,
        },
    )
    category_id = bind.execute(
        sa.text("SELECT id FROM fair_stand_categories WHERE catalog_index = 5"),
    ).scalar_one()
    preview_id = bind.execute(
        sa.text("SELECT id FROM fair_stand_catalog_preview_kinds WHERE sort_index = 9"),
    ).scalar_one()
    next_index = bind.execute(
        sa.text(
            """
            SELECT COALESCE(MAX(catalog_item_index), 0) + 1
            FROM fair_stand_items
            WHERE category_id = :category_id
            """
        ),
        {"category_id": category_id},
    ).scalar_one()
    bind.execute(
        sa.text(
            """
            INSERT INTO fair_stand_items (
              item_key, name, item_type, unit, catalog_visible,
              category_id, catalog_item_index, preview_id,
              default_color, default_opacity, default_z_cm,
              is_render, accepts_color, accepts_image,
              accepts_lightbox, accepts_glass, accepts_mesh,
              is_cost_enabled, is_active,
              rotation_step_deg, default_rotation_deg, side_insert_rotation,
              created_at, updated_at
            )
            SELECT
              :item_key, :name, :type_key, 'metre_kare', :catalog_visible,
              :category_id, :catalog_item_index, :preview_id,
              :default_color, :default_opacity, :default_z_cm,
              :is_render, :accepts_color, :accepts_image,
              :accepts_image, :accepts_image, :accepts_image,
              :is_cost_enabled, :is_active,
              :rotation_step_deg, :default_rotation_deg, :side_insert_rotation,
              :now, :now
            WHERE NOT EXISTS (
              SELECT 1 FROM fair_stand_items WHERE item_key = :item_key
            )
            """
        ),
        {
            "item_key": _ITEM_KEY,
            "name": "Tül",
            "type_key": _TYPE_KEY,
            "catalog_visible": True,
            "category_id": category_id,
            "catalog_item_index": next_index,
            "preview_id": preview_id,
            "default_color": 16777215,
            "default_opacity": Decimal("0.450"),
            "default_z_cm": Decimal("350.00"),
            "is_render": True,
            "accepts_color": True,
            "accepts_image": False,
            "is_cost_enabled": True,
            "is_active": True,
            "rotation_step_deg": 90,
            "default_rotation_deg": 0,
            "side_insert_rotation": "inherit",
            "now": now,
        },
    )
    bind.execute(
        sa.text(
            """
            INSERT INTO fair_stand_item_dimensions (
              item_key, width_cm, depth_cm, height_cm
            )
            SELECT :item_key, :width_cm, :depth_cm, :height_cm
            WHERE NOT EXISTS (
              SELECT 1 FROM fair_stand_item_dimensions WHERE item_key = :item_key
            )
            """
        ),
        {
            "item_key": _ITEM_KEY,
            "width_cm": Decimal("200.00"),
            "depth_cm": Decimal("0.40"),
            "height_cm": Decimal("100.00"),
        },
    )


def downgrade() -> None:
    bind = op.get_bind()
    bind.execute(
        sa.text("DELETE FROM fair_stand_items WHERE item_key = :item_key"),
        {"item_key": _ITEM_KEY},
    )
    bind.execute(
        sa.text("DELETE FROM fair_stand_item_type WHERE key = :type_key"),
        {"type_key": _TYPE_KEY},
    )
