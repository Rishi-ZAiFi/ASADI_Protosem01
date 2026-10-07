import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from collections import defaultdict
from app.db.session import SessionLocal
from app.models.project import Project
from app.models.post import Post, PostTextFeatures, PostVisualFeatures
from app.models.style_profile import StyleProfile
from app.models.embedding import Embedding
from app.models.draft import GeneratedDraft
from app.models.validation import ValidationResult

def main():
    db = SessionLocal()
    
    projects = db.query(Project).all()
    print("--- 5: DATA ---")
    for proj in projects:
        posts = db.query(Post).filter(Post.project_id == proj.id).all()
        print(f"\nProject: '{proj.name}' (ID: {proj.id})")
        
        if not posts:
            print("  No posts.")
            continue
            
        posts_by_format = defaultdict(int)
        lengths = []
        hash_counts = []
        for p in posts:
            posts_by_format[p.post_type] += 1
            words = len(p.caption.split())
            h_count = len(p.hashtags) if p.hashtags else 0
            lengths.append(words)
            hash_counts.append(h_count)
            
        print("  Post counts by format:")
        for fmt, cnt in posts_by_format.items():
            print(f"    - {fmt}: {cnt}")
            
        len_std = 0
        h_std = 0
        if len(posts) > 1:
            import numpy as np
            len_std = np.std(lengths)
            h_std = np.std(hash_counts)
            
        is_real = len_std > 5 and h_std > 0.5
        
        print(f"  Avg length: {np.mean(lengths):.1f} (std {len_std:.1f})")
        print(f"  Avg hashtags: {np.mean(hash_counts):.1f} (std {h_std:.1f})")
        print(f"  Appears real: {'YES' if is_real else 'NO (Seeded/Synthetic)'}")
        
    db.close()

if __name__ == "__main__":
    main()
