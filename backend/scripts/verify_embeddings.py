import os
import sys
import numpy as np

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.models.project import Project
from app.models.post import Post, PostTextFeatures, PostVisualFeatures
from app.models.style_profile import StyleProfile
from app.models.embedding import Embedding
from app.models.draft import GeneratedDraft
from app.models.validation import ValidationResult
from app.services.embedding_service import EmbeddingService

def main():
    db = SessionLocal()
    embedder = EmbeddingService()
    
    # 3a & 3b: embedding vector dimension and norm for 3 stored corpus posts
    posts = db.query(Post).join(Embedding).limit(3).all()
    print("--- 3a & 3b: Stored Corpus Embeddings ---")
    for i, p in enumerate(posts):
        vec = p.embedding.vector
        if not vec:
            print(f"Post {i+1}: Missing embedding")
            continue
            
        dim = len(vec)
        norm = np.linalg.norm(vec)
        
        # Check if it was produced by hash fallback (hash fallback is perfectly length 384, but usually has very few non-zero components and different distribution).
        # We can just generate the hash fallback and see if it matches.
        hash_vec = embedder._deterministic_hash_vector(p.caption)
        is_hash = np.allclose(vec, hash_vec, atol=1e-5)
        
        print(f"Post {i+1}: Dim={dim}, Norm={norm:.6f}, Is_Hash_Fallback={is_hash}")

    # 3c: cosine similarity of pairs
    print("\n--- 3c: Cosine Similarity of Pairs ---")
    
    def get_cos(s1, s2):
        v1 = np.array(embedder.generate_embedding(s1))
        v2 = np.array(embedder.generate_embedding(s2))
        return np.dot(v1, v2)
        
    p1a = "The quick brown fox jumps over the lazy dog."
    p1b = "A fast brown fox leaps across a sleepy dog."
    
    u1a = "Quantum computing relies on qubits."
    u1b = "My favorite recipe is spaghetti bolognese."
    
    v1 = "This is a verbatim test string."
    v2 = "This is a verbatim test string."
    
    print(f"Paraphrases: {get_cos(p1a, p1b):.4f}")
    print(f"Unrelated: {get_cos(u1a, u1b):.4f}")
    print(f"Verbatim: {get_cos(v1, v2):.4f}")
    
    db.close()

if __name__ == "__main__":
    main()
