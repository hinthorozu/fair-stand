"""Item is_render + accepts_* columns.

Revision ID: 0005_item_surface_flags
Revises: 0004_item_rotation
"""

from alembic import op
import sqlalchemy as sa

from app.modules.fair_stand.infrastructure.item_surface_flags_seed import fill_item_surface_flag_columns

revision = "0005_item_surface_flags"
down_revision = "0004_item_rotation"
branch_labels = None
depends_on = None

_COLUMNS = (
    "is_render",
    "accepts_color",
    "accepts_image",
    "accepts_lightbox",
    "accepts_glass",
    "accepts_mesh",
)


def upgrade() -> None:
    bind = op.get_bind()
    columns = {column["name"] for column in sa.inspect(bind).get_columns("fair_stand_items")}
    for name in _COLUMNS:
        if name not in columns:
            op.add_column(
                "fair_stand_items",
                sa.Column(name, sa.Boolean(), nullable=False, server_default=sa.false()),
            )
    existing = {constraint["name"] for constraint in sa.inspect(bind).get_check_constraints("fair_stand_items")}
    if "ck_fair_stand_items_render_surface" not in existing:
        op.create_check_constraint(
            "ck_fair_stand_items_render_surface",
            "fair_stand_items",
            "is_render OR ("
            "NOT accepts_color AND NOT accepts_image AND NOT accepts_lightbox "
            "AND NOT accepts_glass AND NOT accepts_mesh)",
        )

    fill_item_surface_flag_columns(bind)


def downgrade() -> None:
    op.drop_constraint("ck_fair_stand_items_render_surface", "fair_stand_items", type_="check")
    for name in reversed(_COLUMNS):
        op.drop_column("fair_stand_items", name)
