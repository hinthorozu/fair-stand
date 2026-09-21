from __future__ import annotations

from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.fair_stand.infrastructure.models import FairStandSettingsModel

STAND_SETTINGS_ID = 1
MAX_IMAGE_UPLOAD_MB = 5


def ensure_runtime_settings(session: Session) -> FairStandSettingsModel:
    row = session.get(FairStandSettingsModel, STAND_SETTINGS_ID)
    now = datetime.now(tz=UTC)
    if row is None:
        row = FairStandSettingsModel(
            id=STAND_SETTINGS_ID,
            max_image_upload_mb=MAX_IMAGE_UPLOAD_MB,
            created_at=now,
            updated_at=now,
        )
        session.add(row)
        session.flush()
    return row


def has_runtime_settings(session: Session) -> bool:
    return session.scalar(select(FairStandSettingsModel.id).limit(1)) is not None
