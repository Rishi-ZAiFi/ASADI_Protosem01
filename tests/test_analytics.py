"""Tests for analytics engine and pattern detection."""

import pytest
import pandas as pd
import numpy as np
from src.analytics import (
    compute_kpis,
    compute_confidence,
    analyze_dimension,
    compare_top_vs_bottom,
    analyze_all_patterns,
    get_analytics_summary_for_ai,
)
from src.mapping import suggest_column_mapping, normalize_dataset
from src.config import SAMPLE_DATA_PATH


@pytest.fixture
def sample_normalized_df():
    df = pd.read_csv(SAMPLE_DATA_PATH)
    mapping = suggest_column_mapping(df.columns)
    return normalize_dataset(df, mapping)


@pytest.fixture
def synthetic_df():
    # Deterministic test dataset
    data = {
        "title": [
            "Why 99% Fail", "7 Secrets Revealed", "Simple Review",
            "How to Build AI", "5 Daily Habits", "Regular Vlog",
            "Stop Doing This", "My Journey", "Behind the Scenes", "10 Tips for Growth"
        ],
        "published_at": pd.date_range("2026-06-01", periods=10, freq="D"),
        "views": [5000, 4500, 1000, 6000, 3800, 1200, 4200, 1500, 1100, 4800],
        "likes": [500, 400, 80, 700, 350, 90, 410, 120, 100, 460],
        "comments": [50, 40, 5, 80, 30, 10, 45, 12, 8, 50],
        "shares": [30, 25, 2, 50, 20, 5, 30, 8, 4, 35],
        "format": ["Shorts", "Shorts", "Longform Video", "Shorts", "Longform Video", "Longform Video", "Shorts", "Longform Video", "Longform Video", "Shorts"],
        "duration_seconds": [35, 45, 650, 40, 520, 700, 50, 800, 750, 42],
        "watch_time_hours": [12.5, 11.0, 4.5, 15.0, 8.2, 5.0, 10.5, 6.0, 4.8, 12.0],
        "ctr": [8.5, 7.8, 4.2, 9.2, 6.5, 3.8, 7.5, 4.5, 4.0, 8.0],
    }
    df = pd.DataFrame(data)
    mapping = suggest_column_mapping(df.columns)
    return normalize_dataset(df, mapping)


def test_compute_kpis_empty():
    assert compute_kpis(pd.DataFrame()) == {}


def test_compute_kpis_synthetic(synthetic_df):
    kpis = compute_kpis(synthetic_df)
    assert kpis["total_posts"] == 10
    assert kpis["total_views"] == 33100
    assert kpis["mean_views"] == 3310.0
    assert kpis["median_views"] == 4000.0
    assert kpis["mean_engagement_rate"] > 0
    assert kpis["ctr_present"] is True
    assert kpis["watch_present"] is True
    assert kpis["top_10_count"] == 1
    assert kpis["top_10_mean_views"] == 6000.0


def test_compute_confidence():
    assert compute_confidence(30, 0.40) == "High"
    assert compute_confidence(15, 0.15) == "Medium"
    assert compute_confidence(5, 0.50) == "Low"  # Small sample
    assert compute_confidence(30, 0.05) == "Low"  # Tiny effect


def test_analyze_dimension(synthetic_df):
    baseline_views = float(synthetic_df["views"].median())
    results = analyze_dimension(synthetic_df, "format", baseline_views)
    
    assert len(results) == 2
    # Shorts has higher views in synthetic dataset
    assert results[0]["category"] == "Shorts"
    assert results[0]["lift_pct"] > 0
    assert results[0]["sample_size"] == 5
    assert results[0]["is_small_sample"] is True  # 5 < 10


def test_compare_top_vs_bottom(synthetic_df):
    comp = compare_top_vs_bottom(synthetic_df, ratio=0.2)
    assert comp["sample_size_each"] == 2
    assert "top_summary" in comp
    assert "bottom_summary" in comp
    assert comp["top_summary"]["mean_views"] > comp["bottom_summary"]["mean_views"]


def test_analyze_all_patterns(sample_normalized_df):
    patterns = analyze_all_patterns(sample_normalized_df)
    assert "baseline_views" in patterns
    assert "format_patterns" in patterns
    assert "day_patterns" in patterns
    assert "time_patterns" in patterns
    assert "duration_patterns" in patterns
    assert "top_vs_bottom" in patterns
    assert len(patterns["format_patterns"]) > 0


def test_get_analytics_summary_for_ai(sample_normalized_df):
    kpis = compute_kpis(sample_normalized_df)
    patterns = analyze_all_patterns(sample_normalized_df)
    summary = get_analytics_summary_for_ai(kpis, patterns)
    
    assert "kpis" in summary
    assert "top_winning_patterns" in summary
    assert "top_vs_bottom" in summary
    # Assert zero raw rows leaked
    assert "title" not in summary["kpis"]
    assert isinstance(summary["kpis"]["total_views"], (int, float))
