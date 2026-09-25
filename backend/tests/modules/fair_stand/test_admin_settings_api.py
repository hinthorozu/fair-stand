from uuid import UUID

from app.integrations.kyrox_core.ports import AuthorizationPort
from app.modules.fair_stand.api.dependencies import (
    PERMISSION_SETTINGS_READ,
    PERMISSION_SETTINGS_UPDATE,
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


def _deny(client, codes: set[str]):
    client.app.dependency_overrides[get_authorization_adapter] = lambda: SelectiveAuthorization(
        denied=codes
    )


def _allow(client, codes: set[str]):
    client.app.dependency_overrides[get_authorization_adapter] = lambda: SelectiveAuthorization(
        allowed=codes
    )


def test_admin_settings_get_requires_permission(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    _deny(client, {PERMISSION_SETTINGS_READ})
    response = client.get("/api/v1/fair-stand/admin/settings", headers=auth_headers)
    assert response.status_code == 403


def test_admin_settings_get_returns_singletons(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    _allow(client, {PERMISSION_SETTINGS_READ})
    response = client.get("/api/v1/fair-stand/admin/settings", headers=auth_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["standDimensions"] == {
        "heightCm": 350.0,
        "depthCm": 10.0,
        "frameWidthCm": 5.5,
        "frameDepthCm": 10.0,
        "panelRailHeightCm": 0.4,
    }
    assert body["settings"] == {
        "maxImageUploadMb": 5,
        "exportButtonVisible": True,
        "importButtonVisible": True,
        "saveAsButtonVisible": True,
    }


def test_admin_update_stand_dimensions(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    _allow(client, {PERMISSION_SETTINGS_UPDATE})
    response = client.put(
        "/api/v1/fair-stand/admin/stand-dimensions",
        headers=auth_headers,
        json={
            "height_cm": 400.0,
            "depth_cm": 12.0,
            "frame_width_cm": 6.0,
            "frame_depth_cm": 11.0,
            "panel_rail_height_cm": 0.5,
        },
    )
    assert response.status_code == 200
    assert response.json() == {
        "heightCm": 400.0,
        "depthCm": 12.0,
        "frameWidthCm": 6.0,
        "frameDepthCm": 11.0,
        "panelRailHeightCm": 0.5,
    }


def test_admin_update_stand_dimensions_allows_height_above_strip_grid(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    _allow(client, {PERMISSION_SETTINGS_UPDATE})
    response = client.put(
        "/api/v1/fair-stand/admin/stand-dimensions",
        headers=auth_headers,
        json={
            "height_cm": 950.0,
            "depth_cm": 10.0,
            "frame_width_cm": 5.5,
            "frame_depth_cm": 10.0,
            "panel_rail_height_cm": 0.4,
        },
    )
    assert response.status_code == 200
    assert response.json()["heightCm"] == 950.0


def test_admin_update_runtime_settings(client, db_session, auth_headers):
    seed_fair_stand_catalog(db_session)
    db_session.flush()
    _allow(client, {PERMISSION_SETTINGS_UPDATE})
    response = client.put(
        "/api/v1/fair-stand/admin/runtime-settings",
        headers=auth_headers,
        json={
            "max_image_upload_mb": 10,
            "export_button_visible": False,
            "import_button_visible": True,
            "save_as_button_visible": False,
        },
    )
    assert response.status_code == 200
    assert response.json() == {
        "maxImageUploadMb": 10,
        "exportButtonVisible": False,
        "importButtonVisible": True,
        "saveAsButtonVisible": False,
    }
