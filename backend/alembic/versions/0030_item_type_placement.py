"""Add placement/collision/move_snap_cm to fair_stand_item_type (TYPE_BEHAVIORS kesit 1).

Revision ID: 0030_item_type_placement
Revises: 0029_item_type_catalog
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

from app.modules.fair_stand.infrastructure.item_type_behavior_seed import (
    DEFAULT_COLLISION,
    DEFAULT_MOVE_SNAP_CM,
    DEFAULT_PLACEMENT,
    TYPE_BEHAVIOR_SLICE1,
)

revision = "0030_item_type_placement"
down_revision = "0029_item_type_catalog"
branch_labels = None
depends_on = None

_PLACEMENT_IN = ("wall", "free", "wall-overlay", "top")
_COLLISION_IN = ("segment", "footprint", "none")


def upgrade() -> None:
    bind = op.get_bind()
    cols = {c["name"] for c in sa.inspect(bind).get_columns("fair_stand_item_type")}

    if "placement" not in cols:
        op.add_column(
            "fair_stand_item_type",
            sa.Column("placement", sa.String(32), nullable=True),
        )
    if "collision" not in cols:
        op.add_column(
            "fair_stand_item_type",
            sa.Column("collision", sa.String(32), nullable=True),
        )
    if "move_snap_cm" not in cols:
        op.add_column(
            "fair_stand_item_type",
            sa.Column("move_snap_cm", sa.Integer(), nullable=True),
        )

    for key, (placement, collision, move_snap_cm) in TYPE_BEHAVIOR_SLICE1.items():
        bind.execute(
            sa.text(
                """
                UPDATE fair_stand_item_type
                SET placement = :placement,
                    collision = :collision,
                    move_snap_cm = :move_snap_cm,
                    updated_at = NOW()
                WHERE key = :key
                """
            ),
            {
                "key": key,
                "placement": placement,
                "collision": collision,
                "move_snap_cm": move_snap_cm,
            },
        )

    bind.execute(
        sa.text(
            """
            UPDATE fair_stand_item_type
            SET placement = COALESCE(placement, :placement),
                collision = COALESCE(collision, :collision),
                move_snap_cm = COALESCE(move_snap_cm, :move_snap_cm),
                updated_at = NOW()
            WHERE placement IS NULL OR collision IS NULL OR move_snap_cm IS NULL
            """
        ),
        {
            "placement": DEFAULT_PLACEMENT,
            "collision": DEFAULT_COLLISION,
            "move_snap_cm": DEFAULT_MOVE_SNAP_CM,
        },
    )

    op.alter_column("fair_stand_item_type", "placement", nullable=False)
    op.alter_column("fair_stand_item_type", "collision", nullable=False)
    op.alter_column("fair_stand_item_type", "move_snap_cm", nullable=False)

    op.create_check_constraint(
        "ck_fair_stand_item_type_placement",
        "fair_stand_item_type",
        f"placement IN {_PLACEMENT_IN}",
    )
    op.create_check_constraint(
        "ck_fair_stand_item_type_collision",
        "fair_stand_item_type",
        f"collision IN {_COLLISION_IN}",
    )
    op.create_check_constraint(
        "ck_fair_stand_item_type_move_snap_cm",
        "fair_stand_item_type",
        "move_snap_cm > 0",
    )


def downgrade() -> None:
    op.drop_constraint("ck_fair_stand_item_type_move_snap_cm", "fair_stand_item_type", type_="check")
    op.drop_constraint("ck_fair_stand_item_type_collision", "fair_stand_item_type", type_="check")
    op.drop_constraint("ck_fair_stand_item_type_placement", "fair_stand_item_type", type_="check")
    op.drop_column("fair_stand_item_type", "move_snap_cm")
    op.drop_column("fair_stand_item_type", "collision")
    op.drop_column("fair_stand_item_type", "placement")
