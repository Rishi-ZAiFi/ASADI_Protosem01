"""Tests for rule-based insights and offline fallback engine."""

import pytest
import pandas as pd
from src.analytics import compute_kpis, analyze_all_patterns
from src.insights import (
    generate_rule_based_insights,
    generate_rule_based_ideas,
    answer_data_query_rule_based,
)
from src.mapping import suggest_column_mapping, normalize_dataset
from src.config import SAMPLE_DATA_PATH


@pytest.fixture
def analytics_data():
    df = pd.read_csv(SAMPLE_DATA_PATH)
    mapping = suggest_column_mapping(df.columns)
    norm = normalize_dataset(df, mapping)
    kpis = compute_kpis(norm)
    patterns = analyze_all_patterns(norm)
    return kpis, patterns


def test_generate_rule_based_insights(analytics_data):
    kpis, patterns = analytics_data
    insights = generate_rule_based_insights(kpis, patterns)
    
    assert "what_worked" in insights
    assert "what_didnt" in insights
    assert "why_hypotheses" in insights
    assert len(insights["what_worked"]) > 0
    assert len(insights["why_hypotheses"]) > 0
    
    # Check structure of a what_worked item
    item = insights["what_worked"][0]
    assert "statement" in item
    assert "confidence" in item
    assert "sample_size" in item


def test_generate_rule_based_ideas(analytics_data):
    kpis, patterns = analytics_data
    ideas = generate_rule_based_ideas(kpis, patterns)
    
    assert len(ideas) == 10
    assert "title" in ideas[0]
    assert "hook" in ideas[0]
    assert "best_posting_slot" in ideas[0]
    assert "data_backed_reason" in ideas[0]


def test_answer_data_query_rule_based(analytics_data):
    kpis, patterns = analytics_data
    
    ans_time = answer_data_query_rule_based("when is the best time to post?", kpis, patterns)
    assert "median views" in ans_time.lower()
    
    ans_format = answer_data_query_rule_based("what is my best format?", kpis, patterns)
    assert "format" in ans_format.lower()
    
    ans_predict = answer_data_query_rule_based("can you predict my views tomorrow?", kpis, patterns)
    assert "limitation notice" in ans_predict.lower()
