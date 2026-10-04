"""Admin CRUD for the global fair_stand_units catalog."""

from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.modules.fair_stand.application.admin_items import _normalize_item_key
from app.modules.fair_stand.infrastructure.models import FairStandUnitModel


class UnitAdminError(ValueError):
    def __init__(self, message: str, *, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


def _now() -> datetime:
    return datetime.now(tz=UTC)


def _unit_key_from_name(name: str) -> str:
    unit_key = _normalize_item_key(name, max_length=64)
    if not unit_key:
        raise UnitAdminError("Addan unit key üretilemedi.")
    return unit_key


def _required_text(value: object, *, field: str, max_length: int) -> str:
    text = str(value).strip()
    if not text:
        raise UnitAdminError(f"{field} zorunludur.")
    if len(text) > max_length:
        raise UnitAdminError(f"{field} en fazla {max_length} karakter olabilir.")
    return text


def _unit_payload(row: FairStandUnitModel) -> dict:
    return {
        "id": int(row.id),
        "unitKey": row.unit_key,
        "name": row.name,
        "symbol": row.symbol,
        "isActive": bool(row.is_active),
    }


class AdminUnitsService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def _flush(self) -> None:
        try:
            with self._session.begin_nested():
                self._session.flush()
        except IntegrityError as exc:
            orig = str(getattr(exc, "orig", exc)).lower()
            if "uq_fair_stand_units_unit_key" in orig or "unit_key" in orig:
                raise UnitAdminError("Bu unit key zaten kayıtlı.", status_code=409) from exc
            raise UnitAdminError("Kayıt kaydedilemedi.", status_code=409) from exc

    def list_units(self) -> list[dict]:
        rows = self._session.scalars(
            select(FairStandUnitModel).order_by(FairStandUnitModel.unit_key, FairStandUnitModel.id)
        ).all()
        return [_unit_payload(row) for row in rows]

    def create_unit(self, *, name: str, symbol: str, is_active: bool = True) -> dict:
        stored_name = _required_text(name, field="name", max_length=128)
        unit_key = _unit_key_from_name(stored_name)
        now = _now()
        row = FairStandUnitModel(
            unit_key=unit_key,
            name=stored_name,
            symbol=_required_text(symbol, field="symbol", max_length=32),
            is_active=bool(is_active),
            created_at=now,
            updated_at=now,
        )
        self._session.add(row)
        self._flush()
        return _unit_payload(row)

    def update_unit(
        self,
        unit_id: int,
        *,
        name: str | None = None,
        symbol: str | None = None,
        is_active: bool | None = None,
    ) -> dict:
        row = self._session.get(FairStandUnitModel, int(unit_id))
        if row is None:
            raise UnitAdminError("Ölçü birimi bulunamadı.", status_code=404)
        if name is not None:
            stored_name = _required_text(name, field="name", max_length=128)
            row.name = stored_name
            row.unit_key = _unit_key_from_name(stored_name)
        if symbol is not None:
            row.symbol = _required_text(symbol, field="symbol", max_length=32)
        if is_active is not None:
            row.is_active = bool(is_active)
        row.updated_at = _now()
        self._flush()
        return _unit_payload(row)

    def archive_unit(self, unit_id: int) -> dict:
        return self.update_unit(unit_id, is_active=False)

    def restore_unit(self, unit_id: int) -> dict:
        return self.update_unit(unit_id, is_active=True)
