"""Item snap_target_item_type + snap_anchor.

Revision ID: 0007_item_snap
Revises: 0006_item_default_z
"""

from alembic import op
import sqlalchemy as sa

from app.modules.fair_stand.infrastructure.item_snap_seed import fill_item_snap_columns

revision = "0007_item_snap"
down_revision = "0006_item_default_z"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    columns = {column["name"] for column in sa.inspect(bind).get_columns("fair_stand_items")}
    if "snap_target_item_type" not in columns:
        op.add_column("fair_stand_items", sa.Column("snap_target_item_type", sa.String(64), nullable=True))
    if "snap_anchor" not in columns:
        op.add_column("fair_stand_items", sa.Column("snap_anchor", sa.String(16), nullable=True))
    existing = {constraint["name"] for constraint in sa.inspect(bind).get_check_constraints("fair_stand_items")}
    if "ck_fair_stand_items_snap_pair" not in existing:
        op.create_check_constraint(
            "ck_fair_stand_items_snap_pair",
            "fair_stand_items",
            "(snap_target_item_type IS NULL) = (snap_anchor IS NULL)",
        )
    if "ck_fair_stand_items_snap_anchor" not in existing:
        op.create_check_constraint(
            "ck_fair_stand_items_snap_anchor",
            "fair_stand_items",
            "snap_anchor IS NULL OR snap_anchor IN ('top', 'bottom', 'left', 'right')",
        )
    fill_item_snap_columns(bind)


def downgrade() -> None:
    op.drop_constraint("ck_fair_stand_items_snap_anchor", "fair_stand_items", type_="check")
    op.drop_constraint("ck_fair_stand_items_snap_pair", "fair_stand_items", type_="check")
    op.drop_column("fair_stand_items", "snap_anchor")
    op.drop_column("fair_stand_items", "snap_target_item_type")
