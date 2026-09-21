"""Singleton fair_stand_settings: image upload MB cap.

Revision ID: 0010_fair_stand_settings
Revises: 0009_kettle_default_z
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.orm import Session

from app.modules.fair_stand.infrastructure.runtime_settings_seed import ensure_runtime_settings

revision = "0010_fair_stand_settings"
down_revision = "0009_kettle_default_z"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    if "fair_stand_settings" not in sa.inspect(bind).get_table_names():
        op.create_table(
            "fair_stand_settings",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("max_image_upload_mb", sa.Integer(), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
            sa.CheckConstraint("id = 1", name="ck_fair_stand_settings_singleton"),
            sa.CheckConstraint("max_image_upload_mb > 0", name="ck_fair_stand_settings_max_image_upload_mb"),
            sa.PrimaryKeyConstraint("id"),
        )
    session = Session(bind=bind)
    try:
        ensure_runtime_settings(session)
        session.commit()
    finally:
        session.close()


def downgrade() -> None:
    op.drop_table("fair_stand_settings")
