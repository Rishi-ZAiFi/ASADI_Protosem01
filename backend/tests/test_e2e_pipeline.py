import os
import json
import pytest
import datetime

def test_mocked_e2e_complete_instagram_voice_replication_pipeline(client):
    """TC-E2E-001 — Complete Instagram Voice Replication Pipeline"""
    
    # 1. Create Project
    proj_res = client.post("/api/projects", json={
        "name": "E2E AI Content Creator",
        "creator_handle": "@ai_voice_e2e",
        "description": "Full end-to-end style replication pipeline verification"
    })
    assert proj_res.status_code == 200
    proj_id = proj_res.json()["id"]

    # 2. Import Historical Dataset
    dataset_path = os.path.join(os.path.dirname(__file__), "..", "sample_datasets", "tech_creator.json")
    with open(dataset_path) as f:
        dataset = json.load(f)

    import_res = client.post(f"/api/projects/{proj_id}/posts/import", json=dataset)
    assert import_res.status_code == 200
    assert import_res.json()["imported_count"] == 5

    # 3. Analyze Historical Posts & Generate Style Profile
    analyze_res = client.post(f"/api/projects/{proj_id}/analyze")
    assert analyze_res.status_code == 200
    style_profile = analyze_res.json()
    assert style_profile["caption_stats"]["average_word_count"] > 0

    # 4. Retrieve Style Profile
    sp_res = client.get(f"/api/projects/{proj_id}/style-profile")
    assert sp_res.status_code == 200
    assert sp_res.json()["project_id"] == proj_id

    from unittest.mock import patch, MagicMock
    from app.schemas.generation import GenerationResponse, ParsedBrief

    mock_resp = GenerationResponse(
        id="mock-e2e-draft-id",
        project_id=proj_id,
        topic="5 essential tools for modern AI developers",
        post_type="educational",
        hook="Mock e2e hook",
        caption="Mock e2e caption text body for 5 essential tools",
        body="Mock e2e caption text body for 5 essential tools",
        cta="Save for later",
        hashtags=["#ai"],
        slides=[],
        created_at=datetime.datetime.utcnow()
    )

    with patch("app.services.llm_service.LLMService.get_provider") as mock_get_provider:
        mock_provider = MagicMock()
        def mock_generate_structured(prompt, schema):
            if schema == ParsedBrief:
                return ParsedBrief(topic="5 essential tools for modern AI developers", format="educational", goal="educate", constraints=[])
            return mock_resp
        mock_provider.generate_structured.side_effect = mock_generate_structured
        mock_get_provider.return_value = mock_provider

        # 5. Generate New Post with Gemini Provider & Retrieval
        gen_res = client.post(f"/api/projects/{proj_id}/generate", json={
            "topic": "5 essential tools for modern AI developers",
            "post_type": "educational",
            "desired_length": "medium",
            "cta_requirement": "Ask followers to save for later"
        })
        assert gen_res.status_code == 200
        draft = gen_res.json()
        draft_id = draft["id"]
        assert "caption" in draft

    # 6. Retrieve Saved Draft
    draft_res = client.get(f"/api/projects/{proj_id}/drafts/{draft_id}")
    assert draft_res.status_code == 200
    assert draft_res.json()["id"] == draft_id

    # 7. Retrieve Validation & Originality Audit Report
    val_res = client.get(f"/api/drafts/{draft_id}/validation")
    assert val_res.status_code == 200
    val_report = val_res.json()
    assert "overall_score" in val_report
    assert val_report["originality_status"] in ["PASS", "FLAG", "REJECT"]
