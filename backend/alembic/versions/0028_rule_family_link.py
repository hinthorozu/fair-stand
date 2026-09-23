"""Link fair_stand_rule ↔ fair_stand_family (M:N).

Revision ID: 0028_rule_family_link
Revises: 0027_drop_rule_mount_mode
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0028_rule_family_link"
down_revision = "0027_drop_rule_mount_mode"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    tables = set(sa.inspect(bind).get_table_names())
    if "fair_stand_rule_family" in tables:
        return
    op.create_table(
        "fair_stand_rule_family",
        sa.Column("rule_id", sa.Integer(), nullable=False),
        sa.Column("family_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["rule_id"],
            ["fair_stand_rule.id"],
            name="fk_fair_stand_rule_family_rule_id",
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        sa.ForeignKeyConstraint(
            ["family_id"],
            ["fair_stand_family.id"],
            name="fk_fair_stand_rule_family_family_id",
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        sa.PrimaryKeyConstraint("rule_id", "family_id", name="pk_fair_stand_rule_family"),
    )
    op.create_index("ix_fair_stand_rule_family_family_id", "fair_stand_rule_family", ["family_id"])

    # Seed links: top-rail → profile; shelf-rail → panel + separator-panel
    op.execute(
        sa.text(
            """
            INSERT INTO fair_stand_rule_family (rule_id, family_id)
            SELECT r.id, f.id
            FROM fair_stand_rule r
            JOIN fair_stand_rule_type rt ON rt.id = r.rule_type_id AND rt.key = 'snap'
            JOIN fair_stand_family f ON f.key = 'profile'
            WHERE r.key = 'top-rail'
            ON CONFLICT DO NOTHING
            """
        )
    )
    op.execute(
        sa.text(
            """
            INSERT INTO fair_stand_rule_family (rule_id, family_id)
            SELECT r.id, f.id
            FROM fair_stand_rule r
            JOIN fair_stand_rule_type rt ON rt.id = r.rule_type_id AND rt.key = 'snap'
            JOIN fair_stand_family f ON f.key IN ('panel', 'separator-panel')
            WHERE r.key = 'shelf-rail'
            ON CONFLICT DO NOTHING
            """
        )
    )


def downgrade() -> None:
    bind = op.get_bind()
    tables = set(sa.inspect(bind).get_table_names())
    if "fair_stand_rule_family" not in tables:
        return
    op.drop_index("ix_fair_stand_rule_family_family_id", table_name="fair_stand_rule_family")
    op.drop_table("fair_stand_rule_family")
