"""fair_stand_item_assembly_parts: parent lokal child pose (BOM ayrı).

Revision ID: 0038_item_assembly_parts
Revises: 0037_save_as_button
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


revision = "0038_item_assembly_parts"
down_revision = "0037_save_as_button"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "fair_stand_item_assembly_parts",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("parent_item_key", sa.String(length=128), nullable=False),
        sa.Column("child_item_key", sa.String(length=128), nullable=False),
        sa.Column("instance_index", sa.Integer(), nullable=False),
        sa.Column("x_cm", sa.Numeric(10, 3), nullable=False, server_default="0"),
        sa.Column("y_cm", sa.Numeric(10, 3), nullable=False, server_default="0"),
        sa.Column("z_cm", sa.Numeric(10, 3), nullable=False, server_default="0"),
        sa.Column("rotation_z_deg", sa.Numeric(8, 3), nullable=False, server_default="0"),
        sa.ForeignKeyConstraint(
            ["parent_item_key"],
            ["fair_stand_items.item_key"],
            name="fk_fair_stand_item_assembly_parent",
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["child_item_key"],
            ["fair_stand_items.item_key"],
            name="fk_fair_stand_item_assembly_child",
            ondelete="RESTRICT",
            onupdate="CASCADE",
        ),
        sa.CheckConstraint("instance_index >= 0", name="ck_fair_stand_item_assembly_index"),
        sa.UniqueConstraint(
            "parent_item_key",
            "child_item_key",
            "instance_index",
            name="uq_fair_stand_item_assembly_instance",
        ),
    )
    op.create_index(
        "ix_fair_stand_item_assembly_parent",
        "fair_stand_item_assembly_parts",
        ["parent_item_key"],
    )
    op.create_index(
        "ix_fair_stand_item_assembly_child",
        "fair_stand_item_assembly_parts",
        ["child_item_key"],
    )


def downgrade() -> None:
    op.drop_index("ix_fair_stand_item_assembly_child", table_name="fair_stand_item_assembly_parts")
    op.drop_index("ix_fair_stand_item_assembly_parent", table_name="fair_stand_item_assembly_parts")
    op.drop_table("fair_stand_item_assembly_parts")
