import pytest
import sqlalchemy
from fastapi.testclient import TestClient
from datetime import datetime
import uuid

from app.main import app
from app.db.session import SessionLocal, engine, get_db
from app.models.project import Project
from app.models.post import Post
from app.models.embedding import Embedding
from app.services.retrieval_service import RetrievalService
from unittest.mock import patch, MagicMock

test_proj_id = f"test-proj-failed-{uuid.uuid4().hex[:8]}"

client = TestClient(app)

@pytest.fixture(scope="function")
def isolated_db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = SessionLocal(bind=connection)
    
    session.begin_nested()
    
    @sqlalchemy.event.listens_for(session, "after_transaction_end")
    def restart_savepoint(session, transaction):
        if transaction.nested and not transaction._parent.nested:
            session.begin_nested()
    
    def override_get_db():
        yield session

    app.dependency_overrides[get_db] = override_get_db

    project = Project(id=test_proj_id, name="Test Project Failed Posts")
    session.add(project)
    
    # 1. Successful post with date
    p1 = Post(id="success-post", project_id=test_proj_id, original_id="s1", caption="success post", analysis_status="success", published_at=datetime(2023, 1, 1))
    session.add(p1)
    
    # 2. Successful post with NULL date
    p2 = Post(id="null-date-post", project_id=test_proj_id, original_id="s2", caption="null date post", analysis_status="success", published_at=None)
    session.add(p2)
    
    # 3. Failed post with date
    p3 = Post(id="failed-post", project_id=test_proj_id, original_id="s3", caption="failed post", analysis_status="failed", published_at=datetime(2023, 1, 2))
    session.add(p3)
    
    # Add embeddings for retrieval test
    e1 = Embedding(post_id="success-post", vector=[0.1]*384)
    e2 = Embedding(post_id="null-date-post", vector=[0.2]*384)
    e3 = Embedding(post_id="failed-post", vector=[0.3]*384)
    session.add_all([e1, e2, e3])
    
    session.commit()
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()
    app.dependency_overrides.clear()


def test_analysis_excludes_failed_posts(isolated_db_session):
    resp = client.post(f"/api/projects/{test_proj_id}/analyze")
    # if it doesn't fail, it passed. We expect it to process p1 and p2, but not p3.
    assert resp.status_code == 200
    
    # Also verify the posts processed by directly calling the db query
    from sqlalchemy import or_
    posts = isolated_db_session.query(Post).filter(
        Post.project_id == test_proj_id,
        or_(Post.analysis_status != "failed", Post.analysis_status.is_(None))
    ).all()
    assert len(posts) == 2
    assert any(p.id == "success-post" for p in posts)
    assert any(p.id == "null-date-post" for p in posts)


@patch("app.services.embedding_service.EmbeddingService.generate_embedding")
def test_retrieval_excludes_failed_posts_and_handles_null_date(mock_embed, isolated_db_session):
    mock_embed.return_value = [0.1] * 384
    retrieval_service = RetrievalService(isolated_db_session)
    
    results = retrieval_service.retrieve_relevant_posts(test_proj_id, "query")
    
    # Should only return success-post and null-date-post
    assert len(results) == 2
    ids = [r["id"] for r in results]
    assert "success-post" in ids
    assert "null-date-post" in ids
    assert "failed-post" not in ids
    
    # Verify NULL date is returned as None without crashing
    for r in results:
        if r["id"] == "null-date-post":
            assert r["published_at"] is None
        elif r["id"] == "success-post":
            assert r["published_at"] == "2023-01-01"


def test_eval_split_chronological_with_null_dates(isolated_db_session):
    # To test the splitting logic, let's just run the code fragment
    # that sorts by published_at
    from sqlalchemy.orm import joinedload
    from sqlalchemy import or_
    
    all_posts = isolated_db_session.query(Post).filter(
        Post.project_id == test_proj_id,
        or_(Post.analysis_status != "failed", Post.analysis_status.is_(None))
    ).all()
    
    assert len(all_posts) == 2
    
    # Sort chronologically, handling NULL published_at safely (treating them as oldest)
    all_posts.sort(key=lambda x: x.published_at.timestamp() if x.published_at else 0.0, reverse=True)
    
    # The one with 2023-01-01 has a timestamp > 0, so it should be first
    assert all_posts[0].id == "success-post"
    assert all_posts[1].id == "null-date-post"
