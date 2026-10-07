"""Organization-scoped Item purchase and sale prices."""

from __future__ import annotations

from datetime import UTC, datetime
from decimal import Decimal
from uuid import uuid4

from sqlalchemy import select

from app.integrations.kyrox_core.ports import AuthorizationPort
from app.modules.fair_stand.api.dependencies import (
    PERMISSION_COST_ITEMS_CREATE,
    PERMISSION_COST_ITEMS_DELETE,
    PERMISSION_COST_ITEMS_READ,
    PERMISSION_COST_ITEMS_UPDATE,
    get_authorization_adapter,
)
from app.modules.fair_stand.infrastructure.models import (
    FairStandItemModel,
    FairStandItemTypeModel,
    FairStandUnitModel,
)

BASE = "/api/v1/fair-stand/cost-items"


class SelectiveAuthorization(AuthorizationPort):
    def __init__(self, allowed: set[str]) -> None:
        self.allowed = allowed

    def check_permission(self, **kwargs) -> bool:
        return kwargs.get("permission_code") in self.allowed


def _allow(client, codes: set[str]) -> None:
    client.app.dependency_overrides[get_authorization_adapter] = lambda: SelectiveAuthorization(codes)


def _item(db_session, *, item_key: str, active: bool = True, cost: bool = True) -> None:
    now = datetime.now(tz=UTC)
    if db_session.scalar(select(FairStandItemTypeModel).where(FairStandItemTypeModel.key == "panel")) is None:
        db_session.add(
            FairStandItemTypeModel(
                key="panel",
                display_name="Panel",
                is_active=True,
                created_at=now,
                updated_at=now,
            )
        )
        db_session.flush()
    db_session.add(
        FairStandItemModel(
            item_key=item_key,
            name=f"Name {item_key}",
            item_type="panel",
            catalog_visible=False,
            default_opacity=Decimal("1"),
            default_z_cm=Decimal("0"),
            is_render=False,
            accepts_color=False,
            accepts_image=False,
            accepts_lightbox=False,
            accepts_glass=False,
            accepts_mesh=False,
            is_cost_enabled=cost,
            is_active=active,
            created_at=now,
            updated_at=now,
        )
    )
    db_session.flush()


def test_create_list_update_delete_and_cross_organization(client, db_session, auth_headers):
    _item(db_session, item_key="priced_panel")

    missing_purchase = client.post(
        BASE,
        headers=auth_headers,
        json={"itemKey": "priced_panel"},
    )
    assert missing_purchase.status_code == 422

    zero = client.post(
        BASE,
        headers=auth_headers,
        json={"itemKey": "priced_panel", "purchasePrice": "0"},
    )
    assert zero.status_code == 201, zero.text
    body = zero.json()
    assert body["costItemType"] == "ITEM"
    assert body["itemKey"] == "priced_panel"
    assert body["name"] is None
    assert body["unit"] is None
    assert body["purchasePrice"] == "0.00"
    assert body["salePrice"] == "0.00"
    assert body["organizationId"] == auth_headers["X-Organization-Id"]
    price_id = body["id"]

    listed = client.get(BASE, headers=auth_headers)
    assert listed.status_code == 200
    assert [row["id"] for row in listed.json()["prices"]] == [price_id]

    updated = client.patch(
        f"{BASE}/{price_id}",
        headers=auth_headers,
        json={"purchasePrice": "12.50", "salePrice": "20"},
    )
    assert updated.status_code == 200, updated.text
    assert updated.json()["purchasePrice"] == "12.50"
    assert updated.json()["salePrice"] == "20.00"

    foreign_headers = {**auth_headers, "X-Organization-Id": str(uuid4())}
    assert client.patch(
        f"{BASE}/{price_id}",
        headers=foreign_headers,
        json={"purchasePrice": "1"},
    ).status_code == 404
    assert client.delete(f"{BASE}/{price_id}", headers=foreign_headers).status_code == 404
    assert client.get(BASE, headers=foreign_headers).json()["prices"] == []
    assert client.get(BASE, headers=auth_headers).json()["prices"][0]["purchasePrice"] == "12.50"

    deleted = client.delete(f"{BASE}/{price_id}", headers=auth_headers)
    assert deleted.status_code == 204
    assert client.get(BASE, headers=auth_headers).json()["prices"] == []


def test_organization_id_in_body_is_rejected(client, db_session, auth_headers):
    _item(db_session, item_key="priced_panel")
    response = client.post(
        BASE,
        headers=auth_headers,
        json={
            "itemKey": "priced_panel",
            "purchasePrice": "1",
            "organizationId": str(uuid4()),
        },
    )
    assert response.status_code == 422
    assert client.get(BASE, headers=auth_headers).json()["prices"] == []


def test_item_must_be_active_and_cost_enabled(client, db_session, auth_headers):
    _item(db_session, item_key="plain_item", cost=False)
    _item(db_session, item_key="inactive_item", active=False)
    plain = client.post(
        BASE,
        headers=auth_headers,
        json={"itemKey": "plain_item", "purchasePrice": "1"},
    )
    inactive = client.post(
        BASE,
        headers=auth_headers,
        json={"itemKey": "inactive_item", "purchasePrice": "1"},
    )
    assert plain.status_code == 422
    assert inactive.status_code == 422


def test_same_item_cannot_be_priced_twice(client, db_session, auth_headers):
    _item(db_session, item_key="priced_panel")
    payload = {"itemKey": "priced_panel", "purchasePrice": "3", "salePrice": "0"}
    first = client.post(BASE, headers=auth_headers, json=payload)
    second = client.post(BASE, headers=auth_headers, json=payload)
    assert first.status_code == 201, first.text
    assert first.json()["salePrice"] == "0.00"
    assert second.status_code == 409


def test_price_bounds(client, db_session, auth_headers):
    _item(db_session, item_key="priced_panel")
    negative_purchase = client.post(
        BASE,
        headers=auth_headers,
        json={"itemKey": "priced_panel", "purchasePrice": "-1"},
    )
    negative_sale = client.post(
        BASE,
        headers=auth_headers,
        json={"itemKey": "priced_panel", "purchasePrice": "1", "salePrice": "-0.01"},
    )
    assert negative_purchase.status_code == 422
    assert negative_sale.status_code == 422
    created = client.post(
        BASE,
        headers=auth_headers,
        json={"itemKey": "priced_panel", "purchasePrice": "0", "salePrice": "0"},
    )
    assert created.status_code == 201, created.text
    assert created.json()["purchasePrice"] == "0.00"
    assert created.json()["salePrice"] == "0.00"


def test_permissions_split_read_from_mutations(client, db_session, auth_headers):
    _item(db_session, item_key="priced_panel")
    _allow(client, {
        PERMISSION_COST_ITEMS_READ,
        PERMISSION_COST_ITEMS_CREATE,
        PERMISSION_COST_ITEMS_UPDATE,
        PERMISSION_COST_ITEMS_DELETE,
    })
    created = client.post(
        BASE,
        headers=auth_headers,
        json={"itemKey": "priced_panel", "purchasePrice": "4"},
    )
    assert created.status_code == 201, created.text
    price_id = created.json()["id"]

    _allow(client, set())
    assert client.get(BASE, headers=auth_headers).status_code == 403
    assert client.post(
        BASE,
        headers=auth_headers,
        json={"itemKey": "priced_panel", "purchasePrice": "1"},
    ).status_code == 403

    _allow(client, {PERMISSION_COST_ITEMS_READ})
    assert client.get(BASE, headers=auth_headers).status_code == 200
    assert client.post(
        BASE,
        headers=auth_headers,
        json={"itemKey": "priced_panel", "purchasePrice": "1"},
    ).status_code == 403
    assert client.patch(
        f"{BASE}/{price_id}",
        headers=auth_headers,
        json={"purchasePrice": "9"},
    ).status_code == 403
    assert client.delete(f"{BASE}/{price_id}", headers=auth_headers).status_code == 403

    _item(db_session, item_key="second_panel")
    _allow(client, {PERMISSION_COST_ITEMS_CREATE})
    created_second = client.post(
        BASE,
        headers=auth_headers,
        json={"itemKey": "second_panel", "purchasePrice": "2"},
    )
    assert created_second.status_code == 201, created_second.text
    assert client.patch(
        f"{BASE}/{price_id}",
        headers=auth_headers,
        json={"purchasePrice": "9"},
    ).status_code == 403
    assert client.delete(f"{BASE}/{price_id}", headers=auth_headers).status_code == 403

    _allow(client, {PERMISSION_COST_ITEMS_UPDATE})
    updated = client.patch(
        f"{BASE}/{price_id}",
        headers=auth_headers,
        json={"purchasePrice": "9"},
    )
    assert updated.status_code == 200, updated.text
    assert updated.json()["purchasePrice"] == "9.00"
    assert client.delete(f"{BASE}/{price_id}", headers=auth_headers).status_code == 403
    assert client.post(
        BASE,
        headers=auth_headers,
        json={"itemKey": "priced_panel", "purchasePrice": "1"},
    ).status_code == 403

    _allow(client, {PERMISSION_COST_ITEMS_DELETE})
    assert client.get(BASE, headers=auth_headers).status_code == 403
    assert client.delete(f"{BASE}/{price_id}", headers=auth_headers).status_code == 204


def _unit(db_session, *, unit_key: str, active: bool = True) -> None:
    now = datetime.now(tz=UTC)
    db_session.add(
        FairStandUnitModel(
            unit_key=unit_key,
            name=f"Name {unit_key}",
            symbol=unit_key,
            is_active=active,
            created_at=now,
            updated_at=now,
        )
    )
    db_session.flush()


def test_manual_create_list_update_delete_and_cross_organization(client, db_session, auth_headers):
    _unit(db_session, unit_key="adet")
    before_units = db_session.query(FairStandUnitModel).count()

    missing_name = client.post(
        BASE,
        headers=auth_headers,
        json={"costItemType": "MANUAL", "unit": "adet", "purchasePrice": "10"},
    )
    missing_unit = client.post(
        BASE,
        headers=auth_headers,
        json={"costItemType": "MANUAL", "name": "Nakliye", "purchasePrice": "10"},
    )
    blank_name = client.post(
        BASE,
        headers=auth_headers,
        json={"costItemType": "MANUAL", "name": "  ", "unit": "adet", "purchasePrice": "10"},
    )
    assert missing_name.status_code == 422
    assert missing_unit.status_code == 422
    assert blank_name.status_code == 422

    created = client.post(
        BASE,
        headers=auth_headers,
        json={"costItemType": "MANUAL", "name": "Nakliye", "unit": "adet", "purchasePrice": "15.5"},
    )
    assert created.status_code == 201, created.text
    body = created.json()
    assert body["costItemType"] == "MANUAL"
    assert body["itemKey"] is None
    assert body["name"] == "Nakliye"
    assert body["unit"] == "adet"
    assert body["salePrice"] == "0.00"
    assert body["organizationId"] == auth_headers["X-Organization-Id"]
    price_id = body["id"]
    assert db_session.query(FairStandUnitModel).count() == before_units

    second = client.post(
        BASE,
        headers=auth_headers,
        json={"costItemType": "MANUAL", "name": "Forklift", "unit": "adet", "purchasePrice": "4"},
    )
    assert second.status_code == 201, second.text
    second_id = second.json()["id"]

    listed = client.get(BASE, headers=auth_headers)
    assert listed.status_code == 200
    assert {row["id"] for row in listed.json()["prices"]} == {price_id, second_id}

    updated = client.patch(
        f"{BASE}/{price_id}",
        headers=auth_headers,
        json={"name": "Konaklama", "unit": "adet", "purchasePrice": "20", "salePrice": "3"},
    )
    assert updated.status_code == 200, updated.text
    assert updated.json()["name"] == "Konaklama"
    assert updated.json()["purchasePrice"] == "20.00"
    assert updated.json()["salePrice"] == "3.00"

    foreign_headers = {**auth_headers, "X-Organization-Id": str(uuid4())}
    assert client.get(BASE, headers=foreign_headers).json()["prices"] == []
    assert client.patch(
        f"{BASE}/{price_id}",
        headers=foreign_headers,
        json={"purchasePrice": "1"},
    ).status_code == 404
    assert client.delete(f"{BASE}/{price_id}", headers=foreign_headers).status_code == 404

    override = client.post(
        BASE,
        headers=auth_headers,
        json={
            "costItemType": "MANUAL",
            "name": "Forklift",
            "unit": "adet",
            "purchasePrice": "1",
            "organizationId": str(uuid4()),
        },
    )
    assert override.status_code == 422

    assert client.delete(f"{BASE}/{price_id}", headers=auth_headers).status_code == 204
    assert client.delete(f"{BASE}/{second_id}", headers=auth_headers).status_code == 204
    assert client.get(BASE, headers=auth_headers).json()["prices"] == []


def test_manual_and_item_fields_do_not_cross(client, db_session, auth_headers):
    _item(db_session, item_key="priced_panel")
    _unit(db_session, unit_key="adet")

    item_with_unit = client.post(
        BASE,
        headers=auth_headers,
        json={"costItemType": "ITEM", "itemKey": "priced_panel", "unit": "adet", "purchasePrice": "1"},
    )
    item_with_name = client.post(
        BASE,
        headers=auth_headers,
        json={"itemKey": "priced_panel", "name": "İşçilik", "purchasePrice": "1"},
    )
    manual_with_item = client.post(
        BASE,
        headers=auth_headers,
        json={
            "costItemType": "MANUAL",
            "itemKey": "priced_panel",
            "name": "İşçilik",
            "unit": "adet",
            "purchasePrice": "1",
        },
    )
    unknown_unit = client.post(
        BASE,
        headers=auth_headers,
        json={"costItemType": "MANUAL", "name": "İşçilik", "unit": "missing", "purchasePrice": "1"},
    )
    negative = client.post(
        BASE,
        headers=auth_headers,
        json={"costItemType": "MANUAL", "name": "İşçilik", "unit": "adet", "purchasePrice": "-1"},
    )
    negative_sale = client.post(
        BASE,
        headers=auth_headers,
        json={
            "costItemType": "MANUAL",
            "name": "İşçilik",
            "unit": "adet",
            "purchasePrice": "1",
            "salePrice": "-2",
        },
    )
    assert item_with_unit.status_code == 422
    assert item_with_name.status_code == 422
    assert manual_with_item.status_code == 422
    assert unknown_unit.status_code == 422
    assert negative.status_code == 422
    assert negative_sale.status_code == 422
    assert client.get(BASE, headers=auth_headers).json()["prices"] == []

    _unit(db_session, unit_key="saat", active=False)
    inactive_unit = client.post(
        BASE,
        headers=auth_headers,
        json={"costItemType": "MANUAL", "name": "Montaj", "unit": "saat", "purchasePrice": "8"},
    )
    assert inactive_unit.status_code == 201, inactive_unit.text
    assert inactive_unit.json()["unit"] == "saat"
