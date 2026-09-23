from sqlalchemy import create_engine, text

from app.core.config import get_settings

engine = create_engine(get_settings().database_url)
with engine.connect() as conn:
    for key in ("panel_197", "upright_346_5", "profile_190", "shelf_100"):
        row = conn.execute(
            text(
                "SELECT width_cm, height_cm, depth_cm "
                "FROM fair_stand_item_dimensions WHERE item_key = :k"
            ),
            {"k": key},
        ).mappings().first()
        print(key, dict(row) if row else "MISSING")
    missing = conn.execute(
        text(
            """
            SELECT COUNT(*) FROM fair_stand_item_dimensions
            WHERE width_cm IS NULL AND height_cm IS NULL AND depth_cm IS NULL
            """
        )
    ).scalar()
    print("rows_missing_wh_d", missing)
