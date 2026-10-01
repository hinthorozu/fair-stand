"""Session snapshots for stand projects.

Revision ID: 0046_project_revisions
Revises: 0045_project_customer_id

One row is one edit-session snapshot. Later saves in that session update the
same row. organization_id is not stored; tenant scope is the parent project.
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0046_project_revisions"
down_revision = "0045_project_customer_id"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "fair_stand_project_revisions",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("project_id", sa.Uuid(), nullable=False),
        sa.Column("revision_number", sa.Integer(), nullable=False),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["project_id"],
            ["fair_stand_projects.id"],
            name="fk_fair_stand_project_revisions_project_id",
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name="pk_fair_stand_project_revisions"),
        sa.UniqueConstraint(
            "project_id",
            "revision_number",
            name="uq_fair_stand_project_revisions_project_revision",
        ),
        sa.CheckConstraint(
            "revision_number > 0",
            name="ck_fair_stand_project_revisions_revision_number",
        ),
    )
    op.create_index(
        "ix_fair_stand_project_revisions_project_id",
        "fair_stand_project_revisions",
        ["project_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_fair_stand_project_revisions_project_id",
        table_name="fair_stand_project_revisions",
    )
    op.drop_table("fair_stand_project_revisions")
