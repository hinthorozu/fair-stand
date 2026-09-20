from __future__ import annotations

from uuid import UUID, uuid4

from fastapi import HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials

from app.core.config import Settings, get_settings
from app.integrations.kyrox_core.auth import build_auth_context
from app.integrations.kyrox_core.ports import AuthContext, AuthorizationPort

DEFAULT_DEV_BYPASS_TOKEN = "dev-bypass"


def dev_bypass_enabled(settings: Settings | None = None) -> bool:
    settings = settings or get_settings()
    return settings.dev_bypass_core and settings.app_env in {"development", "local", "test"}


class AllowAllAuthorizationAdapter(AuthorizationPort):
    def check_permission(self, **kwargs) -> bool:
        _ = kwargs
        return True


def resolve_auth_context(
    credentials: HTTPAuthorizationCredentials | None,
    organization_id: UUID,
    *,
    dev_user_id: UUID | None = None,
) -> AuthContext:
    settings = get_settings()
    if credentials and credentials.credentials:
        bypass_token = settings.dev_bypass_token or DEFAULT_DEV_BYPASS_TOKEN
        if dev_bypass_enabled(settings) and credentials.credentials == bypass_token:
            user_id = dev_user_id or (UUID(settings.dev_user_id) if settings.dev_user_id else uuid4())
            return AuthContext(
                user_id=user_id,
                email=settings.dev_user_email,
                session_id=uuid4(),
                organization_id=organization_id,
            )
        try:
            return build_auth_context(credentials.credentials, organization_id)
        except Exception:
            if not dev_bypass_enabled(settings):
                raise
    if dev_bypass_enabled(settings):
        user_id = dev_user_id or (UUID(settings.dev_user_id) if settings.dev_user_id else uuid4())
        return AuthContext(
            user_id=user_id,
            email=settings.dev_user_email,
            session_id=uuid4(),
            organization_id=organization_id,
        )
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
