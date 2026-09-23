from app.modules.fair_stand.infrastructure.item_snap_seed import (
    ensure_snap_catalog,
    snap_binding_for_item_type,
)
from app.modules.fair_stand.infrastructure.seed_catalog import seed_fair_stand_catalog


def test_snap_seed_bindings_by_item_type():
    assert snap_binding_for_item_type("led-floodlight") == ("led-floodlight", "top-rail", None)
    assert snap_binding_for_item_type("shelf") == ("shelf", "shelf-rail", None)
    assert snap_binding_for_item_type("profile") == ("profile", None, "top-rail")
    assert snap_binding_for_item_type("panel") == ("panel", None, "shelf-rail")
    assert snap_binding_for_item_type("flat-panel") == ("flat-panel", None, None)
    assert snap_binding_for_item_type("unknown-type") == (None, None, None)


def test_bootstrap_snap_rule_fields(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    ensure_snap_catalog(db_session)
    db_session.flush()
    body = client.get("/api/v1/fair-stand/catalog/bootstrap", headers=auth_headers).json()
    assert any(row["code"] == "snap" for row in body["ruleTypes"])
    assert {row["code"] for row in body["rules"]} >= {"top-rail", "shelf-rail"}
    assert any(row["code"] == "profile" for row in body["families"])
    by_key = {item["itemKey"]: item for item in body["items"]}
    assert by_key["led_floodlight"]["snapRequires"] == "top-rail"
    assert by_key["led_floodlight"]["snapRequiresRuleId"]
    assert "snapTargetItemType" not in by_key["led_floodlight"]
    assert by_key["profile_190"]["snapProvides"] == "top-rail"
    assert by_key["profile_190"]["snapFace"] == "top"
    assert by_key["profile_190"]["snapProvidesRuleId"]
    assert by_key["shelf_100"]["snapRequires"] == "shelf-rail"
    assert by_key["shelf_100"]["snapMountMode"] == "panel-seam"
    assert by_key["panel_197"]["snapProvides"] == "shelf-rail"
    assert "snapRequires" not in by_key["wall_200"]
