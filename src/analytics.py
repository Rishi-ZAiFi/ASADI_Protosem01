"""Deterministic analytics and pattern detection engine for Creator Analytics Copilot."""

import math
from typing import Dict, Any, List, Optional
import pandas as pd
import numpy as np

from src.config import (
    CONFIDENCE_HIGH_SAMPLE,
    CONFIDENCE_MED_SAMPLE,
    CONFIDENCE_HIGH_LIFT,
    CONFIDENCE_MED_LIFT,
)


def compute_kpis(df: pd.DataFrame) -> Dict[str, Any]:
    """Computes high-level creator KPIs, averages, and median comparisons."""
    if df.empty:
        return {}

    total_posts = len(df)
    total_views = int(df["views"].sum())
    mean_views = float(df["views"].mean())
    median_views = float(df["views"].median())

    mean_eng = float(df["engagement_rate"].mean())
    median_eng = float(df["engagement_rate"].median())

    ctr_present = bool("ctr" in df.columns and df["ctr"].sum() > 0)
    mean_ctr = float(df["ctr"].mean()) if ctr_present else 0.0
    median_ctr = float(df["ctr"].median()) if ctr_present else 0.0

    watch_present = bool("watch_time_hours" in df.columns and df["watch_time_hours"].sum() > 0)
    total_watch = float(df["watch_time_hours"].sum()) if watch_present else 0.0

    # Top 10% vs Median
    top_n = max(1, int(math.ceil(total_posts * 0.1)))
    top_10_df = df.nlargest(top_n, "views")
    top_10_mean_views = float(top_10_df["views"].mean())
    views_lift_vs_median = ((top_10_mean_views - median_views) / max(median_views, 1.0)) * 100.0

    return {
        "total_posts": total_posts,
        "total_views": total_views,
        "mean_views": round(mean_views, 1),
        "median_views": round(median_views, 1),
        "mean_engagement_rate": round(mean_eng, 2),
        "median_engagement_rate": round(median_eng, 2),
        "ctr_present": ctr_present,
        "mean_ctr": round(mean_ctr, 2),
        "median_ctr": round(median_ctr, 2),
        "watch_present": watch_present,
        "total_watch_hours": round(total_watch, 1),
        "top_10_count": top_n,
        "top_10_mean_views": round(top_10_mean_views, 1),
        "views_lift_vs_median_pct": round(views_lift_vs_median, 1),
    }


def compute_confidence(sample_size: int, lift_ratio: float) -> str:
    """Calculates confidence score (High, Medium, Low) based on sample size and effect size."""
    abs_lift = abs(lift_ratio)
    if sample_size >= CONFIDENCE_HIGH_SAMPLE and abs_lift >= CONFIDENCE_HIGH_LIFT:
        return "High"
    elif sample_size >= CONFIDENCE_MED_SAMPLE and abs_lift >= CONFIDENCE_MED_LIFT:
        return "Medium"
    else:
        return "Low"


def analyze_dimension(
    df: pd.DataFrame,
    dim_col: str,
    baseline_views: float,
    metric_col: str = "views"
) -> List[Dict[str, Any]]:
    """Analyzes a categorical or bucketed dimension for performance lift, sample size, and confidence."""
    if dim_col not in df.columns or df.empty:
        return []

    groups = df.groupby(dim_col)
    results = []

    for name, group in groups:
        sample_size = len(group)
        group_median = float(group[metric_col].median())
        group_mean = float(group[metric_col].mean())
        group_eng = float(group["engagement_rate"].median())

        lift_ratio = (group_median - baseline_views) / max(baseline_views, 1.0)
        lift_pct = lift_ratio * 100.0
        confidence = compute_confidence(sample_size, lift_ratio)
        is_small_sample = sample_size < CONFIDENCE_MED_SAMPLE

        results.append({
            "dimension": dim_col,
            "category": str(name),
            "sample_size": sample_size,
            "median_views": round(group_median, 1),
            "mean_views": round(group_mean, 1),
            "median_engagement": round(group_eng, 2),
            "lift_pct": round(lift_pct, 1),
            "lift_ratio": round(lift_ratio, 2),
            "confidence": confidence,
            "is_small_sample": is_small_sample,
            "caveat": (
                f"Small sample size (N={sample_size}). Treat with caution."
                if is_small_sample else None
            ),
        })

    # Sort descending by lift_pct
    results.sort(key=lambda x: x["lift_pct"], reverse=True)
    return results


def compare_top_vs_bottom(df: pd.DataFrame, ratio: float = 0.1) -> Dict[str, Any]:
    """Compares top 10% vs bottom 10% of content to identify winning patterns."""
    if df.empty:
        return {}

    n = max(1, int(math.ceil(len(df) * ratio)))
    top_df = df.nlargest(n, "views")
    bottom_df = df.nsmallest(n, "views")

    def get_summary(subset: pd.DataFrame) -> Dict[str, Any]:
        return {
            "count": len(subset),
            "mean_views": round(float(subset["views"].mean()), 1),
            "median_views": round(float(subset["views"].median()), 1),
            "mean_engagement": round(float(subset["engagement_rate"].mean()), 2),
            "pct_questions": round(float(subset["has_question"].mean() * 100), 1),
            "pct_numbers": round(float(subset["has_number"].mean() * 100), 1),
            "pct_power_words": round(float(subset["has_power_word"].mean() * 100), 1),
            "mean_title_words": round(float(subset["title_length_words"].mean()), 1),
            "top_formats": subset["format"].value_counts().to_dict(),
            "top_time_buckets": subset["time_of_day_bucket"].value_counts().to_dict(),
            "top_days": subset["day_of_week"].value_counts().to_dict(),
        }

    top_summary = get_summary(top_df)
    bottom_summary = get_summary(bottom_df)

    # Commonalities & Differentiators
    key_findings = []
    
    if top_summary["pct_numbers"] > bottom_summary["pct_numbers"] + 20:
        key_findings.append(
            f"Top content is {top_summary['pct_numbers']:.0f}% more likely to feature numbers in titles than bottom content ({bottom_summary['pct_numbers']:.0f}%)."
        )
    if top_summary["pct_questions"] > bottom_summary["pct_questions"] + 15:
        key_findings.append(
            f"Top performers leverage question hooks ({top_summary['pct_questions']:.0f}% of winners vs {bottom_summary['pct_questions']:.0f}% of bottom posts)."
        )

    # Identify most dominant format in top posts
    if top_summary["top_formats"]:
        dominant_fmt, dom_cnt = list(top_summary["top_formats"].items())[0]
        fmt_pct = (dom_cnt / top_summary["count"]) * 100.0
        key_findings.append(f"Dominant winning format: '{dominant_fmt}' accounts for {fmt_pct:.0f}% of top-tier content.")

    return {
        "sample_size_each": n,
        "top_summary": top_summary,
        "bottom_summary": bottom_summary,
        "key_findings": key_findings,
    }


def analyze_all_patterns(df: pd.DataFrame) -> Dict[str, Any]:
    """Runs end-to-end pattern detection across all dimensions and feature groups."""
    if df.empty:
        return {}

    baseline_views = float(df["views"].median())

    # Add Title Length Buckets
    def get_title_bucket(words: int) -> str:
        if words <= 5:
            return "Short (≤ 5 words)"
        elif words <= 9:
            return "Medium (6 - 9 words)"
        else:
            return "Long (≥ 10 words)"

    df_copy = df.copy()
    df_copy["title_word_bucket"] = df_copy["title_length_words"].apply(get_title_bucket)

    # Boolean to string for cleaner reporting
    df_copy["has_question_label"] = df_copy["has_question"].map({True: "Includes Question Hook", False: "No Question Hook"})
    df_copy["has_number_label"] = df_copy["has_number"].map({True: "Includes Number", False: "No Number"})
    df_copy["has_power_word_label"] = df_copy["has_power_word"].map({True: "Includes Power Word", False: "No Power Word"})

    # Analyze dimensions
    format_patterns = analyze_dimension(df_copy, "format", baseline_views)
    day_patterns = analyze_dimension(df_copy, "day_of_week", baseline_views)
    time_patterns = analyze_dimension(df_copy, "time_of_day_bucket", baseline_views)
    hour_patterns = analyze_dimension(df_copy, "hour_of_day", baseline_views)
    duration_patterns = analyze_dimension(df_copy, "duration_bucket", baseline_views)
    title_len_patterns = analyze_dimension(df_copy, "title_word_bucket", baseline_views)
    question_patterns = analyze_dimension(df_copy, "has_question_label", baseline_views)
    number_patterns = analyze_dimension(df_copy, "has_number_label", baseline_views)
    power_word_patterns = analyze_dimension(df_copy, "has_power_word_label", baseline_views)

    # Top vs Bottom comparison
    top_vs_bottom = compare_top_vs_bottom(df_copy)

    # High Confidence Highlights
    all_patterns_flat = (
        format_patterns + day_patterns + time_patterns +
        duration_patterns + title_len_patterns + question_patterns +
        number_patterns + power_word_patterns
    )
    
    high_confidence_wins = [
        p for p in all_patterns_flat if p["confidence"] == "High" and p["lift_pct"] > 0
    ]
    med_confidence_wins = [
        p for p in all_patterns_flat if p["confidence"] == "Medium" and p["lift_pct"] > 0
    ]

    return {
        "baseline_views": baseline_views,
        "format_patterns": format_patterns,
        "day_patterns": day_patterns,
        "time_patterns": time_patterns,
        "hour_patterns": hour_patterns,
        "duration_patterns": duration_patterns,
        "title_len_patterns": title_len_patterns,
        "question_patterns": question_patterns,
        "number_patterns": number_patterns,
        "power_word_patterns": power_word_patterns,
        "top_vs_bottom": top_vs_bottom,
        "high_confidence_wins": high_confidence_wins,
        "med_confidence_wins": med_confidence_wins,
    }


def get_analytics_summary_for_ai(kpis: Dict[str, Any], patterns: Dict[str, Any]) -> Dict[str, Any]:
    """Distills computed statistics and pattern summaries for the Gemini AI layer (Zero Raw Rows)."""
    return {
        "kpis": {
            "total_posts": kpis.get("total_posts"),
            "total_views": kpis.get("total_views"),
            "mean_views": kpis.get("mean_views"),
            "median_views": kpis.get("median_views"),
            "mean_engagement_rate": kpis.get("mean_engagement_rate"),
            "mean_ctr": kpis.get("mean_ctr"),
            "total_watch_hours": kpis.get("total_watch_hours"),
            "top_10_mean_views": kpis.get("top_10_mean_views"),
            "views_lift_vs_median_pct": kpis.get("views_lift_vs_median_pct"),
        },
        "top_winning_patterns": [
            {
                "category": p["category"],
                "dimension": p["dimension"],
                "lift_pct": p["lift_pct"],
                "sample_size": p["sample_size"],
                "confidence": p["confidence"],
            }
            for p in patterns.get("high_confidence_wins", [])[:5] + patterns.get("med_confidence_wins", [])[:5]
        ],
        "top_vs_bottom": {
            "key_findings": patterns.get("top_vs_bottom", {}).get("key_findings", []),
            "winner_characteristics": patterns.get("top_vs_bottom", {}).get("top_summary", {}),
            "underperformer_characteristics": patterns.get("top_vs_bottom", {}).get("bottom_summary", {}),
        },
        "best_formats": [
            {"format": p["category"], "lift_pct": p["lift_pct"], "confidence": p["confidence"], "n": p["sample_size"]}
            for p in patterns.get("format_patterns", []) if p["lift_pct"] > 0
        ],
        "best_posting_times": [
            {"time_slot": p["category"], "lift_pct": p["lift_pct"], "confidence": p["confidence"], "n": p["sample_size"]}
            for p in patterns.get("time_patterns", []) if p["lift_pct"] > 0
        ],
    }
