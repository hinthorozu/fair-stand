"""Fair Stand schema (0088 equivalent).

Revision ID: 0001_fair_stand_schema
Revises:
"""

from alembic import op

from app.db.base import Base
from app.modules.fair_stand.infrastructure import models as _models  # noqa: F401

revision = "0001_fair_stand_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    Base.metadata.create_all(bind=bind)


def downgrade() -> None:
    bind = op.get_bind()
    Base.metadata.drop_all(bind=bind)
