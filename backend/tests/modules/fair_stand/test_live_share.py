from datetime import UTC, datetime, timedelta

import pytest
from starlette.websockets import WebSocketDisconnect

from app.core.config import Settings
from app.main import app
from app.modules.fair_stand.api.dependencies import get_authorization_adapter
from app.modules.fair_stand.application.live_share import (
    VIEWER_OCCUPIED_MESSAGE,
    build_ice_servers,
    get_live_share_registry,
)


class DenyAllAuthorization:
    def check_permission(self, **kwargs) -> bool:
        _ = kwargs
        return False


@pytest.fixture(autouse=True)
def clean_live_shares():
    get_live_share_registry().reset()
    yield
    get_live_share_registry().reset()


def _create(client, auth_headers):
    response = client.post("/api/v1/fair-stand/live-shares", headers=auth_headers)
    assert response.status_code == 200
    return response.json()


def _host_url(body):
    return f"/api/v1/fair-stand/live-shares/{body['token']}/ws?role=host&hostKey={body['hostKey']}"


def _viewer_url(token):
    return f"/api/v1/fair-stand/live-shares/{token}/ws?role=viewer"


def test_authenticated_host_creates_session_without_project_payload(client, auth_headers):
    body = _create(client, auth_headers)
    assert set(body) == {"token", "watchPath", "hostKey", "expiresAt"}
    assert body["watchPath"] == f"/stand/watch/{body['token']}"
    assert body["hostKey"] not in body["watchPath"]
    assert len(body["token"]) >= 42
    assert len(body["hostKey"]) >= 42
    for forbidden in ("project", "modules", "customer", "customerId", "organizationId", "bom", "designState", "payload"):
        assert forbidden not in body


def test_unauthenticated_create_is_rejected(client, organization_id):
    response = client.post(
        "/api/v1/fair-stand/live-shares",
        headers={"X-Organization-Id": str(organization_id)},
    )
    assert response.status_code == 401


def test_create_without_permission_is_rejected(client, auth_headers):
    app.dependency_overrides[get_authorization_adapter] = lambda: DenyAllAuthorization()
    response = client.post("/api/v1/fair-stand/live-shares", headers=auth_headers)
    assert response.status_code == 403


def test_tokens_are_unique(client, auth_headers):
    first = _create(client, auth_headers)
    second = _create(client, auth_headers)
    assert first["token"] != second["token"]
    assert first["hostKey"] != second["hostKey"]


def test_invalid_token_is_rejected(client):
    with client.websocket_connect(_viewer_url("missing-token")) as viewer:
        message = viewer.receive_json()
        assert message["type"] == "error"
        assert message["code"] == "invalid"


def test_expired_token_is_rejected(client, auth_headers):
    body = _create(client, auth_headers)
    session = get_live_share_registry().get(body["token"])
    session.expires_at = datetime.now(tz=UTC) - timedelta(seconds=5)
    with client.websocket_connect(_viewer_url(body["token"])) as viewer:
        message = viewer.receive_json()
        assert message["code"] == "expired"


def test_revoked_token_is_rejected(client, auth_headers):
    body = _create(client, auth_headers)
    stopped = client.post(
        f"/api/v1/fair-stand/live-shares/{body['token']}/stop",
        headers={"Content-Type": "application/json"},
        json={"hostKey": body["hostKey"]},
    )
    assert stopped.status_code == 204
    with client.websocket_connect(_viewer_url(body["token"])) as viewer:
        message = viewer.receive_json()
        assert message["code"] == "revoked"


def test_stop_rejects_wrong_host_key(client, auth_headers):
    body = _create(client, auth_headers)
    response = client.post(
        f"/api/v1/fair-stand/live-shares/{body['token']}/stop",
        json={"hostKey": "wrong-host-key"},
    )
    assert response.status_code == 403
    assert get_live_share_registry().get(body["token"]).revoked is False


def test_host_and_viewer_attach_and_second_viewer_is_rejected(client, auth_headers):
    body = _create(client, auth_headers)
    with client.websocket_connect(_host_url(body)) as host:
        assert host.receive_json()["role"] == "host"
        with client.websocket_connect(_viewer_url(body["token"])) as viewer:
            assert viewer.receive_json()["role"] == "viewer"
            assert host.receive_json()["type"] == "viewer-joined"
            with client.websocket_connect(_viewer_url(body["token"])) as second:
                message = second.receive_json()
                assert message["code"] == "occupied"
                assert message["message"] == VIEWER_OCCUPIED_MESSAGE
                with pytest.raises(WebSocketDisconnect):
                    second.receive_json()


def test_second_host_is_rejected(client, auth_headers):
    body = _create(client, auth_headers)
    with client.websocket_connect(_host_url(body)) as host:
        host.receive_json()
        with client.websocket_connect(_host_url(body)) as second:
            message = second.receive_json()
            assert message["code"] == "host-taken"


def test_viewer_cannot_send_offer(client, auth_headers):
    body = _create(client, auth_headers)
    with client.websocket_connect(_host_url(body)) as host:
        host.receive_json()
        with client.websocket_connect(_viewer_url(body["token"])) as viewer:
            viewer.receive_json()
            host.receive_json()
            viewer.send_json({"type": "offer", "sdp": "viewer-offer"})
            error = viewer.receive_json()
            assert error["code"] == "forbidden"
            assert "offer" in error["message"].lower()
            host.send_json({"type": "heartbeat"})
            assert host.receive_json()["type"] == "heartbeat"


def test_offer_stays_inside_its_session(client, auth_headers):
    first = _create(client, auth_headers)
    second = _create(client, auth_headers)
    with client.websocket_connect(_host_url(first)) as host_a:
        host_a.receive_json()
        with client.websocket_connect(_viewer_url(first["token"])) as viewer_a:
            viewer_a.receive_json()
            host_a.receive_json()
            with client.websocket_connect(_viewer_url(second["token"])) as viewer_b:
                viewer_b.receive_json()
                host_a.send_json({"type": "offer", "sdp": "only-a"})
                assert viewer_a.receive_json()["sdp"] == "only-a"
                viewer_b.send_json({"type": "heartbeat"})
                assert viewer_b.receive_json()["type"] == "heartbeat"


def test_host_heartbeat_timeout_ends_session(client, auth_headers):
    body = _create(client, auth_headers)
    with client.websocket_connect(_host_url(body)) as host:
        host.receive_json()
        with client.websocket_connect(_viewer_url(body["token"])) as viewer:
            viewer.receive_json()
            host.receive_json()
            session = get_live_share_registry().get(body["token"])
            session.host_seen_at = datetime.now(tz=UTC) - timedelta(seconds=90)
            viewer.send_json({"type": "heartbeat"})
            assert viewer.receive_json()["type"] == "ended"
            assert host.receive_json()["type"] == "ended"
    assert get_live_share_registry().get(body["token"]).revoked is True


def test_host_stop_ends_session(client, auth_headers):
    body = _create(client, auth_headers)
    with client.websocket_connect(_host_url(body)) as host:
        host.receive_json()
        with client.websocket_connect(_viewer_url(body["token"])) as viewer:
            viewer.receive_json()
            host.receive_json()
            host.send_json({"type": "stop"})
            assert viewer.receive_json()["reason"] == "stopped"
            assert host.receive_json()["reason"] == "stopped"
    assert get_live_share_registry().get(body["token"]).revoked is True


def test_viewer_disconnect_frees_the_slot(client, auth_headers):
    body = _create(client, auth_headers)
    with client.websocket_connect(_host_url(body)) as host:
        host.receive_json()
        with client.websocket_connect(_viewer_url(body["token"])) as viewer:
            viewer.receive_json()
            assert host.receive_json()["viewerCount"] == 1
        left = host.receive_json()
        assert left["type"] == "viewer-left"
        assert left["viewerCount"] == 0
        with client.websocket_connect(_viewer_url(body["token"])) as viewer_again:
            assert viewer_again.receive_json()["role"] == "viewer"
        assert get_live_share_registry().get(body["token"]).revoked is False


def test_viewer_heartbeat_loss_frees_the_slot_without_ending_the_host(client, auth_headers):
    body = _create(client, auth_headers)
    with client.websocket_connect(_host_url(body)) as host:
        host.receive_json()
        with client.websocket_connect(_viewer_url(body["token"])) as viewer:
            viewer.receive_json()
            host.receive_json()
            session = get_live_share_registry().get(body["token"])
            session.viewer_seen_at = datetime.now(tz=UTC) - timedelta(seconds=90)
            host.send_json({"type": "heartbeat"})
            assert host.receive_json()["type"] == "viewer-left"
        with client.websocket_connect(_viewer_url(body["token"])) as replacement:
            assert replacement.receive_json()["role"] == "viewer"
        assert get_live_share_registry().get(body["token"]).revoked is False


def test_turn_is_optional_and_stun_is_present():
    stun_only = build_ice_servers(Settings(live_share_stun_urls="stun:example.test:19302", live_share_turn_urls=""))
    assert stun_only == [{"urls": ["stun:example.test:19302"]}]
    with_turn = build_ice_servers(Settings(
        live_share_stun_urls="stun:example.test:19302",
        live_share_turn_urls="turn:example.test:3478",
        live_share_turn_username="user",
        live_share_turn_credential="secret",
    ))
    assert with_turn[1]["urls"] == ["turn:example.test:3478"]
    assert "credential" in with_turn[1]


def test_joined_message_carries_stun_and_not_a_project(client, auth_headers):
    body = _create(client, auth_headers)
    with client.websocket_connect(_viewer_url(body["token"])) as viewer:
        message = viewer.receive_json()
        assert message["type"] == "joined"
        assert message["iceServers"][0]["urls"]
        assert "project" not in message
        assert "payload" not in message
