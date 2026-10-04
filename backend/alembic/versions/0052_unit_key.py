"""Rename fair_stand_units.code to unit_key.

Revision ID: 0052_unit_key
Revises: 0051_unit_catalog

Column rename only. Existing rows stay. Item.unit is not touched.
"""

from alembic import op


revision = "0052_unit_key"
down_revision = "0051_unit_catalog"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.batch_alter_table("fair_stand_units") as batch:
        batch.alter_column("code", new_column_name="unit_key")
    with op.batch_alter_table("fair_stand_units") as batch:
        batch.drop_constraint("uq_fair_stand_units_code", type_="unique")
        batch.create_unique_constraint("uq_fair_stand_units_unit_key", ["unit_key"])
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        op.execute(
            "ALTER TABLE fair_stand_units RENAME CONSTRAINT "
            "fair_stand_units_code_not_null TO fair_stand_units_unit_key_not_null"
        )


def downgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        op.execute(
            "ALTER TABLE fair_stand_units RENAME CONSTRAINT "
            "fair_stand_units_unit_key_not_null TO fair_stand_units_code_not_null"
        )
    with op.batch_alter_table("fair_stand_units") as batch:
        batch.drop_constraint("uq_fair_stand_units_unit_key", type_="unique")
        batch.create_unique_constraint("uq_fair_stand_units_code", ["unit_key"])
    with op.batch_alter_table("fair_stand_units") as batch:
        batch.alter_column("unit_key", new_column_name="code")
