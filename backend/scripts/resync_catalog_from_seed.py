"""Replace fair_stand catalog rows from CATALOG_SEED (catalog tables only).

Does not drop projects, assets, stand envelope (fair_stand_dimensions if already set),
or runtime settings beyond what seed_fair_stand_catalog refreshes.
"""

from __future__ import annotations

from sqlalchemy import text

from app.db.session import SessionLocal
from app.modules.fair_stand.infrastructure.seed_catalog import seed_fair_stand_catalog


def main() -> None:
    session = SessionLocal()
    try:
        seed_fair_stand_catalog(session)
        session.commit()
        total = session.execute(text("SELECT COUNT(*) FROM fair_stand_items")).scalar_one()
        head = session.execute(text("SELECT version_num FROM alembic_version")).scalar_one()
        print(f"catalog reseed ok: items={total} alembic={head}")
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == "__main__":
    main()
