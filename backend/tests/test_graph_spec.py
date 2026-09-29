import pytest
import os
from unittest.mock import patch, MagicMock
from app.schemas.generation import GenerationRequest, GenerationResponse
from app.services.graph_service import run_generation_graph, GraphState

@pytest.fixture
def mock_llm_service():
    with patch("app.services.llm_service.LLMService.get_provider") as mock_get_provider:
        mock_provider = MagicMock()
        mock_get_provider.return_value = mock_provider
        
        def mock_generate_structured(prompt, schema):
            from datetime import datetime
            import uuid
            from app.schemas.generation import ParsedBrief, StructuredGeneratorOutput, GenerationResponse
            if schema == ParsedBrief:
                return ParsedBrief(
                    topic="test topic",
                    format="educational",
                    goal="educate audience",
                    constraints=["short"]
                )
            if schema == StructuredGeneratorOutput:
                return StructuredGeneratorOutput(
                    hook="Test hook",
                    body="Mock text",
                    cta="Test cta",
                    hashtags=["#mock"],
                    image_text="Image overlay text",
                    visual_brief="Graphic showing diagram"
                )
            return GenerationResponse(
                id=str(uuid.uuid4()),
                project_id="proj-1",
                topic="test topic",
                post_type="educational",
                hook="Test hook",
                body="Mock text",
                caption="Test hook\n\nMock text\n\nTest cta",
                cta="Test cta",
                hashtags=["#mock"],
                created_at=datetime.utcnow()
            )
            
        mock_provider.generate_structured.side_effect = mock_generate_structured
        yield mock_provider

@pytest.fixture
def mock_validation():
    with patch("app.services.validation_service.ValidationService.validate_draft") as mock_validate:
        yield mock_validate

@pytest.fixture
def mock_db_session():
    class MockSession:
        def query(self, *args, **kwargs):
            mock_query = MagicMock()
            mock_query.filter.return_value.first.return_value = None
            mock_query.filter.return_value.all.return_value = []
            return mock_query
    return MockSession()

def test_graph_state_is_pydantic_basemodel():
    from pydantic import BaseModel
    assert issubclass(GraphState, BaseModel), "GraphState is not a Pydantic BaseModel"

def test_retrieve_node_uses_custom_retriever():
    from app.services.custom_retriever import RetrievalServiceRetriever
    from app.services.graph_service import retrieve
    
    retriever = MagicMock(spec=RetrievalServiceRetriever)
    doc = MagicMock()
    doc.metadata = {"id": "123"}
    doc.page_content = "caption"
    retriever.invoke.return_value = [doc]
    
    state = GraphState(project_id="1", request=GenerationRequest(topic="t", post_type="educational"), retriever=retriever)
    res = retrieve(state)
    assert res == {"retrieved_posts": [{"id": "123", "caption": "caption"}]}

def test_max_iterations_loop_0(mock_llm_service, mock_validation, mock_db_session):
    mock_validation.return_value = {"overall_score": 30, "originality_status": "PASS"}
    req = GenerationRequest(topic="test", post_type="educational")
    
    result, warnings = run_generation_graph(mock_db_session, "proj-1", req, n_candidates=1, max_iterations=0)
    
    # 1 brief parse + 1 generate = 2 calls
    assert mock_llm_service.generate_structured.call_count == 2
    assert result.caption is not None

def test_max_iterations_loop_exhausted(mock_llm_service, mock_validation, mock_db_session):
    mock_validation.return_value = {"overall_score": 30, "originality_status": "FAIL"}
    req = GenerationRequest(topic="test", post_type="educational")
    
    result, warnings = run_generation_graph(mock_db_session, "proj-1", req, n_candidates=1, max_iterations=1)
    
    # 1 brief parse + 1 generate + 1 revise = 3 calls
    assert mock_llm_service.generate_structured.call_count == 3
    assert result.caption is not None
    assert len(warnings) > 0

def test_best_candidate_return_on_exhaustion(mock_llm_service, mock_validation, mock_db_session):
    call_counts = {"val": 0}
    def side_effect_val(*args, **kwargs):
        call_counts["val"] += 1
        if call_counts["val"] == 1:
            return {"overall_score": 40, "originality_status": "FAIL"}
        else:
            return {"overall_score": 20, "originality_status": "FAIL"}
            
    mock_validation.side_effect = side_effect_val
    req = GenerationRequest(topic="test", post_type="educational")
    
    result, warnings = run_generation_graph(mock_db_session, "proj-1", req, n_candidates=1, max_iterations=1)
    
    assert mock_llm_service.generate_structured.call_count == 3
    assert len(warnings) > 0

def test_langsmith_trace_toggle(mock_llm_service, mock_validation, mock_db_session):
    req = GenerationRequest(topic="test", post_type="educational")
    mock_validation.return_value = {"overall_score": 90, "originality_status": "PASS"}
    
    os.environ["LANGSMITH_API_KEY"] = "dummy_key"
    os.environ["ENABLE_LANGSMITH"] = "0"
    os.environ["LANGCHAIN_TRACING_V2"] = "true"
    
    run_generation_graph(mock_db_session, "proj-1", req, n_candidates=1)
    assert os.environ.get("LANGCHAIN_TRACING_V2") == "false"

    os.environ["ENABLE_LANGSMITH"] = "1"
    os.environ["LANGSMITH_PROJECT"] = "test_ls_proj"
    
    run_generation_graph(mock_db_session, "proj-1", req, n_candidates=1)
    assert os.environ.get("LANGCHAIN_TRACING_V2") == "true"
    assert os.environ.get("LANGCHAIN_PROJECT") == "test_ls_proj"
    
    # Cleanup env
    del os.environ["ENABLE_LANGSMITH"]
    del os.environ["LANGSMITH_API_KEY"]

def test_prompt_includes_validation_feedback(mock_llm_service, mock_validation, mock_db_session):
    mock_validation.return_value = {"overall_score": 40, "originality_status": "FAIL", "flagged_phrases": ["too similar"]}
    req = GenerationRequest(topic="test", post_type="educational")
    
    run_generation_graph(mock_db_session, "proj-1", req, n_candidates=1, max_iterations=1)
    
    calls = mock_llm_service.generate_structured.call_args_list
    assert len(calls) >= 2
    prompt = calls[-1][0][0]
    
    assert "Originality Status: FAIL" in prompt
    assert "too similar" in prompt

def test_parse_brief_node_returns_parsed_brief(mock_llm_service):
    from app.services.graph_service import parse_brief
    req = GenerationRequest(topic="AI trends", post_type="educational")
    state = GraphState(project_id="1", request=req)
    res = parse_brief(state)
    assert "parsed_brief" in res
    assert res["parsed_brief"].topic == "test topic"

def test_style_exemplar_retriever_invokes_mmr():
    from app.services.custom_retriever import StyleExemplarRetriever
    mock_service = MagicMock()
    mock_service.retrieve_style_exemplars.return_value = [
        {"id": "p1", "caption": "Caption 1", "post_type": "educational"}
    ]
    retriever = StyleExemplarRetriever(retrieval_service=mock_service, project_id="p1", post_type="educational")
    docs = retriever.invoke("AI tools")
    assert len(docs) == 1
    assert docs[0].metadata["id"] == "p1"
    assert docs[0].page_content == "Caption 1"
