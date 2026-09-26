"""box-block type + box_block item + default_opacity on items.

Revision ID: 0042_box_block_default_opacity
Revises: 0041_rename_profil_screen_keys
"""

from __future__ import annotations

from datetime import UTC, datetime
from decimal import Decimal

import sqlalchemy as sa
from alembic import op

revision = "0042_box_block_default_opacity"
down_revision = "0041_rename_profil_screen_keys"
branch_labels = None
depends_on = None


def _now() -> datetime:
    return datetime.now(tz=UTC)


def upgrade() -> None:
    bind = op.get_bind()
    cols = {c["name"] for c in sa.inspect(bind).get_columns("fair_stand_items")}
    if "default_opacity" not in cols:
        op.add_column(
            "fair_stand_items",
            sa.Column(
                "default_opacity",
                sa.Numeric(4, 3),
                nullable=False,
                server_default="1",
            ),
        )
        op.create_check_constraint(
            "ck_fair_stand_items_default_opacity",
            "fair_stand_items",
            "default_opacity >= 0 AND default_opacity <= 1",
        )

    now = _now()
    # Tip davranışı: free zemin (plastic-trash-bin ile aynı paket).
    bind.execute(
        sa.text(
            """
            INSERT INTO fair_stand_item_type (
              key, display_name, placement, collision, move_snap_cm,
              magnetic_snap, allow_side_insert, supports_wall_overlay_mount, wall_capacity,
              connection_endpoint, collision_depth, endpoint_contact, boundary_snap,
              collision_height, ghost_kind, ghost_renderer, ghost_opacity,
              is_active, created_at, updated_at
            ) VALUES (
              'box-block', 'Kutu blok', 'free', 'none', 10,
              'none', true, false, 'include',
              'segment', 'physical', 'standard', 'stand-edge',
              'full', 'silhouette', 'module-silhouette', 0.38,
              true, :now, :now
            )
            ON CONFLICT (key) DO UPDATE SET
              display_name = EXCLUDED.display_name,
              placement = EXCLUDED.placement,
              collision = EXCLUDED.collision,
              move_snap_cm = EXCLUDED.move_snap_cm,
              magnetic_snap = EXCLUDED.magnetic_snap,
              allow_side_insert = EXCLUDED.allow_side_insert,
              supports_wall_overlay_mount = EXCLUDED.supports_wall_overlay_mount,
              wall_capacity = EXCLUDED.wall_capacity,
              connection_endpoint = EXCLUDED.connection_endpoint,
              collision_depth = EXCLUDED.collision_depth,
              endpoint_contact = EXCLUDED.endpoint_contact,
              boundary_snap = EXCLUDED.boundary_snap,
              collision_height = EXCLUDED.collision_height,
              ghost_kind = EXCLUDED.ghost_kind,
              ghost_renderer = EXCLUDED.ghost_renderer,
              ghost_opacity = EXCLUDED.ghost_opacity,
              updated_at = EXCLUDED.updated_at
            """
        ),
        {"now": now},
    )

    category_id = bind.execute(
        sa.text(
            "SELECT id FROM fair_stand_categories WHERE catalog_name = 'Panel Ek Modül' LIMIT 1"
        )
    ).scalar()
    preview_id = bind.execute(
        sa.text("SELECT id FROM fair_stand_catalog_preview_kinds ORDER BY sort_index NULLS LAST, id LIMIT 1")
    ).scalar()

    exists = bind.execute(
        sa.text("SELECT 1 FROM fair_stand_items WHERE item_key = 'box_block'")
    ).scalar()
    if not exists and category_id is not None:
        bind.execute(
            sa.text(
                """
                INSERT INTO fair_stand_items (
                  item_key, name, item_type, unit, catalog_visible, category_id,
                  catalog_item_index, preview_id, default_color, default_opacity,
                  rotation_step_deg, default_rotation_deg, side_insert_rotation,
                  default_z_cm, is_render, accepts_color, accepts_image,
                  accepts_lightbox, accepts_glass, accepts_mesh, is_active,
                  created_at, updated_at
                ) VALUES (
                  'box_block', 'Kutu blok', 'box-block', 'adet', true, :category_id,
                  14, :preview_id, 15263957, 0.85,
                  90, 0, 'inherit',
                  0, true, true, false, false, false, false, true,
                  :now, :now
                )
                """
            ),
            {"category_id": category_id, "preview_id": preview_id, "now": now},
        )
        bind.execute(
            sa.text(
                """
                INSERT INTO fair_stand_item_dimensions (
                  item_key, width_cm, depth_cm, height_cm
                ) VALUES ('box_block', 100, 50, 50)
                ON CONFLICT (item_key) DO NOTHING
                """
            )
        )


def downgrade() -> None:
    bind = op.get_bind()
    bind.execute(sa.text("DELETE FROM fair_stand_items WHERE item_key = 'box_block'"))
    bind.execute(sa.text("DELETE FROM fair_stand_item_type WHERE key = 'box-block'"))
    cols = {c["name"] for c in sa.inspect(bind).get_columns("fair_stand_items")}
    if "default_opacity" in cols:
        op.drop_constraint("ck_fair_stand_items_default_opacity", "fair_stand_items", type_="check")
        op.drop_column("fair_stand_items", "default_opacity")
