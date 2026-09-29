import sys
import os
import socket
import pytest

# Ensure tests use the test database
os.environ["DATABASE_URL"] = "postgresql+psycopg://instagram_user:instagram_password@localhost:5432/instagram_voice_test"

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.config import settings
from app.db.session import Base, engine, SessionLocal, get_db

@pytest.fixture(scope="session", autouse=True)
def assert_test_db():
    dev_db_url = os.getenv("DEV_DATABASE_URL", "postgresql+psycopg://instagram_user:instagram_password@localhost:5432/instagram_voice")
    db_url = str(settings.DATABASE_URL).strip()
    if db_url == dev_db_url or db_url.rstrip('/').endswith('/instagram_voice'):
        pytest.exit(f"ABORT: Test database URL must not match the dev URL! Current: {db_url}")
    # Create tables
    Base.metadata.create_all(bind=engine)

def is_postgres_reachable() -> bool:
    try:
        s = socket.socket()
        s.settimeout(1.0)
        s.connect(('127.0.0.1', 5432))
        s.close()
        return True
    except Exception:
        return False

requires_postgres = pytest.mark.skipif(
    not is_postgres_reachable(),
    reason="PostgreSQL not reachable"
)

@pytest.fixture(autouse=True)
def skip_if_postgres_missing(request):
    if "requires_postgres" in request.keywords or "client" in request.fixturenames:
        if not is_postgres_reachable():
            pytest.skip("PostgreSQL not reachable")

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def sample_tech_post_data():
    return {
        "id": "test-post-001",
        "caption": "test",
        "hashtags": ["#ai"],
        "media_path": "",
        "post_type": "educational",
        "published_at": "2026-01-10"
    }
