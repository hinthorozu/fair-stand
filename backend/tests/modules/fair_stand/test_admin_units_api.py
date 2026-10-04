from app.integrations.kyrox_core.ports import AuthorizationPort
from app.modules.fair_stand.api.dependencies import (
    PERMISSION_CATALOG_ARCHIVE,
    PERMISSION_CATALOG_CREATE,
    PERMISSION_CATALOG_READ,
    PERMISSION_CATALOG_UPDATE,
    PERMISSION_PROJECTS_READ,
    get_authorization_adapter,
)
from pathlib import Path

from app.modules.fair_stand.infrastructure.item_snap_seed import ensure_item_types
from app.modules.fair_stand.infrastructure.models import FairStandItemModel, FairStandUnitModel
from datetime import UTC, datetime
from uuid import UUID

CATALOG = {
    PERMISSION_CATALOG_READ,
    PERMISSION_CATALOG_CREATE,
    PERMISSION_CATALOG_UPDATE,
    PERMISSION_CATALOG_ARCHIVE,
}
PAYLOAD = {"name": "Metrekare", "symbol": "m²"}


def test_unit_service_does_not_write_item_rows():
    source = Path(__file__).resolve().parents[3].joinpath(
        "app/modules/fair_stand/application/admin_units.py"
    ).read_text(encoding="utf-8")
    assert "FairStandItemModel" not in source
    assert "fair_stand_items" not in source


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


def _deny(client, codes: set[str]) -> None:
    client.app.dependency_overrides[get_authorization_adapter] = lambda: SelectiveAuthorization(denied=codes)


def _allow_only(client, codes: set[str]) -> None:
    client.app.dependency_overrides[get_authorization_adapter] = lambda: SelectiveAuthorization(allowed=codes)


def test_super_admin_lists_creates_and_persists_unit(client, auth_headers, db_session):
    listed = client.get("/api/v1/fair-stand/admin/units", headers=auth_headers)
    assert listed.status_code == 200
    assert listed.json() == []

    created = client.post("/api/v1/fair-stand/admin/units", headers=auth_headers, json=PAYLOAD)
    assert created.status_code == 201
    body = created.json()
    assert body["unitKey"] == "metrekare"
    assert body["name"] == "Metrekare"
    assert body["symbol"] == "m²"
    assert body["isActive"] is True

    row = db_session.get(FairStandUnitModel, body["id"])
    assert row is not None
    assert row.unit_key == "metrekare"
    assert row.name == "Metrekare"
    assert row.symbol == "m²"
    assert row.is_active is True

    again = client.get("/api/v1/fair-stand/admin/units", headers=auth_headers)
    assert again.status_code == 200
    assert any(item["id"] == body["id"] for item in again.json())


def test_duplicate_and_blank_fields_are_rejected(client, auth_headers):
    assert client.post("/api/v1/fair-stand/admin/units", headers=auth_headers, json=PAYLOAD).status_code == 201
    duplicate = client.post("/api/v1/fair-stand/admin/units", headers=auth_headers, json=PAYLOAD)
    assert duplicate.status_code == 409

    for field in ("name", "symbol"):
        blank = {**PAYLOAD, field: "   "}
        rejected = client.post("/api/v1/fair-stand/admin/units", headers=auth_headers, json=blank)
        assert rejected.status_code == 400, field

    unusable = client.post(
        "/api/v1/fair-stand/admin/units",
        headers=auth_headers,
        json={"name": "!!!", "symbol": "x"},
    )
    assert unusable.status_code == 400
    supplied = client.post(
        "/api/v1/fair-stand/admin/units",
        headers=auth_headers,
        json={**PAYLOAD, "unitKey": "ozel"},
    )
    assert supplied.status_code == 422


def test_update_archive_restore_keeps_inactive_row_and_has_no_delete(client, auth_headers):
    created = client.post("/api/v1/fair-stand/admin/units", headers=auth_headers, json=PAYLOAD)
    unit_id = created.json()["id"]

    updated = client.patch(
        f"/api/v1/fair-stand/admin/units/{unit_id}",
        headers=auth_headers,
        json={"name": "Alan", "symbol": "m2"},
    )
    assert updated.status_code == 200
    assert updated.json()["unitKey"] == "alan"
    assert updated.json()["name"] == "Alan"
    assert updated.json()["symbol"] == "m2"

    archived = client.post(f"/api/v1/fair-stand/admin/units/{unit_id}/archive", headers=auth_headers)
    assert archived.status_code == 200
    assert archived.json()["isActive"] is False

    listed = client.get("/api/v1/fair-stand/admin/units", headers=auth_headers)
    assert any(item["id"] == unit_id and item["isActive"] is False for item in listed.json())

    restored = client.post(f"/api/v1/fair-stand/admin/units/{unit_id}/restore", headers=auth_headers)
    assert restored.status_code == 200
    assert restored.json()["isActive"] is True

    deleted = client.delete(f"/api/v1/fair-stand/admin/units/{unit_id}", headers=auth_headers)
    assert deleted.status_code == 405
    still = client.get("/api/v1/fair-stand/admin/units", headers=auth_headers)
    assert any(item["id"] == unit_id for item in still.json())


def test_renaming_unit_rewrites_item_unit_that_stores_the_old_code(client, auth_headers, db_session):
    created = client.post("/api/v1/fair-stand/admin/units", headers=auth_headers, json=PAYLOAD)
    assert created.status_code == 201
    unit_id = created.json()["id"]
    now = datetime.now(tz=UTC)
    ensure_item_types(db_session, ["shelf"])
    linked = FairStandItemModel(
        item_key="linked_unit_item",
        name="Bağlı",
        item_type="shelf",
        unit="metrekare",
        catalog_visible=False,
        is_active=True,
        created_at=now,
        updated_at=now,
    )
    other = FairStandItemModel(
        item_key="other_unit_item",
        name="Diğer",
        item_type="shelf",
        unit="adet",
        catalog_visible=False,
        is_active=True,
        created_at=now,
        updated_at=now,
    )
    db_session.add(
        FairStandUnitModel(
            unit_key="adet",
            name="Adet",
            symbol="adet",
            is_active=True,
            created_at=now,
            updated_at=now,
        )
    )
    db_session.flush()
    db_session.add_all([linked, other])
    db_session.flush()

    updated = client.patch(
        f"/api/v1/fair-stand/admin/units/{unit_id}",
        headers=auth_headers,
        json={"name": "Alan"},
    )
    assert updated.status_code == 200
    assert updated.json()["unitKey"] == "alan"
    db_session.expire_all()
    assert db_session.get(FairStandItemModel, "linked_unit_item").unit == "alan"
    assert db_session.get(FairStandItemModel, "other_unit_item").unit == "adet"


def test_duplicate_unit_key_rename_is_rejected_without_changing_items(client, auth_headers, db_session):
    source = client.post("/api/v1/fair-stand/admin/units", headers=auth_headers, json=PAYLOAD)
    target = client.post(
        "/api/v1/fair-stand/admin/units",
        headers=auth_headers,
        json={"name": "Adet", "symbol": "adet"},
    )
    assert source.status_code == 201
    assert target.status_code == 201
    now = datetime.now(tz=UTC)
    ensure_item_types(db_session, ["shelf"])
    db_session.add(
        FairStandItemModel(
            item_key="cascade_guard_item",
            name="Korunan",
            item_type="shelf",
            unit="metrekare",
            catalog_visible=False,
            is_active=True,
            created_at=now,
            updated_at=now,
        )
    )
    db_session.flush()

    updated = client.patch(
        f"/api/v1/fair-stand/admin/units/{source.json()['id']}",
        headers=auth_headers,
        json={"name": "Adet"},
    )
    assert updated.status_code == 409
    assert "zaten kayıtlı" in updated.json()["detail"]


def test_archive_does_not_change_unit_key_or_item_unit(client, auth_headers, db_session):
    created = client.post("/api/v1/fair-stand/admin/units", headers=auth_headers, json=PAYLOAD)
    assert created.status_code == 201
    unit_id = created.json()["id"]
    now = datetime.now(tz=UTC)
    ensure_item_types(db_session, ["shelf"])
    db_session.add(
        FairStandItemModel(
            item_key="archived_unit_item",
            name="Arşiv",
            item_type="shelf",
            unit="metrekare",
            catalog_visible=False,
            is_active=True,
            created_at=now,
            updated_at=now,
        )
    )
    db_session.flush()

    archived = client.post(f"/api/v1/fair-stand/admin/units/{unit_id}/archive", headers=auth_headers)
    assert archived.status_code == 200
    assert archived.json()["unitKey"] == "metrekare"
    assert archived.json()["isActive"] is False
    db_session.expire_all()
    assert db_session.get(FairStandItemModel, "archived_unit_item").unit == "metrekare"


def test_organization_permission_and_missing_auth_cannot_manage_units(client, auth_headers):
    _allow_only(client, {PERMISSION_PROJECTS_READ})
    assert client.get("/api/v1/fair-stand/admin/units", headers=auth_headers).status_code == 403
    assert client.post("/api/v1/fair-stand/admin/units", headers=auth_headers, json=PAYLOAD).status_code == 403

    _deny(client, CATALOG)
    assert client.post("/api/v1/fair-stand/admin/units", headers=auth_headers, json=PAYLOAD).status_code == 403
    assert client.patch("/api/v1/fair-stand/admin/units/1", headers=auth_headers, json={"name": "X"}).status_code == 403
    assert client.post("/api/v1/fair-stand/admin/units/1/archive", headers=auth_headers).status_code == 403
    assert client.post("/api/v1/fair-stand/admin/units/1/restore", headers=auth_headers).status_code == 403

    missing = client.get(
        "/api/v1/fair-stand/admin/units",
        headers={"X-Organization-Id": auth_headers["X-Organization-Id"]},
    )
    assert missing.status_code == 401
