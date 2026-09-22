"""Item default_z_cm: drop placement.zCm. mount_height_cm is the floodlight source."""

from __future__ import annotations

from decimal import Decimal

import sqlalchemy as sa


def default_z_cm_for_row(row: dict) -> Decimal:
    explicit = row.get("default_z_cm")
    if explicit is not None:
        return Decimal(str(explicit))
    dims = row.get("dimensions") or {}
    mount = dims.get("mount_height_cm")
    if mount is not None:
        return Decimal(str(mount))
    return Decimal("0")


def apply_item_default_z(row: dict) -> dict:
    row["default_z_cm"] = default_z_cm_for_row(row)
    return row


def fill_item_default_z_columns(bind) -> None:
    bind.execute(
        sa.text(
            "UPDATE fair_stand_items SET default_z_cm = COALESCE(("
            "SELECT mount_height_cm FROM fair_stand_item_dimensions "
            "WHERE fair_stand_item_dimensions.item_key = fair_stand_items.item_key"
            "), 0)"
        )
    )
    fill_kettle_default_z_column(bind)


def fill_kettle_default_z_column(bind) -> None:
    bind.execute(
        sa.text("UPDATE fair_stand_items SET default_z_cm = 66 WHERE item_key = 'kettle'")
    )
