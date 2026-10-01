"""Rename short-up wall item keys and variants to wall-short.

Revision ID: 0047_rename_wall_short_keys
Revises: 0046_project_revisions

FK columns use ON UPDATE CASCADE from fair_stand_items.item_key.
Project and revision payloads are not rewritten. Legacy item keys are
canonicalized when a project is loaded.

Fresh installs load the historical catalog dump (old keys, null scene
height). 0008 fills pose from the variant names that existed then.
This revision renames those rows and writes the same scene height and
default Z the pose seed assigns to wall-short-1 / wall-short-2.
"""

from alembic import op
import sqlalchemy as sa


revision = "0047_rename_wall_short_keys"
down_revision = "0046_project_revisions"
branch_labels = None
depends_on = None

# old_key, new_key, old_variant, new_variant, old_name, new_name, height_cm, default_z_cm
_ROWS = (
    ("wall_200_short_up_1", "wall_200_short_1", "short-up-1", "wall-short-1", "Panel 200 Short Up 1", "Panel 200 Short 1", 50, 300),
    ("wall_150_short_up_1", "wall_150_short_1", "short-up-1", "wall-short-1", "Panel 150 Short Up 1", "Panel 150 Short 1", 50, 300),
    ("wall_100_short_up_1", "wall_100_short_1", "short-up-1", "wall-short-1", "Panel 100 Short Up 1", "Panel 100 Short 1", 50, 300),
    ("wall_50_short_up_1", "wall_50_short_1", "short-up-1", "wall-short-1", "Panel 50 Short Up 1", "Panel 50 Short 1", 50, 300),
    ("wall_200_short_up_2", "wall_200_short_2", "short-up-2", "wall-short-2", "Panel 200 Short Up 2", "Panel 200 Short 2", 100, 250),
    ("wall_150_short_up_2", "wall_150_short_2", "short-up-2", "wall-short-2", "Panel 150 Short Up 2", "Panel 150 Short 2", 100, 250),
    ("wall_100_short_up_2", "wall_100_short_2", "short-up-2", "wall-short-2", "Panel 100 Short Up 2", "Panel 100 Short 2", 100, 250),
    ("wall_50_short_up_2", "wall_50_short_2", "short-up-2", "wall-short-2", "Panel 50 Short Up 2", "Panel 50 Short 2", 100, 250),
)


def _apply(forward: bool) -> None:
    conn = op.get_bind()
    for old_key, new_key, old_variant, new_variant, old_name, new_name, height_cm, default_z_cm in _ROWS:
        source_key = old_key if forward else new_key
        target_key = new_key if forward else old_key
        variant = new_variant if forward else old_variant
        name = new_name if forward else old_name
        exists_source = conn.execute(
            sa.text("SELECT 1 FROM fair_stand_items WHERE item_key = :k"),
            {"k": source_key},
        ).scalar()
        if not exists_source:
            continue
        exists_target = conn.execute(
            sa.text("SELECT 1 FROM fair_stand_items WHERE item_key = :k"),
            {"k": target_key},
        ).scalar()
        if exists_target:
            raise RuntimeError(
                f"Cannot rename {source_key!r} → {target_key!r}: target key already exists."
            )
        conn.execute(
            sa.text(
                "UPDATE fair_stand_items "
                "SET item_key = :target, variant = :variant, name = :name, default_z_cm = :z "
                "WHERE item_key = :source"
            ),
            {
                "source": source_key,
                "target": target_key,
                "variant": variant,
                "name": name,
                "z": default_z_cm,
            },
        )
        updated = conn.execute(
            sa.text(
                "UPDATE fair_stand_item_scene_dimensions "
                "SET height_cm = :height WHERE item_key = :item_key"
            ),
            {"height": height_cm, "item_key": target_key},
        )
        if updated.rowcount == 0:
            conn.execute(
                sa.text(
                    "INSERT INTO fair_stand_item_scene_dimensions "
                    "(item_key, width_cm, depth_cm, height_cm) "
                    "VALUES (:item_key, NULL, 10, :height)"
                ),
                {"item_key": target_key, "height": height_cm},
            )


def upgrade() -> None:
    _apply(True)


def downgrade() -> None:
    _apply(False)
