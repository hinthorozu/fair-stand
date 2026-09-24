"""Move overlap_with_types JSON → fair_stand_item_type_overlap FK junction.

Revision ID: 0033_item_type_overlap_fk
Revises: 0032_item_type_behavior_s3
"""

from __future__ import annotations

import json

import sqlalchemy as sa
from alembic import op

revision = "0033_item_type_overlap_fk"
down_revision = "0032_item_type_behavior_s3"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    op.create_table(
        "fair_stand_item_type_overlap",
        sa.Column("item_type_id", sa.Integer(), nullable=False),
        sa.Column("overlap_item_type_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["item_type_id"],
            ["fair_stand_item_type.id"],
            name="fk_fair_stand_item_type_overlap_src",
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["overlap_item_type_id"],
            ["fair_stand_item_type.id"],
            name="fk_fair_stand_item_type_overlap_tgt",
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        sa.PrimaryKeyConstraint(
            "item_type_id",
            "overlap_item_type_id",
            name="pk_fair_stand_item_type_overlap",
        ),
        sa.CheckConstraint(
            "item_type_id <> overlap_item_type_id",
            name="ck_fair_stand_item_type_overlap_not_self",
        ),
    )
    op.create_index(
        "ix_fair_stand_item_type_overlap_target",
        "fair_stand_item_type_overlap",
        ["overlap_item_type_id"],
    )

    rows = bind.execute(
        sa.text("SELECT id, key, overlap_with_types FROM fair_stand_item_type")
    ).mappings().all()
    by_key = {row["key"]: int(row["id"]) for row in rows}
    insert_rows: list[dict[str, int]] = []
    missing: list[str] = []
    for row in rows:
        raw = row["overlap_with_types"]
        if raw is None:
            continue
        if isinstance(raw, str):
            keys = json.loads(raw)
        else:
            keys = list(raw)
        src_id = int(row["id"])
        for key in keys:
            text = str(key).strip()
            if not text:
                continue
            tgt_id = by_key.get(text)
            if tgt_id is None:
                missing.append(f"{row['key']}→{text}")
                continue
            if tgt_id == src_id:
                continue
            insert_rows.append(
                {"item_type_id": src_id, "overlap_item_type_id": tgt_id}
            )
    if missing:
        raise RuntimeError(
            "overlap_with_types bilinmeyen tip key (FK taşınamaz): " + ", ".join(missing)
        )

    # Deduplicate while preserving order.
    seen: set[tuple[int, int]] = set()
    unique_rows: list[dict[str, int]] = []
    for item in insert_rows:
        pair = (item["item_type_id"], item["overlap_item_type_id"])
        if pair in seen:
            continue
        seen.add(pair)
        unique_rows.append(item)
    if unique_rows:
        bind.execute(
            sa.text(
                """
                INSERT INTO fair_stand_item_type_overlap (item_type_id, overlap_item_type_id)
                VALUES (:item_type_id, :overlap_item_type_id)
                """
            ),
            unique_rows,
        )

    op.drop_column("fair_stand_item_type", "overlap_with_types")


def downgrade() -> None:
    from sqlalchemy.dialects.postgresql import JSONB

    bind = op.get_bind()
    op.add_column(
        "fair_stand_item_type",
        sa.Column("overlap_with_types", JSONB(astext_type=sa.Text()), nullable=True),
    )
    pairs = bind.execute(
        sa.text(
            """
            SELECT src.key AS src_key, tgt.key AS tgt_key
            FROM fair_stand_item_type_overlap o
            JOIN fair_stand_item_type src ON src.id = o.item_type_id
            JOIN fair_stand_item_type tgt ON tgt.id = o.overlap_item_type_id
            ORDER BY src.key, tgt.key
            """
        )
    ).mappings().all()
    by_src: dict[str, list[str]] = {}
    for row in pairs:
        by_src.setdefault(row["src_key"], []).append(row["tgt_key"])
    for src_key, keys in by_src.items():
        bind.execute(
            sa.text(
                """
                UPDATE fair_stand_item_type
                SET overlap_with_types = CAST(:overlap AS jsonb)
                WHERE key = :key
                """
            ),
            {"key": src_key, "overlap": json.dumps(keys)},
        )
    bind.execute(
        sa.text(
            """
            UPDATE fair_stand_item_type
            SET overlap_with_types = CAST('[]' AS jsonb)
            WHERE overlap_with_types IS NULL
            """
        )
    )
    op.alter_column("fair_stand_item_type", "overlap_with_types", nullable=False)
    op.drop_index("ix_fair_stand_item_type_overlap_target", table_name="fair_stand_item_type_overlap")
    op.drop_table("fair_stand_item_type_overlap")
