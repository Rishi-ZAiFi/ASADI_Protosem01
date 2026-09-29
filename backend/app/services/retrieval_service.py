import numpy as np
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.post import Post
from app.models.embedding import Embedding
from app.services.embedding_service import EmbeddingService

class RetrievalService:
    def __init__(self, db: Session):
        self.db = db
        self.embedding_service = EmbeddingService()

    def retrieve_relevant_posts(
        self,
        project_id: str,
        query_text: str,
        top_k: int = 5,
        post_type_filter: str = None
    ) -> List[Dict[str, Any]]:
        # 1. Generate embedding vector for query
        query_vec = np.array(self.embedding_service.generate_embedding(query_text), dtype=np.float32)
        # 2. Fetch all posts with embeddings for the project
        query = self.db.query(Post).join(Embedding).filter(
            Post.project_id == project_id,
            or_(Post.analysis_status != "failed", Post.analysis_status.is_(None))
        )
        if post_type_filter:
            query = query.filter(Post.post_type == post_type_filter)
            
        posts = query.all()
        if not posts:
            # Fall back to any posts in project without post_type_filter
            posts = self.db.query(Post).filter(
                Post.project_id == project_id,
                or_(Post.analysis_status != "failed", Post.analysis_status.is_(None))
            ).all()
            
        if not posts:
            return []

        scored_posts = []
        for post in posts:
            if not post.embedding or not post.embedding.vector:
                similarity = 0.1
            else:
                post_vec = np.array(post.embedding.vector, dtype=np.float32)
                # Compute cosine similarity
                dot = np.dot(query_vec, post_vec)
                norm_q = np.linalg.norm(query_vec)
                norm_p = np.linalg.norm(post_vec)
                similarity = float(dot / (norm_q * norm_p)) if (norm_q > 0 and norm_p > 0) else 0.0
                
            scored_posts.append({
                "id": post.id,
                "caption": post.caption,
                "hashtags": post.hashtags or [],
                "post_type": post.post_type,
                "published_at": post.published_at.strftime("%Y-%m-%d") if post.published_at else None,
                "similarity_score": round(similarity, 4),
                "structure": post.text_features.structure_components if post.text_features else ["hook", "body", "cta"]
            })

        # Sort by highest similarity score
        scored_posts.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored_posts[:top_k]

    def retrieve_style_exemplars(
        self,
        project_id: str,
        query_text: str,
        top_k: int = 3,
        post_type_filter: str = None,
        lambda_mult: float = 0.6
    ) -> List[Dict[str, Any]]:
        query_vec = np.array(self.embedding_service.generate_embedding(query_text), dtype=np.float32)
        norm_q = np.linalg.norm(query_vec)

        query = self.db.query(Post).join(Embedding).filter(
            Post.project_id == project_id,
            or_(Post.analysis_status != "failed", Post.analysis_status.is_(None))
        )
        if post_type_filter:
            same_type_posts = query.filter(Post.post_type == post_type_filter).all()
            if same_type_posts:
                posts = same_type_posts
            else:
                posts = query.all()
        else:
            posts = query.all()

        if not posts:
            return []

        cand_vectors = []
        cand_posts = []
        sim_to_query = []

        for p in posts:
            if not p.embedding or not p.embedding.vector:
                continue
            vec = np.array(p.embedding.vector, dtype=np.float32)
            norm_p = np.linalg.norm(vec)
            sim = float(np.dot(query_vec, vec) / (norm_q * norm_p)) if (norm_q > 0 and norm_p > 0) else 0.0
            cand_vectors.append(vec)
            cand_posts.append({
                "id": p.id,
                "caption": p.caption,
                "hashtags": p.hashtags or [],
                "post_type": p.post_type,
                "similarity_score": round(sim, 4)
            })
            sim_to_query.append(sim)

        if not cand_posts:
            return []

        # MMR selection algorithm
        selected_indices = []
        unselected_indices = list(range(len(cand_posts)))

        # Pick 1st best match
        best_first = int(np.argmax(sim_to_query))
        selected_indices.append(best_first)
        unselected_indices.remove(best_first)

        while len(selected_indices) < min(top_k, len(cand_posts)) and unselected_indices:
            best_mmr = -1e9
            best_cand_idx = -1

            for idx in unselected_indices:
                sim_q = sim_to_query[idx]
                # Cosine similarity to already selected candidates
                vec_i = cand_vectors[idx]
                norm_i = np.linalg.norm(vec_i)
                
                max_sim_sel = 0.0
                for sel_idx in selected_indices:
                    vec_j = cand_vectors[sel_idx]
                    norm_j = np.linalg.norm(vec_j)
                    sim_ij = float(np.dot(vec_i, vec_j) / (norm_i * norm_j)) if (norm_i > 0 and norm_j > 0) else 0.0
                    if sim_ij > max_sim_sel:
                        max_sim_sel = sim_ij

                mmr_score = lambda_mult * sim_q - (1.0 - lambda_mult) * max_sim_sel
                if mmr_score > best_mmr:
                    best_mmr = mmr_score
                    best_cand_idx = idx

            if best_cand_idx != -1:
                selected_indices.append(best_cand_idx)
                unselected_indices.remove(best_cand_idx)
            else:
                break

        return [cand_posts[i] for i in selected_indices]
