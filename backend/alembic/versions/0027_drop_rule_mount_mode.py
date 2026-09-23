"""Drop mount_mode from fair_stand_rule (face+edge enough).

Revision ID: 0027_drop_rule_mount_mode
Revises: 0026_snap_code_to_key
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0027_drop_rule_mount_mode"
down_revision = "0026_snap_code_to_key"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    cols = {c["name"] for c in sa.inspect(bind).get_columns("fair_stand_rule")}
    if "mount_mode" not in cols:
        return
    op.drop_constraint("ck_fair_stand_rule_mount_mode", "fair_stand_rule", type_="check")
    op.drop_column("fair_stand_rule", "mount_mode")


def downgrade() -> None:
    bind = op.get_bind()
    cols = {c["name"] for c in sa.inspect(bind).get_columns("fair_stand_rule")}
    if "mount_mode" in cols:
        return
    op.add_column("fair_stand_rule", sa.Column("mount_mode", sa.String(32), nullable=True))
    op.create_check_constraint(
        "ck_fair_stand_rule_mount_mode",
        "fair_stand_rule",
        "mount_mode IS NULL OR mount_mode IN ('face-edge', 'panel-seam')",
    )
