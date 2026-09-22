"""fair_stand_projects and fair_stand_project_assets.

Revision ID: 0012_fair_stand_projects
Revises: 0011_archive_button_visibility
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0012_fair_stand_projects"
down_revision = "0011_archive_button_visibility"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "fair_stand_projects",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=256), nullable=False),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("created_by", sa.Uuid(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_fair_stand_projects"),
        sa.CheckConstraint("version > 0", name="ck_fair_stand_projects_version"),
        sa.CheckConstraint("length(btrim(name)) > 0", name="ck_fair_stand_projects_name"),
    )
    op.create_index(
        "ix_fair_stand_projects_organization_id_updated_at",
        "fair_stand_projects",
        ["organization_id", "updated_at"],
    )

    op.create_table(
        "fair_stand_project_assets",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("organization_id", sa.Uuid(), nullable=False),
        sa.Column("project_id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(length=512), nullable=False),
        sa.Column("mime_type", sa.String(length=128), nullable=False),
        sa.Column("byte_size", sa.Integer(), nullable=False),
        sa.Column("storage_key", sa.String(length=1024), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["project_id"],
            ["fair_stand_projects.id"],
            name="fk_fair_stand_project_assets_project_id",
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name="pk_fair_stand_project_assets"),
        sa.UniqueConstraint("storage_key", name="uq_fair_stand_project_assets_storage_key"),
        sa.CheckConstraint("byte_size >= 0", name="ck_fair_stand_project_assets_byte_size"),
        sa.CheckConstraint("length(btrim(name)) > 0", name="ck_fair_stand_project_assets_name"),
        sa.CheckConstraint("length(btrim(mime_type)) > 0", name="ck_fair_stand_project_assets_mime"),
        sa.CheckConstraint("length(btrim(storage_key)) > 0", name="ck_fair_stand_project_assets_key"),
    )
    op.create_index(
        "ix_fair_stand_project_assets_project_id",
        "fair_stand_project_assets",
        ["project_id"],
    )
    op.create_index(
        "ix_fair_stand_project_assets_organization_id",
        "fair_stand_project_assets",
        ["organization_id"],
    )


def downgrade() -> None:
    op.drop_index("ix_fair_stand_project_assets_organization_id", table_name="fair_stand_project_assets")
    op.drop_index("ix_fair_stand_project_assets_project_id", table_name="fair_stand_project_assets")
    op.drop_table("fair_stand_project_assets")
    op.drop_index("ix_fair_stand_projects_organization_id_updated_at", table_name="fair_stand_projects")
    op.drop_table("fair_stand_projects")
