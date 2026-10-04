"""Bind fair_stand_items.unit to fair_stand_units.unit_key.

Revision ID: 0055_item_unit_fk
Revises: 0054_production_items

Maps the verified legacy value m2 to metre_kare, then adds the foreign key.
Does not invent units. Downgrade drops the key and leaves canonical values.
"""

import sqlalchemy as sa
from alembic import op


revision = "0055_item_unit_fk"
down_revision = "0054_production_items"
branch_labels = None
depends_on = None


def _distinct(bind, statement: str) -> list[str]:
    return [row[0] for row in bind.execute(sa.text(statement)).fetchall()]


def upgrade() -> None:
    bind = op.get_bind()
    m2_count = bind.execute(
        sa.text("SELECT COUNT(*) FROM fair_stand_items WHERE unit = 'm2'")
    ).scalar_one()
    if m2_count:
        active = bind.execute(
            sa.text("SELECT is_active FROM fair_stand_units WHERE unit_key = 'metre_kare'")
        ).first()
        if active is None or not bool(active[0]):
            raise RuntimeError(
                "m2 items cannot be mapped: fair_stand_units.unit_key metre_kare is missing or inactive."
            )
        op.execute("UPDATE fair_stand_items SET unit = 'metre_kare' WHERE unit = 'm2'")

    missing = _distinct(
        bind,
        """
        SELECT DISTINCT unit
        FROM fair_stand_items
        WHERE unit IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM fair_stand_units AS units
            WHERE units.unit_key = fair_stand_items.unit
          )
        """,
    )
    if missing:
        raise RuntimeError(
            "Item unit values have no fair_stand_units.unit_key: " + ", ".join(sorted(missing))
        )

    with op.batch_alter_table("fair_stand_items") as batch:
        batch.alter_column(
            "unit",
            existing_type=sa.String(length=32),
            type_=sa.String(length=64),
            existing_nullable=True,
        )
        batch.create_foreign_key(
            "fk_fair_stand_items_unit_key",
            "fair_stand_units",
            ["unit"],
            ["unit_key"],
            onupdate="CASCADE",
            ondelete="RESTRICT",
        )


def downgrade() -> None:
    bind = op.get_bind()
    too_long = _distinct(
        bind,
        "SELECT DISTINCT unit FROM fair_stand_items WHERE unit IS NOT NULL AND length(unit) > 32",
    )
    if too_long:
        raise RuntimeError(
            "Downgrade blocked. Item unit values longer than 32 characters: "
            + ", ".join(sorted(too_long))
        )
    with op.batch_alter_table("fair_stand_items") as batch:
        batch.drop_constraint("fk_fair_stand_items_unit_key", type_="foreignkey")
        batch.alter_column(
            "unit",
            existing_type=sa.String(length=64),
            type_=sa.String(length=32),
            existing_nullable=True,
        )
