from app.modules.fair_stand.infrastructure.item_scene_pose_seed import apply_item_scene_pose
from app.modules.fair_stand.infrastructure.seed_catalog import seed_fair_stand_catalog


def test_profile_rail_is_thickness_not_stand_ceiling():
    row = {
        "item_key": "profile_190",
        "item_type": "profile",
        "variant": None,
        "dimensions": {"depth_cm": 8, "height_cm": 8, "width_cm": 190},
        "scene_dimensions": {"width_cm": 200, "depth_cm": 8, "height_cm": 350},
        "default_z_cm": 0,
    }
    apply_item_scene_pose(row)
    assert float(row["scene_dimensions"]["height_cm"]) == 8
    assert float(row["default_z_cm"]) == 342


def test_short_up_height_and_drop_kot():
    row = {
        "item_key": "wall_200_short_up_2",
        "item_type": "flat-panel",
        "variant": "short-up-2",
        "scene_dimensions": {"depth_cm": 10, "height_cm": None},
        "default_z_cm": 0,
    }
    apply_item_scene_pose(row)
    assert float(row["scene_dimensions"]["height_cm"]) == 100
    assert float(row["default_z_cm"]) == 250


def test_bootstrap_scene_pose(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    body = client.get("/api/v1/fair-stand/catalog/bootstrap", headers=auth_headers).json()
    by_key = {item["itemKey"]: item for item in body["items"]}
    assert by_key["profile_190"]["sceneDimensions"]["heightCm"] == 8
    assert by_key["profile_190"]["defaultZCm"] == 342
    assert by_key["upright_99"]["sceneDimensions"]["heightCm"] == 99
    assert by_key["upright_99"]["sceneDimensions"]["widthCm"] == 8
    assert by_key["wall_200"]["sceneDimensions"]["heightCm"] == 350
    assert by_key["wall_200"]["defaultZCm"] == 0
    assert by_key["wall_200_short_up_2"]["sceneDimensions"]["heightCm"] == 100
    assert by_key["wall_200_short_up_2"]["defaultZCm"] == 250
