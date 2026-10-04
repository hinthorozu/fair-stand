"""Rename the mesh production item key.

Revision ID: 0056_mesh_fabric_key
Revises: 0055_item_unit_fk

mesh_print becomes mesh_fabric. Name, type, unit and flags stay.
"""

import sqlalchemy as sa
from alembic import op


revision = "0056_mesh_fabric_key"
down_revision = "0055_item_unit_fk"
branch_labels = None
depends_on = None

_OLD = "mesh_print"
_NEW = "mesh_fabric"


def _row(bind, item_key: str):
    return bind.execute(
        sa.text(
            """
            SELECT name, item_type, unit, catalog_visible, is_render, is_active
            FROM fair_stand_items
            WHERE item_key = :item_key
            """
        ),
        {"item_key": item_key},
    ).mappings().first()


def _require_same_item(row, item_key: str) -> None:
    if row is None:
        raise RuntimeError(f"{item_key} item row is missing.")
    if (
        row["name"] != "Mesh Baskı"
        or row["item_type"] != "production"
        or row["unit"] != "metre_kare"
        or bool(row["catalog_visible"])
        or bool(row["is_render"])
        or not bool(row["is_active"])
    ):
        raise RuntimeError(f"{item_key} is not the unchanged Mesh Baskı production item.")


def _rename(old: str, new: str) -> None:
    bind = op.get_bind()
    source = _row(bind, old)
    target = _row(bind, new)
    if source is not None and target is not None:
        raise RuntimeError(f"Both {old} and {new} exist.")
    if source is not None:
        _require_same_item(source, old)
        bind.execute(
            sa.text("UPDATE fair_stand_items SET item_key = :new WHERE item_key = :old"),
            {"old": old, "new": new},
        )
        target = _row(bind, new)
    _require_same_item(target, new)
    if _row(bind, old) is not None:
        raise RuntimeError(f"{old} still exists after rename.")


def upgrade() -> None:
    _rename(_OLD, _NEW)


def downgrade() -> None:
    _rename(_NEW, _OLD)
