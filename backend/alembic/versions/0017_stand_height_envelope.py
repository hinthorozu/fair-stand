"""Allow stand height_m as max envelope independent of strip grid.

Revision ID: 0017_stand_height_envelope
Revises: 0016_drop_connector_type
Create Date: 2026-09-22

"""

from alembic import op

revision = "0017_stand_height_envelope"
down_revision = "0016_drop_connector_type"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_constraint(
        "ck_fair_stand_dimensions_height_strips",
        "fair_stand_dimensions",
        type_="check",
    )


def downgrade() -> None:
    op.create_check_constraint(
        "ck_fair_stand_dimensions_height_strips",
        "fair_stand_dimensions",
        "height_m = strip_count * strip_height_m",
    )
