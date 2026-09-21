from app.modules.fair_stand.infrastructure.item_snap_seed import snap_fields_for_item
from app.modules.fair_stand.infrastructure.seed_catalog import seed_fair_stand_catalog


def test_snap_anchor_values_and_floodlight_seed():
    assert snap_fields_for_item("led_floodlight", "led-floodlight") == ("profile", "top")
    assert snap_fields_for_item("shelf_100", "shelf") == ("panel", "top")
    assert snap_fields_for_item("wall_200", "flat-panel") == (None, None)


def test_bootstrap_snap_fields(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    body = client.get("/api/v1/fair-stand/catalog/bootstrap", headers=auth_headers).json()
    by_key = {item["itemKey"]: item for item in body["items"]}
    assert by_key["led_floodlight"]["snapTargetItemType"] == "profile"
    assert by_key["led_floodlight"]["snapAnchor"] == "top"
    assert by_key["shelf_100"]["snapAnchor"] == "top"
    assert "snapAnchor" not in by_key["wall_200"]
