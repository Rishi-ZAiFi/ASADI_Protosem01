import os
import sys
import time
import json
from sqlalchemy import create_engine
from sqlalchemy import text
from sqlalchemy.orm import sessionmaker

from app.config import settings
from app.schemas.generation import GenerationRequest
from app.services.graph_service import run_generation_graph
from app.api.routes.generation import generate_draft

def run_tests():
    engine = create_engine(settings.DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    # Find a project ID to use (first one)
    project_id = session.execute(text("SELECT id FROM projects LIMIT 1")).scalar()
    if not project_id:
        print("No project found to test against.")
        return
        
    # Ensure project has a style profile
    from app.models.style_profile import StyleProfile
    has_profile = session.query(StyleProfile).filter(StyleProfile.project_id == project_id).first()
    if not has_profile:
        print("Creating dummy style profile for project...")
        sp = StyleProfile(
            project_id=project_id,
            tone_scores={"informative": 0.8},
            caption_stats={"average_word_count": 100},
            visual_profile={"colors": ["blue"]},
            vocabulary_profile={"top_keywords": ["tech"]}
        )
        session.add(sp)
        session.commit()

    topics = [
        "How to use LangGraph for AI agents",
        "The best features of Next.js 14",
        "Why structured outputs matter for LLMs"
    ]
    
    results = []

    for idx, topic in enumerate(topics):
        print(f"\n--- TOPIC {idx+1}: {topic} ---")
        req = GenerationRequest(topic=topic, post_type="educational")
        
        # Variant 1: Current pipeline (no graph, n=1, no revision)
        start_t = time.time()
        try:
            # We don't have a direct service method easily callable without FastAPI Depends, 
            # but generate_draft expects (project_id, req, db). Wait, generate_draft uses db.query, etc.
            # Let's call the non-graph pipeline endpoint logic directly or via the route handler.
            # generate_draft(project_id, req, db=session)
            res1 = generate_draft(project_id=project_id, req=req, db=session)
            t1 = time.time() - start_t
            # We don't have token counts in LLMService yet, but we will record latency.
            print(f"1. Current Pipeline: Latency={t1:.2f}s, len={len(res1.caption)}")
        except Exception as e:
            print(f"1. Current Pipeline: FAILED: {e}")

        # Variant 2: Best-of-N only (graph, n=4, enable_revision=False)
        start_t = time.time()
        try:
            res2 = run_generation_graph(session, project_id, req, n_candidates=4, enable_revision=False)
            t2 = time.time() - start_t
            print(f"2. Best-of-N: Latency={t2:.2f}s, len={len(res2.caption)}")
        except Exception as e:
            print(f"2. Best-of-N: FAILED: {e}")

        # Variant 3: Revise-only (graph, n=1, enable_revision=True)
        start_t = time.time()
        try:
            res3 = run_generation_graph(session, project_id, req, n_candidates=1, enable_revision=True)
            t3 = time.time() - start_t
            print(f"3. Revise-only: Latency={t3:.2f}s, len={len(res3.caption)}")
        except Exception as e:
            print(f"3. Revise-only: FAILED: {e}")
            
        # Variant 4: Both (graph, n=4, enable_revision=True)
        start_t = time.time()
        try:
            res4 = run_generation_graph(session, project_id, req, n_candidates=4, enable_revision=True)
            t4 = time.time() - start_t
            print(f"4. Both: Latency={t4:.2f}s, len={len(res4.caption)}")
            
            # For the full graph run, dump verbatim
            if idx == 0:
                with open("eval/evidence/phase_3_1b_verbatim_run.txt", "w") as f:
                    f.write(f"Topic: {topic}\n\n")
                    f.write(f"Caption:\n{res4.caption}\n\n")
                    f.write(f"Hashtags: {res4.hashtags}\n")
        except Exception as e:
            print(f"4. Both: FAILED: {e}")

if __name__ == "__main__":
    run_tests()
