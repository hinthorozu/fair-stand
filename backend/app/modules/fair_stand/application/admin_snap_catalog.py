"""Admin CRUD for fair_stand_item_type, rule_type, and rule."""

from __future__ import annotations

import re
import unicodedata
from datetime import UTC, datetime
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.modules.fair_stand.infrastructure.item_snap_seed import (
    SNAP_EDGES,
    SNAP_FACES,
)
from app.modules.fair_stand.infrastructure.item_type_behavior_seed import (
    BOUNDARY_SNAP_VALUES,
    COLLISION_DEPTH_VALUES,
    COLLISION_HEIGHT_VALUES,
    COLLISION_VALUES,
    CONNECTION_ENDPOINT_VALUES,
    ENDPOINT_CONTACT_VALUES,
    MAGNETIC_SNAP_VALUES,
    PLACEMENT_VALUES,
    WALL_CAPACITY_VALUES,
)
from app.modules.fair_stand.infrastructure.models import (
    FairStandItemTypeModel,
    FairStandItemTypeSceneBehaviorModel,
    FairStandRuleModel,
    FairStandRuleTypeModel,
)

_BEHAVIOR_FIELDS = (
    "placement",
    "collision",
    "move_snap_cm",
    "magnetic_snap",
    "allow_side_insert",
    "supports_wall_overlay_mount",
    "wall_capacity",
    "connection_endpoint",
    "collision_depth",
    "endpoint_contact",
    "boundary_snap",
    "collision_height",
    "ghost_kind",
    "ghost_renderer",
    "ghost_opacity",
)


class SnapCatalogAdminError(ValueError):
    def __init__(self, message: str, *, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


def _now() -> datetime:
    return datetime.now(tz=UTC)


def _optional_str(value: object | None) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    return text or None


def slugify_key(value: str, *, max_length: int = 64) -> str:
    """Display name → editable key slug (ascii, hyphen). Same idea as item_key from name."""
    text = unicodedata.normalize("NFKD", value.strip())
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = text.replace("ı", "i").replace("İ", "i")
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    return text[:max_length] or "item"


def _resolve_key(*, key: str | None, display_name: str) -> str:
    resolved = (key or "").strip() or slugify_key(display_name)
    if not resolved:
        raise SnapCatalogAdminError("key üretilemedi.")
    return resolved


def _validate_placement(value: object) -> str:
    text = str(value).strip()
    if text not in PLACEMENT_VALUES:
        raise SnapCatalogAdminError(
            f"placement geçersiz: {text!r}. İzinli: {', '.join(sorted(PLACEMENT_VALUES))}."
        )
    return text


def _validate_collision(value: object) -> str:
    text = str(value).strip()
    if text not in COLLISION_VALUES:
        raise SnapCatalogAdminError(
            f"collision geçersiz: {text!r}. İzinli: {', '.join(sorted(COLLISION_VALUES))}."
        )
    return text


def _validate_move_snap_cm(value: object) -> int:
    try:
        snap = int(value)  # type: ignore[arg-type]
    except (TypeError, ValueError) as exc:
        raise SnapCatalogAdminError("move_snap_cm pozitif tamsayı olmalıdır.") from exc
    if snap <= 0:
        raise SnapCatalogAdminError("move_snap_cm pozitif tamsayı olmalıdır.")
    return snap


def _validate_magnetic_snap(value: object) -> str:
    text = str(value).strip()
    if text not in MAGNETIC_SNAP_VALUES:
        raise SnapCatalogAdminError(
            f"magnetic_snap geçersiz: {text!r}. İzinli: {', '.join(sorted(MAGNETIC_SNAP_VALUES))}."
        )
    return text


def _validate_wall_capacity(value: object) -> str:
    text = str(value).strip()
    if text not in WALL_CAPACITY_VALUES:
        raise SnapCatalogAdminError(
            f"wall_capacity geçersiz: {text!r}. İzinli: {', '.join(sorted(WALL_CAPACITY_VALUES))}."
        )
    return text


def _validate_enum(field: str, value: object, allowed: frozenset[str]) -> str:
    text = str(value).strip()
    if text not in allowed:
        raise SnapCatalogAdminError(
            f"{field} geçersiz: {text!r}. İzinli: {', '.join(sorted(allowed))}."
        )
    return text


def _parse_overlap_keys(value: object) -> list[str]:
    if value is None:
        return []
    if isinstance(value, str):
        return [p.strip() for p in value.split(",") if p.strip()]
    if not isinstance(value, (list, tuple)):
        raise SnapCatalogAdminError("overlap_with_types liste olmalıdır.")
    out: list[str] = []
    for item in value:
        text = str(item).strip()
        if text:
            out.append(text)
    return out


def _validate_ghost_opacity(value: object) -> Decimal:
    try:
        opacity = Decimal(str(value))
    except Exception as exc:
        raise SnapCatalogAdminError("ghost_opacity 0–1 arasında olmalıdır.") from exc
    if opacity < 0 or opacity > 1:
        raise SnapCatalogAdminError("ghost_opacity 0–1 arasında olmalıdır.")
    return opacity


def _item_type_payload(row: FairStandItemTypeModel) -> dict:
    payload = {
        "id": int(row.id),
        "key": row.key,
        "displayName": row.display_name,
        "isActive": bool(row.is_active),
    }
    behavior = row.scene_behavior
    if behavior is None:
        return payload
    overlaps = sorted(row.overlap_types or [], key=lambda item: item.key)
    payload.update(
        {
            "placement": behavior.placement,
            "collision": behavior.collision,
            "moveSnapCm": int(behavior.move_snap_cm),
            "magneticSnap": behavior.magnetic_snap,
            "allowSideInsert": bool(behavior.allow_side_insert),
            "supportsWallOverlayMount": bool(behavior.supports_wall_overlay_mount),
            "wallCapacity": behavior.wall_capacity,
            "connectionEndpoint": behavior.connection_endpoint,
            "collisionDepth": behavior.collision_depth,
            "endpointContact": behavior.endpoint_contact,
            "boundarySnap": behavior.boundary_snap,
            "collisionHeight": behavior.collision_height,
            "overlapWithTypes": [item.key for item in overlaps],
            "overlapItemTypeIds": [int(item.id) for item in overlaps],
            "ghost": {
                "kind": behavior.ghost_kind,
                "renderer": behavior.ghost_renderer,
                "opacity": float(behavior.ghost_opacity),
            },
        }
    )
    return payload


def _behavior_values_from_mapping(values: dict) -> dict:
    """Return provided behavior fields. Empty means classification-only."""
    provided = {
        key: values[key]
        for key in _BEHAVIOR_FIELDS
        if key in values and values[key] is not None
    }
    return provided


def _require_complete_behavior(provided: dict) -> None:
    missing = [key for key in _BEHAVIOR_FIELDS if key not in provided]
    if missing:
        raise SnapCatalogAdminError(
            "Scene behavior eksik: " + ", ".join(missing) + "."
        )


def _validated_behavior(provided: dict) -> dict:
    if "placement" in provided:
        _validate_placement(provided["placement"])
    if "collision" in provided:
        _validate_collision(provided["collision"])
    if "move_snap_cm" in provided:
        _validate_move_snap_cm(provided["move_snap_cm"])
    if "magnetic_snap" in provided:
        _validate_magnetic_snap(provided["magnetic_snap"])
    if "wall_capacity" in provided:
        _validate_wall_capacity(provided["wall_capacity"])
    if "connection_endpoint" in provided:
        _validate_enum(
            "connection_endpoint", provided["connection_endpoint"], CONNECTION_ENDPOINT_VALUES
        )
    if "collision_depth" in provided:
        _validate_enum("collision_depth", provided["collision_depth"], COLLISION_DEPTH_VALUES)
    if "endpoint_contact" in provided:
        _validate_enum("endpoint_contact", provided["endpoint_contact"], ENDPOINT_CONTACT_VALUES)
    if "boundary_snap" in provided:
        _validate_enum("boundary_snap", provided["boundary_snap"], BOUNDARY_SNAP_VALUES)
    if "collision_height" in provided:
        _validate_enum("collision_height", provided["collision_height"], COLLISION_HEIGHT_VALUES)
    if "ghost_opacity" in provided:
        _validate_ghost_opacity(provided["ghost_opacity"])
    _require_complete_behavior(provided)
    ghost_kind = str(provided["ghost_kind"]).strip()
    ghost_renderer = str(provided["ghost_renderer"]).strip()
    if not ghost_kind:
        raise SnapCatalogAdminError("ghost_kind boş olamaz.")
    if not ghost_renderer:
        raise SnapCatalogAdminError("ghost_renderer boş olamaz.")
    return {
        "placement": _validate_placement(provided["placement"]),
        "collision": _validate_collision(provided["collision"]),
        "move_snap_cm": _validate_move_snap_cm(provided["move_snap_cm"]),
        "magnetic_snap": _validate_magnetic_snap(provided["magnetic_snap"]),
        "allow_side_insert": bool(provided["allow_side_insert"]),
        "supports_wall_overlay_mount": bool(provided["supports_wall_overlay_mount"]),
        "wall_capacity": _validate_wall_capacity(provided["wall_capacity"]),
        "connection_endpoint": _validate_enum(
            "connection_endpoint", provided["connection_endpoint"], CONNECTION_ENDPOINT_VALUES
        ),
        "collision_depth": _validate_enum(
            "collision_depth", provided["collision_depth"], COLLISION_DEPTH_VALUES
        ),
        "endpoint_contact": _validate_enum(
            "endpoint_contact", provided["endpoint_contact"], ENDPOINT_CONTACT_VALUES
        ),
        "boundary_snap": _validate_enum(
            "boundary_snap", provided["boundary_snap"], BOUNDARY_SNAP_VALUES
        ),
        "collision_height": _validate_enum(
            "collision_height", provided["collision_height"], COLLISION_HEIGHT_VALUES
        ),
        "ghost_kind": ghost_kind,
        "ghost_renderer": ghost_renderer,
        "ghost_opacity": _validate_ghost_opacity(provided["ghost_opacity"]),
    }


def _rule_type_payload(row: FairStandRuleTypeModel) -> dict:
    return {
        "id": int(row.id),
        "key": row.key,
        "displayName": row.display_name,
        "isActive": bool(row.is_active),
    }


def _rule_payload(row: FairStandRuleModel) -> dict:
    item_types = sorted(row.item_types or [], key=lambda item_type: item_type.display_name)
    return {
        "id": int(row.id),
        "ruleTypeId": int(row.rule_type_id),
        "ruleTypeKey": row.rule_type.key if row.rule_type is not None else None,
        "key": row.key,
        "displayName": row.display_name,
        "face": row.face,
        "edge": row.edge,
        "itemTypeIds": [int(item_type.id) for item_type in item_types],
        "itemTypeKeys": [item_type.key for item_type in item_types],
        "isActive": bool(row.is_active),
    }


class AdminSnapCatalogService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def _flush(self) -> None:
        try:
            self._session.flush()
        except IntegrityError as exc:
            raise SnapCatalogAdminError(
                "Kayıt kaydedilemedi: key çakışması veya kısıt ihlali.",
                status_code=409,
            ) from exc

    # --- item types ---

    def list_item_types(self) -> list[dict]:
        rows = self._session.scalars(
            select(FairStandItemTypeModel)
            .options(
                selectinload(FairStandItemTypeModel.overlap_types),
                selectinload(FairStandItemTypeModel.scene_behavior),
            )
            .order_by(FairStandItemTypeModel.display_name)
        ).all()
        return [_item_type_payload(row) for row in rows]

    def _set_item_type_overlaps(
        self,
        row: FairStandItemTypeModel,
        *,
        overlap_with_types: list[str] | str | None = None,
        overlap_item_type_ids: list[int] | None = None,
        allow_unset: bool = False,
    ) -> None:
        """Resolve overlap by keys and/or ids; unknown → 400. Self → 400."""
        if overlap_item_type_ids is None and overlap_with_types is None:
            if allow_unset:
                return
            raise SnapCatalogAdminError("overlap alanları eksik.")

        keys: list[str] = []
        if overlap_with_types is not None:
            keys.extend(_parse_overlap_keys(overlap_with_types))
        if overlap_item_type_ids is not None:
            unique_ids = sorted(
                {int(item_id) for item_id in overlap_item_type_ids if int(item_id) > 0}
            )
            if unique_ids:
                found = list(
                    self._session.scalars(
                        select(FairStandItemTypeModel).where(
                            FairStandItemTypeModel.id.in_(unique_ids)
                        )
                    ).all()
                )
                if len(found) != len(unique_ids):
                    raise SnapCatalogAdminError(
                        "Overlap: bir veya daha fazla item tipi bulunamadı.",
                        status_code=404,
                    )
                keys.extend(item.key for item in found)

        wanted = sorted({key for key in keys if key})
        if row.key in wanted:
            raise SnapCatalogAdminError("Overlap kendini referanslayamaz.")
        if not wanted:
            row.overlap_types = []
            return
        found_by_key = list(
            self._session.scalars(
                select(FairStandItemTypeModel).where(FairStandItemTypeModel.key.in_(wanted))
            ).all()
        )
        found_keys = {item.key for item in found_by_key}
        missing = sorted(set(wanted) - found_keys)
        if missing:
            raise SnapCatalogAdminError(
                f"Overlap bilinmeyen tip key: {', '.join(missing)}",
                status_code=400,
            )
        row.overlap_types = sorted(found_by_key, key=lambda item: item.key)

    def create_item_type(
        self,
        *,
        display_name: str,
        key: str | None = None,
        is_active: bool = True,
        placement: str | None = None,
        collision: str | None = None,
        move_snap_cm: int | None = None,
        magnetic_snap: str | None = None,
        allow_side_insert: bool | None = None,
        supports_wall_overlay_mount: bool | None = None,
        wall_capacity: str | None = None,
        connection_endpoint: str | None = None,
        collision_depth: str | None = None,
        endpoint_contact: str | None = None,
        boundary_snap: str | None = None,
        collision_height: str | None = None,
        overlap_with_types: list[str] | str | None = None,
        overlap_item_type_ids: list[int] | None = None,
        ghost_kind: str | None = None,
        ghost_renderer: str | None = None,
        ghost_opacity: object | None = None,
    ) -> dict:
        display_name = display_name.strip()
        if not display_name:
            raise SnapCatalogAdminError("display_name zorunludur.")
        key = _resolve_key(key=key, display_name=display_name)
        provided = _behavior_values_from_mapping(
            {
                "placement": placement,
                "collision": collision,
                "move_snap_cm": move_snap_cm,
                "magnetic_snap": magnetic_snap,
                "allow_side_insert": allow_side_insert,
                "supports_wall_overlay_mount": supports_wall_overlay_mount,
                "wall_capacity": wall_capacity,
                "connection_endpoint": connection_endpoint,
                "collision_depth": collision_depth,
                "endpoint_contact": endpoint_contact,
                "boundary_snap": boundary_snap,
                "collision_height": collision_height,
                "ghost_kind": ghost_kind,
                "ghost_renderer": ghost_renderer,
                "ghost_opacity": ghost_opacity,
            }
        )
        overlap_requested = overlap_with_types is not None or overlap_item_type_ids is not None
        if overlap_requested and not provided:
            raise SnapCatalogAdminError(
                "Scene behavior olmayan tipe overlap bağlanamaz."
            )
        behavior_values = _validated_behavior(provided) if provided else None
        now = _now()
        row = FairStandItemTypeModel(
            key=key,
            display_name=display_name,
            is_active=bool(is_active),
            created_at=now,
            updated_at=now,
        )
        self._session.add(row)
        self._flush()
        if behavior_values is not None:
            row.scene_behavior = FairStandItemTypeSceneBehaviorModel(
                item_type_id=row.id,
                **behavior_values,
            )
            if overlap_requested:
                self._set_item_type_overlaps(
                    row,
                    overlap_with_types=overlap_with_types,
                    overlap_item_type_ids=overlap_item_type_ids,
                )
            else:
                row.overlap_types = []
            self._flush()
        return _item_type_payload(row)

    def update_item_type(self, item_type_id: int, payload: dict) -> dict:
        row = self._session.get(FairStandItemTypeModel, int(item_type_id))
        if row is None:
            raise SnapCatalogAdminError("Item tipi bulunamadı.", status_code=404)
        if "display_name" in payload and payload["display_name"] is not None:
            name = str(payload["display_name"]).strip()
            if not name:
                raise SnapCatalogAdminError("display_name zorunludur.")
            row.display_name = name
        if "key" in payload and payload["key"] is not None:
            key = str(payload["key"]).strip()
            if not key:
                raise SnapCatalogAdminError("key zorunludur.")
            row.key = key
        if "is_active" in payload and payload["is_active"] is not None:
            row.is_active = bool(payload["is_active"])
        provided = _behavior_values_from_mapping(payload)
        overlap_requested = "overlap_with_types" in payload or "overlap_item_type_ids" in payload
        if row.scene_behavior is None:
            if overlap_requested and not provided:
                raise SnapCatalogAdminError(
                    "Scene behavior olmayan tipe overlap bağlanamaz."
                )
            if provided:
                behavior_values = _validated_behavior(provided)
                row.scene_behavior = FairStandItemTypeSceneBehaviorModel(
                    item_type_id=row.id,
                    **behavior_values,
                )
                if overlap_requested:
                    self._set_item_type_overlaps(
                        row,
                        overlap_with_types=payload.get("overlap_with_types"),
                        overlap_item_type_ids=payload.get("overlap_item_type_ids"),
                        allow_unset=False,
                    )
                else:
                    row.overlap_types = []
        else:
            behavior = row.scene_behavior
            if "placement" in provided:
                behavior.placement = _validate_placement(provided["placement"])
            if "collision" in provided:
                behavior.collision = _validate_collision(provided["collision"])
            if "move_snap_cm" in provided:
                behavior.move_snap_cm = _validate_move_snap_cm(provided["move_snap_cm"])
            if "magnetic_snap" in provided:
                behavior.magnetic_snap = _validate_magnetic_snap(provided["magnetic_snap"])
            if "allow_side_insert" in provided:
                behavior.allow_side_insert = bool(provided["allow_side_insert"])
            if "supports_wall_overlay_mount" in provided:
                behavior.supports_wall_overlay_mount = bool(provided["supports_wall_overlay_mount"])
            if "wall_capacity" in provided:
                behavior.wall_capacity = _validate_wall_capacity(provided["wall_capacity"])
            if "connection_endpoint" in provided:
                behavior.connection_endpoint = _validate_enum(
                    "connection_endpoint", provided["connection_endpoint"], CONNECTION_ENDPOINT_VALUES
                )
            if "collision_depth" in provided:
                behavior.collision_depth = _validate_enum(
                    "collision_depth", provided["collision_depth"], COLLISION_DEPTH_VALUES
                )
            if "endpoint_contact" in provided:
                behavior.endpoint_contact = _validate_enum(
                    "endpoint_contact", provided["endpoint_contact"], ENDPOINT_CONTACT_VALUES
                )
            if "boundary_snap" in provided:
                behavior.boundary_snap = _validate_enum(
                    "boundary_snap", provided["boundary_snap"], BOUNDARY_SNAP_VALUES
                )
            if "collision_height" in provided:
                behavior.collision_height = _validate_enum(
                    "collision_height", provided["collision_height"], COLLISION_HEIGHT_VALUES
                )
            if "ghost_kind" in provided:
                kind = str(provided["ghost_kind"]).strip()
                if not kind:
                    raise SnapCatalogAdminError("ghost_kind boş olamaz.")
                behavior.ghost_kind = kind
            if "ghost_renderer" in provided:
                renderer = str(provided["ghost_renderer"]).strip()
                if not renderer:
                    raise SnapCatalogAdminError("ghost_renderer boş olamaz.")
                behavior.ghost_renderer = renderer
            if "ghost_opacity" in provided:
                behavior.ghost_opacity = _validate_ghost_opacity(provided["ghost_opacity"])
            if overlap_requested:
                self._set_item_type_overlaps(
                    row,
                    overlap_with_types=payload.get("overlap_with_types"),
                    overlap_item_type_ids=payload.get("overlap_item_type_ids"),
                    allow_unset=False,
                )
        row.updated_at = _now()
        self._flush()
        return _item_type_payload(row)

    def archive_item_type(self, item_type_id: int) -> dict:
        return self.update_item_type(item_type_id, {"is_active": False})

    def restore_item_type(self, item_type_id: int) -> dict:
        return self.update_item_type(item_type_id, {"is_active": True})

    # --- rule types ---

    def list_rule_types(self) -> list[dict]:
        rows = self._session.scalars(
            select(FairStandRuleTypeModel).order_by(FairStandRuleTypeModel.display_name)
        ).all()
        return [_rule_type_payload(row) for row in rows]

    def create_rule_type(self, *, display_name: str, key: str | None = None, is_active: bool = True) -> dict:
        display_name = display_name.strip()
        if not display_name:
            raise SnapCatalogAdminError("display_name zorunludur.")
        key = _resolve_key(key=key, display_name=display_name)
        now = _now()
        row = FairStandRuleTypeModel(
            key=key,
            display_name=display_name,
            is_active=bool(is_active),
            created_at=now,
            updated_at=now,
        )
        self._session.add(row)
        self._flush()
        return _rule_type_payload(row)

    def update_rule_type(self, rule_type_id: int, payload: dict) -> dict:
        row = self._session.get(FairStandRuleTypeModel, int(rule_type_id))
        if row is None:
            raise SnapCatalogAdminError("Kural tipi bulunamadı.", status_code=404)
        if "key" in payload and payload["key"] is not None:
            key = str(payload["key"]).strip()
            if not key:
                raise SnapCatalogAdminError("key zorunludur.")
            row.key = key
        if "display_name" in payload and payload["display_name"] is not None:
            name = str(payload["display_name"]).strip()
            if not name:
                raise SnapCatalogAdminError("display_name zorunludur.")
            row.display_name = name
        if "is_active" in payload and payload["is_active"] is not None:
            row.is_active = bool(payload["is_active"])
        row.updated_at = _now()
        self._flush()
        return _rule_type_payload(row)

    def archive_rule_type(self, rule_type_id: int) -> dict:
        return self.update_rule_type(rule_type_id, {"is_active": False})

    def restore_rule_type(self, rule_type_id: int) -> dict:
        return self.update_rule_type(rule_type_id, {"is_active": True})

    # --- rules ---

    def list_rules(self) -> list[dict]:
        rows = self._session.scalars(
            select(FairStandRuleModel)
            .options(
                selectinload(FairStandRuleModel.rule_type),
                selectinload(FairStandRuleModel.item_types),
            )
            .order_by(FairStandRuleModel.display_name)
        ).all()
        return [_rule_payload(row) for row in rows]

    def _set_rule_item_types(self, row: FairStandRuleModel, item_type_ids: list[int] | None) -> None:
        if item_type_ids is None:
            return
        unique_ids = sorted({int(item_type_id) for item_type_id in item_type_ids if int(item_type_id) > 0})
        if not unique_ids:
            item_types: list[FairStandItemTypeModel] = []
        else:
            item_types = list(
                self._session.scalars(
                    select(FairStandItemTypeModel).where(FairStandItemTypeModel.id.in_(unique_ids))
                ).all()
            )
            if len(item_types) != len(unique_ids):
                raise SnapCatalogAdminError("Bir veya daha fazla item tipi bulunamadı.", status_code=404)
        missing_behavior = [item.key for item in item_types if item.scene_behavior is None]
        if missing_behavior:
            raise SnapCatalogAdminError(
                "Scene behavior olmayan tipe snap rule bağlanamaz: "
                + ", ".join(sorted(missing_behavior))
                + ".",
                status_code=400,
            )
        # Tip linki = motor provides; item.snap_provides_rule_id yazılmaz (opsiyonel override).
        row.item_types = item_types

    def _validate_snap_geometry(
        self,
        *,
        face: str | None,
        edge: str | None,
    ) -> tuple[str | None, str | None]:
        face = _optional_str(face)
        edge = _optional_str(edge)
        if (face is None) != (edge is None):
            raise SnapCatalogAdminError("face ve edge birlikte seçilmeli veya ikisi de boş olmalı.")
        if face is not None and face not in SNAP_FACES:
            raise SnapCatalogAdminError("Geçersiz face.")
        if edge is not None and edge not in SNAP_EDGES:
            raise SnapCatalogAdminError("Geçersiz edge.")
        return face, edge

    def create_rule(
        self,
        *,
        rule_type_id: int,
        display_name: str,
        key: str | None = None,
        face: str | None = None,
        edge: str | None = None,
        item_type_ids: list[int] | None = None,
        is_active: bool = True,
    ) -> dict:
        display_name = display_name.strip()
        if not display_name:
            raise SnapCatalogAdminError("display_name zorunludur.")
        key = _resolve_key(key=key, display_name=display_name)
        rule_type = self._session.get(FairStandRuleTypeModel, int(rule_type_id))
        if rule_type is None:
            raise SnapCatalogAdminError("Kural tipi bulunamadı.", status_code=404)
        face, edge = self._validate_snap_geometry(face=face, edge=edge)
        now = _now()
        row = FairStandRuleModel(
            rule_type_id=int(rule_type_id),
            key=key,
            display_name=display_name,
            face=face,
            edge=edge,
            is_active=bool(is_active),
            created_at=now,
            updated_at=now,
        )
        self._session.add(row)
        self._flush()
        self._set_rule_item_types(row, item_type_ids)
        self._flush()
        loaded = self._session.scalar(
            select(FairStandRuleModel)
            .options(
                selectinload(FairStandRuleModel.rule_type),
                selectinload(FairStandRuleModel.item_types),
            )
            .where(FairStandRuleModel.id == row.id)
        )
        return _rule_payload(loaded or row)

    def update_rule(self, rule_id: int, payload: dict) -> dict:
        row = self._session.scalar(
            select(FairStandRuleModel)
            .options(
                selectinload(FairStandRuleModel.rule_type),
                selectinload(FairStandRuleModel.item_types),
            )
            .where(FairStandRuleModel.id == int(rule_id))
        )
        if row is None:
            raise SnapCatalogAdminError("Kural bulunamadı.", status_code=404)
        if "rule_type_id" in payload and payload["rule_type_id"] is not None:
            rule_type = self._session.get(FairStandRuleTypeModel, int(payload["rule_type_id"]))
            if rule_type is None:
                raise SnapCatalogAdminError("Kural tipi bulunamadı.", status_code=404)
            row.rule_type_id = int(payload["rule_type_id"])
        if "key" in payload and payload["key"] is not None:
            key = str(payload["key"]).strip()
            if not key:
                raise SnapCatalogAdminError("key zorunludur.")
            row.key = key
        if "display_name" in payload and payload["display_name"] is not None:
            name = str(payload["display_name"]).strip()
            if not name:
                raise SnapCatalogAdminError("display_name zorunludur.")
            row.display_name = name
        if any(field in payload for field in ("face", "edge")):
            face = payload["face"] if "face" in payload else row.face
            edge = payload["edge"] if "edge" in payload else row.edge
            row.face, row.edge = self._validate_snap_geometry(face=face, edge=edge)
        if "item_type_ids" in payload:
            self._set_rule_item_types(row, payload.get("item_type_ids") or [])
        if "is_active" in payload and payload["is_active"] is not None:
            row.is_active = bool(payload["is_active"])
        row.updated_at = _now()
        self._flush()
        return _rule_payload(row)

    def archive_rule(self, rule_id: int) -> dict:
        return self.update_rule(rule_id, {"is_active": False})

    def restore_rule(self, rule_id: int) -> dict:
        return self.update_rule(rule_id, {"is_active": True})
