"""fair_stand_settings: save-as button visibility.

Revision ID: 0037_save_as_button
Revises: 0036_item_flag_audit
"""

from alembic import op
import sqlalchemy as sa

revision = "0037_save_as_button"
down_revision = "0036_item_flag_audit"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "fair_stand_settings",
        sa.Column(
            "save_as_button_visible",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
    )


def downgrade() -> None:
    op.drop_column("fair_stand_settings", "save_as_button_visible")
