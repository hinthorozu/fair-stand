from datetime import UTC, datetime

from sqlalchemy import select

from app.modules.fair_stand.application.admin_snap_catalog import AdminSnapCatalogService
from app.modules.fair_stand.infrastructure.item_snap_seed import (
    ensure_snap_catalog,
    snap_binding_for_item_type,
)
from app.modules.fair_stand.infrastructure.models import (
    FairStandItemModel,
    FairStandItemTypeModel,
    FairStandRuleTypeModel,
)
from app.modules.fair_stand.infrastructure.seed_catalog import seed_fair_stand_catalog


def test_snap_seed_bindings_by_item_type():
    assert snap_binding_for_item_type("led-floodlight") == ("top-rail", None)
    assert snap_binding_for_item_type("shelf") == ("shelf-rail", None)
    assert snap_binding_for_item_type("profile") == (None, "top-rail")
    assert snap_binding_for_item_type("panel") == (None, "shelf-rail")
    assert snap_binding_for_item_type("flat-panel") == (None, None)
    assert snap_binding_for_item_type("unknown-type") == (None, None)


def test_rule_item_type_checkbox_does_not_write_item_provides(db_session):
    """Tip çentiği yalnız kural↔tip bağlar; item provides alanına yazmaz."""
    now = datetime.now(tz=UTC)
    db_session.add(
        FairStandRuleTypeModel(
            key="snap-sync-test",
            display_name="Snap sync",
            is_active=True,
            created_at=now,
            updated_at=now,
        )
    )
    for key, name in (("profile", "Profil"), ("panel", "Panel")):
        existing = db_session.scalar(
            select(FairStandItemTypeModel).where(FairStandItemTypeModel.key == key)
        )
        if existing is None:
            db_session.add(
                FairStandItemTypeModel(
                    key=key,
                    display_name=name,
                    is_active=True,
                    created_at=now,
                    updated_at=now,
                )
            )
    db_session.flush()
    for item_key, item_type in (
        ("sync_profile_a", "profile"),
        ("sync_profile_b", "profile"),
        ("sync_panel_a", "panel"),
    ):
        db_session.add(
            FairStandItemModel(
                item_key=item_key,
                name=item_key,
                item_type=item_type,
                catalog_visible=False,
                default_z_cm=0,
                is_render=False,
                accepts_color=False,
                accepts_image=False,
                accepts_lightbox=False,
                accepts_glass=False,
                accepts_mesh=False,
                is_active=True,
                created_at=now,
                updated_at=now,
            )
        )
    db_session.flush()

    rule_type_id = db_session.scalar(
        select(FairStandRuleTypeModel.id).where(FairStandRuleTypeModel.key == "snap-sync-test")
    )
    profile_id = db_session.scalar(
        select(FairStandItemTypeModel.id).where(FairStandItemTypeModel.key == "profile")
    )
    panel_id = db_session.scalar(
        select(FairStandItemTypeModel.id).where(FairStandItemTypeModel.key == "panel")
    )
    svc = AdminSnapCatalogService(db_session)
    created = svc.create_rule(
        rule_type_id=int(rule_type_id),
        display_name="Sync rail",
        key="sync-rail",
        face="top",
        edge="top",
        item_type_ids=[int(profile_id)],
    )
    rule_id = int(created["id"])
    assert created["itemTypeKeys"] == ["profile"]
    assert db_session.get(FairStandItemModel, "sync_profile_a").snap_provides_rule_id is None
    assert db_session.get(FairStandItemModel, "sync_profile_b").snap_provides_rule_id is None
    assert db_session.get(FairStandItemModel, "sync_panel_a").snap_provides_rule_id is None

    updated = svc.update_rule(rule_id, {"item_type_ids": [int(panel_id)]})
    assert updated["itemTypeKeys"] == ["panel"]
    assert db_session.get(FairStandItemModel, "sync_profile_a").snap_provides_rule_id is None
    assert db_session.get(FairStandItemModel, "sync_panel_a").snap_provides_rule_id is None


def test_bootstrap_snap_rule_fields(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    ensure_snap_catalog(db_session)
    db_session.flush()
    body = client.get("/api/v1/fair-stand/catalog/bootstrap", headers=auth_headers).json()
    assert any(row["key"] == "snap" for row in body["ruleTypes"])
    assert {row["key"] for row in body["rules"]} >= {"top-rail", "shelf-rail"}
    assert any(row["key"] == "profile" for row in body["itemTypes"])
    by_key = {item["itemKey"]: item for item in body["items"]}
    assert by_key["led_floodlight"]["snapRequires"] == "top-rail"
    assert by_key["led_floodlight"]["snapRequiresRuleId"]
    assert "snapFace" not in by_key["led_floodlight"]
    assert "snapEdge" not in by_key["led_floodlight"]
    assert "snapTargetItemType" not in by_key["led_floodlight"]
    assert by_key["profile_190"]["snapProvides"] == "top-rail"
    assert by_key["profile_190"]["snapProvidesRuleId"]
    assert "snapFace" not in by_key["profile_190"]
    assert by_key["shelf_100"]["snapRequires"] == "shelf-rail"
    assert "snapMountMode" not in by_key["shelf_100"]
    assert by_key["panel_197"]["snapProvides"] == "shelf-rail"
    assert "snapRequires" not in by_key["wall_200_350"]

    by_rule = {row["key"]: row for row in body["rules"]}
    assert by_rule["top-rail"]["face"] == "top"
    assert by_rule["top-rail"]["edge"] == "top"
    assert by_rule["shelf-rail"]["face"] == "front"
    assert by_rule["shelf-rail"]["edge"] == "top"
    assert "profile" in by_rule["top-rail"]["itemTypeKeys"]
    assert set(by_rule["shelf-rail"]["itemTypeKeys"]) >= {"panel", "separator-panel"}
