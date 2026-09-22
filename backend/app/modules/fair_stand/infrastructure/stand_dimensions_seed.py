from __future__ import annotations

from datetime import UTC, datetime
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.fair_stand.infrastructure.models import FairStandDimensionsModel

STAND_DIMENSIONS_ID = 1
STAND_DIMENSIONS_HEIGHT_CM = Decimal("350")
STAND_DIMENSIONS_DEPTH_CM = Decimal("10")
def ensure_stand_dimensions(session: Session) -> FairStandDimensionsModel:
    row = session.get(FairStandDimensionsModel, STAND_DIMENSIONS_ID)
    now = datetime.now(tz=UTC)
    if row is None:
        row = FairStandDimensionsModel(
            id=STAND_DIMENSIONS_ID,
            height_cm=STAND_DIMENSIONS_HEIGHT_CM,
            depth_cm=STAND_DIMENSIONS_DEPTH_CM,
            created_at=now,
            updated_at=now,
        )
        session.add(row)
        session.flush()
    return row


def has_stand_dimensions(session: Session) -> bool:
    return session.scalar(select(FairStandDimensionsModel.id).limit(1)) is not None
