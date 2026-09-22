from uuid import UUID

from app.integrations.kyrox_core.ports import AuthorizationPort
from app.modules.fair_stand.api.dependencies import (
    PERMISSION_ITEMS_CREATE,
    PERMISSION_ITEMS_READ,
    PERMISSION_ITEMS_UPDATE,
    get_authorization_adapter,
)
from app.modules.fair_stand.infrastructure.seed_catalog import seed_fair_stand_catalog


class SelectiveAuthorization(AuthorizationPort):
    def __init__(self, *, allowed: set[str] | None = None, denied: set[str] | None = None) -> None:
        self._allowed = allowed
        self._denied = denied or set()

    def check_permission(
        self,
        *,
        organization_id: UUID,
        user_id: UUID,
        permission_code: str,
        access_token: str,
    ) -> bool:
        _ = (organization_id, user_id, access_token)
        if permission_code in self._denied:
            return False
        if self._allowed is None:
            return True
        return permission_code in self._allowed


def _allow(client, codes: set[str]):
    client.app.dependency_overrides[get_authorization_adapter] = lambda: SelectiveAuthorization(
        allowed=codes
    )


def test_admin_item_records_list_and_get(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    _allow(client, {PERMISSION_ITEMS_READ})
    listed = client.get("/api/v1/fair-stand/admin/item-records", headers=auth_headers)
    assert listed.status_code == 200
    body = listed.json()
    assert "items" in body
    assert body["pagination"]["page"] == 1
    assert body["pagination"]["pageSize"] == 25
    assert body["pagination"]["totalItems"] >= 90
    assert len(body["items"]) == 25
    assert body["sorting"]["field"] == "itemKey"
    detail = client.get("/api/v1/fair-stand/admin/item-records/wall_200", headers=auth_headers)
    assert detail.status_code == 200
    detail_body = detail.json()
    assert detail_body["itemKey"] == "wall_200"
    assert detail_body["dimensions"] is not None
    assert isinstance(detail_body["components"], list)
    assert isinstance(detail_body["assets"], list)
    if detail_body["components"]:
        component = detail_body["components"][0]
        assert "childItemKey" in component
        assert "childName" in component
        assert "childType" in component
        assert component["childName"]
        assert component["childType"]


def test_admin_item_records_list_search_filter_and_page(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    _allow(client, {PERMISSION_ITEMS_READ})
    response = client.get(
        "/api/v1/fair-stand/admin/item-records",
        headers=auth_headers,
        params={
            "page": 1,
            "pageSize": 10,
            "search": "wall_200",
            "status": "active",
            "catalog": "visible",
            "render": "yes",
            "type": "flat-panel",
            "sort_by": "name",
            "sort_order": "asc",
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["pagination"]["pageSize"] == 10
    assert body["pagination"]["totalItems"] >= 1
    assert any(item["itemKey"] == "wall_200" for item in body["items"])
    assert body["filters"]["status"] == "active"
    assert body["filters"]["catalog"] == "visible"
    assert body["filters"]["render"] == "yes"
    assert body["filters"]["type"] == "flat-panel"
    assert body["sorting"]["field"] == "name"
    assert "flat-panel" in body["filterOptions"]["types"]
    assert isinstance(body["filterOptions"].get("units"), list)
    assert isinstance(body["filterOptions"].get("materials"), list)


def test_admin_item_records_update_dimensions_and_components(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    _allow(client, {PERMISSION_ITEMS_UPDATE})
    response = client.put(
        "/api/v1/fair-stand/admin/item-records/shelf_100",
        headers=auth_headers,
        json={
            "name": "Shelf 100 Updated",
            "dimensions": {"width_cm": 100, "depth_cm": 30, "height_cm": 4},
            "components": [{"child_item_key": "shelf_leg", "quantity": 2}],
        },
    )
    assert response.status_code == 200
    body = response.json()
    assert body["name"] == "Shelf 100 Updated"
    assert body["dimensions"]["widthCm"] == 100
    assert body["components"][0]["childItemKey"] == "shelf_leg"
    assert body["components"][0]["childName"]
    assert body["components"][0]["childType"]


def test_admin_item_records_create_minimal(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    _allow(client, {PERMISSION_ITEMS_CREATE})
    response = client.post(
        "/api/v1/fair-stand/admin/item-records",
        headers=auth_headers,
        json={"item_key": "admin_test_sku", "name": "Admin Test", "item_type": "panel"},
    )
    assert response.status_code == 201
    assert response.json()["itemKey"] == "admin_test_sku"
