"""Nullable Item rotation policy columns.

Revision ID: 0004_item_rotation
Revises: 0003_fair_stand_dimensions
"""

from alembic import op
import sqlalchemy as sa

from app.modules.fair_stand.infrastructure.item_rotation_seed import fill_item_rotation_columns

revision = "0004_item_rotation"
down_revision = "0003_fair_stand_dimensions"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    columns = {column["name"] for column in sa.inspect(bind).get_columns("fair_stand_items")}
    if "rotation_step_deg" not in columns:
        op.add_column(
            "fair_stand_items",
            sa.Column("rotation_step_deg", sa.Numeric(8, 2), nullable=True),
        )
        op.add_column(
            "fair_stand_items",
            sa.Column("default_rotation_deg", sa.Numeric(8, 2), nullable=True),
        )
        op.add_column(
            "fair_stand_items",
            sa.Column("side_insert_rotation", sa.String(16), nullable=True),
        )
        op.create_check_constraint(
            "ck_fair_stand_items_side_insert_rotation",
            "fair_stand_items",
            "side_insert_rotation IS NULL OR side_insert_rotation IN ('inherit', 'default')",
        )
        op.create_check_constraint(
            "ck_fair_stand_items_rotation_trio",
            "fair_stand_items",
            "(rotation_step_deg IS NULL) = (default_rotation_deg IS NULL) "
            "AND (rotation_step_deg IS NULL) = (side_insert_rotation IS NULL)",
        )

    fill_item_rotation_columns(bind)


def downgrade() -> None:
    op.drop_constraint("ck_fair_stand_items_rotation_trio", "fair_stand_items", type_="check")
    op.drop_constraint("ck_fair_stand_items_side_insert_rotation", "fair_stand_items", type_="check")
    op.drop_column("fair_stand_items", "side_insert_rotation")
    op.drop_column("fair_stand_items", "default_rotation_deg")
    op.drop_column("fair_stand_items", "rotation_step_deg")
