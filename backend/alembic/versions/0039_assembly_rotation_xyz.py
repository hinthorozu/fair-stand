"""assembly parts: free Euler angles (rotation_x_deg, rotation_y_deg).

Revision ID: 0039_assembly_rotation_xyz
Revises: 0038_item_assembly_parts
"""

from alembic import op
import sqlalchemy as sa


revision = "0039_assembly_rotation_xyz"
down_revision = "0038_item_assembly_parts"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "fair_stand_item_assembly_parts",
        sa.Column(
            "rotation_x_deg",
            sa.Numeric(8, 3),
            nullable=False,
            server_default="0",
        ),
    )
    op.add_column(
        "fair_stand_item_assembly_parts",
        sa.Column(
            "rotation_y_deg",
            sa.Numeric(8, 3),
            nullable=False,
            server_default="0",
        ),
    )


def downgrade() -> None:
    op.drop_column("fair_stand_item_assembly_parts", "rotation_y_deg")
    op.drop_column("fair_stand_item_assembly_parts", "rotation_x_deg")
