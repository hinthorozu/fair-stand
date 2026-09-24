"""Add kesit 3 behavior cols to fair_stand_item_type.

Revision ID: 0032_item_type_behavior_s3
Revises: 0031_item_type_behavior_s2
"""

from __future__ import annotations

import json

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB

from app.modules.fair_stand.infrastructure.item_type_behavior_seed import (
    DEFAULT_BOUNDARY_SNAP,
    DEFAULT_COLLISION_DEPTH,
    DEFAULT_COLLISION_HEIGHT,
    DEFAULT_CONNECTION_ENDPOINT,
    DEFAULT_ENDPOINT_CONTACT,
    DEFAULT_GHOST_KIND,
    DEFAULT_GHOST_OPACITY,
    DEFAULT_GHOST_RENDERER,
    TYPE_BEHAVIOR_SLICE3,
)

revision = "0032_item_type_behavior_s3"
down_revision = "0031_item_type_behavior_s2"
branch_labels = None
depends_on = None

_ENDPOINT_IN = ("segment", "logical-fixture")
_DEPTH_IN = ("physical", "wall-backbone")
_CONTACT_IN = ("standard", "thin-wall-endpoint")
_BOUNDARY_IN = ("stand-edge", "wall-inner-face")
_HEIGHT_IN = ("full",)


def _sql_in(values: tuple[str, ...]) -> str:
    return "(" + ", ".join(f"'{value}'" for value in values) + ")"


def upgrade() -> None:
    bind = op.get_bind()
    cols = {c["name"] for c in sa.inspect(bind).get_columns("fair_stand_item_type")}
    json_type = JSONB().with_variant(sa.JSON(), "sqlite")

    additions = [
        ("connection_endpoint", sa.Column("connection_endpoint", sa.String(32), nullable=True)),
        ("collision_depth", sa.Column("collision_depth", sa.String(32), nullable=True)),
        ("endpoint_contact", sa.Column("endpoint_contact", sa.String(32), nullable=True)),
        ("boundary_snap", sa.Column("boundary_snap", sa.String(32), nullable=True)),
        ("collision_height", sa.Column("collision_height", sa.String(16), nullable=True)),
        ("overlap_with_types", sa.Column("overlap_with_types", json_type, nullable=True)),
        ("ghost_kind", sa.Column("ghost_kind", sa.String(32), nullable=True)),
        ("ghost_renderer", sa.Column("ghost_renderer", sa.String(64), nullable=True)),
        ("ghost_opacity", sa.Column("ghost_opacity", sa.Numeric(4, 3), nullable=True)),
    ]
    for name, column in additions:
        if name not in cols:
            op.add_column("fair_stand_item_type", column)

    for key, row in TYPE_BEHAVIOR_SLICE3.items():
        (
            connection_endpoint,
            collision_depth,
            endpoint_contact,
            boundary_snap,
            collision_height,
            overlap,
            ghost_kind,
            ghost_renderer,
            ghost_opacity,
        ) = row
        bind.execute(
            sa.text(
                """
                UPDATE fair_stand_item_type
                SET connection_endpoint = :connection_endpoint,
                    collision_depth = :collision_depth,
                    endpoint_contact = :endpoint_contact,
                    boundary_snap = :boundary_snap,
                    collision_height = :collision_height,
                    overlap_with_types = CAST(:overlap AS jsonb),
                    ghost_kind = :ghost_kind,
                    ghost_renderer = :ghost_renderer,
                    ghost_opacity = :ghost_opacity,
                    updated_at = NOW()
                WHERE key = :key
                """
            ),
            {
                "key": key,
                "connection_endpoint": connection_endpoint,
                "collision_depth": collision_depth,
                "endpoint_contact": endpoint_contact,
                "boundary_snap": boundary_snap,
                "collision_height": collision_height,
                "overlap": json.dumps(list(overlap)),
                "ghost_kind": ghost_kind,
                "ghost_renderer": ghost_renderer,
                "ghost_opacity": str(ghost_opacity),
            },
        )

    bind.execute(
        sa.text(
            """
            UPDATE fair_stand_item_type
            SET connection_endpoint = COALESCE(connection_endpoint, :connection_endpoint),
                collision_depth = COALESCE(collision_depth, :collision_depth),
                endpoint_contact = COALESCE(endpoint_contact, :endpoint_contact),
                boundary_snap = COALESCE(boundary_snap, :boundary_snap),
                collision_height = COALESCE(collision_height, :collision_height),
                overlap_with_types = COALESCE(overlap_with_types, CAST('[]' AS jsonb)),
                ghost_kind = COALESCE(ghost_kind, :ghost_kind),
                ghost_renderer = COALESCE(ghost_renderer, :ghost_renderer),
                ghost_opacity = COALESCE(ghost_opacity, :ghost_opacity),
                updated_at = NOW()
            WHERE connection_endpoint IS NULL
               OR collision_depth IS NULL
               OR endpoint_contact IS NULL
               OR boundary_snap IS NULL
               OR collision_height IS NULL
               OR overlap_with_types IS NULL
               OR ghost_kind IS NULL
               OR ghost_renderer IS NULL
               OR ghost_opacity IS NULL
            """
        ),
        {
            "connection_endpoint": DEFAULT_CONNECTION_ENDPOINT,
            "collision_depth": DEFAULT_COLLISION_DEPTH,
            "endpoint_contact": DEFAULT_ENDPOINT_CONTACT,
            "boundary_snap": DEFAULT_BOUNDARY_SNAP,
            "collision_height": DEFAULT_COLLISION_HEIGHT,
            "ghost_kind": DEFAULT_GHOST_KIND,
            "ghost_renderer": DEFAULT_GHOST_RENDERER,
            "ghost_opacity": str(DEFAULT_GHOST_OPACITY),
        },
    )

    for col in (
        "connection_endpoint",
        "collision_depth",
        "endpoint_contact",
        "boundary_snap",
        "collision_height",
        "overlap_with_types",
        "ghost_kind",
        "ghost_renderer",
        "ghost_opacity",
    ):
        op.alter_column("fair_stand_item_type", col, nullable=False)

    op.create_check_constraint(
        "ck_fair_stand_item_type_connection_endpoint",
        "fair_stand_item_type",
        f"connection_endpoint IN {_sql_in(_ENDPOINT_IN)}",
    )
    op.create_check_constraint(
        "ck_fair_stand_item_type_collision_depth",
        "fair_stand_item_type",
        f"collision_depth IN {_sql_in(_DEPTH_IN)}",
    )
    op.create_check_constraint(
        "ck_fair_stand_item_type_endpoint_contact",
        "fair_stand_item_type",
        f"endpoint_contact IN {_sql_in(_CONTACT_IN)}",
    )
    op.create_check_constraint(
        "ck_fair_stand_item_type_boundary_snap",
        "fair_stand_item_type",
        f"boundary_snap IN {_sql_in(_BOUNDARY_IN)}",
    )
    op.create_check_constraint(
        "ck_fair_stand_item_type_collision_height",
        "fair_stand_item_type",
        f"collision_height IN {_sql_in(_HEIGHT_IN)}",
    )
    op.create_check_constraint(
        "ck_fair_stand_item_type_ghost_opacity",
        "fair_stand_item_type",
        "ghost_opacity >= 0 AND ghost_opacity <= 1",
    )


def downgrade() -> None:
    for name in (
        "ck_fair_stand_item_type_ghost_opacity",
        "ck_fair_stand_item_type_collision_height",
        "ck_fair_stand_item_type_boundary_snap",
        "ck_fair_stand_item_type_endpoint_contact",
        "ck_fair_stand_item_type_collision_depth",
        "ck_fair_stand_item_type_connection_endpoint",
    ):
        op.drop_constraint(name, "fair_stand_item_type", type_="check")
    for col in (
        "ghost_opacity",
        "ghost_renderer",
        "ghost_kind",
        "overlap_with_types",
        "collision_height",
        "boundary_snap",
        "endpoint_contact",
        "collision_depth",
        "connection_endpoint",
    ):
        op.drop_column("fair_stand_item_type", col)
