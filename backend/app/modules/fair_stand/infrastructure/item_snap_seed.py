"""Item snap_target_item_type + snap_anchor. Anchor is only top/bottom/left/right."""

from __future__ import annotations

import sqlalchemy as sa

SNAP_ANCHORS = frozenset({"top", "bottom", "left", "right"})

_SNAP_BY_TYPE = {
    "led-floodlight": ("profile", "top"),
    "shelf": ("panel", "top"),
}


def snap_fields_for_item(_item_key: str, item_type: str) -> tuple[str | None, str | None]:
    return _SNAP_BY_TYPE.get(item_type, (None, None))


def apply_item_snap_fields(row: dict) -> dict:
    target, anchor = snap_fields_for_item(row["item_key"], row["item_type"])
    row["snap_target_item_type"] = target
    row["snap_anchor"] = anchor
    return row


def fill_item_snap_columns(bind) -> None:
    rows = bind.execute(sa.text("SELECT item_key, item_type FROM fair_stand_items")).mappings()
    for row in rows:
        target, anchor = snap_fields_for_item(row["item_key"], row["item_type"])
        bind.execute(
            sa.text(
                "UPDATE fair_stand_items SET snap_target_item_type = :target, snap_anchor = :anchor "
                "WHERE item_key = :item_key"
            ),
            {"target": target, "anchor": anchor, "item_key": row["item_key"]},
        )
