from typing import List, Optional, Any, Dict
from langgraph.graph import StateGraph, START, END
from pydantic import BaseModel, Field
import time
import uuid
import os

from app.schemas.generation import GenerationRequest, GenerationResponse
from app.services.retrieval_service import RetrievalService
from app.services.prompt_builder import PromptBuilder
from app.services.llm_service import LLMService
from app.services.validation_service import ValidationService

# The graph state as Pydantic BaseModel
from pydantic import ConfigDict

class GraphState(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    project_id: str
    request: GenerationRequest
    n_candidates: int = Field(default=4)
    enable_revision: bool = Field(default=True)
    max_iterations: int = Field(default=2)
    iterations: int = Field(default=0)
    
    style_profile: Optional[Dict[str, Any]] = Field(default_factory=dict)
    retrieved_posts: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    historical_posts: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    
    candidates: Optional[List[GenerationResponse]] = Field(default_factory=list)
    validation_results: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    
    selected_candidate: Optional[GenerationResponse] = None
    revised_candidate: Optional[GenerationResponse] = None
    
    variant_metrics: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    
    needs_revision: Optional[bool] = None
    best_val: Optional[Dict[str, Any]] = None
    warnings: Optional[List[str]] = Field(default_factory=list)
    retriever: Optional[Any] = None
    
    global_best_candidate: Optional[GenerationResponse] = None
    global_best_score: int = -1

def parse_brief(state: GraphState) -> dict:
    return {}

def retrieve(state: GraphState) -> dict:
    if state.retriever:
        docs = state.retriever.invoke(state.request.topic)
        retrieved_posts = [{"id": d.metadata["id"], "caption": d.page_content} for d in docs]
        return {"retrieved_posts": retrieved_posts}
    return {}

def generate(state: GraphState) -> dict:
    llm_service = LLMService.get_provider()
    
    prompt = PromptBuilder.build_generation_prompt(
        style_profile=state.style_profile or {},
        relevant_examples=state.retrieved_posts or [],
        topic=state.request.topic,
        post_type=state.request.post_type,
        cta_requirement=state.request.cta_requirement,
        desired_length=state.request.desired_length,
        custom_instructions=state.request.custom_instructions
    )
    
    candidates = []
    metrics = []
    
    for i in range(state.n_candidates):
        start_t = time.time()
        candidate = llm_service.generate_structured(prompt, GenerationResponse)
        latency = time.time() - start_t
        
        candidate.id = f"cand-{uuid.uuid4().hex[:6]}"
        candidate.project_id = state.project_id
        
        candidates.append(candidate)
        metrics.append({"candidate_id": candidate.id, "latency_sec": round(latency, 2)})
        
    return {"candidates": candidates, "variant_metrics": metrics}

def validate(state: GraphState) -> dict:
    results = []
    for cand in state.candidates:
        val_report = ValidationService.validate_draft(
            draft_caption=cand.caption,
            draft_hashtags=cand.hashtags or [],
            style_profile=state.style_profile or {},
            historical_posts=state.historical_posts or []
        )
        val_report["candidate_id"] = cand.id
        results.append(val_report)
        
    return {"validation_results": results}

import re

def select(state: GraphState) -> dict:
    results = state.validation_results
    candidates = state.candidates
    
    best_result = sorted(results, key=lambda x: x["overall_score"], reverse=True)[0]
    best_cand = next(c for c in candidates if c.id == best_result["candidate_id"])
    
    current_score = best_result.get("overall_score", 0)
    global_best_candidate = state.global_best_candidate
    global_best_score = state.global_best_score
    
    if current_score > global_best_score or global_best_candidate is None:
        global_best_candidate = best_cand
        global_best_score = current_score
        
    needs_revision = False
    warnings = list(state.warnings or [])
    
    final_selected = best_cand
    
    if (current_score < 50 or best_result.get("originality_status") == "FAIL") and state.enable_revision:
        if state.iterations < state.max_iterations:
            needs_revision = True
        else:
            needs_revision = False
            warnings = ["Max iterations exhausted. Draft failed validation constraints."]
            final_selected = global_best_candidate
    else:
        if current_score < global_best_score and global_best_candidate:
            final_selected = global_best_candidate
    
    return {
        "selected_candidate": final_selected, 
        "needs_revision": needs_revision, 
        "best_val": best_result,
        "warnings": warnings,
        "global_best_candidate": global_best_candidate,
        "global_best_score": global_best_score
    }

def revise(state: GraphState) -> dict:
    best_cand = state.selected_candidate
    val_report = state.best_val or {}
    
    reasons = []
    mb = val_report.get("metrics_breakdown", {})
    caption_stats = (state.style_profile or {}).get("caption_stats", {})
    
    if mb.get("length", 100) < 70:
        words = len(re.findall(r"\b\w+\b", best_cand.caption or ""))
        target_words = caption_stats.get("average_word_count", 120)
        reasons.append(f"word count {words} vs profile median {target_words}")
    if mb.get("tone", 100) < 70:
        reasons.append(f"tone score {mb.get('tone')} vs target 70+")
    if val_report.get("originality_status") in ("FLAG", "REJECT", "FAIL"):
        flagged = val_report.get("flagged_phrases", [])
        reasons.append(f"originality status {val_report.get('originality_status')}, flagged phrases: {flagged}")
    if not reasons:
        reasons.append(f"overall score {val_report.get('overall_score', 0)} vs target 50+")

    feedback_text = "\n".join(f"- {r}" for r in reasons)
    
    prompt = f"""
    Please revise the following social media post to fix stylistic and originality issues.
    Original Caption: {best_cand.caption}
    Original Hashtags: {best_cand.hashtags}
    
    Feedback from Validator:
    - Style Score: {val_report.get('overall_score', 0)}
    - Originality Status: {val_report.get('originality_status')}
    - Failure Reasons:
    {feedback_text}
    
    Fix these issues while keeping the same format and topic.
    """
    llm_service = LLMService.get_provider()
    revised = llm_service.generate_structured(prompt, GenerationResponse)
    revised.id = f"{best_cand.id}-rev{state.iterations + 1}"
    revised.project_id = best_cand.project_id
    
    return {
        "revised_candidate": revised, 
        "selected_candidate": revised, 
        "candidates": [revised],
        "iterations": state.iterations + 1
    }

def route_after_select(state: GraphState) -> str:
    print(f"DEBUG route_after_select: iterations={state.iterations}, needs_revision={state.needs_revision}")
    if state.needs_revision:
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
builder.add_edge("revise", "validate")

graph = builder.compile()

def run_generation_graph(db_session, project_id: str, req: GenerationRequest, n_candidates: Optional[int] = None, enable_revision: Optional[bool] = None, max_iterations: Optional[int] = None):
    from app.models.style_profile import StyleProfile
    from app.models.post import Post
    from app.services.retrieval_service import RetrievalService
    from app.services.custom_retriever import RetrievalServiceRetriever
    
    n_candidates = n_candidates if n_candidates is not None else (req.n_candidates if req.n_candidates is not None else 4)
    max_iterations = max_iterations if max_iterations is not None else (req.max_iterations if req.max_iterations is not None else 2)
    enable_revision = enable_revision if enable_revision is not None else (req.enable_revision if req.enable_revision is not None else True)
    
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
    retriever = RetrievalServiceRetriever(
        retrieval_service=retrieval_service,
        project_id=project_id,
        post_type=req.post_type or "general"
    )
    
    initial_state = GraphState(
        project_id=project_id,
        request=req,
        n_candidates=n_candidates,
        enable_revision=enable_revision,
        max_iterations=max_iterations,
        style_profile=style_profile_data,
        retrieved_posts=[],
        historical_posts=h_posts_list,
        retriever=retriever
    )
    
    # LangSmith tracing check (Tier 2 rule)
    if os.environ.get("ENABLE_LANGSMITH") != "1":
        if "LANGCHAIN_TRACING_V2" in os.environ:
            del os.environ["LANGCHAIN_TRACING_V2"]
            
    final_state = graph.invoke(initial_state)
    
    # Extract candidate & warnings
    selected_candidate = final_state.get("selected_candidate") or final_state.get("global_best_candidate")
    warnings = final_state.get("warnings") or []
    if selected_candidate:
        selected_candidate.warnings = warnings
    return selected_candidate, warnings
