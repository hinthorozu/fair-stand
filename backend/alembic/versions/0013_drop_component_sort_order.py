"""Align multi-row child tables: drop component sort_order; give body_parts UUID id.

Revision ID: 0013_drop_component_sort_order
Revises: 0012_fair_stand_projects
"""

from alembic import op
import sqlalchemy as sa

revision = "0013_drop_component_sort_order"
down_revision = "0012_fair_stand_projects"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint(
        "uq_fair_stand_item_components_sort",
        "fair_stand_item_components",
        type_="unique",
    )
    op.drop_column("fair_stand_item_components", "sort_order")

    op.add_column(
        "fair_stand_item_body_parts",
        sa.Column("id", sa.Uuid(), nullable=True),
    )
    op.execute("UPDATE fair_stand_item_body_parts SET id = gen_random_uuid() WHERE id IS NULL")
    op.alter_column("fair_stand_item_body_parts", "id", nullable=False)
    op.drop_constraint("fair_stand_item_body_parts_pkey", "fair_stand_item_body_parts", type_="primary")
    op.create_primary_key("pk_fair_stand_item_body_parts", "fair_stand_item_body_parts", ["id"])
    op.create_unique_constraint(
        "uq_fair_stand_item_body_parts_role",
        "fair_stand_item_body_parts",
        ["parent_item_key", "body_role"],
    )


def downgrade() -> None:
    op.drop_constraint(
        "uq_fair_stand_item_body_parts_role",
        "fair_stand_item_body_parts",
        type_="unique",
    )
    op.drop_constraint("pk_fair_stand_item_body_parts", "fair_stand_item_body_parts", type_="primary")
    op.create_primary_key(
        "fair_stand_item_body_parts_pkey",
        "fair_stand_item_body_parts",
        ["parent_item_key", "body_role"],
    )
    op.drop_column("fair_stand_item_body_parts", "id")

    op.add_column(
        "fair_stand_item_components",
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
    )
    op.create_unique_constraint(
        "uq_fair_stand_item_components_sort",
        "fair_stand_item_components",
        ["parent_item_key", "sort_order"],
    )
    op.alter_column("fair_stand_item_components", "sort_order", server_default=None)
