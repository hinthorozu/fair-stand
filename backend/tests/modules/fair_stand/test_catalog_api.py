from app.modules.fair_stand.infrastructure.seed_catalog import seed_fair_stand_catalog


def test_bootstrap_requires_auth(client):
    response = client.get("/api/v1/fair-stand/catalog/bootstrap")
    assert response.status_code in {401, 422}


def test_bootstrap_returns_canonical_aggregates(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()

    response = client.get("/api/v1/fair-stand/catalog/bootstrap", headers=auth_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["revision"]
    assert len(body["categories"]) == 6
    assert len(body["items"]) == 96
    visible = [item for item in body["items"] if item["catalogVisible"] is True]
    hidden = [item for item in body["items"] if item["catalogVisible"] is not True]
    assert len(visible) == 58
    assert len(hidden) == 38
    shelf = next(item for item in body["items"] if item["itemKey"] == "shelf_100")
    assert shelf["categoryId"] == 3
    assert "catalogCategory" not in shelf
    assert all("catalogKey" not in category for category in body["categories"])
    assert all(isinstance(category["id"], int) for category in body["categories"])
    assert shelf["previewId"] == 20
    assert "catalogPreview" not in shelf
    chair = next(item for item in body["items"] if item["itemKey"] == "chair_eames")
    assert chair["modelFile"] == "eames_chair.glb"
    plant = next(item for item in body["items"] if item["itemKey"] == "EXTRA_INDOOR_PLANT_1")
    assert plant["modelFile"] == "indoor_plants.glb"
    sofa = next(item for item in body["items"] if item["itemKey"] == "furniture_sofa_single_classic")
    assert sofa["modelFile"] == "bej_koltuk_1_ciftli_2_tekli.glb"
    tv = next(item for item in body["items"] if item["type"] == "tv")
    door = next(item for item in body["items"] if item["itemKey"] == "door_100")
    assert door["composition"]["mode"] == "recipe"
    assert len(door["composition"]["items"]) == 6
    assert "options" not in door["composition"]
    kit = next(item for item in body["items"] if item["itemKey"] == "furniture_sofa_set_classic")
    assert "mode" not in kit["composition"]
    assert len(kit["composition"]["items"]) == 3
    vw = next(item for item in body["items"] if item["itemKey"] == "VIDEO_WALL_2X2")
    assert vw["videoWall"]["panelItemKey"] == "VIDEO_WALL_PANEL"
    showcase = next(item for item in body["items"] if item["itemKey"] == "wall_showcase_100_2")
    assert showcase["bodyItems"]["glassShelfItemKey"] == "glass_shelf"
    wall_200 = next(item for item in body["items"] if item["itemKey"] == "wall_200")
    assert wall_200["rotationStepDeg"] == 90
    assert wall_200["defaultRotationDeg"] == 0
    assert wall_200["sideInsertRotation"] == "inherit"
    assert wall_200["isRender"] is True
    assert wall_200["acceptsColor"] is True
    assert wall_200["acceptsImage"] is True
    assert wall_200["acceptsGlass"] is True
    assert wall_200["acceptsLightbox"] is True
    assert wall_200["acceptsMesh"] is True
    assert wall_200["defaultZCm"] == 0
    banko = next(item for item in body["items"] if item["itemKey"] == "desk_banko_150")
    assert banko["rotationStepDeg"] == 45
    stool = next(item for item in body["items"] if item["itemKey"] == "furniture_bar_stool_classic")
    assert stool["defaultRotationDeg"] == 270
    assert stool["sideInsertRotation"] == "default"
    l_banko = next(item for item in body["items"] if item["itemKey"] == "desk_banko_100_L")
    assert l_banko["defaultRotationDeg"] == 270
    assert l_banko["rotationStepDeg"] == 90
    assert "innerCorner" not in wall_200.get("composition", {})
    assert "nominalModuleWidthCm" not in wall_200
    corner = next(item for item in body["items"] if item["itemKey"] == "panel_corner_192")
    assert corner["panelRole"] == "inner-corner"
    assert "nominalModuleWidthCm" not in corner
    assert all("nominalModuleWidthCm" not in item for item in body["items"])
    assert all("innerCorner" not in item.get("composition", {}) for item in body["items"])
    assert "FairStandItemModel" not in body
    assert "SQLAlchemy" not in body
    assert len(body["previewKinds"]) == 28
    assert body["standDimensions"] == {
        "height": 3.5,
        "depth": 0.1,
        "stripCount": 7,
        "stripHeight": 0.5,
        "frameWidth": 0.055,
        "frameDepth": 0.1,
    }
    shelf_preview = next(kind for kind in body["previewKinds"] if kind["id"] == 20)
    assert "previewKey" not in shelf_preview
    assert all("previewKey" not in kind for kind in body["previewKinds"])
    assert all(isinstance(kind["id"], int) for kind in body["previewKinds"])
    assert "module-drag-shelf" in shelf_preview["markup"]
    assert shelf_preview["cssCode"]


def test_hidden_item_is_not_catalog_visible(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    response = client.get("/api/v1/fair-stand/catalog/bootstrap", headers=auth_headers)
    panel = next(item for item in response.json()["items"] if item["itemKey"] == "panel_48_5")
    assert panel["catalogVisible"] is False
    assert panel.get("previewId") is None
    assert "rotationStepDeg" not in panel
    assert "defaultRotationDeg" not in panel
    assert "sideInsertRotation" not in panel
    assert panel["isRender"] is False
    assert panel["acceptsColor"] is False
    assert panel["acceptsImage"] is False
    assert panel["acceptsGlass"] is False
    assert panel["acceptsLightbox"] is False
    assert panel["acceptsMesh"] is False
    assert "catalogPreview" not in panel


def test_unknown_item_is_404(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    response = client.get("/api/v1/fair-stand/items/not-a-real-item", headers=auth_headers)
    assert response.status_code == 404


def test_exact_item_lookup(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    response = client.get("/api/v1/fair-stand/items/shelf_100", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["itemKey"] == "shelf_100"
    assert response.json()["type"] == "shelf"


def test_corner_panel_item_lookup(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    response = client.get("/api/v1/fair-stand/items/panel_corner_192", headers=auth_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["itemKey"] == "panel_corner_192"
    assert body["panelRole"] == "inner-corner"
    assert "nominalModuleWidthCm" not in body
    assert "innerCorner" not in body.get("composition", {})
