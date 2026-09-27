"""Proje maliyet anlık görüntüsü. Tasarım payload'undan ayrıdır.

Revision ID: 0045_project_commercial
Revises: 0044_panel_corner_glass_family
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0045_project_commercial"
down_revision = "0044_panel_corner_glass_family"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    json_type = (
        postgresql.JSONB(astext_type=sa.Text())
        if bind.dialect.name == "postgresql"
        else sa.JSON()
    )
    op.add_column("fair_stand_projects", sa.Column("commercial", json_type, nullable=True))


def downgrade() -> None:
    op.drop_column("fair_stand_projects", "commercial")
