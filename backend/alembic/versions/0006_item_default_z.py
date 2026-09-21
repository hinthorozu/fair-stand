"""Item default_z_cm for catalog drop placement.zCm.

Revision ID: 0006_item_default_z
Revises: 0005_item_surface_flags
"""

from alembic import op
import sqlalchemy as sa

from app.modules.fair_stand.infrastructure.item_default_z_seed import fill_item_default_z_columns

revision = "0006_item_default_z"
down_revision = "0005_item_surface_flags"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    columns = {column["name"] for column in sa.inspect(bind).get_columns("fair_stand_items")}
    if "default_z_cm" not in columns:
        op.add_column(
            "fair_stand_items",
            sa.Column("default_z_cm", sa.Numeric(8, 2), nullable=False, server_default="0"),
        )
    fill_item_default_z_columns(bind)


def downgrade() -> None:
    op.drop_column("fair_stand_items", "default_z_cm")
