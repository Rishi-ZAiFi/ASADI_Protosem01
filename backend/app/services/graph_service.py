from typing import TypedDict, List, Optional, Any, Dict
from langgraph.graph import StateGraph, START, END
from pydantic import BaseModel
import time
import uuid

from app.schemas.generation import GenerationRequest, GenerationResponse
from app.services.retrieval_service import RetrievalService
from app.services.prompt_builder import PromptBuilder
from app.services.llm_service import LLMService
from app.services.validation_service import ValidationService

# The graph state
class GraphState(TypedDict):
    project_id: str
    request: GenerationRequest
    n_candidates: int
    enable_revision: bool
    
    style_profile: Optional[Dict[str, Any]]
    retrieved_posts: Optional[List[Dict[str, Any]]]
    historical_posts: Optional[List[Dict[str, Any]]]
    
    candidates: Optional[List[GenerationResponse]]
    validation_results: Optional[List[Dict[str, Any]]]
    
    selected_candidate: Optional[GenerationResponse]
    revised_candidate: Optional[GenerationResponse]
    
    variant_metrics: Optional[List[Dict[str, Any]]]
    
    _needs_revision: Optional[bool]
    _best_val: Optional[Dict[str, Any]]

def parse_brief(state: GraphState) -> dict:
    # Just a placeholder for brief enrichment
    return state

def retrieve(state: GraphState) -> dict:
    # Using existing retrieval logic which is wrapped by run_generation_graph wrapper
    return state

def generate(state: GraphState) -> dict:
    llm_service = LLMService.get_provider()
    
    prompt = PromptBuilder.build_generation_prompt(
        style_profile=state.get("style_profile", {}),
        relevant_examples=state.get("retrieved_posts", []),
        topic=state["request"].topic,
        post_type=state["request"].post_type,
        cta_requirement=state["request"].cta_requirement,
        desired_length=state["request"].desired_length,
        custom_instructions=state["request"].custom_instructions
    )
    
    # Generate N=4 candidates
    candidates = []
    metrics = []
    
    n = state.get("n_candidates", 4)
    for i in range(n):
        start_t = time.time()
        # use structured output
        candidate = llm_service.generate_structured(prompt, GenerationResponse)
        latency = time.time() - start_t
        
        # We need to manually assign a temporary ID for tracking
        candidate.id = f"cand-{uuid.uuid4().hex[:6]}"
        candidate.project_id = state["project_id"]
        
        candidates.append(candidate)
        metrics.append({"candidate_id": candidate.id, "latency_sec": round(latency, 2)})
        
    return {"candidates": candidates, "variant_metrics": metrics}

def validate(state: GraphState) -> dict:
    results = []
    for cand in state["candidates"]:
        val_report = ValidationService.validate_draft(
            draft_caption=cand.caption,
            draft_hashtags=cand.hashtags or [],
            style_profile=state.get("style_profile", {}),
            historical_posts=state.get("historical_posts", [])
        )
        val_report["candidate_id"] = cand.id
        results.append(val_report)
        
    return {"validation_results": results}

def select(state: GraphState) -> dict:
    results = state["validation_results"]
    candidates = state["candidates"]
    
    # Select best based on overall_score
    best_result = sorted(results, key=lambda x: x["overall_score"], reverse=True)[0]
    best_cand = next(c for c in candidates if c.id == best_result["candidate_id"])
    
    # We didn't do max_iterations loop, just a single revision pass if needed.
    needs_revision = (best_result["overall_score"] < 50) and state.get("enable_revision", True)
    
    # Attach a flag so we can route
    return {"selected_candidate": best_cand, "_needs_revision": needs_revision, "_best_val": best_result}

def revise(state: GraphState) -> dict:
    best_cand = state["selected_candidate"]
    val_report = state.get("_best_val", {})
    
    prompt = f"""
    Please revise the following social media post to fix stylistic and originality issues.
    Original Caption: {best_cand.caption}
    Original Hashtags: {best_cand.hashtags}
    
    Feedback from Validator:
    - Style Score: {val_report.get('metrics_breakdown', {}).get('style_score')}
    - Originality Status: {val_report.get('originality_status')}
    - Flagged Phrases: {val_report.get('flagged_phrases')}
    
    Fix these issues while keeping the same format and topic.
    """
    llm_service = LLMService.get_provider()
    revised = llm_service.generate_structured(prompt, GenerationResponse)
    revised.id = best_cand.id + "-rev"
    revised.project_id = best_cand.project_id
    
    return {"revised_candidate": revised, "selected_candidate": revised}

def route_after_select(state: GraphState) -> str:
    if state.get("_needs_revision"):
        return "revise"
    return "end"

# Build graph
builder = StateGraph(GraphState)

builder.add_node("parse_brief", parse_brief)
builder.add_node("retrieve", retrieve)
builder.add_node("generate", generate)
builder.add_node("validate", validate)
builder.add_node("select", select)
builder.add_node("revise", revise)

builder.add_edge(START, "parse_brief")
builder.add_edge("parse_brief", "retrieve")
builder.add_edge("retrieve", "generate")
builder.add_edge("generate", "validate")
builder.add_edge("validate", "select")
builder.add_conditional_edges("select", route_after_select, {"revise": "revise", "end": END})
builder.add_edge("revise", END)

graph = builder.compile()

def run_generation_graph(db_session, project_id: str, req: GenerationRequest, n_candidates: int = 4, enable_revision: bool = True) -> GenerationResponse:
    from app.models.style_profile import StyleProfile
    from app.models.post import Post
    from app.services.retrieval_service import RetrievalService
    
    sp = db_session.query(StyleProfile).filter(StyleProfile.project_id == project_id).first()
    style_profile_data = {}
    if sp:
        style_profile_data = {
            "tone_scores": sp.tone_scores or {},
            "caption_stats": sp.caption_stats or {},
            "formatting_patterns": sp.formatting_patterns or {},
            "emoji_profile": sp.emoji_profile or {},
            "hashtag_profile": sp.hashtag_profile or {},
            "cta_profile": sp.cta_profile or {},
            "common_structures": sp.common_structures or []
        }
        
    historical_posts = db_session.query(Post).filter(Post.project_id == project_id).all()
    h_posts_list = [{"id": p.id, "caption": p.caption} for p in historical_posts]
    
    retrieval_service = RetrievalService(db_session)
    retrieved = retrieval_service.retrieve_relevant_posts(
        project_id=project_id,
        query_text=req.topic,
        top_k=5,
        post_type_filter=req.post_type
    )
    
    initial_state = {
        "project_id": project_id,
        "request": req,
        "n_candidates": n_candidates,
        "enable_revision": enable_revision,
        "style_profile": style_profile_data,
        "retrieved_posts": retrieved,
        "historical_posts": h_posts_list
    }
    
    final_state = graph.invoke(initial_state)
    return final_state["selected_candidate"]
