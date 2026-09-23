"""Rename fair_stand_* catalog `code` columns to `key`.

Revision ID: 0026_snap_code_to_key
Revises: 0025_drop_rule_sort_index
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0026_snap_code_to_key"
down_revision = "0025_drop_rule_sort_index"
branch_labels = None
depends_on = None


def _rename_code_to_key(table: str, *, unique_old: str, unique_new: str, unique_cols: tuple[str, ...]) -> None:
    bind = op.get_bind()
    cols = {c["name"] for c in sa.inspect(bind).get_columns(table)}
    if "key" in cols:
        return
    if "code" not in cols:
        return
    op.drop_constraint(unique_old, table, type_="unique")
    op.alter_column(table, "code", new_column_name="key")
    op.create_unique_constraint(unique_new, table, list(unique_cols))


def _rename_key_to_code(table: str, *, unique_old: str, unique_new: str, unique_cols: tuple[str, ...]) -> None:
    bind = op.get_bind()
    cols = {c["name"] for c in sa.inspect(bind).get_columns(table)}
    if "code" in cols:
        return
    if "key" not in cols:
        return
    op.drop_constraint(unique_old, table, type_="unique")
    op.alter_column(table, "key", new_column_name="code")
    op.create_unique_constraint(unique_new, table, list(unique_cols))


def upgrade() -> None:
    _rename_code_to_key(
        "fair_stand_family",
        unique_old="uq_fair_stand_family_code",
        unique_new="uq_fair_stand_family_key",
        unique_cols=("key",),
    )
    _rename_code_to_key(
        "fair_stand_rule_type",
        unique_old="uq_fair_stand_rule_type_code",
        unique_new="uq_fair_stand_rule_type_key",
        unique_cols=("key",),
    )
    _rename_code_to_key(
        "fair_stand_rule",
        unique_old="uq_fair_stand_rule_type_id_code",
        unique_new="uq_fair_stand_rule_type_id_key",
        unique_cols=("rule_type_id", "key"),
    )


def downgrade() -> None:
    _rename_key_to_code(
        "fair_stand_rule",
        unique_old="uq_fair_stand_rule_type_id_key",
        unique_new="uq_fair_stand_rule_type_id_code",
        unique_cols=("rule_type_id", "code"),
    )
    _rename_key_to_code(
        "fair_stand_rule_type",
        unique_old="uq_fair_stand_rule_type_key",
        unique_new="uq_fair_stand_rule_type_code",
        unique_cols=("code",),
    )
    _rename_key_to_code(
        "fair_stand_family",
        unique_old="uq_fair_stand_family_key",
        unique_new="uq_fair_stand_family_code",
        unique_cols=("code",),
    )
