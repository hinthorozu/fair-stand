from __future__ import annotations

from datetime import UTC, datetime
from decimal import Decimal, InvalidOperation

from sqlalchemy.orm import Session

from app.modules.fair_stand.application.item_mapper import (
    map_runtime_settings,
    map_stand_dimensions,
    runtime_settings_payload,
    stand_dimensions_payload,
)
from app.modules.fair_stand.infrastructure.models import FairStandDimensionsModel, FairStandSettingsModel
from app.modules.fair_stand.infrastructure.runtime_settings_seed import ensure_runtime_settings
from app.modules.fair_stand.infrastructure.stand_dimensions_seed import ensure_stand_dimensions


class SettingsAdminError(ValueError):
    def __init__(self, message: str, *, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


def _now() -> datetime:
    return datetime.now(tz=UTC)


def _positive_decimal(value: object, *, label: str) -> Decimal:
    try:
        number = value if isinstance(value, Decimal) else Decimal(str(value))
    except (InvalidOperation, TypeError, ValueError) as exc:
        raise SettingsAdminError(f"{label} sayı olmalıdır.") from exc
    if number <= 0:
        raise SettingsAdminError(f"{label} sıfırdan büyük olmalıdır.")
    return number


def _positive_int(value: object, *, label: str) -> int:
    try:
        number = int(value)  # type: ignore[arg-type]
    except (TypeError, ValueError) as exc:
        raise SettingsAdminError(f"{label} tam sayı olmalıdır.") from exc
    if number <= 0:
        raise SettingsAdminError(f"{label} sıfırdan büyük olmalıdır.")
    return number


class AdminSettingsService:
    def __init__(self, session: Session) -> None:
        self._session = session

    def get_bundle(self) -> dict:
        dimensions = ensure_stand_dimensions(self._session)
        settings = ensure_runtime_settings(self._session)
        self._session.flush()
        return {
            "standDimensions": stand_dimensions_payload(map_stand_dimensions(dimensions)),
            "settings": runtime_settings_payload(map_runtime_settings(settings)),
        }

    def update_stand_dimensions(
        self,
        *,
        height_cm: object,
        depth_cm: object,
        frame_width_cm: object,
        frame_depth_cm: object,
        panel_rail_height_cm: object,
    ) -> dict:
        depth = _positive_decimal(depth_cm, label="Duvar derinliği").quantize(Decimal("0.001"))
        frame_width = _positive_decimal(frame_width_cm, label="Çerçeve genişliği").quantize(
            Decimal("0.001")
        )
        frame_depth = _positive_decimal(frame_depth_cm, label="Çerçeve derinliği").quantize(
            Decimal("0.001")
        )
        height = _positive_decimal(height_cm, label="Tavan yüksekliği").quantize(Decimal("0.001"))
        panel_rail = _positive_decimal(panel_rail_height_cm, label="Panel ray boşluğu").quantize(
            Decimal("0.001")
        )

        row = self._session.get(FairStandDimensionsModel, 1)
        if row is None:
            row = ensure_stand_dimensions(self._session)

        now = _now()
        row.height_cm = height
        row.depth_cm = depth
        row.frame_width_cm = frame_width
        row.frame_depth_cm = frame_depth
        row.panel_rail_height_cm = panel_rail
        row.updated_at = now
        self._session.flush()
        return stand_dimensions_payload(map_stand_dimensions(row))

    def update_runtime_settings(
        self,
        *,
        max_image_upload_mb: object,
        export_button_visible: bool,
        import_button_visible: bool,
    ) -> dict:
        max_mb = _positive_int(max_image_upload_mb, label="Görsel yükleme tavanı (MB)")

        row = self._session.get(FairStandSettingsModel, 1)
        if row is None:
            row = ensure_runtime_settings(self._session)

        now = _now()
        row.max_image_upload_mb = max_mb
        row.export_button_visible = bool(export_button_visible)
        row.import_button_visible = bool(import_button_visible)
        row.updated_at = now
        self._session.flush()
        return runtime_settings_payload(map_runtime_settings(row))
