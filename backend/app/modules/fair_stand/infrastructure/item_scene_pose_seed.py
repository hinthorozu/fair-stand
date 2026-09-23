"""Item scene height + default_z for profile rails and short-up walls."""

from __future__ import annotations

from decimal import Decimal

import sqlalchemy as sa

CATALOG_CEILING_CM = Decimal("350")
SHORT_UP_HEIGHT_CM = {
    "short-up-1": Decimal("50"),
    "short-up-2": Decimal("100"),
}


def _cross_section_cm(row: dict) -> Decimal:
    dims = row.get("dimensions") or {}
    scene = row.get("scene_dimensions") or {}
    item_type = row.get("item_type")
    # Post-W/H/D: profile span is width_cm; cross-section is depth/height (8 cm).
    if item_type == "profile":
        for candidate in (
            dims.get("depth_cm"),
            dims.get("height_cm"),
            scene.get("depth_cm"),
            scene.get("height_cm"),
        ):
            if candidate is not None:
                return Decimal(str(candidate))
        return Decimal("8")
    if item_type == "upright":
        for candidate in (
            dims.get("width_cm"),
            dims.get("depth_cm"),
            scene.get("width_cm"),
            scene.get("depth_cm"),
        ):
            if candidate is not None:
                return Decimal(str(candidate))
        return Decimal("8")
    for candidate in (dims.get("depth_cm"), dims.get("height_cm"), dims.get("width_cm"), scene.get("depth_cm")):
        if candidate is not None:
            return Decimal(str(candidate))
    return Decimal("8")


def apply_item_scene_pose(row: dict) -> dict:
    item_type = row.get("item_type")
    variant = row.get("variant")
    scene = row.get("scene_dimensions")
    dims = row.get("dimensions") or {}
    if item_type == "profile":
        if not isinstance(scene, dict):
            scene = {}
            row["scene_dimensions"] = scene
        thickness = _cross_section_cm(row)
        scene["height_cm"] = thickness
        row["default_z_cm"] = CATALOG_CEILING_CM - thickness
    if item_type == "upright":
        if not isinstance(scene, dict):
            scene = {}
            row["scene_dimensions"] = scene
        cross = _cross_section_cm(row)
        height = dims.get("height_cm")
        if scene.get("width_cm") is None:
            scene["width_cm"] = dims.get("width_cm") if dims.get("width_cm") is not None else cross
        if scene.get("depth_cm") is None:
            scene["depth_cm"] = dims.get("depth_cm") if dims.get("depth_cm") is not None else cross
        if scene.get("height_cm") is None and height is not None:
            scene["height_cm"] = Decimal(str(height))
    if variant in SHORT_UP_HEIGHT_CM:
        if not isinstance(scene, dict):
            scene = {}
            row["scene_dimensions"] = scene
        height = SHORT_UP_HEIGHT_CM[variant]
        scene["height_cm"] = height
        row["default_z_cm"] = CATALOG_CEILING_CM - height
    return row


def _sql_num(value):
    if value is None:
        return None
    return float(value)


def fill_item_scene_pose_columns(bind) -> None:
    rows = bind.execute(
        sa.text(
            "SELECT i.item_key, i.item_type, i.variant, d.width_cm, d.depth_cm, d.height_cm, "
            "s.width_cm, s.depth_cm, s.height_cm "
            "FROM fair_stand_items i "
            "LEFT JOIN fair_stand_item_dimensions d ON d.item_key = i.item_key "
            "LEFT JOIN fair_stand_item_scene_dimensions s ON s.item_key = i.item_key"
        )
    ).mappings()
    for row in rows:
        if row["item_type"] not in ("profile", "upright") and row["variant"] not in SHORT_UP_HEIGHT_CM:
            continue
        fake = {
            "item_type": row["item_type"],
            "variant": row["variant"],
            "dimensions": {
                "width_cm": row["width_cm"],
                "depth_cm": row["depth_cm"],
                "height_cm": row["height_cm"],
            },
            "scene_dimensions": {
                "width_cm": row["width_cm"],
                "depth_cm": row["depth_cm"],
                "height_cm": row["height_cm"],
            },
        }
        apply_item_scene_pose(fake)
        scene = fake.get("scene_dimensions") or {}
        default_z = fake.get("default_z_cm")
        width = _sql_num(scene.get("width_cm"))
        depth = _sql_num(scene.get("depth_cm"))
        height = _sql_num(scene.get("height_cm"))
        if width is not None or depth is not None or height is not None:
            existing = bind.execute(
                sa.text(
                    "SELECT 1 FROM fair_stand_item_scene_dimensions WHERE item_key = :item_key"
                ),
                {"item_key": row["item_key"]},
            ).first()
            params = {
                "width": width,
                "depth": depth,
                "height": height,
                "item_key": row["item_key"],
            }
            if existing:
                bind.execute(
                    sa.text(
                        "UPDATE fair_stand_item_scene_dimensions "
                        "SET width_cm = :width, depth_cm = :depth, height_cm = :height "
                        "WHERE item_key = :item_key"
                    ),
                    params,
                )
            else:
                bind.execute(
                    sa.text(
                        "INSERT INTO fair_stand_item_scene_dimensions "
                        "(item_key, width_cm, depth_cm, height_cm) "
                        "VALUES (:item_key, :width, :depth, :height)"
                    ),
                    params,
                )
        if default_z is not None:
            bind.execute(
                sa.text(
                    "UPDATE fair_stand_items SET default_z_cm = :z WHERE item_key = :item_key"
                ),
                {"z": _sql_num(default_z), "item_key": row["item_key"]},
            )
