from datetime import UTC, datetime

from sqlalchemy.exc import IntegrityError

from app.modules.fair_stand.infrastructure.catalog_seed_data import CATALOG_SEED
from app.modules.fair_stand.infrastructure.models import FairStandItemModel


def _item(item_key: str) -> dict:
    return next(row for row in CATALOG_SEED["items"] if row["item_key"] == item_key)


def test_wall_200_is_render_with_panel_cover_flags():
    item = _item("wall_200_350")
    assert item["is_render"] is True
    assert item["accepts_color"] is True
    assert item["accepts_image"] is True
    assert item["accepts_glass"] is True
    assert item["accepts_lightbox"] is True
    assert item["accepts_mesh"] is True


def test_panel_197_cover_flags_live_on_the_item_row():
    item = _item("panel_197")
    assert item["is_render"] is True
    assert item["accepts_color"] is True
    assert item["accepts_image"] is True
    assert item["accepts_glass"] is True
    assert item["accepts_lightbox"] is True
    assert item["accepts_mesh"] is True


def test_door_leaf_renders_color_image_without_cover():
    item = _item("door_leaf_100")
    assert item["is_render"] is True
    assert item["accepts_color"] is True
    assert item["accepts_image"] is True
    assert item["accepts_glass"] is False
    assert item["accepts_lightbox"] is False
    connector = _item("connector_start")
    assert connector["is_render"] is True
    assert connector["accepts_color"] is False
    assert connector["accepts_image"] is False
    assert connector["accepts_lightbox"] is False
    assert connector["accepts_glass"] is False
    assert connector["accepts_mesh"] is False


def test_profile_renders_without_cover_flags():
    item = _item("profile_190")
    assert item["is_render"] is True
    assert item["accepts_color"] is False
    assert item["accepts_glass"] is False


def test_banko_color_image_not_glass():
    item = _item("desk_banko_100")
    assert item["is_render"] is True
    assert item["accepts_color"] is True
    assert item["accepts_image"] is True
    assert item["accepts_glass"] is False


def test_virtual_item_cannot_accept_color(db_session):
    now = datetime.now(tz=UTC)
    db_session.add(
        FairStandItemModel(
            item_key="tmp_virtual",
            name="Tmp",
            item_type="floor",
            catalog_visible=False,
            is_render=False,
            accepts_color=True,
            is_active=True,
            created_at=now,
            updated_at=now,
        )
    )
    try:
        db_session.flush()
    except IntegrityError:
        db_session.rollback()
        return
    raise AssertionError("expected ck_fair_stand_items_render_surface")
