"""In-memory live tab-share sessions.

Video stays on the WebRTC peer connection. This registry only matches one host
socket to one viewer socket and exchanges signaling messages.

Ofis ağı ↔ mobil internet acceptance testinde P2P bağlantısı kurulamıyorsa
coturn/TURN eklenmelidir. Bu mevcut V1'in başarısızlığı sayılmaz. SFU kurulmaz.
"""

from __future__ import annotations

import secrets
from dataclasses import dataclass, field
from datetime import UTC, datetime, timedelta
from typing import Any

from app.core.config import Settings, get_settings

LIVE_SHARE_LIFETIME = timedelta(hours=2)
LIVE_SHARE_STALE_AFTER = timedelta(seconds=45)
VIEWER_OCCUPIED_MESSAGE = "Bu canlı paylaşım oturumunda zaten bir izleyici bağlı."


def _utcnow() -> datetime:
    return datetime.now(tz=UTC)


@dataclass
class LiveShareSession:
    token: str
    host_key: str
    created_at: datetime
    expires_at: datetime
    revoked: bool = False
    end_reason: str | None = None
    host_ws: Any = None
    viewer_ws: Any = None
    host_seen_at: datetime = field(default_factory=_utcnow)
    viewer_seen_at: datetime | None = None


class LiveShareRegistry:
    def __init__(
        self,
        *,
        lifetime: timedelta = LIVE_SHARE_LIFETIME,
        stale_after: timedelta = LIVE_SHARE_STALE_AFTER,
        clock=None,
    ) -> None:
        self._lifetime = lifetime
        self._stale_after = stale_after
        self._clock = clock or _utcnow
        self._sessions: dict[str, LiveShareSession] = {}

    def reset(self) -> None:
        self._sessions.clear()

    def now(self) -> datetime:
        return self._clock()

    def create(self) -> LiveShareSession:
        token = secrets.token_urlsafe(32)
        while token in self._sessions:
            token = secrets.token_urlsafe(32)
        session = LiveShareSession(
            token=token,
            host_key=secrets.token_urlsafe(32),
            created_at=self.now(),
            expires_at=self.now() + self._lifetime,
            host_seen_at=self.now(),
        )
        self._sessions[token] = session
        return session

    def get(self, token: str) -> LiveShareSession | None:
        return self._sessions.get(token)

    def host_key_matches(self, session: LiveShareSession, presented: str | None) -> bool:
        if not presented:
            return False
        return secrets.compare_digest(session.host_key, presented)

    def availability(self, session: LiveShareSession) -> str | None:
        if session.revoked:
            return "expired" if session.end_reason == "expired" else "revoked"
        if self.now() >= session.expires_at:
            self.revoke(session, "expired")
            return "expired"
        return None

    def attach_host(self, session: LiveShareSession, websocket: Any) -> str | None:
        blocked = self.availability(session)
        if blocked:
            return blocked
        if session.host_ws is not None:
            return "host-taken"
        session.host_ws = websocket
        session.host_seen_at = self.now()
        return None

    def attach_viewer(self, session: LiveShareSession, websocket: Any) -> str | None:
        blocked = self.availability(session)
        if blocked:
            return blocked
        if session.viewer_ws is not None:
            return "occupied"
        session.viewer_ws = websocket
        session.viewer_seen_at = self.now()
        return None

    def touch(self, session: LiveShareSession, role: str) -> None:
        if session.revoked:
            return
        if role == "host":
            session.host_seen_at = self.now()
        elif role == "viewer" and session.viewer_ws is not None:
            session.viewer_seen_at = self.now()

    def detach_host(self, session: LiveShareSession, websocket: Any) -> dict[str, Any] | None:
        if session.host_ws is not websocket:
            return None
        session.host_ws = None
        if session.revoked:
            return None
        return self.revoke(session, "host-disconnect")

    def detach_viewer(self, session: LiveShareSession, websocket: Any) -> dict[str, Any] | None:
        if session.viewer_ws is not websocket:
            return None
        host = session.host_ws
        session.viewer_ws = None
        session.viewer_seen_at = None
        if session.revoked:
            return None
        return {"type": "viewer-left", "host": host, "viewer": None, "session": session}

    def revoke(self, session: LiveShareSession, reason: str) -> dict[str, Any]:
        host = session.host_ws
        viewer = session.viewer_ws
        session.revoked = True
        session.end_reason = reason
        session.host_ws = None
        session.viewer_ws = None
        session.viewer_seen_at = None
        return {
            "type": "ended",
            "reason": reason,
            "host": host,
            "viewer": viewer,
            "session": session,
        }

    def stop(self, token: str, host_key: str | None) -> tuple[str, dict[str, Any] | None]:
        session = self.get(token)
        if session is None:
            return "invalid", None
        if not self.host_key_matches(session, host_key):
            return "forbidden", None
        blocked = self.availability(session)
        if blocked:
            return blocked, None
        return "stopped", self.revoke(session, "stopped")

    def sweep(self) -> list[dict[str, Any]]:
        events: list[dict[str, Any]] = []
        now = self.now()
        for session in list(self._sessions.values()):
            if session.revoked:
                continue
            if now >= session.expires_at:
                events.append(self.revoke(session, "expired"))
                continue
            if session.host_ws is not None and now - session.host_seen_at > self._stale_after:
                events.append(self.revoke(session, "heartbeat"))
                continue
            if (
                session.viewer_ws is not None
                and session.viewer_seen_at is not None
                and now - session.viewer_seen_at > self._stale_after
            ):
                viewer = session.viewer_ws
                host = session.host_ws
                session.viewer_ws = None
                session.viewer_seen_at = None
                events.append({
                    "type": "viewer-stale",
                    "host": host,
                    "viewer": viewer,
                    "session": session,
                })
        return events


_registry = LiveShareRegistry()


def get_live_share_registry() -> LiveShareRegistry:
    return _registry


def build_ice_servers(settings: Settings | None = None) -> list[dict[str, Any]]:
    """STUN now. TURN is included only when its environment values are set."""
    settings = settings or get_settings()
    servers: list[dict[str, Any]] = []
    stun_urls = _csv(settings.live_share_stun_urls)
    if stun_urls:
        servers.append({"urls": stun_urls})
    turn_urls = _csv(settings.live_share_turn_urls)
    if turn_urls and settings.live_share_turn_username and settings.live_share_turn_credential:
        servers.append({
            "urls": turn_urls,
            "username": settings.live_share_turn_username,
            "credential": settings.live_share_turn_credential,
        })
    return servers


def _csv(value: str) -> list[str]:
    return [item.strip() for item in (value or "").split(",") if item.strip()]
