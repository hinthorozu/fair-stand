"""Type behavior seed: kesit 1 + 2 + 3.

Eski kaynak: src/moduleBehavior.js TYPE_BEHAVIORS (kaldırıldı).
Bilinen tip yoksa DEFAULT_* = WALL paketi.
"""

from __future__ import annotations

from decimal import Decimal

PLACEMENT_VALUES = frozenset({"wall", "free", "wall-overlay", "top"})
COLLISION_VALUES = frozenset({"segment", "footprint", "none"})
MAGNETIC_SNAP_VALUES = frozenset({"standard", "none", "short-up-joint"})
WALL_CAPACITY_VALUES = frozenset({"include", "exclude"})
CONNECTION_ENDPOINT_VALUES = frozenset({"segment", "logical-fixture"})
COLLISION_DEPTH_VALUES = frozenset({"physical", "wall-backbone"})
ENDPOINT_CONTACT_VALUES = frozenset({"standard", "thin-wall-endpoint"})
BOUNDARY_SNAP_VALUES = frozenset({"stand-edge", "wall-inner-face"})
COLLISION_HEIGHT_VALUES = frozenset({"full"})

DEFAULT_PLACEMENT = "wall"
DEFAULT_COLLISION = "segment"
DEFAULT_MOVE_SNAP_CM = 50
DEFAULT_MAGNETIC_SNAP = "standard"
DEFAULT_ALLOW_SIDE_INSERT = True
DEFAULT_SUPPORTS_WALL_OVERLAY_MOUNT = True
DEFAULT_WALL_CAPACITY = "include"
DEFAULT_CONNECTION_ENDPOINT = "segment"
DEFAULT_COLLISION_DEPTH = "physical"
DEFAULT_ENDPOINT_CONTACT = "standard"
DEFAULT_BOUNDARY_SNAP = "stand-edge"
DEFAULT_COLLISION_HEIGHT = "full"
DEFAULT_OVERLAP: tuple[str, ...] = ()
DEFAULT_GHOST_KIND = "silhouette"
DEFAULT_GHOST_RENDERER = "module-silhouette"
DEFAULT_GHOST_OPACITY = Decimal("0.38")

# key → (placement, collision, move_snap_cm)
TYPE_BEHAVIOR_SLICE1: dict[str, tuple[str, str, int]] = {
    "flat-panel": ("wall", "segment", 50),
    "showcase-3": ("wall", "segment", 50),
    "showcase-2": ("wall", "segment", 50),
    "shelf": ("wall-overlay", "none", 10),
    "door": ("wall", "segment", 50),
    "base-wall": ("wall", "segment", 50),
    "separator": ("wall", "segment", 50),
    "counter": ("free", "footprint", 50),
    "base": ("free", "footprint", 50),
    "sofa-set-classic": ("free", "footprint", 10),
    "sofa-single-classic": ("free", "none", 10),
    "sofa-double-classic": ("free", "none", 10),
    "coffee-table-classic": ("free", "none", 10),
    "table-chair-set-eames": ("free", "none", 10),
    "chair": ("free", "none", 10),
    "table-glass": ("free", "none", 10),
    "bar-stool": ("free", "none", 10),
    "mini-fridge": ("free", "none", 10),
    "kettle": ("free", "none", 10),
    "coat-rack": ("free", "none", 10),
    "plastic-trash-bin": ("free", "none", 10),
    "upright": ("free", "footprint", 50),
    "profile": ("wall", "segment", 50),
    "indoor-plant-1": ("free", "footprint", 10),
    "illuminated-foam": ("wall-overlay", "none", 10),
    "tv": ("wall-overlay", "none", 10),
    "led-floodlight": ("top", "none", 20),
}

# key → (magnetic_snap, allow_side_insert, supports_wall_overlay_mount, wall_capacity)
TYPE_BEHAVIOR_SLICE2: dict[str, tuple[str, bool, bool, str]] = {
    "flat-panel": ("standard", True, True, "include"),
    "showcase-3": ("standard", True, True, "include"),
    "showcase-2": ("standard", True, True, "include"),
    "shelf": ("none", False, False, "exclude"),
    "door": ("standard", True, True, "include"),
    "base-wall": ("standard", True, True, "include"),
    "separator": ("standard", True, True, "include"),
    "counter": ("standard", True, False, "include"),
    "base": ("standard", True, False, "include"),
    "sofa-set-classic": ("standard", True, False, "include"),
    "sofa-single-classic": ("none", True, False, "include"),
    "sofa-double-classic": ("none", True, False, "include"),
    "coffee-table-classic": ("none", True, False, "include"),
    "table-chair-set-eames": ("none", True, False, "include"),
    "chair": ("none", True, False, "include"),
    "table-glass": ("none", True, False, "include"),
    "bar-stool": ("none", True, False, "include"),
    "mini-fridge": ("none", True, False, "include"),
    "kettle": ("none", True, False, "include"),
    "coat-rack": ("none", True, False, "include"),
    "plastic-trash-bin": ("none", True, False, "include"),
    "upright": ("short-up-joint", False, False, "exclude"),
    "profile": ("standard", True, True, "include"),
    "indoor-plant-1": ("standard", True, False, "include"),
    "illuminated-foam": ("none", False, False, "include"),
    "tv": ("none", False, False, "include"),
    "led-floodlight": ("none", True, False, "exclude"),
}

# (connection_endpoint, collision_depth, endpoint_contact, boundary_snap, collision_height,
#  overlap_with_types, ghost_kind, ghost_renderer, ghost_opacity)
_Slice3 = tuple[str, str, str, str, str, tuple[str, ...], str, str, Decimal]

_DEFAULT_S3: _Slice3 = (
    DEFAULT_CONNECTION_ENDPOINT,
    DEFAULT_COLLISION_DEPTH,
    DEFAULT_ENDPOINT_CONTACT,
    DEFAULT_BOUNDARY_SNAP,
    DEFAULT_COLLISION_HEIGHT,
    DEFAULT_OVERLAP,
    DEFAULT_GHOST_KIND,
    DEFAULT_GHOST_RENDERER,
    DEFAULT_GHOST_OPACITY,
)


def _s3(
    *,
    connection_endpoint: str = DEFAULT_CONNECTION_ENDPOINT,
    collision_depth: str = DEFAULT_COLLISION_DEPTH,
    endpoint_contact: str = DEFAULT_ENDPOINT_CONTACT,
    boundary_snap: str = DEFAULT_BOUNDARY_SNAP,
    collision_height: str = DEFAULT_COLLISION_HEIGHT,
    overlap: tuple[str, ...] = DEFAULT_OVERLAP,
) -> _Slice3:
    return (
        connection_endpoint,
        collision_depth,
        endpoint_contact,
        boundary_snap,
        collision_height,
        overlap,
        DEFAULT_GHOST_KIND,
        DEFAULT_GHOST_RENDERER,
        DEFAULT_GHOST_OPACITY,
    )


TYPE_BEHAVIOR_SLICE3: dict[str, _Slice3] = {
    "flat-panel": _s3(),
    "showcase-3": _s3(),
    "showcase-2": _s3(),
    "shelf": _s3(),
    "door": _s3(),
    "base-wall": _s3(collision_depth="wall-backbone"),
    "separator": _s3(),
    "counter": _s3(connection_endpoint="logical-fixture"),
    "base": _s3(connection_endpoint="logical-fixture"),
    "sofa-set-classic": _s3(boundary_snap="wall-inner-face"),
    "sofa-single-classic": _s3(),
    "sofa-double-classic": _s3(),
    "coffee-table-classic": _s3(),
    "table-chair-set-eames": _s3(),
    "chair": _s3(),
    "table-glass": _s3(),
    "bar-stool": _s3(),
    "mini-fridge": _s3(overlap=("kettle",)),
    "kettle": _s3(overlap=("mini-fridge",)),
    "coat-rack": _s3(),
    "plastic-trash-bin": _s3(),
    "upright": _s3(overlap=("flat-panel", "profile", "counter")),
    "profile": _s3(overlap=("separator",)),
    "indoor-plant-1": _s3(endpoint_contact="thin-wall-endpoint"),
    "illuminated-foam": _s3(),
    "tv": _s3(),
    "led-floodlight": _s3(),
}

TYPE_BEHAVIOR_KEYS = (
    frozenset(TYPE_BEHAVIOR_SLICE1) | frozenset(TYPE_BEHAVIOR_SLICE2) | frozenset(TYPE_BEHAVIOR_SLICE3)
)


def behavior_slice1_for_type(item_type: str) -> tuple[str, str, int]:
    return TYPE_BEHAVIOR_SLICE1.get(
        item_type,
        (DEFAULT_PLACEMENT, DEFAULT_COLLISION, DEFAULT_MOVE_SNAP_CM),
    )


def behavior_slice2_for_type(item_type: str) -> tuple[str, bool, bool, str]:
    return TYPE_BEHAVIOR_SLICE2.get(
        item_type,
        (
            DEFAULT_MAGNETIC_SNAP,
            DEFAULT_ALLOW_SIDE_INSERT,
            DEFAULT_SUPPORTS_WALL_OVERLAY_MOUNT,
            DEFAULT_WALL_CAPACITY,
        ),
    )


def behavior_slice3_for_type(item_type: str) -> _Slice3:
    return TYPE_BEHAVIOR_SLICE3.get(item_type, _DEFAULT_S3)


def _overlap_keys(row) -> list[str]:
    return sorted(item.key for item in (row.overlap_types or []))


def set_item_type_overlaps(session, row, overlap_keys: list[str] | tuple[str, ...]) -> None:
    """Stamp M:N overlap rows; unknown keys → RuntimeError (gevşetme yok)."""
    import sqlalchemy as sa

    from app.modules.fair_stand.infrastructure.models import FairStandItemTypeModel

    wanted = sorted({str(k).strip() for k in overlap_keys if str(k).strip()})
    if not wanted:
        row.overlap_types = []
        return
    if row.key in wanted:
        raise RuntimeError(f"overlap kendini referanslayamaz: {row.key}")
    found = list(
        session.scalars(
            sa.select(FairStandItemTypeModel).where(FairStandItemTypeModel.key.in_(wanted))
        ).all()
    )
    found_keys = {item.key for item in found}
    missing = sorted(set(wanted) - found_keys)
    if missing:
        raise RuntimeError(
            f"overlap bilinmeyen tip key(ler) ({row.key}): {', '.join(missing)}"
        )
    row.overlap_types = sorted(found, key=lambda item: item.key)


def ensure_type_behavior_slices(session) -> dict[str, int]:
    """Idempotent: slice1+2+3 keys + kolon stamp + overlap FK (gevşetme yok)."""
    from datetime import UTC, datetime

    import sqlalchemy as sa

    from app.modules.fair_stand.infrastructure.item_snap_seed import ensure_item_types
    from app.modules.fair_stand.infrastructure.models import FairStandItemTypeModel

    ids = ensure_item_types(session, TYPE_BEHAVIOR_KEYS)
    now = datetime.now(tz=UTC)
    for key in sorted(TYPE_BEHAVIOR_KEYS):
        row = session.scalar(
            sa.select(FairStandItemTypeModel).where(FairStandItemTypeModel.key == key)
        )
        if row is None:
            raise RuntimeError(f"ensure_type_behavior_slices: tip oluşmadı: {key}")
        placement, collision, move_snap_cm = behavior_slice1_for_type(key)
        magnetic_snap, allow_side, supports_overlay, wall_capacity = behavior_slice2_for_type(key)
        (
            connection_endpoint,
            collision_depth,
            endpoint_contact,
            boundary_snap,
            collision_height,
            overlap,
            ghost_kind,
            ghost_renderer,
            ghost_opacity,
        ) = behavior_slice3_for_type(key)
        overlap_list = list(overlap)
        changed = (
            row.placement != placement
            or row.collision != collision
            or int(row.move_snap_cm) != move_snap_cm
            or row.magnetic_snap != magnetic_snap
            or bool(row.allow_side_insert) != allow_side
            or bool(row.supports_wall_overlay_mount) != supports_overlay
            or row.wall_capacity != wall_capacity
            or row.connection_endpoint != connection_endpoint
            or row.collision_depth != collision_depth
            or row.endpoint_contact != endpoint_contact
            or row.boundary_snap != boundary_snap
            or row.collision_height != collision_height
            or _overlap_keys(row) != sorted(overlap_list)
            or row.ghost_kind != ghost_kind
            or row.ghost_renderer != ghost_renderer
            or Decimal(str(row.ghost_opacity)) != ghost_opacity
        )
        if changed:
            row.placement = placement
            row.collision = collision
            row.move_snap_cm = move_snap_cm
            row.magnetic_snap = magnetic_snap
            row.allow_side_insert = allow_side
            row.supports_wall_overlay_mount = supports_overlay
            row.wall_capacity = wall_capacity
            row.connection_endpoint = connection_endpoint
            row.collision_depth = collision_depth
            row.endpoint_contact = endpoint_contact
            row.boundary_snap = boundary_snap
            row.collision_height = collision_height
            set_item_type_overlaps(session, row, overlap_list)
            row.ghost_kind = ghost_kind
            row.ghost_renderer = ghost_renderer
            row.ghost_opacity = ghost_opacity
            row.updated_at = now
    return ids


def ensure_type_behavior_slice1(session) -> dict[str, int]:
    return ensure_type_behavior_slices(session)
