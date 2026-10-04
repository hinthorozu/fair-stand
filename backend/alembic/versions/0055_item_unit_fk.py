"""Bind fair_stand_items.unit to fair_stand_units.unit_key.

Revision ID: 0055_item_unit_fk
Revises: 0054_production_items

0051 opens an empty unit catalog. This revision inserts the canonical rows
adet and metre_kare when item data references them and the row is absent,
maps the verified legacy value m2 to metre_kare, then adds the foreign key.
An existing inactive metre_kare row is not reactivated. Any other unit value
stops the upgrade. Downgrade drops the key and leaves canonical values.
"""

import sqlalchemy as sa
from alembic import op


revision = "0055_item_unit_fk"
down_revision = "0054_production_items"
branch_labels = None
depends_on = None

_CANONICAL_UNITS = {
    "adet": ("Adet", "adet"),
    "metre_kare": ("Metre Kare", "m2"),
}


def _distinct(bind, statement: str) -> list[str]:
    return [row[0] for row in bind.execute(sa.text(statement)).fetchall()]


def _ensure_referenced_units(bind) -> None:
    referenced = set(
        _distinct(bind, "SELECT DISTINCT unit FROM fair_stand_items WHERE unit IS NOT NULL")
    )
    needed = set(referenced)
    if "m2" in needed:
        row = bind.execute(
            sa.text("SELECT is_active FROM fair_stand_units WHERE unit_key = 'metre_kare'")
        ).first()
        if row is not None and not bool(row[0]):
            raise RuntimeError(
                "m2 items cannot be mapped: fair_stand_units.unit_key metre_kare is missing or inactive."
            )
        needed.remove("m2")
        needed.add("metre_kare")
    for unit_key in sorted(needed & set(_CANONICAL_UNITS)):
        exists = bind.execute(
            sa.text("SELECT 1 FROM fair_stand_units WHERE unit_key = :unit_key"),
            {"unit_key": unit_key},
        ).first()
        if exists is not None:
            continue
        name, symbol = _CANONICAL_UNITS[unit_key]
        bind.execute(
            sa.text(
                """
                INSERT INTO fair_stand_units
                    (unit_key, name, symbol, is_active, created_at, updated_at)
                VALUES
                    (:unit_key, :name, :symbol, :is_active, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """
            ),
            {"unit_key": unit_key, "name": name, "symbol": symbol, "is_active": True},
        )


def upgrade() -> None:
    bind = op.get_bind()
    _ensure_referenced_units(bind)
    m2_count = bind.execute(
        sa.text("SELECT COUNT(*) FROM fair_stand_items WHERE unit = 'm2'")
    ).scalar_one()
    if m2_count:
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
