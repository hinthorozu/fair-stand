"""Load the frozen local fair_stand catalog dump when the target database has no Items."""

from __future__ import annotations

import json
from datetime import datetime
from decimal import Decimal
from pathlib import Path
from uuid import UUID, uuid4

import sqlalchemy as sa
from sqlalchemy import DateTime, Numeric, Uuid, insert

from app.db.base import Base
from app.modules.fair_stand.infrastructure import models as _models  # noqa: F401

DUMP_PATH = Path(__file__).resolve().parents[4] / "alembic" / "data" / "0002_fair_stand_catalog_dump.json"

TABLE_ORDER = (
    "fair_stand_categories",
    "fair_stand_catalog_preview_kinds",
    "fair_stand_items",
    "fair_stand_item_dimensions",
    "fair_stand_item_scene_dimensions",
    "fair_stand_item_strip_occupancy",
    "fair_stand_item_assets",
    "fair_stand_item_components",
    "fair_stand_item_video_walls",
    "fair_stand_item_body_parts",
)

SERIAL_TABLES = (
    "fair_stand_categories",
    "fair_stand_catalog_preview_kinds",
)


def _coerce(column: sa.Column, value: object) -> object:
    if value is None:
        return None
    if isinstance(column.type, DateTime) and isinstance(value, str):
        return datetime.fromisoformat(value)
    if isinstance(column.type, Numeric) and not isinstance(value, Decimal):
        return Decimal(str(value))
    if isinstance(column.type, Uuid) and not isinstance(value, UUID):
        return UUID(str(value))
    return value


def load_catalog_dump() -> dict:
    return json.loads(DUMP_PATH.read_text(encoding="utf-8"))


def seed_catalog_if_empty(bind) -> None:
    item_count = bind.execute(sa.text("SELECT COUNT(*) FROM fair_stand_items")).scalar()
    if item_count:
        return

    payload = load_catalog_dump()
    tables = payload["tables"]
    for name in TABLE_ORDER:
        rows = tables.get(name) or []
        if not rows:
            continue
        table = Base.metadata.tables[name]
        coerced = [
            {column.name: _coerce(column, row.get(column.name)) for column in table.columns}
            for row in rows
        ]
        if name == "fair_stand_items":
            for item in coerced:
                for flag in (
                    "is_render",
                    "accepts_color",
                    "accepts_image",
                    "accepts_lightbox",
                    "accepts_glass",
                    "accepts_mesh",
                ):
                    if item.get(flag) is None:
                        item[flag] = False
                if item.get("default_z_cm") is None:
                    item["default_z_cm"] = 0
        if name == "fair_stand_item_body_parts":
            for part in coerced:
                if part.get("id") is None:
                    part["id"] = uuid4()
        bind.execute(insert(table), coerced)

    from app.modules.fair_stand.infrastructure.item_rotation_seed import fill_item_rotation_columns

    fill_item_rotation_columns(bind)
    from app.modules.fair_stand.infrastructure.item_surface_flags_seed import fill_item_surface_flag_columns

    fill_item_surface_flag_columns(bind)
    from app.modules.fair_stand.infrastructure.item_default_z_seed import fill_item_default_z_columns

    fill_item_default_z_columns(bind)
    from app.modules.fair_stand.infrastructure.item_snap_seed import fill_item_snap_columns

    fill_item_snap_columns(bind)
    from app.modules.fair_stand.infrastructure.item_scene_pose_seed import fill_item_scene_pose_columns

    fill_item_scene_pose_columns(bind)

    if bind.dialect.name == "postgresql":
        for name in SERIAL_TABLES:
            bind.execute(
                sa.text(
                    f"SELECT setval(pg_get_serial_sequence('{name}', 'id'), "
                    f"COALESCE((SELECT MAX(id) FROM {name}), 1), "
                    f"(SELECT COUNT(*) > 0 FROM {name}))"
                )
            )
