"""Bind every stand project to a customer UUID.

Revision ID: 0045_project_customer_id
Revises: 0044_panel_corner_glass_family

Existing rows receive one temporary UUID. That id is not a crm_customers row.
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

from app.modules.fair_stand.application.projects import backfill_unassigned_project_customers

revision = "0045_project_customer_id"
down_revision = "0044_panel_corner_glass_family"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "fair_stand_projects",
        sa.Column("customer_id", postgresql.UUID(as_uuid=True), nullable=True),
    )
    backfill_unassigned_project_customers(op.get_bind())
    op.alter_column("fair_stand_projects", "customer_id", nullable=False)
    op.create_index(
        "ix_fair_stand_projects_organization_id_customer_id",
        "fair_stand_projects",
        ["organization_id", "customer_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_fair_stand_projects_organization_id_customer_id",
        table_name="fair_stand_projects",
    )
    op.drop_column("fair_stand_projects", "customer_id")
