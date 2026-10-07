from typing import Dict, Any, List
from app.services.text_analyzer import TextAnalyzer
import re

class ValidationService:
    @staticmethod
    def validate_draft(
        draft_caption: str,
        draft_hashtags: List[str],
        style_profile: Dict[str, Any],
        historical_posts: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        
        # 1. Re-run text analysis on generated draft
        draft_features = TextAnalyzer.extract_features(draft_caption, draft_hashtags)
        
        # 2. Extract profile targets
        caption_stats = style_profile.get("caption_stats", {})
        target_words = caption_stats.get("average_word_count", 120)
        target_sentence_len = caption_stats.get("average_sentence_length", 14.0)
        
        emoji_prof = style_profile.get("emoji_profile", {})
        target_emoji_count = emoji_prof.get("avg_count", 2.0)
        
        hashtag_prof = style_profile.get("hashtag_profile", {})
        target_hashtag_count = hashtag_prof.get("avg_count", 5.0)
        
        cta_prof = style_profile.get("cta_profile", {})
        target_cta_freq = cta_prof.get("frequency", 0.6)
        
        tone_scores = style_profile.get("tone_scores", {})

        # 3. Calculate individual consistency metrics (0 to 100)
        
        # Tone Consistency
        tone_diff = abs(draft_features.get("formality_score", 0.5) - tone_scores.get("formality", 0.5)) + \
                    abs(draft_features.get("conversational_score", 0.5) - tone_scores.get("conversational", 0.5)) + \
                    abs(draft_features.get("educational_score", 0.5) - tone_scores.get("educational", 0.5))
        tone_metric = max(0, min(100, int(100 - (tone_diff / 3.0) * 100)))

        # Length Consistency
        word_count = draft_features.get("word_count", 0)
        word_diff = abs(word_count - target_words) / max(1, target_words)
        length_metric = max(0, min(100, int(100 - word_diff * 100)))

        # Structure Consistency
        has_hook = 1 if "hook" in draft_features.get("structure_components", []) else 0
        has_cta = draft_features.get("has_cta", 0)
        struct_metric = 90 if (has_hook and (has_cta or target_cta_freq < 0.3)) else 70

        # Emoji Usage Consistency
        emoji_count = draft_features.get("emoji_count", 0)
        emoji_diff = abs(emoji_count - target_emoji_count) / max(1.0, target_emoji_count)
        emoji_metric = max(0, min(100, int(100 - emoji_diff * 40)))

        # Hashtag Usage Consistency
        hashtag_count = draft_features.get("hashtag_count", 0)
        hashtag_diff = abs(hashtag_count - target_hashtag_count) / max(1.0, target_hashtag_count)
        hashtag_metric = max(0, min(100, int(100 - hashtag_diff * 40)))

        # CTA Consistency
        cta_metric = 95 if (has_cta and target_cta_freq >= 0.5) or (not has_cta and target_cta_freq < 0.5) else 65

        # Overall weighted score
        overall_score = round(
            (tone_metric * 0.25) +
            (length_metric * 0.20) +
            (struct_metric * 0.20) +
            (emoji_metric * 0.10) +
            (hashtag_metric * 0.10) +
            (cta_metric * 0.15),
            1
        )

        # 4. Copy-Protection and Originality Audit vs Historical Posts
        from app.services.embedding_service import EmbeddingService
        embedder = EmbeddingService()
        originality_info = ValidationService._check_originality(draft_caption, historical_posts, embedder)

        return {
            "overall_score": overall_score,
            "metrics_breakdown": {
                "tone": tone_metric,
                "length": length_metric,
                "structure": struct_metric,
                "emoji_usage": emoji_metric,
                "hashtag_usage": hashtag_metric,
                "cta": cta_metric,
            },
            "originality_status": originality_info["status"],
            "max_ngram_overlap": originality_info["max_ngram_overlap"],
            "max_cosine_corpus": float(originality_info.get("max_cosine_corpus", 0.0)),
            "flagged_phrases": originality_info["flagged_phrases"],
            "retrieved_examples_used": originality_info["retrieved_examples_used"]
        }

    @staticmethod
    def _check_originality(draft_caption: str, historical_posts: List[Dict[str, Any]], embedder: Any = None) -> Dict[str, Any]:
        draft_words = [w.lower() for w in re.findall(r"\b\w+\b", draft_caption)]
        if len(draft_words) < 5:
            return {"status": "PASS", "max_ngram_overlap": 0.0, "max_cosine_corpus": 0.0, "flagged_phrases": [], "retrieved_examples_used": []}

        # Create 5-grams
        draft_5grams = set(zip(draft_words[:-4], draft_words[1:-3], draft_words[2:-2], draft_words[3:-1], draft_words[4:]))

        max_overlap_ratio = 0.0
        max_cosine = 0.0
        flagged_phrases = []
        examples_used = []

        import numpy as np
        draft_vec = None
        if embedder:
            draft_vec = np.array(embedder.generate_embedding(draft_caption))

        for post in historical_posts:
            h_caption = post.get("caption", "")
            h_words = [w.lower() for w in re.findall(r"\b\w+\b", h_caption)]
            if len(h_words) < 5:
                continue

            h_5grams = set(zip(h_words[:-4], h_words[1:-3], h_words[2:-2], h_words[3:-1], h_words[4:]))

            overlap_5 = draft_5grams.intersection(h_5grams)

            if overlap_5:
                for gram in overlap_5:
                    phrase = " ".join(gram)
                    if phrase not in flagged_phrases:
                        flagged_phrases.append(phrase)

            overlap_ratio = len(overlap_5) / max(1, len(draft_5grams))
            if overlap_ratio > max_overlap_ratio:
                max_overlap_ratio = overlap_ratio
                
            # Cosine similarity
            h_vec_data = post.get("embedding_vector")
            if draft_vec is not None and h_vec_data:
                h_vec = np.array(h_vec_data)
                sim = np.dot(draft_vec, h_vec)
                if sim > max_cosine:
                    max_cosine = sim
                
            if post.get("id"):
                examples_used.append(post["id"])

        max_overlap_pct = round(max_overlap_ratio * 100, 1)

        if max_overlap_pct > 35.0 or len(flagged_phrases) >= 3 or max_cosine > 0.90:
            status = "FLAG"
        elif max_overlap_pct > 60.0 or max_cosine > 0.95:
            status = "REJECT"
        else:
            status = "PASS"

        return {
            "status": status,
            "max_ngram_overlap": max_overlap_pct,
            "max_cosine_corpus": float(max_cosine),
            "flagged_phrases": flagged_phrases[:5],
            "retrieved_examples_used": examples_used[:5]
        }
