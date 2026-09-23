"""Admin CRUD for stand.family, rule_type, and rule."""

from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.modules.fair_stand.infrastructure.item_snap_seed import (
    SNAP_EDGES,
    SNAP_FACES,
    SNAP_MOUNT_MODES,
)
from app.modules.fair_stand.infrastructure.models import (
    FairStandFamilyModel,
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


def _family_payload(row: FairStandFamilyModel) -> dict:
    return {
        "id": int(row.id),
        "code": row.code,
        "displayName": row.display_name,
        "sortIndex": int(row.sort_index),
        "isActive": bool(row.is_active),
    }


def _rule_type_payload(row: FairStandRuleTypeModel) -> dict:
    return {
        "id": int(row.id),
        "code": row.code,
        "displayName": row.display_name,
        "isActive": bool(row.is_active),
    }


def _rule_payload(row: FairStandRuleModel) -> dict:
    return {
        "id": int(row.id),
        "ruleTypeId": int(row.rule_type_id),
        "ruleTypeCode": row.rule_type.code if row.rule_type is not None else None,
        "code": row.code,
        "displayName": row.display_name,
        "face": row.face,
        "edge": row.edge,
        "mountMode": row.mount_mode,
        "sortIndex": int(row.sort_index),
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
                "Kayıt kaydedilemedi: kod çakışması veya kısıt ihlali.",
                status_code=409,
            ) from exc

    # --- families (stand.family) ---

    def list_families(self) -> list[dict]:
        rows = self._session.scalars(
            select(FairStandFamilyModel).order_by(
                FairStandFamilyModel.sort_index,
                FairStandFamilyModel.code,
            )
        ).all()
        return [_family_payload(row) for row in rows]

    def create_family(
        self,
        *,
        code: str,
        display_name: str,
        sort_index: int = 0,
        is_active: bool = True,
    ) -> dict:
        code = code.strip()
        display_name = display_name.strip()
        if not code:
            raise SnapCatalogAdminError("code zorunludur.")
        if not display_name:
            raise SnapCatalogAdminError("display_name zorunludur.")
        now = _now()
        row = FairStandFamilyModel(
            code=code,
            display_name=display_name,
            sort_index=int(sort_index),
            is_active=bool(is_active),
            created_at=now,
            updated_at=now,
        )
        self._session.add(row)
        self._flush()
        return _family_payload(row)

    def update_family(self, family_id: int, payload: dict) -> dict:
        row = self._session.get(FairStandFamilyModel, int(family_id))
        if row is None:
            raise SnapCatalogAdminError("Aile bulunamadı.", status_code=404)
        if "code" in payload and payload["code"] is not None:
            code = str(payload["code"]).strip()
            if not code:
                raise SnapCatalogAdminError("code zorunludur.")
            row.code = code
        if "display_name" in payload and payload["display_name"] is not None:
            name = str(payload["display_name"]).strip()
            if not name:
                raise SnapCatalogAdminError("display_name zorunludur.")
            row.display_name = name
        if "sort_index" in payload and payload["sort_index"] is not None:
            row.sort_index = int(payload["sort_index"])
        if "is_active" in payload and payload["is_active"] is not None:
            row.is_active = bool(payload["is_active"])
        row.updated_at = _now()
        self._flush()
        return _family_payload(row)

    def archive_family(self, family_id: int) -> dict:
        return self.update_family(family_id, {"is_active": False})

    def restore_family(self, family_id: int) -> dict:
        return self.update_family(family_id, {"is_active": True})

    # --- rule types ---

    def list_rule_types(self) -> list[dict]:
        rows = self._session.scalars(
            select(FairStandRuleTypeModel).order_by(FairStandRuleTypeModel.code)
        ).all()
        return [_rule_type_payload(row) for row in rows]

    def create_rule_type(self, *, code: str, display_name: str, is_active: bool = True) -> dict:
        code = code.strip()
        display_name = display_name.strip()
        if not code:
            raise SnapCatalogAdminError("code zorunludur.")
        if not display_name:
            raise SnapCatalogAdminError("display_name zorunludur.")
        now = _now()
        row = FairStandRuleTypeModel(
            code=code,
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
        if "code" in payload and payload["code"] is not None:
            code = str(payload["code"]).strip()
            if not code:
                raise SnapCatalogAdminError("code zorunludur.")
            row.code = code
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
            .options(selectinload(FairStandRuleModel.rule_type))
            .order_by(FairStandRuleModel.sort_index, FairStandRuleModel.code)
        ).all()
        return [_rule_payload(row) for row in rows]

    def _validate_snap_geometry(
        self,
        *,
        face: str | None,
        edge: str | None,
        mount_mode: str | None,
    ) -> tuple[str | None, str | None, str | None]:
        face = _optional_str(face)
        edge = _optional_str(edge)
        mount_mode = _optional_str(mount_mode)
        if (face is None) != (edge is None):
            raise SnapCatalogAdminError("face ve edge birlikte seçilmeli veya ikisi de boş olmalı.")
        if face is not None and face not in SNAP_FACES:
            raise SnapCatalogAdminError("Geçersiz face.")
        if edge is not None and edge not in SNAP_EDGES:
            raise SnapCatalogAdminError("Geçersiz edge.")
        if mount_mode is not None and mount_mode not in SNAP_MOUNT_MODES:
            raise SnapCatalogAdminError("Geçersiz mount_mode.")
        return face, edge, mount_mode

    def create_rule(
        self,
        *,
        rule_type_id: int,
        code: str,
        display_name: str,
        face: str | None = None,
        edge: str | None = None,
        mount_mode: str | None = None,
        sort_index: int = 0,
        is_active: bool = True,
    ) -> dict:
        code = code.strip()
        display_name = display_name.strip()
        if not code:
            raise SnapCatalogAdminError("code zorunludur.")
        if not display_name:
            raise SnapCatalogAdminError("display_name zorunludur.")
        rule_type = self._session.get(FairStandRuleTypeModel, int(rule_type_id))
        if rule_type is None:
            raise SnapCatalogAdminError("Kural tipi bulunamadı.", status_code=404)
        face, edge, mount_mode = self._validate_snap_geometry(
            face=face, edge=edge, mount_mode=mount_mode
        )
        now = _now()
        row = FairStandRuleModel(
            rule_type_id=int(rule_type_id),
            code=code,
            display_name=display_name,
            face=face,
            edge=edge,
            mount_mode=mount_mode,
            sort_index=int(sort_index),
            is_active=bool(is_active),
            created_at=now,
            updated_at=now,
        )
        self._session.add(row)
        self._flush()
        loaded = self._session.scalar(
            select(FairStandRuleModel)
            .options(selectinload(FairStandRuleModel.rule_type))
            .where(FairStandRuleModel.id == row.id)
        )
        return _rule_payload(loaded or row)

    def update_rule(self, rule_id: int, payload: dict) -> dict:
        row = self._session.scalar(
            select(FairStandRuleModel)
            .options(selectinload(FairStandRuleModel.rule_type))
            .where(FairStandRuleModel.id == int(rule_id))
        )
        if row is None:
            raise SnapCatalogAdminError("Kural bulunamadı.", status_code=404)
        if "rule_type_id" in payload and payload["rule_type_id"] is not None:
            rule_type = self._session.get(FairStandRuleTypeModel, int(payload["rule_type_id"]))
            if rule_type is None:
                raise SnapCatalogAdminError("Kural tipi bulunamadı.", status_code=404)
            row.rule_type_id = int(payload["rule_type_id"])
        if "code" in payload and payload["code"] is not None:
            code = str(payload["code"]).strip()
            if not code:
                raise SnapCatalogAdminError("code zorunludur.")
            row.code = code
        if "display_name" in payload and payload["display_name"] is not None:
            name = str(payload["display_name"]).strip()
            if not name:
                raise SnapCatalogAdminError("display_name zorunludur.")
            row.display_name = name
        if any(key in payload for key in ("face", "edge", "mount_mode")):
            face = payload["face"] if "face" in payload else row.face
            edge = payload["edge"] if "edge" in payload else row.edge
            mount_mode = payload["mount_mode"] if "mount_mode" in payload else row.mount_mode
            row.face, row.edge, row.mount_mode = self._validate_snap_geometry(
                face=face, edge=edge, mount_mode=mount_mode
            )
        if "sort_index" in payload and payload["sort_index"] is not None:
            row.sort_index = int(payload["sort_index"])
        if "is_active" in payload and payload["is_active"] is not None:
            row.is_active = bool(payload["is_active"])
        row.updated_at = _now()
        self._flush()
        return _rule_payload(row)

    def archive_rule(self, rule_id: int) -> dict:
        return self.update_rule(rule_id, {"is_active": False})

    def restore_rule(self, rule_id: int) -> dict:
        return self.update_rule(rule_id, {"is_active": True})
