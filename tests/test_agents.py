"""Tests for LangChain Multi-Agent System & LangSmith Tracing."""

import pytest
from src.agents.tools import (
    analyze_retention_curves,
    evaluate_browse_correlation,
    detect_outlier_patterns,
    score_title_clickability,
    generate_hook_script,
)
from src.agents.pattern_diagnostic_agent import PatternDiagnosticAgent
from src.agents.content_strategist_agent import ContentStrategistAgent
from src.agents.orchestrator import CopilotOrchestrator


def test_analyze_retention_curves_tool():
    result = analyze_retention_curves.invoke({
        "video_data": {
            "intro_retention_pct": 75.0,
            "avg_percentage_viewed": 55.0,
            "duration_seconds": 600.0,
        }
    })
    assert result["intro_retention_pct"] == 75.0
    assert result["intro_drop_pct"] == 25.0
    assert result["intro_health_rating"] == "Excellent"
    assert len(result["detected_hotspots"]) >= 1


def test_evaluate_browse_correlation_tool():
    result = evaluate_browse_correlation.invoke({
        "channel_metrics": {"ctr": 8.0, "retention_30s": 72.0}
    })
    assert "browse_velocity_score" in result
    assert "browse_distribution_tier" in result
    assert len(result["primary_findings"]) == 3


def test_detect_outlier_patterns_tool():
    top_vs_bottom = {
        "top_summary": {"mean_views": 100000},
        "bottom_summary": {"mean_views": 10000},
    }
    result = detect_outlier_patterns.invoke({"top_vs_bottom": top_vs_bottom})
    assert result["view_multiplier"] == 10.0
    assert len(result["isolated_drivers"]) == 3


def test_score_title_clickability_tool():
    title = "Why 99% of Channels Will Die in 2026"
    result = score_title_clickability.invoke({"title": title, "niche": "Tech"})
    assert result["evaluated_title"] == title
    assert result["clickability_score"] >= 80
    assert result["cognitive_load"] == "Optimal (5-9 words)"


def test_generate_hook_script_tool():
    result = generate_hook_script.invoke({
        "premise": "Test premise for viral retention",
        "target_audience": "Creators",
    })
    assert "00_05_visual_anchor" in result["hook_breakdown"]
    assert "05_15_problem_escalation" in result["hook_breakdown"]
    assert "15_30_stakes_and_payoff" in result["hook_breakdown"]
    assert "30_60_first_value_delivery" in result["hook_breakdown"]


def test_pattern_diagnostic_agent():
    agent = PatternDiagnosticAgent()
    summary = {
        "kpis": {"mean_views": 45000, "mean_ctr": 7.5},
        "top_vs_bottom": {
            "top_summary": {"mean_views": 90000},
            "bottom_summary": {"mean_views": 15000},
        },
    }
    dossier = agent.run(summary)
    assert dossier["status"] == "COMPLETED"
    assert dossier["agent"] == "PatternDiagnosticAgent"
    assert len(dossier["causal_drivers"]) == 3
    assert len(dossier["tools_called"]) == 3
    assert len(dossier["thought_trace"]) == 4


def test_content_strategist_agent():
    agent = ContentStrategistAgent()
    diag_dossier = {
        "executive_summary": "Top videos succeed via high CTR curiosity.",
        "causal_drivers": [],
    }
    result = agent.run(diag_dossier, niche="Tech", channel_name="TestChannel")
    assert result["status"] == "COMPLETED"
    assert result["agent"] == "ContentStrategistAgent"
    assert len(result["blueprints"]) == 5
    assert len(result["title_evaluations"]) == 5
    assert "primary_hook_script" in result


def test_copilot_orchestrator_pipeline():
    orchestrator = CopilotOrchestrator()
    summary = {
        "kpis": {"mean_views": 30000, "mean_ctr": 7.2},
        "top_vs_bottom": {
            "top_summary": {"mean_views": 80000},
            "bottom_summary": {"mean_views": 12000},
        },
    }
    pipeline_res = orchestrator.run_pipeline(summary, niche="Tech")
    assert pipeline_res["pipeline_status"] == "SUCCESS"
    assert "agent_1_diagnostic" in pipeline_res
    assert "agent_2_strategist" in pipeline_res
    assert len(pipeline_res["orchestrator_log"]) == 6
    assert pipeline_res["tracing_metadata"]["project_name"] == "creator-analytics-copilot"


def test_copilot_orchestrator_chat_routing():
    orchestrator = CopilotOrchestrator()
    
    # Creative question should route to ContentStrategistAgent
    creative_res = orchestrator.chat("Give me 3 new video ideas and title hooks", [])
    assert creative_res["responding_agent"] == "ContentStrategistAgent"
    
    # Metric question should route to PatternDiagnosticAgent
    metric_res = orchestrator.chat("What is my average retention at 30 seconds?", [])
    assert metric_res["responding_agent"] == "PatternDiagnosticAgent"
