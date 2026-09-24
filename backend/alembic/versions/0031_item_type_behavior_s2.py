"""Add kesit 2 behavior cols to fair_stand_item_type.

Revision ID: 0031_item_type_behavior_s2
Revises: 0030_item_type_placement
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

from app.modules.fair_stand.infrastructure.item_type_behavior_seed import (
    DEFAULT_ALLOW_SIDE_INSERT,
    DEFAULT_MAGNETIC_SNAP,
    DEFAULT_SUPPORTS_WALL_OVERLAY_MOUNT,
    DEFAULT_WALL_CAPACITY,
    TYPE_BEHAVIOR_SLICE2,
)

revision = "0031_item_type_behavior_s2"
down_revision = "0030_item_type_placement"
branch_labels = None
depends_on = None

_MAGNETIC_IN = ("standard", "none", "short-up-joint")
_CAPACITY_IN = ("include", "exclude")


def upgrade() -> None:
    bind = op.get_bind()
    cols = {c["name"] for c in sa.inspect(bind).get_columns("fair_stand_item_type")}

    if "magnetic_snap" not in cols:
        op.add_column("fair_stand_item_type", sa.Column("magnetic_snap", sa.String(32), nullable=True))
    if "allow_side_insert" not in cols:
        op.add_column("fair_stand_item_type", sa.Column("allow_side_insert", sa.Boolean(), nullable=True))
    if "supports_wall_overlay_mount" not in cols:
        op.add_column(
            "fair_stand_item_type",
            sa.Column("supports_wall_overlay_mount", sa.Boolean(), nullable=True),
        )
    if "wall_capacity" not in cols:
        op.add_column("fair_stand_item_type", sa.Column("wall_capacity", sa.String(16), nullable=True))

    for key, (magnetic_snap, allow_side, supports_overlay, wall_capacity) in TYPE_BEHAVIOR_SLICE2.items():
        bind.execute(
            sa.text(
                """
                UPDATE fair_stand_item_type
                SET magnetic_snap = :magnetic_snap,
                    allow_side_insert = :allow_side,
                    supports_wall_overlay_mount = :supports_overlay,
                    wall_capacity = :wall_capacity,
                    updated_at = NOW()
                WHERE key = :key
                """
            ),
            {
                "key": key,
                "magnetic_snap": magnetic_snap,
                "allow_side": allow_side,
                "supports_overlay": supports_overlay,
                "wall_capacity": wall_capacity,
            },
        )

    bind.execute(
        sa.text(
            """
            UPDATE fair_stand_item_type
            SET magnetic_snap = COALESCE(magnetic_snap, :magnetic_snap),
                allow_side_insert = COALESCE(allow_side_insert, :allow_side),
                supports_wall_overlay_mount = COALESCE(supports_wall_overlay_mount, :supports_overlay),
                wall_capacity = COALESCE(wall_capacity, :wall_capacity),
                updated_at = NOW()
            WHERE magnetic_snap IS NULL
               OR allow_side_insert IS NULL
               OR supports_wall_overlay_mount IS NULL
               OR wall_capacity IS NULL
            """
        ),
        {
            "magnetic_snap": DEFAULT_MAGNETIC_SNAP,
            "allow_side": DEFAULT_ALLOW_SIDE_INSERT,
            "supports_overlay": DEFAULT_SUPPORTS_WALL_OVERLAY_MOUNT,
            "wall_capacity": DEFAULT_WALL_CAPACITY,
        },
    )

    op.alter_column("fair_stand_item_type", "magnetic_snap", nullable=False)
    op.alter_column("fair_stand_item_type", "allow_side_insert", nullable=False)
    op.alter_column("fair_stand_item_type", "supports_wall_overlay_mount", nullable=False)
    op.alter_column("fair_stand_item_type", "wall_capacity", nullable=False)

    op.create_check_constraint(
        "ck_fair_stand_item_type_magnetic_snap",
        "fair_stand_item_type",
        f"magnetic_snap IN {_MAGNETIC_IN}",
    )
    op.create_check_constraint(
        "ck_fair_stand_item_type_wall_capacity",
        "fair_stand_item_type",
        f"wall_capacity IN {_CAPACITY_IN}",
    )


def downgrade() -> None:
    op.drop_constraint("ck_fair_stand_item_type_wall_capacity", "fair_stand_item_type", type_="check")
    op.drop_constraint("ck_fair_stand_item_type_magnetic_snap", "fair_stand_item_type", type_="check")
    op.drop_column("fair_stand_item_type", "wall_capacity")
    op.drop_column("fair_stand_item_type", "supports_wall_overlay_mount")
    op.drop_column("fair_stand_item_type", "allow_side_insert")
    op.drop_column("fair_stand_item_type", "magnetic_snap")
