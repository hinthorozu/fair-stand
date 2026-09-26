"""Rename profil_*_screen item keys to profile_*_screen.

Revision ID: 0041_rename_profil_screen_keys
Revises: 0040_assembly_lock_group
"""

from alembic import op
import sqlalchemy as sa


revision = "0041_rename_profil_screen_keys"
down_revision = "0040_assembly_lock_group"
branch_labels = None
depends_on = None

# (old_key, new_key) — FK columns use ON UPDATE CASCADE from fair_stand_items.item_key.
_RENAMES = (
    ("profil_140_5_screen", "profile_140_5_screen"),
    ("profil_190_screen", "profile_190_screen"),
    ("profil_41_5_screen", "profile_41_5_screen"),
    ("profil_91_screen", "profile_91_screen"),
)


def _rename_item_keys(renames: tuple[tuple[str, str], ...]) -> None:
    conn = op.get_bind()
    for old_key, new_key in renames:
        exists_old = conn.execute(
            sa.text("SELECT 1 FROM fair_stand_items WHERE item_key = :k"),
            {"k": old_key},
        ).scalar()
        if not exists_old:
            continue
        exists_new = conn.execute(
            sa.text("SELECT 1 FROM fair_stand_items WHERE item_key = :k"),
            {"k": new_key},
        ).scalar()
        if exists_new:
            raise RuntimeError(
                f"Cannot rename {old_key!r} → {new_key!r}: target key already exists."
            )
        conn.execute(
            sa.text("UPDATE fair_stand_items SET item_key = :new WHERE item_key = :old"),
            {"old": old_key, "new": new_key},
        )
        # Stand project JSONB may embed itemKey strings (not FK-cascaded).
        conn.execute(
            sa.text(
                """
                UPDATE fair_stand_projects
                SET payload = replace(payload::text, :old, :new)::jsonb
                WHERE payload::text LIKE '%' || :old || '%'
                """
            ),
            {"old": old_key, "new": new_key},
        )


def upgrade() -> None:
    _rename_item_keys(_RENAMES)


def downgrade() -> None:
    _rename_item_keys(tuple((new, old) for old, new in _RENAMES))
