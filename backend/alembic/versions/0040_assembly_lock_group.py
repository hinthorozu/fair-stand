"""fair_stand_item_assembly_parts.lock_group_id: persistent N-member snap lock.

Revision ID: 0040_assembly_lock_group
Revises: 0039_assembly_rotation_xyz
"""

from alembic import op
import sqlalchemy as sa


revision = "0040_assembly_lock_group"
down_revision = "0039_assembly_rotation_xyz"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "fair_stand_item_assembly_parts",
        sa.Column("lock_group_id", sa.Integer(), nullable=True),
    )
    op.create_check_constraint(
        "ck_fair_stand_item_assembly_lock_group",
        "fair_stand_item_assembly_parts",
        "lock_group_id IS NULL OR lock_group_id >= 1",
    )


def downgrade() -> None:
    op.drop_constraint(
        "ck_fair_stand_item_assembly_lock_group",
        "fair_stand_item_assembly_parts",
        type_="check",
    )
    op.drop_column("fair_stand_item_assembly_parts", "lock_group_id")
