"""Replace fair_stand catalog rows from CATALOG_SEED (destructive to catalog tables only)."""

from __future__ import annotations

from sqlalchemy import text

from app.db.session import SessionLocal
from app.modules.fair_stand.infrastructure.seed_catalog import seed_fair_stand_catalog


def main() -> None:
    session = SessionLocal()
    try:
        before = session.execute(
            text(
                "SELECT item_key FROM fair_stand_items "
                "WHERE item_key IN ('wall_200', 'wall_200_350', 'door_100', 'wall_door_100_350')"
            )
        ).scalars().all()
        print("before:", list(before))
        seed_fair_stand_catalog(session)
        session.commit()
        after = session.execute(
            text(
                "SELECT item_key FROM fair_stand_items "
                "WHERE item_key IN ('wall_200', 'wall_200_350', 'door_100', 'wall_door_100_350')"
            )
        ).scalars().all()
        print("after:", list(after))
        head = session.execute(text("SELECT version_num FROM alembic_version")).scalar_one()
        print("alembic_version:", head)
        total = session.execute(text("SELECT COUNT(*) FROM fair_stand_items")).scalar_one()
        print("item_count:", total)
    finally:
        session.close()


if __name__ == "__main__":
    main()
