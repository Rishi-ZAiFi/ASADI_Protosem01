from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

import os

connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    if os.getenv("ALLOW_SQLITE", "0") != "1":
        raise RuntimeError("SQLite fallback is not allowed unless ALLOW_SQLITE=1 is set in the environment.")
    connect_args["check_same_thread"] = False
    connect_args["timeout"] = 60.0

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)

if settings.DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
