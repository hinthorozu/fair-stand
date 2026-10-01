"""Rename wall-short display names to Tek Sıra / Çift Sıra.

Revision ID: 0048_wall_short_display_names
Revises: 0047_rename_wall_short_keys

item_key and variant stay. Only fair_stand_items.name changes.
wall-short-1 is Tek Sıra. wall-short-2 is Çift Sıra.
"""

from alembic import op
import sqlalchemy as sa


revision = "0048_wall_short_display_names"
down_revision = "0047_rename_wall_short_keys"
branch_labels = None
depends_on = None

# item_key, previous name from 0047, canonical display name
_ROWS = (
    ("wall_200_short_1", "Panel 200 Short 1", "Panel 200 Kısa Tek Sıra"),
    ("wall_150_short_1", "Panel 150 Short 1", "Panel 150 Kısa Tek Sıra"),
    ("wall_100_short_1", "Panel 100 Short 1", "Panel 100 Kısa Tek Sıra"),
    ("wall_50_short_1", "Panel 50 Short 1", "Panel 50 Kısa Tek Sıra"),
    ("wall_200_short_2", "Panel 200 Short 2", "Panel 200 Kısa Çift Sıra"),
    ("wall_150_short_2", "Panel 150 Short 2", "Panel 150 Kısa Çift Sıra"),
    ("wall_100_short_2", "Panel 100 Short 2", "Panel 100 Kısa Çift Sıra"),
    ("wall_50_short_2", "Panel 50 Short 2", "Panel 50 Kısa Çift Sıra"),
)


def _apply(forward: bool) -> None:
    conn = op.get_bind()
    for item_key, previous_name, display_name in _ROWS:
        source = previous_name if forward else display_name
        target = display_name if forward else previous_name
        conn.execute(
            sa.text(
                "UPDATE fair_stand_items SET name = :target "
                "WHERE item_key = :item_key AND name = :source"
            ),
            {"item_key": item_key, "source": source, "target": target},
        )


def upgrade() -> None:
    _apply(True)


def downgrade() -> None:
    _apply(False)
