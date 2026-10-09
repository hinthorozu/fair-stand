"""Price the metal separator by square metre.

Revision ID: 0066_metal_separator_area
Revises: 0065_metal_separator

The item stays out of the design catalog. Cost can be assigned because
is_cost_enabled is on and the unit is metre_kare. A converted panel
block bills one width by height, not one piece per panel.
"""

import sqlalchemy as sa
from alembic import op


revision = "0066_metal_separator_area"
down_revision = "0065_metal_separator"
branch_labels = None
depends_on = None

_ITEM_KEY = "metal_separator"


def upgrade() -> None:
    bind = op.get_bind()
    bind.execute(
        sa.text(
            """
            UPDATE fair_stand_items
            SET unit = 'metre_kare',
                is_cost_enabled = true,
                catalog_visible = false
            WHERE item_key = :item_key
            """
        ),
        {"item_key": _ITEM_KEY},
    )


def downgrade() -> None:
    bind = op.get_bind()
    bind.execute(
        sa.text(
            """
            UPDATE fair_stand_items
            SET unit = 'adet',
                is_cost_enabled = false,
                catalog_visible = false
            WHERE item_key = :item_key
            """
        ),
        {"item_key": _ITEM_KEY},
    )
