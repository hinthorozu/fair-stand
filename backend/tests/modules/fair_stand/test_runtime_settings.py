from sqlalchemy import inspect, select

from app.modules.fair_stand.infrastructure.models import FairStandSettingsModel
from app.modules.fair_stand.infrastructure.seed_catalog import seed_fair_stand_catalog


def test_runtime_settings_singleton_is_seeded(db_session):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    rows = list(db_session.scalars(select(FairStandSettingsModel)))
    assert len(rows) == 1
    row = rows[0]
    assert row.id == 1
    assert row.max_image_upload_mb == 5
    assert row.export_button_visible is True
    assert row.import_button_visible is True
    assert row.save_as_button_visible is True


def test_fair_stand_settings_table_exists(test_engine):
    names = inspect(test_engine).get_table_names()
    assert "fair_stand_settings" in names
