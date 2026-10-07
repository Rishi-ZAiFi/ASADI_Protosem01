import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.validation_service import ValidationService
from app.services.embedding_service import EmbeddingService

def test_originality_sanity():
    embedder = EmbeddingService()
    
    historical_posts = [
        {
            "id": "post1",
            "caption": "This is exactly a test post for the uniqueness and originality checking logic.",
            "embedding_vector": embedder.generate_embedding("This is exactly a test post for the uniqueness and originality checking logic.")
        },
        {
            "id": "post2",
            "caption": "Here is another completely different post about something else entirely.",
            "embedding_vector": embedder.generate_embedding("Here is another completely different post about something else entirely.")
        }
    ]
    
    # 1. Verbatim post
    draft_caption = "This is exactly a test post for the uniqueness and originality checking logic."
    info = ValidationService._check_originality(draft_caption, historical_posts, embedder)
    
    print(f"VERBATIM POST -> {info}")
    assert info["max_cosine_corpus"] > 0.95, f"Expected >0.95 cosine for verbatim, got {info['max_cosine_corpus']}"
    assert info["max_ngram_overlap"] > 90.0, f"Expected >90 overlap for verbatim, got {info['max_ngram_overlap']}"
    
    # 2. Unrelated post
    draft_caption_unrelated = "Dogs are cool pets to have."
    info_unrelated = ValidationService._check_originality(draft_caption_unrelated, historical_posts, embedder)
    print(f"UNRELATED POST -> {info_unrelated}")
    assert info_unrelated["max_cosine_corpus"] < 0.5, f"Expected low cosine, got {info_unrelated['max_cosine_corpus']}"
    assert info_unrelated["max_ngram_overlap"] < 10.0, f"Expected low overlap, got {info_unrelated['max_ngram_overlap']}"

if __name__ == "__main__":
    test_originality_sanity()
    print("Sanity checks passed.")
