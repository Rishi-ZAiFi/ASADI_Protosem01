import pytest
from app.services.graph_service import graph
from app.schemas.generation import GenerationRequest, GenerationResponse
from app.models.validation import ValidationResult
import uuid
import datetime
from unittest.mock import patch, MagicMock

def test_graph_with_mock_llm():
    req = GenerationRequest(
        topic="mock topic",
        post_type="educational"
    )
    
    initial_state = {
        "project_id": "test-project",
        "request": req,
        "style_profile": {},
        "retrieved_posts": [],
        "historical_posts": []
    }
    
    mock_resp = GenerationResponse(
        id="test-cand",
        project_id="test-project",
        topic="mock topic",
        post_type="educational",
        hook="Mock hook",
        caption="Mock caption",
        cta="Mock CTA",
        hashtags=["#mock"],
        slides=[],
        created_at=datetime.datetime.utcnow()
    )
    
    with patch("app.services.graph_service.LLMService.get_provider") as mock_get_provider, \
         patch("app.services.graph_service.ValidationService.validate_draft") as mock_validate:
        
        mock_provider = MagicMock()
        mock_provider.generate_structured.return_value = mock_resp
        mock_get_provider.return_value = mock_provider
        
        mock_validate.return_value = {
            "overall_score": 85,
            "metrics_breakdown": {"style_score": 85, "format_score": 85, "tone_score": 85, "length_score": 85},
            "originality_status": "pass",
            "max_ngram_overlap": 0.0,
            "flagged_phrases": []
        }
        
        final_state = graph.invoke(initial_state)
        
        # Verify node execution
        assert "selected_candidate" in final_state
        assert final_state["selected_candidate"].caption == "Mock caption"
        assert len(final_state["candidates"]) == 4
        assert len(final_state["validation_results"]) == 4
        assert not final_state.get("_needs_revision")
        assert "revised_candidate" not in final_state
        
        # Verify revise path
        mock_validate.return_value = {
            "overall_score": 30, # Fails validation
            "metrics_breakdown": {"style_score": 30, "format_score": 30, "tone_score": 30, "length_score": 30},
            "originality_status": "fail",
            "max_ngram_overlap": 0.9,
            "flagged_phrases": []
        }
        final_state_failed = graph.invoke(initial_state)
        assert final_state_failed.get("_needs_revision") is True
        assert "revised_candidate" in final_state_failed

def test_real_graph_smoke():
    # Only run if explicit env var allows real LLM test
    import os
    if os.environ.get("TEST_REAL_LLM") != "1":
        pytest.skip("Skipping real LLM smoke test")
        
    req = GenerationRequest(
        topic="Test topic real LLM",
        post_type="educational"
    )
    
    initial_state = {
        "project_id": "test-project",
        "request": req,
        "style_profile": {},
        "retrieved_posts": [],
        "historical_posts": []
    }
    
    final_state = graph.invoke(initial_state)
    assert "selected_candidate" in final_state
    assert final_state["selected_candidate"].caption
