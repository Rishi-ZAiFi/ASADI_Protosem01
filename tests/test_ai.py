"""Tests for Gemini AI integration, Pydantic validation, and fallback mechanisms."""

import pytest
import pandas as pd
from src.ai import (
    get_api_key,
    generate_ai_analysis,
    ask_your_data_ai,
    GeminiAnalysisResponse,
    InsightItem,
    HypothesisItem,
    ContentIdeaItem,
)
from src.analytics import compute_kpis, analyze_all_patterns, get_analytics_summary_for_ai
from src.mapping import suggest_column_mapping, normalize_dataset
from src.config import SAMPLE_DATA_PATH


@pytest.fixture
def analytics_bundle():
    df = pd.read_csv(SAMPLE_DATA_PATH)
    mapping = suggest_column_mapping(df.columns)
    norm = normalize_dataset(df, mapping)
    kpis = compute_kpis(norm)
    patterns = analyze_all_patterns(norm)
    summary = get_analytics_summary_for_ai(kpis, patterns)
    return kpis, patterns, summary


def test_get_api_key():
    assert get_api_key("custom_test_key") == "custom_test_key"
    assert get_api_key("   ") is None or isinstance(get_api_key("  "), str)


def test_pydantic_schema_validation():
    valid_payload = {
        "what_worked": [
            {
                "statement": "Shorts deliver 2x more views",
                "dimension": "Format",
                "confidence": "High",
                "sample_size": 30,
                "caveat": None,
            }
        ],
        "what_didnt": [
            {
                "statement": "Longform over 20m underperforms",
                "dimension": "Duration",
                "confidence": "Medium",
                "sample_size": 12,
                "caveat": None,
            }
        ],
        "why_hypotheses": [
            {
                "topic": "Shorts format advantage",
                "hypothesis": "Higher initial velocity on algorithmic swipe feeds.",
            }
        ],
        "next_10_ideas": [
            {
                "title": "7 AI Tools in 60s",
                "hook": "Here are 7 tools you missed...",
                "format": "Shorts",
                "best_posting_slot": "Evening (6-9 PM)",
                "data_backed_reason": "Matches highest performing format and window.",
            }
        ] * 10,
    }

    validated = GeminiAnalysisResponse.model_validate(valid_payload)
    assert len(validated.what_worked) == 1
    assert len(validated.next_10_ideas) == 10
    assert validated.what_worked[0].confidence == "High"


def test_ai_analysis_fallback_without_key(analytics_bundle):
    kpis, patterns, summary = analytics_bundle
    
    # Run with empty / placeholder key to test fallback
    result = generate_ai_analysis(summary, kpis, patterns, custom_api_key="")
    
    assert "what_worked" in result
    assert "what_didnt" in result
    assert "why_hypotheses" in result
    assert "next_10_ideas" in result
    assert len(result["next_10_ideas"]) == 10
    assert "rule" in result["source"]


def test_ask_your_data_ai_fallback(analytics_bundle):
    kpis, patterns, summary = analytics_bundle
    
    ans = ask_your_data_ai(
        query="When is my best time to post?",
        summary_for_ai=summary,
        kpis=kpis,
        patterns=patterns,
        chat_history=[],
        custom_api_key="",
    )
    assert len(ans) > 20
    assert "median views" in ans.lower()
