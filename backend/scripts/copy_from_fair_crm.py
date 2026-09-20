"""Copy fair_stand_* rows from fair_crm into fair_stand. No reseed, no DROP of source."""

from sqlalchemy import MetaData, create_engine, text

SRC = "postgresql+psycopg2://postgres:postgres@127.0.0.1:5432/fair_crm"
DST = "postgresql+psycopg2://postgres:postgres@127.0.0.1:5432/fair_stand"
TABLES = (
    "fair_stand_categories",
    "fair_stand_catalog_preview_kinds",
    "fair_stand_items",
    "fair_stand_item_dimensions",
    "fair_stand_item_scene_dimensions",
    "fair_stand_item_strip_occupancy",
    "fair_stand_item_assets",
    "fair_stand_item_components",
    "fair_stand_item_video_walls",
    "fair_stand_item_body_parts",
)


def main() -> None:
    src = create_engine(SRC)
    dst = create_engine(DST)
    src_meta = MetaData()
    dst_meta = MetaData()
    src_meta.reflect(bind=src, only=TABLES)
    dst_meta.reflect(bind=dst, only=TABLES)
    with dst.begin() as conn:
        conn.execute(text("SET session_replication_role = replica"))
        for name in reversed(TABLES):
            conn.execute(text(f'TRUNCATE TABLE "{name}" CASCADE'))
        conn.execute(text("SET session_replication_role = origin"))
        for name in TABLES:
            rows = src.connect().execute(src_meta.tables[name].select()).mappings().all()
            if not rows:
                print(name, 0)
                continue
            conn.execute(dst_meta.tables[name].insert(), [dict(row) for row in rows])
            print(name, len(rows))
    with src.connect() as a, dst.connect() as b:
        src_keys = {row[0] for row in a.execute(text("SELECT item_key FROM fair_stand_items"))}
        dst_keys = {row[0] for row in b.execute(text("SELECT item_key FROM fair_stand_items"))}
        print("item_keys_match", src_keys == dst_keys, "count", len(dst_keys))


if __name__ == "__main__":
    main()
