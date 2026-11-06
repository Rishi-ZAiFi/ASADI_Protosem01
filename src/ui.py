"""UI components, layout helpers, and interactive Plotly charts for Creator Analytics Copilot."""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from typing import Dict, Any, Optional

from src.config import CSS_PATH

THEME_COLOR_PRIMARY = "#4F46E5"
THEME_COLOR_ACCENT = "#7C3AED"
THEME_COLOR_SUCCESS = "#10B981"
THEME_COLOR_WARNING = "#F59E0B"
THEME_COLOR_MUTED = "#6B7280"


def inject_custom_css() -> None:
    """Injects responsive custom CSS from assets/style.css."""
    if CSS_PATH.exists():
        with open(CSS_PATH, "r", encoding="utf-8") as f:
            css = f.read()
        st.markdown(f"<style>{css}</style>", unsafe_allow_html=True)


def render_hero_header() -> None:
    """Renders the top branding header."""
    st.markdown(
        """
        <div class="hero-header">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span style="font-size: 2.2rem;">✨</span>
                <div>
                    <h1 style="margin: 0; font-size: 1.85rem; font-weight: 800; color: white;">Creator Analytics Copilot</h1>
                    <p style="margin: 0.25rem 0 0 0; color: #E0E7FF; font-size: 0.95rem;">
                        Transform messy analytics into actionable growth insights and your next 10 high-performing content ideas.
                    </p>
                </div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_privacy_callout() -> None:
    """Displays user privacy reassurance."""
    st.markdown(
        """
        <div class="privacy-banner">
            <span style="font-size: 1.1rem;">🔒</span>
            <div>
                <strong>Privacy Guaranteed:</strong> Your data remains strictly in your local session. 
                Raw rows are never shared with external services; only aggregated summary statistics are sent to AI for synthesis.
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )


def render_kpi_card(label: str, value: str, delta: Optional[str] = None, is_positive: bool = True) -> str:
    """Generates HTML for a responsive KPI stat card."""
    delta_html = ""
    if delta:
        delta_class = "kpi-delta-pos" if is_positive else "kpi-delta-neg"
        arrow = "▲" if is_positive else "▼"
        delta_html = f'<div class="{delta_class}">{arrow} {delta} vs median</div>'

    return f"""
    <div class="kpi-card">
        <div class="kpi-label">{label}</div>
        <div class="kpi-value">{value}</div>
        {delta_html}
    </div>
    """


def render_confidence_badge(confidence: str) -> str:
    """Returns styled HTML badge for confidence level."""
    conf = (confidence or "low").lower()
    if "high" in conf:
        cls = "badge-high"
        label = "High Confidence"
    elif "med" in conf:
        cls = "badge-med"
        label = "Medium Confidence"
    else:
        cls = "badge-low"
        label = "Low Confidence"
    return f'<span class="badge {cls}">{label}</span>'


def create_timeline_chart(df: pd.DataFrame) -> go.Figure:
    """Interactive performance-over-time scatter/line plot."""
    df_sorted = df.sort_values("published_at").copy()
    
    fig = px.scatter(
        df_sorted,
        x="published_at",
        y="views",
        color="format",
        size="engagement_rate",
        hover_name="title",
        hover_data={
            "published_at": "|%b %d, %Y %H:%M",
            "views": ":,",
            "engagement_rate": ":.2f%",
            "format": True,
        },
        labels={
            "published_at": "Published Date",
            "views": "Views",
            "format": "Content Format",
            "engagement_rate": "Engagement Rate",
        },
        color_discrete_sequence=px.colors.qualitative.Bold,
    )

    # Add 7-post rolling median trendline
    if len(df_sorted) >= 7:
        rolling_views = df_sorted["views"].rolling(window=7, min_periods=3).median()
        fig.add_trace(
            go.Scatter(
                x=df_sorted["published_at"],
                y=rolling_views,
                mode="lines",
                name="7-Post Rolling Median",
                line=dict(color="#1E1B4B", width=2.5, dash="dot"),
            )
        )

    fig.update_layout(
        template="plotly_white",
        margin=dict(l=20, r=20, t=30, b=20),
        height=380,
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        hovermode="closest",
    )
    return fig


def create_posting_heatmap(df: pd.DataFrame) -> go.Figure:
    """Creates a 2D Heatmap of Day of Week vs Hour of Day performance."""
    days_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    hours_order = list(range(24))

    # Pivot median views
    pivot_views = df.pivot_table(
        index="day_of_week",
        columns="hour_of_day",
        values="views",
        aggfunc="median",
        fill_value=0,
    ).reindex(index=days_order, columns=hours_order, fill_value=0)

    # Pivot counts for hover text
    pivot_counts = df.pivot_table(
        index="day_of_week",
        columns="hour_of_day",
        values="views",
        aggfunc="count",
        fill_value=0,
    ).reindex(index=days_order, columns=hours_order, fill_value=0)

    hover_text = [
        [
            f"Day: {day}<br>Hour: {hour:02d}:00<br>Median Views: {int(pivot_views.loc[day, hour]):,}<br>Posts: {int(pivot_counts.loc[day, hour])}"
            for hour in hours_order
        ]
        for day in days_order
    ]

    fig = go.Figure(
        data=go.Heatmap(
            z=pivot_views.values,
            x=[f"{h:02d}:00" for h in hours_order],
            y=days_order,
            hoverinfo="text",
            text=hover_text,
            colorscale="Purples",
            colorbar=dict(title="Median Views"),
        )
    )

    fig.update_layout(
        template="plotly_white",
        margin=dict(l=20, r=20, t=30, b=20),
        height=320,
        xaxis=dict(title="Hour of Day (24h)", tickmode="linear"),
        yaxis=dict(title="Day of Week", autorange="reversed"),
    )
    return fig


def create_format_comparison_chart(format_patterns: list) -> go.Figure:
    """Bar chart comparing median views and lift across content formats."""
    if not format_patterns:
        return go.Figure()

    df_fmt = pd.DataFrame(format_patterns)
    colors = [THEME_COLOR_SUCCESS if l >= 0 else THEME_COLOR_WARNING for l in df_fmt["lift_pct"]]

    fig = go.Figure()
    fig.add_trace(
        go.Bar(
            x=df_fmt["category"],
            y=df_fmt["median_views"],
            text=[f"{l:+.1f}% lift (N={n})" for l, n in zip(df_fmt["lift_pct"], df_fmt["sample_size"])],
            textposition="auto",
            marker_color=colors,
            name="Median Views",
        )
    )

    fig.update_layout(
        template="plotly_white",
        margin=dict(l=20, r=20, t=30, b=20),
        height=320,
        xaxis_title="Content Format",
        yaxis_title="Median Views",
        showlegend=False,
    )
    return fig


def create_top_vs_bottom_chart(top_vs_bottom: Dict[str, Any]) -> go.Figure:
    """Grouped bar chart comparing feature prevalence in Top 10% vs Bottom 10%."""
    if not top_vs_bottom:
        return go.Figure()

    top_s = top_vs_bottom.get("top_summary", {})
    bot_s = top_vs_bottom.get("bottom_summary", {})

    metrics = ["Questions in Title", "Numbers in Title", "Power Words in Title", "Engagement Rate (%)"]
    top_vals = [
        top_s.get("pct_questions", 0),
        top_s.get("pct_numbers", 0),
        top_s.get("pct_power_words", 0),
        top_s.get("mean_engagement", 0),
    ]
    bot_vals = [
        bot_s.get("pct_questions", 0),
        bot_s.get("pct_numbers", 0),
        bot_s.get("pct_power_words", 0),
        bot_s.get("mean_engagement", 0),
    ]

    fig = go.Figure()
    fig.add_trace(
        go.Bar(
            name="Top 10% Winners",
            x=metrics,
            y=top_vals,
            marker_color=THEME_COLOR_PRIMARY,
        )
    )
    fig.add_trace(
        go.Bar(
            name="Bottom 10% Underperformers",
            x=metrics,
            y=bot_vals,
            marker_color="#9CA3AF",
        )
    )

    fig.update_layout(
        barmode="group",
        template="plotly_white",
        margin=dict(l=20, r=20, t=30, b=20),
        height=300,
        yaxis_title="Percentage / Rate (%)",
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    )
    return fig
