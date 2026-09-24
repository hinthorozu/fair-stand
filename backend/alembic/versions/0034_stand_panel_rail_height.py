"""Add panel_rail_height_cm to fair_stand_dimensions (panel seam gap).

Revision ID: 0034_stand_panel_rail_height
Revises: 0033_item_type_overlap_fk
"""

from __future__ import annotations

import sqlalchemy as sa
from alembic import op

revision = "0034_stand_panel_rail_height"
down_revision = "0033_item_type_overlap_fk"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "fair_stand_dimensions",
        sa.Column(
            "panel_rail_height_cm",
            sa.Numeric(10, 3),
            nullable=False,
            server_default="0.4",
        ),
    )
    op.create_check_constraint(
        "ck_fair_stand_dimensions_panel_rail_height",
        "fair_stand_dimensions",
        "panel_rail_height_cm > 0",
    )
    op.alter_column("fair_stand_dimensions", "panel_rail_height_cm", server_default=None)


def downgrade() -> None:
    op.drop_constraint(
        "ck_fair_stand_dimensions_panel_rail_height",
        "fair_stand_dimensions",
        type_="check",
    )
    op.drop_column("fair_stand_dimensions", "panel_rail_height_cm")
