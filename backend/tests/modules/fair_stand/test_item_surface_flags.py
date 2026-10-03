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


def test_straight_panel_glass_twins_are_non_render_cam():
    expected = {
        "panel_cam_48_5": 48.5,
        "panel_cam_98": 98,
        "panel_cam_147_5": 147.5,
        "panel_cam_197": 197,
    }
    for item_key, width in expected.items():
        item = _item(item_key)
        assert item["item_type"] == "panel-glass"
        assert item["material"] == "cam"
        assert item["default_color"] is None
        assert item["catalog_visible"] is False
        assert item["is_render"] is False
        assert item["accepts_color"] is False
        assert item["accepts_image"] is False
        assert item["accepts_lightbox"] is False
        assert item["accepts_glass"] is False
        assert item["accepts_mesh"] is False
        assert item["dimensions"]["width_cm"] == width
        assert item["dimensions"]["depth_cm"] == 0.8
        assert item["dimensions"]["height_cm"] == 47
        assert item["components"] == []


def test_corner_panel_glass_twins_are_non_render_cam():
    expected = {
        "panel_corner_cam_42_5": 42.5,
        "panel_corner_cam_92": 92,
        "panel_corner_cam_142_5": 142.5,
        "panel_corner_cam_192": 192,
    }
    for item_key, width in expected.items():
        item = _item(item_key)
        assert item["item_type"] == "panel-glass"
        assert item["material"] == "cam"
        assert item["default_color"] is None
        assert item["catalog_visible"] is False
        assert item["is_render"] is False
        assert item["dimensions"]["width_cm"] == width
        assert item["dimensions"]["depth_cm"] == 0.8
        assert item["dimensions"]["height_cm"] == 47


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


def test_box_block_keeps_color_and_accepts_image_lightbox_mesh():
    item = _item("box_block")
    assert item["accepts_color"] is True
    assert item["accepts_image"] is True
    assert item["accepts_lightbox"] is True
    assert item["accepts_glass"] is False
    assert item["accepts_mesh"] is True
    assert item["default_opacity"] == 0.85


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
