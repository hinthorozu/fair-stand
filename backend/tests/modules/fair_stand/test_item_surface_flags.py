from app.modules.fair_stand.infrastructure.item_surface_flags_seed import surface_flags_for_item
from app.modules.fair_stand.infrastructure.models import FairStandItemModel
from sqlalchemy.exc import IntegrityError
from datetime import UTC, datetime


def test_wall_200_is_render_with_panel_cover_flags():
    flags = surface_flags_for_item("wall_200", "flat-panel")
    assert flags["is_render"] is True
    assert flags["accepts_color"] is True
    assert flags["accepts_image"] is True
    assert flags["accepts_glass"] is True
    assert flags["accepts_lightbox"] is True
    assert flags["accepts_mesh"] is True


def test_door_leaf_renders_color_image_without_cover():
    flags = surface_flags_for_item("door_leaf_100", "door-leaf")
    assert flags["is_render"] is True
    assert flags["accepts_color"] is True
    assert flags["accepts_image"] is True
    assert flags["accepts_glass"] is False
    assert flags["accepts_lightbox"] is False
    flags = surface_flags_for_item("connector_start", "connector")
    assert flags == {
        "is_render": False,
        "accepts_color": False,
        "accepts_image": False,
        "accepts_lightbox": False,
        "accepts_glass": False,
        "accepts_mesh": False,
    }


def test_profile_renders_without_cover_flags():
    flags = surface_flags_for_item("profile_190", "profile")
    assert flags["is_render"] is True
    assert flags["accepts_color"] is False
    assert flags["accepts_glass"] is False


def test_banko_color_image_not_glass():
    flags = surface_flags_for_item("desk_banko_100", "counter")
    assert flags["is_render"] is True
    assert flags["accepts_color"] is True
    assert flags["accepts_image"] is True
    assert flags["accepts_glass"] is False


def test_virtual_item_cannot_accept_color(db_session):
    now = datetime.now(tz=UTC)
    db_session.add(
        FairStandItemModel(
            item_key="tmp_virtual",
            name="Tmp",
            item_type="connector",
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
