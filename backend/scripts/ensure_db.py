from sqlalchemy import create_engine, text

admin = create_engine("postgresql+psycopg2://postgres:postgres@127.0.0.1:5432/postgres", isolation_level="AUTOCOMMIT")
with admin.connect() as conn:
    exists = conn.execute(text("SELECT 1 FROM pg_database WHERE datname = 'fair_stand'")).scalar()
    if not exists:
        conn.execute(text("CREATE DATABASE fair_stand"))
        print("created fair_stand")
    else:
        print("fair_stand exists")
