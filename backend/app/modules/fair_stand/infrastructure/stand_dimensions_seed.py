from __future__ import annotations

from datetime import UTC, datetime
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.fair_stand.infrastructure.models import FairStandDimensionsModel

STAND_DIMENSIONS_ID = 1
STAND_DIMENSIONS_HEIGHT_M = Decimal("3.5")
STAND_DIMENSIONS_DEPTH_M = Decimal("0.1")
STAND_DIMENSIONS_STRIP_COUNT = 7
STAND_DIMENSIONS_STRIP_HEIGHT_M = Decimal("0.5")
STAND_DIMENSIONS_FRAME_WIDTH_M = Decimal("0.055")
STAND_DIMENSIONS_FRAME_DEPTH_M = Decimal("0.1")


def ensure_stand_dimensions(session: Session) -> FairStandDimensionsModel:
    row = session.get(FairStandDimensionsModel, STAND_DIMENSIONS_ID)
    now = datetime.now(tz=UTC)
    if row is None:
        row = FairStandDimensionsModel(
            id=STAND_DIMENSIONS_ID,
            height_m=STAND_DIMENSIONS_HEIGHT_M,
            depth_m=STAND_DIMENSIONS_DEPTH_M,
            strip_count=STAND_DIMENSIONS_STRIP_COUNT,
            strip_height_m=STAND_DIMENSIONS_STRIP_HEIGHT_M,
            frame_width_m=STAND_DIMENSIONS_FRAME_WIDTH_M,
            frame_depth_m=STAND_DIMENSIONS_FRAME_DEPTH_M,
            created_at=now,
            updated_at=now,
        )
        session.add(row)
        session.flush()
    return row


def has_stand_dimensions(session: Session) -> bool:
    return session.scalar(select(FairStandDimensionsModel.id).limit(1)) is not None
