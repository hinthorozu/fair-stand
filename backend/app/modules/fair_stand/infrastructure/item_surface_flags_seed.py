"""Item is_render + accepts_* seed. Matches current scene gates, not future wiring."""

from __future__ import annotations

import sqlalchemy as sa

from app.modules.fair_stand.infrastructure.item_rotation_seed import PLACEABLE_ITEM_TYPES

# itemCapabilities.js COLOR_AND_IMAGE types (image+color today).
_IMAGE_COLOR_TYPES = frozenset(
    {
        "door-leaf",
        "flat-panel",
        "base",
        "counter",
        "door",
        "showcase-2",
        "showcase-3",
    }
)

# pickModuleContext: selectionMode === "panel" (glass/lightbox/mesh menu).
_PANEL_COVER_TYPES = frozenset(
    {
        "flat-panel",
        "showcase-2",
        "showcase-3",
        "door",
    }
)

_COLOR_ONLY_TYPES = frozenset(
    {
        "separator",
        "sofa-set-classic",
        "sofa-single-classic",
        "sofa-double-classic",
    }
)

_LEAF_COLOR_IMAGE_TYPES = frozenset({"door-leaf"})


def surface_flags_for_item(item_key: str, item_type: str) -> dict[str, bool]:
    del item_key
    if item_type in _LEAF_COLOR_IMAGE_TYPES:
        return {
            "is_render": True,
            "accepts_color": True,
            "accepts_image": True,
            "accepts_lightbox": False,
            "accepts_glass": False,
            "accepts_mesh": False,
        }
    is_render = item_type in PLACEABLE_ITEM_TYPES
    if not is_render:
        return {
            "is_render": False,
            "accepts_color": False,
            "accepts_image": False,
            "accepts_lightbox": False,
            "accepts_glass": False,
            "accepts_mesh": False,
        }

    cover = item_type in _PANEL_COVER_TYPES
    image_color = item_type in _IMAGE_COLOR_TYPES
    color_only = item_type in _COLOR_ONLY_TYPES
    return {
        "is_render": True,
        "accepts_color": image_color or color_only,
        "accepts_image": image_color,
        "accepts_lightbox": cover,
        "accepts_glass": cover,
        "accepts_mesh": cover,
    }


def apply_item_surface_flags(row: dict) -> dict:
    flags = surface_flags_for_item(row["item_key"], row["item_type"])
    row.update(flags)
    return row


def fill_item_surface_flag_columns(bind) -> None:
    existing = bind.execute(sa.text("SELECT item_key, item_type FROM fair_stand_items")).mappings()
    for row in existing:
        flags = surface_flags_for_item(row["item_key"], row["item_type"])
        bind.execute(
            sa.text(
                "UPDATE fair_stand_items SET is_render = :is_render, "
                "accepts_color = :accepts_color, accepts_image = :accepts_image, "
                "accepts_lightbox = :accepts_lightbox, accepts_glass = :accepts_glass, "
                "accepts_mesh = :accepts_mesh WHERE item_key = :item_key"
            ),
            {**flags, "item_key": row["item_key"]},
        )
