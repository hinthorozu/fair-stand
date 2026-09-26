"""Visible catalog item order: unique + contiguous 1..N per category."""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.fair_stand.infrastructure.models import FairStandItemModel


class CatalogItemOrderError(ValueError):
    def __init__(self, message: str, *, status_code: int = 400) -> None:
        super().__init__(message)
        self.status_code = status_code


def _visible_peers(session: Session, category_id: int, *, exclude_key: str | None = None) -> list[FairStandItemModel]:
    stmt = select(FairStandItemModel).where(
        FairStandItemModel.category_id == category_id,
        FairStandItemModel.catalog_visible.is_(True),
    )
    if exclude_key:
        stmt = stmt.where(FairStandItemModel.item_key != exclude_key)
    return list(session.scalars(stmt).all())


def _assign_indices(session: Session, ordered: list[FairStandItemModel]) -> None:
    """Two-phase write so partial unique (category_id, index) never clashes mid-shift."""
    for i, item in enumerate(ordered):
        item.catalog_item_index = -(i + 1)
    session.flush()
    for i, item in enumerate(ordered, start=1):
        item.catalog_item_index = i


def renumber_visible_category(session: Session, category_id: int) -> None:
    peers = _visible_peers(session, category_id)
    ordered = sorted(
        peers,
        key=lambda row: (row.catalog_item_index if row.catalog_item_index is not None else 10**9, row.item_key),
    )
    _assign_indices(session, ordered)


def assert_category_order(session: Session, category_id: int) -> None:
    peers = _visible_peers(session, category_id)
    indices = [int(row.catalog_item_index) for row in peers if row.catalog_item_index is not None]
    if len(indices) != len(peers):
        raise CatalogItemOrderError(
            "Katalogda görünür itemlerde katalog sırası zorunludur."
        )
    if len(set(indices)) != len(indices):
        raise CatalogItemOrderError(
            "Bu kategori içinde aynı katalog sırası zaten kullanılıyor.",
            status_code=409,
        )
    n = len(indices)
    if sorted(indices) != list(range(1, n + 1)):
        raise CatalogItemOrderError(
            f"Katalog sırası kategoride 1..{n} kesintisiz olmalıdır."
        )


def next_append_catalog_index(session: Session, category_id: int) -> int:
    """Visible peers için son indeks + 1 (boş kategoride 1)."""
    return len(_visible_peers(session, int(category_id))) + 1


def place_visible_item(
    session: Session,
    row: FairStandItemModel,
    *,
    category_id: int,
    catalog_item_index: int,
) -> None:
    """Insert/move ``row`` as visible at ``catalog_item_index`` (1..N+1), then renumber 1..N.

    Index above N+1 is clamped to append (N+1) so category moves keep working.
    """
    peers = _visible_peers(session, category_id, exclude_key=row.item_key)
    n = len(peers)
    target = int(catalog_item_index)
    if target < 1:
        raise CatalogItemOrderError("Katalog sırası 1’den küçük olamaz.")
    if target > n + 1:
        target = n + 1
    peers_sorted = sorted(
        peers,
        key=lambda peer: (peer.catalog_item_index if peer.catalog_item_index is not None else 10**9, peer.item_key),
    )
    ordered = peers_sorted[: target - 1] + [row] + peers_sorted[target - 1 :]
    row.catalog_visible = True
    row.category_id = category_id
    _assign_indices(session, ordered)
    assert_category_order(session, category_id)


def apply_catalog_item_order(
    session: Session,
    row: FairStandItemModel,
    *,
    catalog_visible: bool,
    category_id: int | None,
    catalog_item_index: int | None,
) -> None:
    """
    Apply visibility/category/index with unique + 1..N among visible peers.

    Hidden items keep whatever category/index the caller passes (stale OK); peers compact.
    """
    old_category_id = row.category_id
    was_visible = bool(row.catalog_visible)

    # Detach from visible order first so peers can compact without this row.
    row.catalog_visible = False
    if was_visible and old_category_id is not None:
        renumber_visible_category(session, int(old_category_id))

    row.category_id = int(category_id) if category_id is not None else None
    if catalog_item_index is not None:
        row.catalog_item_index = int(catalog_item_index)

    if not catalog_visible:
        row.catalog_visible = False
        # Hidden updates must not enforce 1..N on the category. Contiguous order is
        # only required when an item is (or becomes) catalog_visible=true.
        # Peers were already compacted above if this row was previously visible.
        return

    if category_id is None or catalog_item_index is None:
        raise CatalogItemOrderError(
            "Katalogda görünür itemlerde kategori, katalog sırası ve önizleme zorunludur."
        )
    place_visible_item(
        session,
        row,
        category_id=int(category_id),
        catalog_item_index=int(catalog_item_index),
    )
    if old_category_id is not None and int(old_category_id) != int(category_id) and was_visible:
        # Leaving a category as visible→moved: compact/validate the old category.
        renumber_visible_category(session, int(old_category_id))
        assert_category_order(session, int(old_category_id))
