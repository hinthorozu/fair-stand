from dataclasses import dataclass
from typing import Protocol
from uuid import UUID


@dataclass(frozen=True)
class AuthContext:
    user_id: UUID
    email: str
    session_id: UUID
    organization_id: UUID


class AuthorizationPort(Protocol):
    def check_permission(
        self,
        *,
        organization_id: UUID,
        user_id: UUID,
        permission_code: str,
        access_token: str,
    ) -> bool: ...
