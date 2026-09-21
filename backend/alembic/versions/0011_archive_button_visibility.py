"""fair_stand_settings: export/import button visibility.

Revision ID: 0011_archive_button_visibility
Revises: 0010_fair_stand_settings
"""

from alembic import op
import sqlalchemy as sa

revision = "0011_archive_button_visibility"
down_revision = "0010_fair_stand_settings"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "fair_stand_settings",
        sa.Column(
            "export_button_visible",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
    )
    op.add_column(
        "fair_stand_settings",
        sa.Column(
            "import_button_visible",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
    )


def downgrade() -> None:
    op.drop_column("fair_stand_settings", "import_button_visible")
    op.drop_column("fair_stand_settings", "export_button_visible")
