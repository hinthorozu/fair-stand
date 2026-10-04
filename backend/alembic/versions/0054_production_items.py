"""Add the production classification and three BOM-only print items.

Revision ID: 0054_production_items
Revises: 0053_item_type_scene_behavior

production has no scene behavior row. Item.unit stays a free string.
"""

from datetime import UTC, datetime

import sqlalchemy as sa
from alembic import op


revision = "0054_production_items"
down_revision = "0053_item_type_scene_behavior"
branch_labels = None
depends_on = None

_ITEMS = (
    ("digital_print", "Dijital Baskı"),
    ("mesh_print", "Mesh Baskı"),
    ("lightbox_fabric", "Lightbox Bezi"),
)


def upgrade() -> None:
    bind = op.get_bind()
    now = datetime.now(tz=UTC)
    bind.execute(
        sa.text(
            """
            INSERT INTO fair_stand_item_type (key, display_name, is_active, created_at, updated_at)
            SELECT 'production', :display_name, :is_active, :now, :now
            WHERE NOT EXISTS (
              SELECT 1 FROM fair_stand_item_type WHERE key = 'production'
            )
            """
        ),
        {"display_name": "Üretim", "is_active": True, "now": now},
    )
    for item_key, name in _ITEMS:
        bind.execute(
            sa.text(
                """
                INSERT INTO fair_stand_items (
                  item_key, name, item_type, unit, catalog_visible,
                  is_render, accepts_color, accepts_image,
                  accepts_lightbox, accepts_glass, accepts_mesh,
                  is_active, created_at, updated_at
                )
                SELECT
                  :item_key, :name, 'production', 'metre_kare', :catalog_visible,
                  :is_render, :accepts, :accepts,
                  :accepts, :accepts, :accepts,
                  :is_active, :now, :now
                WHERE NOT EXISTS (
                  SELECT 1 FROM fair_stand_items WHERE item_key = :item_key
                )
                """
            ),
            {
                "item_key": item_key,
                "name": name,
                "catalog_visible": False,
                "is_render": False,
                "accepts": False,
                "is_active": True,
                "now": now,
            },
        )


def downgrade() -> None:
    bind = op.get_bind()
    bind.execute(
        sa.text(
            """
            DELETE FROM fair_stand_items
            WHERE item_key IN ('digital_print', 'mesh_print', 'lightbox_fabric')
            """
        )
    )
    bind.execute(sa.text("DELETE FROM fair_stand_item_type WHERE key = 'production'"))
