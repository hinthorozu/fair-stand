"""Admin CRUD for fair_stand_item_type, rule_type, and rule."""

from __future__ import annotations

import re
import unicodedata
from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.modules.fair_stand.infrastructure.item_snap_seed import (
    SNAP_EDGES,
    SNAP_FACES,
)
from app.modules.fair_stand.infrastructure.models import (
    FairStandItemTypeModel,
    FairStandRuleModel,
    FairStandRuleTypeModel,
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


def _item_type_payload(row: FairStandItemTypeModel) -> dict:
    return {
        "id": int(row.id),
        "key": row.key,
        "displayName": row.display_name,
        "isActive": bool(row.is_active),
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
            select(FairStandItemTypeModel).order_by(FairStandItemTypeModel.display_name)
        ).all()
        return [_item_type_payload(row) for row in rows]

    def create_item_type(
        self,
        *,
        display_name: str,
        key: str | None = None,
        is_active: bool = True,
    ) -> dict:
        display_name = display_name.strip()
        if not display_name:
            raise SnapCatalogAdminError("display_name zorunludur.")
        key = _resolve_key(key=key, display_name=display_name)
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
