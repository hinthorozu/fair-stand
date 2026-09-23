"""stand.family + rule_type + rule; item selects family and snap rule FKs.

Revision ID: 0024_item_snap_capability
Revises: 0023_restore_stand_frame_columns
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

from app.modules.fair_stand.infrastructure.item_snap_seed import (
    RULE_TYPE_SNAP,
    _INITIAL_FAMILIES,
    _INITIAL_RULES,
    bind_item_snap_fks,
)

revision = "0024_item_snap_capability"
down_revision = "0023_restore_stand_frame_columns"
branch_labels = None
depends_on = None

FACES = ("front", "back", "top", "bottom", "left", "right")
EDGES = ("top", "bottom", "left", "right")
MOUNT_MODES = ("face-edge", "panel-seam")

_LEGACY_CAPS = (
    "ck_fair_stand_items_snap_capability_xor",
    "ck_fair_stand_items_snap_provides_face_edge",
    "ck_fair_stand_items_snap_face",
    "ck_fair_stand_items_snap_edge",
)
_LEGACY_COLS = ("snap_requires", "snap_provides", "snap_face", "snap_edge")


def _item_columns() -> set[str]:
    bind = op.get_bind()
    return {c["name"] for c in sa.inspect(bind).get_columns("fair_stand_items")}


def _drop_legacy_string_capability() -> None:
    cols = _item_columns()
    if not any(name in cols for name in _LEGACY_COLS):
        return
    for name in _LEGACY_CAPS:
        try:
            op.drop_constraint(name, "fair_stand_items", type_="check")
        except Exception:
            pass
    for col in _LEGACY_COLS:
        if col in cols:
            op.drop_column("fair_stand_items", col)


def upgrade() -> None:
    _drop_legacy_string_capability()

    op.create_table(
        "fair_stand_family",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("code", sa.String(64), nullable=False),
        sa.Column("display_name", sa.String(128), nullable=False),
        sa.Column("sort_index", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("code", name="uq_fair_stand_family_code"),
    )

    op.create_table(
        "fair_stand_rule_type",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("code", sa.String(64), nullable=False),
        sa.Column("display_name", sa.String(128), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("code", name="uq_fair_stand_rule_type_code"),
    )

    op.create_table(
        "fair_stand_rule",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("rule_type_id", sa.Integer(), sa.ForeignKey("fair_stand_rule_type.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("code", sa.String(64), nullable=False),
        sa.Column("display_name", sa.String(128), nullable=False),
        sa.Column("face", sa.String(16), nullable=True),
        sa.Column("edge", sa.String(16), nullable=True),
        sa.Column("mount_mode", sa.String(32), nullable=True),
        sa.Column("sort_index", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("rule_type_id", "code", name="uq_fair_stand_rule_type_id_code"),
        sa.CheckConstraint(
            f"face IS NULL OR face IN {FACES}",
            name="ck_fair_stand_rule_face",
        ),
        sa.CheckConstraint(
            f"edge IS NULL OR edge IN {EDGES}",
            name="ck_fair_stand_rule_edge",
        ),
        sa.CheckConstraint(
            f"mount_mode IS NULL OR mount_mode IN {MOUNT_MODES}",
            name="ck_fair_stand_rule_mount_mode",
        ),
        sa.CheckConstraint(
            "(face IS NULL) = (edge IS NULL)",
            name="ck_fair_stand_rule_face_edge_pair",
        ),
    )

    op.add_column(
        "fair_stand_items",
        sa.Column("family_id", sa.Integer(), sa.ForeignKey("fair_stand_family.id", ondelete="SET NULL"), nullable=True),
    )
    op.add_column(
        "fair_stand_items",
        sa.Column(
            "snap_requires_rule_id",
            sa.Integer(),
            sa.ForeignKey("fair_stand_rule.id", ondelete="SET NULL"),
            nullable=True,
        ),
    )
    op.add_column(
        "fair_stand_items",
        sa.Column(
            "snap_provides_rule_id",
            sa.Integer(),
            sa.ForeignKey("fair_stand_rule.id", ondelete="SET NULL"),
            nullable=True,
        ),
    )
    op.create_check_constraint(
        "ck_fair_stand_items_snap_rule_xor",
        "fair_stand_items",
        "snap_requires_rule_id IS NULL OR snap_provides_rule_id IS NULL",
    )
    op.create_index("ix_fair_stand_items_family_id", "fair_stand_items", ["family_id"])
    op.create_index("ix_fair_stand_items_snap_requires_rule_id", "fair_stand_items", ["snap_requires_rule_id"])
    op.create_index("ix_fair_stand_items_snap_provides_rule_id", "fair_stand_items", ["snap_provides_rule_id"])

    bind = op.get_bind()
    now = sa.func.now()
    bind.execute(
        sa.text(
            """
            INSERT INTO fair_stand_rule_type (code, display_name, is_active, created_at, updated_at)
            VALUES (:code, :name, TRUE, NOW(), NOW())
            """
        ),
        {"code": RULE_TYPE_SNAP, "name": "Snap"},
    )
    rule_type_id = bind.execute(
        sa.text("SELECT id FROM fair_stand_rule_type WHERE code = :code"),
        {"code": RULE_TYPE_SNAP},
    ).scalar_one()

    families: dict[str, int] = {}
    for code, name, sort_index in _INITIAL_FAMILIES:
        bind.execute(
            sa.text(
                """
                INSERT INTO fair_stand_family (code, display_name, sort_index, is_active, created_at, updated_at)
                VALUES (:code, :name, :sort_index, TRUE, NOW(), NOW())
                """
            ),
            {"code": code, "name": name, "sort_index": sort_index},
        )
        families[code] = bind.execute(
            sa.text("SELECT id FROM fair_stand_family WHERE code = :code"),
            {"code": code},
        ).scalar_one()

    rules: dict[str, int] = {}
    for code, name, face, edge, mount_mode, sort_index in _INITIAL_RULES:
        bind.execute(
            sa.text(
                """
                INSERT INTO fair_stand_rule
                  (rule_type_id, code, display_name, face, edge, mount_mode, sort_index, is_active, created_at, updated_at)
                VALUES
                  (:rule_type_id, :code, :name, :face, :edge, :mount_mode, :sort_index, TRUE, NOW(), NOW())
                """
            ),
            {
                "rule_type_id": rule_type_id,
                "code": code,
                "name": name,
                "face": face,
                "edge": edge,
                "mount_mode": mount_mode,
                "sort_index": sort_index,
            },
        )
        rules[code] = bind.execute(
            sa.text(
                "SELECT id FROM fair_stand_rule WHERE rule_type_id = :tid AND code = :code"
            ),
            {"tid": rule_type_id, "code": code},
        ).scalar_one()

    _ = now
    bind_item_snap_fks(bind, families=families, rules=rules)


def downgrade() -> None:
    op.drop_constraint("ck_fair_stand_items_snap_rule_xor", "fair_stand_items", type_="check")
    op.drop_index("ix_fair_stand_items_snap_provides_rule_id", table_name="fair_stand_items")
    op.drop_index("ix_fair_stand_items_snap_requires_rule_id", table_name="fair_stand_items")
    op.drop_index("ix_fair_stand_items_family_id", table_name="fair_stand_items")
    op.drop_column("fair_stand_items", "snap_provides_rule_id")
    op.drop_column("fair_stand_items", "snap_requires_rule_id")
    op.drop_column("fair_stand_items", "family_id")
    op.drop_table("fair_stand_rule")
    op.drop_table("fair_stand_rule_type")
    op.drop_table("fair_stand_family")
