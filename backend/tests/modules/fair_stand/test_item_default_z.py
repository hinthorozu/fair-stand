from app.modules.fair_stand.infrastructure.item_default_z_seed import default_z_cm_for_row
from app.modules.fair_stand.infrastructure.seed_catalog import seed_fair_stand_catalog


def test_floodlight_default_z_copies_mount_height():
    assert float(default_z_cm_for_row({
        "item_key": "led_floodlight",
        "dimensions": {"mount_height_cm": 350},
    })) == 350
    assert float(default_z_cm_for_row({"item_key": "wall_200", "dimensions": {"width_cm": 200}})) == 0


def test_bootstrap_default_z_cm(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    body = client.get("/api/v1/fair-stand/catalog/bootstrap", headers=auth_headers).json()
    by_key = {item["itemKey"]: item for item in body["items"]}
    assert by_key["led_floodlight"]["defaultZCm"] == 350
    assert by_key["wall_200"]["defaultZCm"] == 0
    assert by_key["panel_197"]["defaultZCm"] == 0
    assert by_key["profile_190"]["defaultZCm"] == 342
    assert by_key["wall_200_short_up_2"]["defaultZCm"] == 250
    assert by_key["wall_200_short_up_1"]["defaultZCm"] == 300
