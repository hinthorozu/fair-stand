from sqlalchemy import inspect, select

from app.modules.fair_stand.infrastructure.models import FairStandDimensionsModel
from app.modules.fair_stand.infrastructure.seed_catalog import seed_fair_stand_catalog


def test_stand_dimensions_singleton_is_seeded(db_session):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    rows = list(db_session.scalars(select(FairStandDimensionsModel)))
    assert len(rows) == 1
    row = rows[0]
    assert row.id == 1
    assert float(row.height_m) == 3.5
    assert float(row.depth_m) == 0.1
    assert row.strip_count == 7
    assert float(row.strip_height_m) == 0.5
    assert float(row.frame_width_m) == 0.055
    assert float(row.frame_depth_m) == 0.1


def test_fair_stand_dimensions_table_exists(test_engine):
    names = inspect(test_engine).get_table_names()
    assert "fair_stand_dimensions" in names
