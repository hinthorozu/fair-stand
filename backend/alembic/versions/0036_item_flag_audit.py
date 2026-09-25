"""Align item color flags with surfaces the scene actually paints.

Revision ID: 0036_item_flag_audit
Revises: 0035_item_surface_flags
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0036_item_flag_audit"
down_revision = "0035_item_surface_flags"
branch_labels = None
depends_on = None

# Scene audit: only furniture_table_chair_set_eames paints a user color among
# the rows that were still false. Kettle, fridge, coat rack, coffee table,
# glass table, and the single indoor plant do not.
_COLOR_ON = ("furniture_table_chair_set_eames",)
_COLOR_OFF = (
    "kettle",
    "mini_fridge_avanti",
    "coat_rack",
    "furniture_coffee_table_classic",
    "glass_table",
    "extra_indoor_plant_1",
)


def upgrade() -> None:
    conn = op.get_bind()
    for item_key in _COLOR_ON:
        conn.execute(
            sa.text(
                "UPDATE fair_stand_items SET accepts_color = true WHERE item_key = :item_key"
            ),
            {"item_key": item_key},
        )
    for item_key in _COLOR_OFF:
        conn.execute(
            sa.text(
                "UPDATE fair_stand_items SET accepts_color = false WHERE item_key = :item_key"
            ),
            {"item_key": item_key},
        )


def downgrade() -> None:
    pass
