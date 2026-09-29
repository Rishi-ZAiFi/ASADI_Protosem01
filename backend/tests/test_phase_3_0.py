import pytest
import sqlalchemy
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from datetime import datetime

from app.main import app
from app.db.session import SessionLocal, engine, Base, get_db
from app.models.project import Project
from app.models.post import Post
from app.services.image_analyzer import ImageAnalyzer
from app.schemas.post import PostDatasetImport

import uuid

test_proj_id = f"test-proj-30-{uuid.uuid4().hex[:8]}"

client = TestClient(app)

@pytest.fixture(scope="function")
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = SessionLocal(bind=connection)
    
    # We use a savepoint to isolate the test from other tests.
    session.begin_nested()
    
    # Optional: if a nested transaction fails, SQLAlchemy needs to rollback to the savepoint
    @sqlalchemy.event.listens_for(session, "after_transaction_end")
    def restart_savepoint(session, transaction):
        if transaction.nested and not transaction._parent.nested:
            session.begin_nested()
    
    def override_get_db():
        yield session

    app.dependency_overrides[get_db] = override_get_db

    project = Project(id=test_proj_id, name="Test Project")
    session.add(project)
    session.commit()
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()
    app.dependency_overrides.clear()

def test_image_analyzer_missing_file():
    with pytest.raises(ValueError, match="Media path does not exist"):
        ImageAnalyzer.extract_features("does_not_exist.jpg")

@patch("app.api.routes.posts.TextAnalyzer.extract_features")
@patch("app.api.routes.posts.ImageAnalyzer.extract_features")
@patch("app.api.routes.posts.EmbeddingService")
def test_import_posts_parse_error_and_resilience(mock_embed, mock_img, mock_text, db_session):
    mock_text.return_value = {
        "char_count": 10, "word_count": 2, "sentence_count": 1, "paragraph_count": 1,
        "avg_sentence_length": 2, "avg_word_length": 5, "punctuation_counts": {},
        "question_count": 0, "exclamation_count": 0, "line_break_count": 0,
        "has_bullet_points": 0, "has_numbered_list": 0, "capitalization_style": "standard",
        "emoji_count": 0, "emojis": [], "hashtag_count": 0, "has_cta": 0,
        "cta_phrase": None, "has_url": 0, "first_person_ratio": 0.0,
        "second_person_ratio": 0.0, "formality_score": 0.5, "conversational_score": 0.5,
        "educational_score": 0.5, "promotional_score": 0.5, "storytelling_score": 0.5,
        "structure_components": []
    }
    
    mock_img.side_effect = [
        # Post 1 succeeds
        {
            "width": 100, "height": 100, "aspect_ratio": 1.0, "brightness": 0.5,
            "contrast": 0.5, "saturation": 0.5, "dominant_colors": [],
            "color_histogram": {}, "text_area_ratio": 0.0, "ocr_text": ""
        },
        # Post 2 fails extraction
        RuntimeError("Simulated extraction failure")
    ]
    
    # Mock embedding
    instance = mock_embed.return_value
    instance.generate_embedding.return_value = [0.0] * 384
    
    payload = {
        "posts": [
            {
                "id": "post-1",
                "caption": "test",
                "published_at": "invalid-date-string" # Should parse_error
            },
            {
                "id": "post-2",
                "caption": "test 2",
                "published_at": "2023-01-01" # Valid date, but extraction will fail
            }
        ]
    }
    
    resp = client.post(f"/api/projects/{test_proj_id}/posts/import", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["imported_count"] == 2
    assert data["parse_errors"] == 1
    assert data["analysis_failures"] == 1
    
    # Check DB
    posts = db_session.query(Post).filter(Post.project_id == test_proj_id).order_by(Post.original_id).all()
    assert len(posts) == 2
    
    p1 = posts[0]
    assert p1.original_id == "post-1"
    assert p1.parse_error is not None
    assert "Failed to parse published_at" in p1.parse_error
    assert p1.analysis_status == "success"
    
    p2 = posts[1]
    assert p2.original_id == "post-2"
    assert p2.parse_error is None
    assert p2.analysis_status == "failed"
    assert "Simulated extraction failure" in p2.analysis_error
