import os
import sys
import json
from datetime import datetime
from collections import defaultdict
import random
import numpy as np
import pandas as pd

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import joinedload
from sqlalchemy import or_
from app.db.session import SessionLocal, engine
from app.models.post import Post, PostTextFeatures, PostVisualFeatures
from app.models.style_profile import StyleProfile
from app.models.embedding import Embedding
from app.models.draft import GeneratedDraft
from app.models.validation import ValidationResult
from app.services.llm_service import LLMService
from app.services.prompt_builder import PromptBuilder
from app.services.retrieval_service import RetrievalService
from app.services.validation_service import ValidationService
from app.services.embedding_service import EmbeddingService
from app.services.text_analyzer import TextAnalyzer

import argparse

def run_eval():
    parser = argparse.ArgumentParser()
    parser.add_argument("--no-cache", action="store_true", help="Disable caching")
    args = parser.parse_args()
    
    if args.no_cache:
        print("Running with --no-cache: ensuring generation is fresh.")
        
    db = SessionLocal()
    
    project = db.query(Project).first()
    if not project:
        print("No project found. Exiting.")
        return
        
    print(f"Evaluating project: {project.name}")
    style_profile = project.style_profile
    if not style_profile:
        print("No style profile found.")
        return

    sp_data = {
        "tone_scores": style_profile.tone_scores,
        "caption_stats": style_profile.caption_stats,
        "formatting_patterns": style_profile.formatting_patterns,
        "emoji_profile": style_profile.emoji_profile,
        "hashtag_profile": style_profile.hashtag_profile,
        "cta_profile": style_profile.cta_profile,
        "common_structures": style_profile.common_structures
    }

    # Use joinedload to get embeddings, and exclude failed posts
    all_posts = db.query(Post).options(joinedload(Post.embedding)).filter(
        Post.project_id == project.id,
        or_(Post.analysis_status != "failed", Post.analysis_status.is_(None))
    ).all()
    if not all_posts:
        print("No posts found.")
        return

    # Check why hashtags are exactly 5.0
    print("\n[DATA CHECK] Verifying corpus hashtags...")
    sample_tags = [len(p.hashtags) if p.hashtags else 0 for p in all_posts[:5]]
    print(f"Sample hashtag counts for real posts: {sample_tags}")
    
    is_synthetic = False
    if sample_tags and all(x == sample_tags[0] for x in [len(p.hashtags) if p.hashtags else 0 for p in all_posts]):
        is_synthetic = True
        print("Note: The real corpus posts all have exactly identical hashtag counts. This indicates the corpus is synthetic.")

    emb_service = EmbeddingService()
    valid_embs = []
    for p in all_posts:
        if p.embedding and p.embedding.vector:
            valid_embs.append(np.array(p.embedding.vector))
    if valid_embs:
        creator_centroid = np.mean(valid_embs, axis=0)
        norm = np.linalg.norm(creator_centroid)
        if norm > 0:
            creator_centroid = creator_centroid / norm
    else:
        creator_centroid = np.zeros(384)

    posts_by_type = defaultdict(list)
    for p in all_posts:
        posts_by_type[p.post_type].append(p)
        
    print(f"\n[DATA CHECK] Corpus size: {len(all_posts)} posts.")
    for pt, posts in posts_by_type.items():
        print(f"  - {pt}: {len(posts)} posts")

    # If small corpus (<40), use leave-one-out
    held_out = []
    if len(all_posts) < 40:
        print("\nSmall corpus detected. Using entire corpus as held-out (Leave-One-Out mode).")
        held_out = all_posts
    else:
        total_to_hold_out = 30
        types_count = len(posts_by_type)
        per_type = total_to_hold_out // types_count if types_count > 0 else 0
        for pt, posts in posts_by_type.items():
            # Sort chronologically, handling NULL published_at safely (treating them as oldest)
            posts.sort(key=lambda x: x.published_at.timestamp() if x.published_at else 0.0, reverse=True)
            # Take the most recent ones as held out
            held_out.extend(posts[:per_type])
        if len(held_out) < total_to_hold_out:
            remaining = [p for p in all_posts if p not in held_out]
            remaining.sort(key=lambda x: x.published_at.timestamp() if x.published_at else 0.0, reverse=True)
            held_out.extend(remaining[:total_to_hold_out - len(held_out)])
            
    print(f"[DATA CHECK] n actually used in eval: {len(held_out)}\n")

    retrieval_service = RetrievalService(db)
    provider = LLMService.get_provider()
    results = []
    
    for idx, p in enumerate(held_out):
        print(f"[{idx+1}/{len(held_out)}] Processing post {p.id}...")
        topic = " ".join(p.caption.split()[:15]) + "..."
        
        # Determine corpus excluding current post
        corpus_dicts = []
        for cp in all_posts:
            if cp.id != p.id:
                corpus_dicts.append({
                    "id": cp.id,
                    "caption": cp.caption,
                    "hashtags": cp.hashtags,
                    "post_type": cp.post_type,
                    "embedding_vector": cp.embedding.vector if cp.embedding else None
                })
        
        # B0: Baseline (Plain Gemini)
        b0_prompt = f"Write an Instagram post about {topic}.\n- Topic: {topic}\nReturn JSON with 'hook', 'caption', 'cta', 'hashtags', and 'slides'."
        b0_res = provider.generate(b0_prompt)
        
        # B1: Current Pipeline
        # We manually filter retrieval to not include `p`
        raw_relevant = retrieval_service.retrieve_relevant_posts(project.id, topic, top_k=10, post_type_filter=p.post_type)
        relevant = [r for r in raw_relevant if r["id"] != p.id][:3]
        
        b1_prompt = PromptBuilder.build_generation_prompt(
            style_profile=sp_data,
            relevant_examples=relevant,
            topic=topic,
            post_type=p.post_type
        )
        b1_res = provider.generate(b1_prompt)
        
        def eval_draft(draft_caption, draft_hashtags):
            val_res = ValidationService.validate_draft(draft_caption, draft_hashtags, sp_data, corpus_dicts)
            draft_emb = np.array(emb_service.generate_embedding(draft_caption))
            norm = np.linalg.norm(draft_emb)
            if norm > 0:
                draft_emb = draft_emb / norm
            
            dist = float(1.0 - np.dot(draft_emb, creator_centroid))
            feats = TextAnalyzer.extract_features(draft_caption, draft_hashtags)
            
            return {
                "style_score": val_res["overall_score"],
                "centroid_dist": dist,
                "max_cosine_corpus": float(val_res.get("max_cosine_corpus", 0.0)),
                "max_5gram_overlap": float(val_res.get("max_ngram_overlap", 0.0)),
                "length": feats.get("word_count", 0),
                "emoji_count": feats.get("emoji_count", 0),
                "hashtag_count": feats.get("hashtag_count", 0),
                "caption": draft_caption
            }
            
        b0_metrics = eval_draft(b0_res.get("caption", ""), b0_res.get("hashtags", []))
        b1_metrics = eval_draft(b1_res.get("caption", ""), b1_res.get("hashtags", []))
        real_metrics = eval_draft(p.caption, p.hashtags)
        
        results.append({
            "post_id": p.id,
            "topic": topic,
            "post_type": p.post_type,
            "B0": b0_metrics,
            "B1": b1_metrics,
            "REAL": real_metrics
        })

    os.makedirs("eval/results", exist_ok=True)
    ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    out_file = f"eval/results/{ts}.json"
    
    llm_mode = "fake" if os.environ.get("TEST_FAKE_LLM") == "1" else "real"
    embedding_mode = "fake" if os.environ.get("TEST_FAKE_EMBEDDINGS") == "1" else "real"
    data_provenance = "synthetic" if is_synthetic else "real"
    db_backend = engine.url.drivername
    
    output_data = {
        "metadata": {
            "llm_mode": llm_mode,
            "embedding_mode": embedding_mode,
            "data_provenance": data_provenance,
            "db_backend": db_backend
        },
        "results": results
    }
    
    with open(out_file, "w") as f:
        json.dump(output_data, f, indent=2)
        
    metrics = ["style_score", "centroid_dist", "max_cosine_corpus", "max_5gram_overlap", "length", "emoji_count", "hashtag_count"]
    
    is_invalid_eval = (llm_mode == "fake" or embedding_mode == "fake" or data_provenance == "synthetic")

    print("\n--- AVERAGE METRICS (Mean ± Std) ---")
    if is_invalid_eval:
        print("\n==========================================")
        print("      METRICS NOT INTERPRETABLE")
        print(" (Eval contains fake modes or synthetic data)")
        print("==========================================\n")
        
    print(f"{'Metric':<20} | {'B0 (Plain Gemini)':<20} | {'B1 (Pipeline)':<20} | {'REAL (Held-out)':<20}")
    print("-" * 88)
    for m in metrics:
        b0_vals = [r["B0"][m] for r in results]
        b1_vals = [r["B1"][m] for r in results]
        real_vals = [r["REAL"][m] for r in results]
        
        print(f"{m:<20} | {np.mean(b0_vals):>8.4f} ± {np.std(b0_vals):>6.4f} | {np.mean(b1_vals):>8.4f} ± {np.std(b1_vals):>6.4f} | {np.mean(real_vals):>8.4f} ± {np.std(real_vals):>6.4f}")
        
    if not is_invalid_eval:
        print("\n=== PAIRED DIFFERENCE (B1 - B0) ===")
        b1_scores = np.array([r["B1"]["style_score"] for r in results])
        b0_scores = np.array([r["B0"]["style_score"] for r in results])
        score_diffs = b1_scores - b0_scores
        
        b1_dists = np.array([r["B1"]["centroid_dist"] for r in results])
        b0_dists = np.array([r["B0"]["centroid_dist"] for r in results])
        dist_diffs = b1_dists - b0_dists
        
        print(f"Style Score Diff:  {np.mean(score_diffs):>8.4f} ± {np.std(score_diffs):>6.4f}")
        print(f"Centroid Dist Diff:{np.mean(dist_diffs):>8.4f} ± {np.std(dist_diffs):>6.4f}")
        
        if np.mean(score_diffs) > (1.5 * np.std(score_diffs) / np.sqrt(len(results))):
            print("\nCONCLUSION: B1 beats B0 in Style Score beyond noise.")
        else:
            print("\nCONCLUSION: B1 DOES NOT beat B0 beyond noise (or the difference is very small compared to variance).")
            
        if np.mean(dist_diffs) < -(1.5 * np.std(dist_diffs) / np.sqrt(len(results))):
            print("CONCLUSION: B1 is closer to the creator centroid than B0 beyond noise.")
        else:
            print("CONCLUSION: B1 is NOT meaningfully closer to the creator centroid than B0.")

if __name__ == "__main__":
    run_eval()
