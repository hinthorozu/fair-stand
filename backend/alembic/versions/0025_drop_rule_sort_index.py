"""Drop sort_index from fair_stand_rule (list by display_name).

Revision ID: 0025_drop_rule_sort_index
Revises: 0024_item_snap_capability
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0025_drop_rule_sort_index"
down_revision = "0024_item_snap_capability"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    cols = {c["name"] for c in sa.inspect(bind).get_columns("fair_stand_rule")}
    if "sort_index" in cols:
        op.drop_column("fair_stand_rule", "sort_index")


def downgrade() -> None:
    op.add_column(
        "fair_stand_rule",
        sa.Column("sort_index", sa.Integer(), nullable=False, server_default="0"),
    )
