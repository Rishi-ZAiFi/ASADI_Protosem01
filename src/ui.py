"""UI components and layout helpers for Creator Analytics Copilot."""

import streamlit as st
from src.config import CSS_PATH


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


def render_kpi_card(label: str, value: str, delta: str = None, is_positive: bool = True) -> str:
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
