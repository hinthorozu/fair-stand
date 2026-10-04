"""Empty global Fair Stand unit catalog.

Revision ID: 0051_unit_catalog
Revises: 0050_box_block_rotation_45

System-level catalog. No organization_id, no seed rows, no Item.unit foreign key.
"""

from alembic import op
import sqlalchemy as sa


revision = "0051_unit_catalog"
down_revision = "0050_box_block_rotation_45"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "fair_stand_units",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("code", sa.String(64), nullable=False),
        sa.Column("name", sa.String(128), nullable=False),
        sa.Column("symbol", sa.String(32), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("code", name="uq_fair_stand_units_code"),
    )


def downgrade() -> None:
    op.drop_table("fair_stand_units")
