"""Retire the separate Strafor Logo production item.

Revision ID: 0061_drop_foam_logo_item
Revises: 0060_item_prices

The scene item illuminated-foam owns the production square meters.
foam_logo is removed. An existing illuminated-foam unit is left as saved.
"""

from datetime import UTC, datetime

import sqlalchemy as sa
from alembic import op


revision = "0061_drop_foam_logo_item"
down_revision = "0060_item_prices"
branch_labels = None
depends_on = None

_SCENE_KEY = "illuminated-foam"
_RETIRED_KEY = "foam_logo"
_RETIRED_NAME = "Strafor Logo"


def upgrade() -> None:
    bind = op.get_bind()
    bind.execute(
        sa.text(
            """
            UPDATE fair_stand_items
            SET unit = 'metre_kare'
            WHERE item_key = :item_key AND unit IS NULL
            """
        ),
        {"item_key": _SCENE_KEY},
    )
    bind.execute(
        sa.text("DELETE FROM fair_stand_items WHERE item_key = :item_key"),
        {"item_key": _RETIRED_KEY},
    )


def downgrade() -> None:
    bind = op.get_bind()
    now = datetime.now(tz=UTC)
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
            "item_key": _RETIRED_KEY,
            "name": _RETIRED_NAME,
            "catalog_visible": False,
            "is_render": False,
            "accepts": False,
            "is_active": True,
            "now": now,
        },
    )
