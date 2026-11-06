"""Tests for report export module."""

import pytest
from src.export import generate_markdown_report, generate_ideas_csv, generate_pdf_report


@pytest.fixture
def mock_export_data():
    kpis = {
        "total_posts": 50,
        "total_views": 150000,
        "mean_views": 3000.0,
        "median_views": 2500.0,
        "mean_engagement_rate": 8.5,
        "top_10_mean_views": 8000.0,
        "views_lift_vs_median_pct": 220.0,
        "total_watch_hours": 120.5,
        "mean_ctr": 7.2,
    }
    ai_results = {
        "what_worked": [
            {
                "statement": "Shorts format generates 2.1x views",
                "dimension": "Format",
                "confidence": "High",
                "sample_size": 25,
                "caveat": None,
            }
        ],
        "what_didnt": [
            {
                "statement": "Morning posts underperform",
                "dimension": "Timing",
                "confidence": "Medium",
                "sample_size": 15,
                "caveat": None,
            }
        ],
        "why_hypotheses": [
            {
                "topic": "Shorts Swipe Velocity",
                "hypothesis": "Quick dopamine reward loop drives algorithmic momentum.",
            }
        ],
        "next_10_ideas": [
            {
                "title": f"Idea {i}",
                "hook": f"Hook {i}",
                "format": "Shorts",
                "best_posting_slot": "Evening (6-9 PM)",
                "data_backed_reason": "Matches winning pattern",
            }
            for i in range(1, 11)
        ],
    }
    return kpis, ai_results


def test_generate_markdown_report(mock_export_data):
    kpis, ai_results = mock_export_data
    md = generate_markdown_report(kpis, ai_results, "YouTube Studio")
    assert "# 🚀 Creator Analytics Copilot" in md
    assert "YouTube Studio" in md
    assert "Shorts format generates 2.1x views" in md
    assert "Next 10 Content Ideas" in md


def test_generate_ideas_csv(mock_export_data):
    _, ai_results = mock_export_data
    csv_str = generate_ideas_csv(ai_results["next_10_ideas"])
    assert "title,hook,format" in csv_str
    assert "Idea 1" in csv_str
    assert len(csv_str.strip().split("\n")) == 11  # header + 10 rows


def test_generate_pdf_report(mock_export_data):
    kpis, ai_results = mock_export_data
    pdf_bytes = generate_pdf_report(kpis, ai_results, "YouTube Studio")
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 500
    assert pdf_bytes.startswith(b"%PDF")
