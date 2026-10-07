import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.models.project import Project
from app.models.post import Post, PostTextFeatures, PostVisualFeatures
from app.models.style_profile import StyleProfile
from app.models.embedding import Embedding
from app.models.draft import GeneratedDraft
from app.models.validation import ValidationResult
from app.services.embedding_service import EmbeddingService

def reindex_all():
    db = SessionLocal()
    embedder = EmbeddingService()
    
    posts = db.query(Post).all()
    print(f"Re-indexing {len(posts)} posts...")
    
    for idx, post in enumerate(posts):
        caption = post.caption
        vec = embedder.generate_embedding(caption)
        
        if post.embedding:
            post.embedding.vector = vec
        else:
            emb = Embedding(post_id=post.id, vector=vec)
            db.add(emb)
            
        if (idx + 1) % 10 == 0:
            print(f"Processed {idx + 1}/{len(posts)} posts")
            
    db.commit()
    print("Re-indexing complete.")
    db.close()

if __name__ == "__main__":
    reindex_all()
