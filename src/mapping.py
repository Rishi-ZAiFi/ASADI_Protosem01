"""Column mapping, platform auto-detection, and feature normalization for Creator Analytics Copilot."""

import re
from typing import Dict, List, Optional, Tuple
import pandas as pd
from src.config import (
    CANONICAL_COLUMNS,
    MINIMUM_REQUIRED_COLUMNS,
    PLATFORM_YOUTUBE,
    PLATFORM_INSTAGRAM,
    PLATFORM_TIKTOK,
    PLATFORM_GENERIC,
)
from src.loader import clean_numeric_value

# Synonyms for platform matching
PLATFORM_SIGNATURES = {
    PLATFORM_YOUTUBE: [
        "video title",
        "video publish time",
        "impressions click-through rate (%)",
        "watch time (hours)",
        "average percentage viewed (%)",
    ],
    PLATFORM_INSTAGRAM: [
        "post caption",
        "reach",
        "saves",
        "profile visits",
        "follows",
        "shares",
    ],
    PLATFORM_TIKTOK: [
        "video views",
        "total play time",
        "average watch time",
        "watched full video (%)",
    ],
}

# Synonyms for canonical columns
CANONICAL_SYNONYMS: Dict[str, List[str]] = {
    "title": [
        "title",
        "content title",
        "video title",
        "post title",
        "caption",
        "post caption",
        "text",
        "name",
        "headline",
    ],
    "published_at": [
        "publish date",
        "published date",
        "publish time",
        "published time",
        "date",
        "post time",
        "created at",
        "timestamp",
        "upload date",
        "video publish time",
    ],
    "views": [
        "views",
        "view count",
        "video views",
        "impressions",
        "reach",
        "plays",
        "impressions count",
    ],
    "likes": ["likes", "like count", "reactions", "hearts", "upvotes"],
    "comments": ["comments", "comment count", "replies", "responses"],
    "shares": ["shares", "share count", "reposts", "retweets", "forwards"],
    "format": ["format", "format type", "type", "post type", "content type", "media type"],
    "duration_seconds": [
        "duration (sec)",
        "duration (seconds)",
        "duration",
        "length (sec)",
        "video length",
        "duration_sec",
    ],
    "watch_time_hours": [
        "watch_time_hours",
        "watch time (hours)",
        "watch time",
        "watch hours",
        "total watch time (hours)",
        "total play time (hours)",
    ],
    "ctr": [
        "ctr",
        "click-through rate (%)",
        "click through rate (%)",
        "impressions click-through rate (%)",
        "ctr (%)",
        "reach rate (%)",
    ],
}

POWER_WORDS = {
    "secret", "insane", "mistake", "hack", "fast", "easy", "proven", "blueprint",
    "ultimate", "simple", "worst", "best", "truth", "revealed", "stop", "never",
    "genius", "shocking", "million", "double", "triple", "rules"
}


def detect_platform(columns: List[str]) -> str:
    """Auto-detects creator platform from column names."""
    col_set = {c.strip().lower() for c in columns}

    for platform, signatures in PLATFORM_SIGNATURES.items():
        matches = sum(1 for sig in signatures if any(sig in c for c in col_set))
        if matches >= 2:
            return platform

    return PLATFORM_GENERIC


def suggest_column_mapping(columns: List[str]) -> Dict[str, Optional[str]]:
    """Suggests an initial mapping from canonical fields to dataframe columns."""
    mapping: Dict[str, Optional[str]] = {}
    lower_to_actual = {c.strip().lower(): c for c in columns}

    for canonical, synonyms in CANONICAL_SYNONYMS.items():
        found_col = None
        # Exact lowercase match
        for syn in synonyms:
            if syn in lower_to_actual:
                found_col = lower_to_actual[syn]
                break
        
        # Substring match if no exact match
        if not found_col:
            for syn in synonyms:
                for low, act in lower_to_actual.items():
                    if syn in low or low in syn:
                        found_col = act
                        break
                if found_col:
                    break

        mapping[canonical] = found_col

    return mapping


def validate_mapping(mapping: Dict[str, Optional[str]]) -> Tuple[bool, List[str]]:
    """Checks if all required columns have been mapped."""
    missing = [req for req in MINIMUM_REQUIRED_COLUMNS if not mapping.get(req)]
    if missing:
        return False, [f"Required column '{CANONICAL_COLUMNS[m]}' must be mapped." for m in missing]
    return True, []


def extract_title_features(title: str) -> Dict[str, any]:
    """Extracts psychological and structural features from a title."""
    if not isinstance(title, str):
        title = ""

    chars = len(title)
    words = len(title.split())
    has_question = "?" in title or any(title.strip().lower().startswith(q) for q in ["how", "why", "what", "is", "can", "are", "do"])
    has_number = bool(re.search(r"\b\d+\b", title))
    has_emoji = bool(re.search(r"[\U00010000-\U0010ffff]", title))
    
    title_words = set(re.findall(r"\b[a-zA-Z]+\b", title.lower()))
    has_power = bool(title_words.intersection(POWER_WORDS))

    return {
        "title_length_chars": chars,
        "title_length_words": words,
        "has_question": has_question,
        "has_number": has_number,
        "has_emoji": has_emoji,
        "has_power_word": has_power,
    }


def normalize_dataset(df: pd.DataFrame, mapping: Dict[str, Optional[str]]) -> pd.DataFrame:
    """Creates a normalized DataFrame with canonical columns and derived feature engineering."""
    normalized = pd.DataFrame()

    # 1. Map Title
    title_col = mapping.get("title")
    normalized["title"] = df[title_col].astype(str).str.strip() if title_col and title_col in df else "Untitled"

    # 2. Map Published Date
    pub_col = mapping.get("published_at")
    if pub_col and pub_col in df:
        normalized["published_at"] = pd.to_datetime(df[pub_col], errors="coerce")
    else:
        normalized["published_at"] = pd.Timestamp.now()

    # Derived Date Features
    # Fill any NaT with current date
    normalized["published_at"] = normalized["published_at"].fillna(pd.Timestamp.now())
    normalized["day_of_week"] = normalized["published_at"].dt.day_name()
    normalized["hour_of_day"] = normalized["published_at"].dt.hour
    normalized["is_weekend"] = normalized["published_at"].dt.dayofweek.isin([5, 6])
    
    def get_time_bucket(hour: int) -> str:
        if 5 <= hour < 12:
            return "Morning (5AM - 12PM)"
        elif 12 <= hour < 17:
            return "Afternoon (12PM - 5PM)"
        elif 17 <= hour < 22:
            return "Evening (5PM - 10PM)"
        else:
            return "Night (10PM - 5AM)"
            
    normalized["time_of_day_bucket"] = normalized["hour_of_day"].apply(get_time_bucket)

    # 3. Numeric Columns
    for col in ["views", "likes", "comments", "shares", "duration_seconds", "watch_time_hours", "ctr"]:
        src_col = mapping.get(col)
        if src_col and src_col in df:
            normalized[col] = df[src_col].apply(clean_numeric_value)
        else:
            normalized[col] = 0.0

    # Ensure views >= 1 for division
    normalized["views"] = normalized["views"].clip(lower=0)

    # 4. Format
    fmt_col = mapping.get("format")
    if fmt_col and fmt_col in df:
        normalized["format"] = df[fmt_col].astype(str).str.strip().replace({"": "Standard", "nan": "Standard"})
    else:
        # Infer format from duration if available
        def infer_fmt(sec: float) -> str:
            if sec > 0 and sec <= 60:
                return "Shorts / Reel"
            elif sec > 60:
                return "Longform Video"
            return "Standard"
        normalized["format"] = normalized["duration_seconds"].apply(infer_fmt)

    # 5. Derived Duration Bucket
    def get_duration_bucket(sec: float) -> str:
        if sec <= 0:
            return "N/A (Non-video)"
        elif sec <= 60:
            return "< 1 min (Short-form)"
        elif sec <= 300:
            return "1 - 5 mins"
        elif sec <= 600:
            return "5 - 10 mins"
        elif sec <= 1200:
            return "10 - 20 mins"
        else:
            return "> 20 mins"

    normalized["duration_bucket"] = normalized["duration_seconds"].apply(get_duration_bucket)

    # 6. Engagement Rate (%)
    normalized["engagement_rate"] = (
        (normalized["likes"] + normalized["comments"] + normalized["shares"])
        / normalized["views"].apply(lambda v: max(v, 1.0))
        * 100.0
    ).round(2)

    # 7. Title Features
    title_features = [extract_title_features(t) for t in normalized["title"]]
    feat_df = pd.DataFrame(title_features)
    for c in feat_df.columns:
        normalized[c] = feat_df[c]

    return normalized
