"""Drop unused fair_stand_items.composition_module_type (scene uses item.type).

Revision ID: 0014_drop_comp_mod_type
Revises: 0013_drop_component_sort_order
"""

from alembic import op
import sqlalchemy as sa

revision = "0014_drop_comp_mod_type"
down_revision = "0013_drop_component_sort_order"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_column("fair_stand_items", "composition_module_type")


def downgrade() -> None:
    op.add_column(
        "fair_stand_items",
        sa.Column("composition_module_type", sa.String(length=64), nullable=True),
    )
