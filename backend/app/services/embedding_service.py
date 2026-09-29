import os
import numpy as np
from typing import List

# Attempt to import sentence_transformers
try:
    from sentence_transformers import SentenceTransformer
except ImportError as e:
    import logging
    logging.warning("Failed to import sentence_transformers: %s", str(e))
    SentenceTransformer = None

class EmbeddingService:
    def __init__(self, provider: str = "sentence-transformers", model_name: str = "all-MiniLM-L6-v2"):
        self.provider = provider
        self.model_name = model_name
        self.model = None

        if os.environ.get("TEST_FAKE_EMBEDDINGS") == "1":
            print("WARNING: Using fake embeddings as TEST_FAKE_EMBEDDINGS=1")
            self.use_fake = True
        else:
            self.use_fake = False
            if SentenceTransformer is None:
                raise ImportError("sentence_transformers is not installed, and TEST_FAKE_EMBEDDINGS is not set.")
            self.model = SentenceTransformer(self.model_name)

    def generate_embedding(self, text: str) -> List[float]:
        if not text or not text.strip():
            raise ValueError("Cannot generate embedding for empty text")
            
        if self.use_fake:
            return EmbeddingService._deterministic_hash_vector(text, dim=384)
            
        # Real embedding
        emb = self.model.encode([text])[0]
        # Normalize
        norm = np.linalg.norm(emb)
        if norm > 0:
            emb = emb / norm
        return emb.tolist()

    @staticmethod
    def _deterministic_hash_vector(text: str, dim: int = 384) -> List[float]:
        """Fast fallback vectorizer converting text to fixed-size normalized float vector."""
        vec = np.zeros(dim, dtype=np.float32)
        words = text.lower().split()
        for idx, word in enumerate(words):
            hash_val = hash(word)
            pos = abs(hash_val) % dim
            sign = 1.0 if hash_val > 0 else -1.0
            vec[pos] += sign * (1.0 / (idx + 1.0) ** 0.5)
            
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()
