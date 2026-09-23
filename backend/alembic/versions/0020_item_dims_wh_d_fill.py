"""Backfill fair_stand_item_dimensions width/height/depth from length/thickness.

Revision ID: 0020_item_dims_wh_d_fill
Revises: 0019_drop_stand_strip_grid
Create Date: 2026-09-22

Historical: ran before 0021 drops length_cm/thickness_cm. Logic inlined for reproducibility.
"""

from alembic import op
import sqlalchemy as sa

revision = "0020_item_dims_wh_d_fill"
down_revision = "0019_drop_stand_strip_grid"
branch_labels = None
depends_on = None


def _fill(item_type: str, row: dict) -> dict:
    out = dict(row)
    w, h, d = out.get("width_cm"), out.get("height_cm"), out.get("depth_cm")
    length, thick = out.get("length_cm"), out.get("thickness_cm")

    def set_if_null(key, val):
        if out.get(key) is None and val is not None:
            out[key] = val

    if item_type == "upright":
        set_if_null("width_cm", thick)
        set_if_null("depth_cm", thick)
        set_if_null("height_cm", length)
    elif item_type == "profile":
        set_if_null("width_cm", length)
        set_if_null("depth_cm", thick)
        set_if_null("height_cm", thick)
    elif item_type in ("panel", "separator-panel", "video-wall-panel", "door-leaf"):
        set_if_null("depth_cm", thick)
    elif item_type == "shelf":
        set_if_null("width_cm", length)
        set_if_null("height_cm", thick)
    elif item_type in ("showcase-board", "showcase-accessory"):
        set_if_null("width_cm", length)
        set_if_null("height_cm", thick)
    elif item_type == "floor":
        set_if_null("width_cm", length)
        set_if_null("height_cm", thick)
    elif item_type in ("counter-top", "base-top"):
        set_if_null("height_cm", thick)
    return out


def upgrade() -> None:
    conn = op.get_bind()
    rows = conn.execute(
        sa.text(
            """
            SELECT i.item_type,
                   d.item_key,
                   d.width_cm,
                   d.height_cm,
                   d.depth_cm,
                   d.length_cm,
                   d.thickness_cm,
                   d.mount_height_cm,
                   d.wall_gap_cm
            FROM fair_stand_item_dimensions d
            JOIN fair_stand_items i ON i.item_key = d.item_key
            """
        )
    ).mappings()
    for row in rows:
        before = dict(row)
        after = _fill(row["item_type"], before)
        params = {"item_key": row["item_key"]}
        sets = []
        for col in ("width_cm", "height_cm", "depth_cm"):
            if before[col] is None and after[col] is not None:
                sets.append(f"{col} = :{col}")
                params[col] = after[col]
        if not sets:
            continue
        conn.execute(
            sa.text(
                f"UPDATE fair_stand_item_dimensions SET {', '.join(sets)} WHERE item_key = :item_key"
            ),
            params,
        )


def downgrade() -> None:
    pass
