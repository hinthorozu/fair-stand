"""Add the Strafor Logo production item.

Revision ID: 0057_foam_logo_item
Revises: 0056_mesh_fabric_key

foam_logo is a hidden production leaf. It has no scene behavior and no recipe.
Existing print production items stay unchanged.
"""

from datetime import UTC, datetime

import sqlalchemy as sa
from alembic import op


revision = "0057_foam_logo_item"
down_revision = "0056_mesh_fabric_key"
branch_labels = None
depends_on = None

_ITEM_KEY = "foam_logo"
_NAME = "Strafor Logo"


def upgrade() -> None:
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
            "item_key": _ITEM_KEY,
            "name": _NAME,
            "catalog_visible": False,
            "is_render": False,
            "accepts": False,
            "is_active": True,
            "now": now,
        },
    )


def downgrade() -> None:
    op.get_bind().execute(
        sa.text("DELETE FROM fair_stand_items WHERE item_key = :item_key"),
        {"item_key": _ITEM_KEY},
    )
