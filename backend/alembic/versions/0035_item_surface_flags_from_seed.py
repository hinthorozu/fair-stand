"""Copy item surface flags from catalog seed rows onto existing item records.

Revision ID: 0035_item_surface_flags
Revises: 0034_stand_panel_rail_height
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0035_item_surface_flags"
down_revision = "0034_stand_panel_rail_height"
branch_labels = None
depends_on = None


def upgrade() -> None:
    from app.modules.fair_stand.infrastructure.catalog_seed_data import CATALOG_SEED

    bind = op.get_bind()
    statement = sa.text(
        """
        UPDATE fair_stand_items SET
            is_render = :is_render,
            accepts_color = :accepts_color,
            accepts_image = :accepts_image,
            accepts_lightbox = :accepts_lightbox,
            accepts_glass = :accepts_glass,
            accepts_mesh = :accepts_mesh
        WHERE item_key = :item_key
        """
    )
    for item in CATALOG_SEED["items"]:
        if "is_render" not in item:
            continue
        bind.execute(
            statement,
            {
                "item_key": item["item_key"],
                "is_render": bool(item["is_render"]),
                "accepts_color": bool(item["accepts_color"]),
                "accepts_image": bool(item["accepts_image"]),
                "accepts_lightbox": bool(item["accepts_lightbox"]),
                "accepts_glass": bool(item["accepts_glass"]),
                "accepts_mesh": bool(item["accepts_mesh"]),
            },
        )


def downgrade() -> None:
    return None
