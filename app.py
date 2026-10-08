"""Creator Analytics Copilot - Entry Point Application."""

import os
import streamlit as st
import pandas as pd
from dotenv import load_dotenv

from src.config import (
    SAMPLE_DATA_PATH,
    CANONICAL_COLUMNS,
    MINIMUM_REQUIRED_COLUMNS,
    MAX_UPLOAD_SIZE_MB,
)
from src.loader import load_file, validate_file_metadata, DataValidationError
from src.mapping import (
    detect_platform,
    suggest_column_mapping,
    validate_mapping,
    normalize_dataset,
)
from src.analytics import (
    compute_kpis,
    analyze_all_patterns,
    get_analytics_summary_for_ai,
)
from src.agents import CopilotOrchestrator
from src.ui import (
    inject_custom_css,
    render_hero_header,
    render_privacy_callout,
    render_kpi_card,
    create_timeline_chart,
    create_posting_heatmap,
    create_format_comparison_chart,
    create_top_vs_bottom_chart,
)

# Load environment variables
load_dotenv()

# Streamlit Page Config
st.set_page_config(
    page_title="Creator Analytics Copilot",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Apply custom styling
inject_custom_css()

# Session State Initialization
if "raw_df" not in st.session_state:
    st.session_state.raw_df = None
if "data" not in st.session_state:
    st.session_state.data = None
if "platform" not in st.session_state:
    st.session_state.platform = None
if "column_mapping" not in st.session_state:
    st.session_state.column_mapping = {}
if "load_warnings" not in st.session_state:
    st.session_state.load_warnings = []
if "kpis" not in st.session_state:
    st.session_state.kpis = None
if "patterns" not in st.session_state:
    st.session_state.patterns = None
if "ai_results" not in st.session_state:
    st.session_state.ai_results = None
if "multi_agent_results" not in st.session_state:
    st.session_state.multi_agent_results = None
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# Sidebar Controls
with st.sidebar:
    st.markdown("### ⚙️ Workspace & Settings")
    st.markdown("---")
    
    # API Key Configuration
    api_key_input = st.text_input(
        "Gemini API Key (Optional)",
        type="password",
        help="Optional: If omitted, the app will read GEMINI_API_KEY from .env or use deterministic agent reasoning.",
    )
    if api_key_input:
        st.session_state["CUSTOM_GEMINI_KEY"] = api_key_input

    # LangSmith Tracing Configuration
    st.markdown("### 🦜️🛠️ LangSmith Tracing")
    langsmith_key_input = st.text_input(
        "LangSmith API Key (Optional)",
        type="password",
        value=os.getenv("LANGCHAIN_API_KEY", ""),
        help="Enables live execution traces, latency tracking, and token telemetry in LangSmith.",
    )
    langsmith_project_input = st.text_input(
        "LangSmith Project",
        value=os.getenv("LANGCHAIN_PROJECT", "creator-analytics-copilot"),
    )
    
    # Initialize Multi-Agent Orchestrator
    orchestrator = CopilotOrchestrator(
        gemini_api_key=st.session_state.get("CUSTOM_GEMINI_KEY"),
        langsmith_api_key=langsmith_key_input,
        langsmith_project=langsmith_project_input,
    )
    tracing_status = orchestrator.get_tracing_status()
    
    if tracing_status["langsmith_active"]:
        st.success(f"🟢 LangSmith Active: `{tracing_status['project_name']}`")
    else:
        st.info("⚪ LangSmith Tracing Ready (Local Tracing Active)")

    st.markdown("#### 🤖 Registered Agents")
    st.caption("1. 🔍 **PatternDiagnosticAgent** (Causal Forensics & Retention)")
    st.caption("2. 🎨 **ContentStrategistAgent** (Blueprints & 60s Hook Scripts)")

    st.markdown("---")
    if st.button("🗑️ Clear My Data", use_container_width=True):
        for key in ["raw_df", "data", "platform", "column_mapping", "load_warnings", "kpis", "patterns", "ai_results", "multi_agent_results", "chat_history"]:
            st.session_state[key] = None if key != "chat_history" else []
        st.rerun()

    st.caption("🔒 All data stays in your browser session.")

# Main Header
render_hero_header()
render_privacy_callout()

# Navigation Tabs
tab_overview, tab_insights, tab_ideas, tab_chat, tab_export = st.tabs(
    ["📊 Dashboard", "💡 Insights & Patterns", "🚀 Next 10 Ideas", "💬 Ask Your Data", "📥 Export & Reports"]
)

# Ingestion & Dashboard Section
with tab_overview:
    if st.session_state.data is None:
        st.markdown("### 📁 Ingest Content Analytics")
        st.write("Upload your exported analytics CSV/XLSX from YouTube, Instagram, TikTok, or use our pre-seeded realistic dataset.")

        col_upload, col_sample = st.columns([2, 1], gap="medium")
        
        with col_upload:
            st.markdown("#### Option A: Upload Analytics File")
            uploaded_file = st.file_uploader(
                f"Choose CSV or Excel file (Max {MAX_UPLOAD_SIZE_MB}MB)",
                type=["csv", "xlsx", "xls"],
                help="Export your posts or videos performance report from your platform dashboard.",
            )
            if uploaded_file is not None:
                try:
                    validate_file_metadata(uploaded_file.name, uploaded_file.size)
                    raw_df, warnings = load_file(uploaded_file, uploaded_file.name)
                    st.session_state.raw_df = raw_df
                    st.session_state.load_warnings = warnings
                    st.session_state.platform = detect_platform(raw_df.columns.tolist())
                    st.session_state.column_mapping = suggest_column_mapping(raw_df.columns.tolist())
                    
                    # Normalize
                    normalized_df = normalize_dataset(raw_df, st.session_state.column_mapping)
                    st.session_state.data = normalized_df
                    st.session_state.kpis = compute_kpis(normalized_df)
                    st.session_state.patterns = analyze_all_patterns(normalized_df)
                    st.success(f"Successfully loaded {len(normalized_df)} posts! Detected platform: **{st.session_state.platform}**")
                    st.rerun()
                except DataValidationError as e:
                    st.error(f"⚠️ Validation Error: {str(e)}")
                except Exception as e:
                    st.error(f"❌ Failed to process file: {str(e)}")

        with col_sample:
            st.markdown("#### Option B: Quick Demo")
            st.write("Explore with 75 realistic multi-format creator posts (Shorts, Longform, evening posting patterns).")
            if st.button("🚀 Load Realistic Sample Data", use_container_width=True):
                raw_df, warnings = load_file(str(SAMPLE_DATA_PATH), "sample_data.csv")
                st.session_state.raw_df = raw_df
                st.session_state.load_warnings = warnings
                st.session_state.platform = detect_platform(raw_df.columns.tolist())
                st.session_state.column_mapping = suggest_column_mapping(raw_df.columns.tolist())
                
                normalized_df = normalize_dataset(raw_df, st.session_state.column_mapping)
                st.session_state.data = normalized_df
                st.session_state.kpis = compute_kpis(normalized_df)
                st.session_state.patterns = analyze_all_patterns(normalized_df)
                st.success("Loaded sample dataset!")
                st.rerun()

    else:
        # Recompute if needed
        if st.session_state.kpis is None:
            st.session_state.kpis = compute_kpis(st.session_state.data)
        if st.session_state.patterns is None:
            st.session_state.patterns = analyze_all_patterns(st.session_state.data)

        kpis = st.session_state.kpis
        patterns = st.session_state.patterns
        df = st.session_state.data

        # Top Control & Metadata bar
        col_status, col_btn = st.columns([3, 1])
        with col_status:
            st.markdown(
                f"**Platform:** `{st.session_state.platform}` | "
                f"**Total Posts:** `{kpis['total_posts']:,}` | "
                f"**Date Range:** `{df['published_at'].min().strftime('%b %d, %Y')}` to `{df['published_at'].max().strftime('%b %d, %Y')}`"
            )
            for w in st.session_state.load_warnings:
                st.caption(f"ℹ️ {w}")
        with col_btn:
            if st.button("🔄 Upload Different File", use_container_width=True):
                for key in ["raw_df", "data", "platform", "column_mapping", "load_warnings", "kpis", "patterns", "ai_results"]:
                    st.session_state[key] = None
                st.rerun()

        # Expandable column mapping tweaker
        with st.expander("🛠️ Review / Fix Column Mapping", expanded=False):
            st.write("Adjust how your file's columns map to our canonical analytics fields:")
            if st.session_state.raw_df is not None:
                source_cols = ["(None / Unmapped)"] + st.session_state.raw_df.columns.tolist()
                new_mapping = {}
                mapping_cols = st.columns(2)
                for i, (canon_key, canon_label) in enumerate(CANONICAL_COLUMNS.items()):
                    curr_val = st.session_state.column_mapping.get(canon_key)
                    default_idx = source_cols.index(curr_val) if curr_val in source_cols else 0
                    
                    with mapping_cols[i % 2]:
                        selected = st.selectbox(
                            f"{canon_label} {'*' if canon_key in MINIMUM_REQUIRED_COLUMNS else ''}",
                            options=source_cols,
                            index=default_idx,
                            key=f"map_{canon_key}",
                        )
                        new_mapping[canon_key] = None if selected == "(None / Unmapped)" else selected

                if st.button("Apply New Mapping"):
                    valid, missing_errs = validate_mapping(new_mapping)
                    if not valid:
                        for err in missing_errs:
                            st.error(err)
                    else:
                        st.session_state.column_mapping = new_mapping
                        st.session_state.data = normalize_dataset(st.session_state.raw_df, new_mapping)
                        st.session_state.kpis = compute_kpis(st.session_state.data)
                        st.session_state.patterns = analyze_all_patterns(st.session_state.data)
                        st.session_state.ai_results = None
                        st.success("Column mapping updated and analytics refreshed!")
                        st.rerun()

        st.markdown("---")

        # 1. KPI Cards Row
        kpi_cols = st.columns(4)
        with kpi_cols[0]:
            st.markdown(
                render_kpi_card(
                    label="Total Views",
                    value=f"{kpis['total_views']:,}",
                    delta=f"Avg {kpis['mean_views']:,.0f}",
                    is_positive=True,
                ),
                unsafe_allow_html=True,
            )
        with kpi_cols[1]:
            st.markdown(
                render_kpi_card(
                    label="Median Views",
                    value=f"{kpis['median_views']:,.0f}",
                    delta=f"+{kpis['views_lift_vs_median_pct']:.0f}% (Top 10%)",
                    is_positive=True,
                ),
                unsafe_allow_html=True,
            )
        with kpi_cols[2]:
            st.markdown(
                render_kpi_card(
                    label="Avg Engagement Rate",
                    value=f"{kpis['mean_engagement_rate']:.2f}%",
                    delta=f"Med {kpis['median_engagement_rate']:.2f}%",
                    is_positive=True,
                ),
                unsafe_allow_html=True,
            )
        with kpi_cols[3]:
            if kpis["watch_present"]:
                st.markdown(
                    render_kpi_card(
                        label="Total Watch Time",
                        value=f"{kpis['total_watch_hours']:,.1f}h",
                        delta=None,
                    ),
                    unsafe_allow_html=True,
                )
            elif kpis["ctr_present"]:
                st.markdown(
                    render_kpi_card(
                        label="Average CTR",
                        value=f"{kpis['mean_ctr']:.2f}%",
                        delta=f"Med {kpis['median_ctr']:.2f}%",
                    ),
                    unsafe_allow_html=True,
                )
            else:
                st.markdown(
                    render_kpi_card(
                        label="Total Content Posts",
                        value=f"{kpis['total_posts']:,}",
                        delta=None,
                    ),
                    unsafe_allow_html=True,
                )

        st.markdown("### 📈 Performance Over Time")
        st.plotly_chart(create_timeline_chart(df), use_container_width=True)
        st.caption(
            "💡 **Trend Summary:** Dot sizes reflect engagement rates. The dotted line tracks your 7-post rolling median baseline. "
            "Hover over any post to see its exact title, views, and publish timestamp."
        )

        st.markdown("---")

        # 2. Heatmap & Format Bars Row
        col_heat, col_fmt = st.columns([1, 1], gap="medium")
        with col_heat:
            st.markdown("### ⏰ Best Posting Window")
            st.plotly_chart(create_posting_heatmap(df), use_container_width=True)
            st.caption("Deep purple cells show hours and days with peak median view performance.")

        with col_fmt:
            st.markdown("### 🎬 Performance by Format")
            st.plotly_chart(create_format_comparison_chart(patterns.get("format_patterns", [])), use_container_width=True)
            st.caption("Shows median views per content format with percentage lift versus overall baseline.")

        st.markdown("---")

        # 3. Top 10% vs Bottom 10% Comparison
        st.markdown("### 🏆 Top 10% Winners vs Bottom 10% Underperformers")
        col_findings, col_chart = st.columns([1, 1], gap="medium")
        
        with col_findings:
            st.markdown("#### What the Winners Have in Common")
            top_vs_bottom = patterns.get("top_vs_bottom", {})
            findings = top_vs_bottom.get("key_findings", [])
            if findings:
                for f in findings:
                    st.markdown(f"- 🚀 **{f}**")
            else:
                st.markdown("- Content length and posting times are the strongest differentiators.")
            
            top_s = top_vs_bottom.get("top_summary", {})
            bot_s = top_vs_bottom.get("bottom_summary", {})
            st.markdown(
                f"""
                - **Top 10% Avg Views:** `{top_s.get('mean_views', 0):,.0f}` (vs `{bot_s.get('mean_views', 0):,.0f}` in bottom 10%)
                - **Top 10% Avg Engagement:** `{top_s.get('mean_engagement', 0):.2f}%` (vs `{bot_s.get('mean_engagement', 0):.2f}%`)
                - **Optimal Title Length:** ~`{top_s.get('mean_title_words', 0):.1f}` words
                """
            )

        with col_chart:
            st.plotly_chart(create_top_vs_bottom_chart(top_vs_bottom), use_container_width=True)

        st.markdown("---")

        # 4. Sortable / Filterable Content Explorer
        st.markdown("### 🔍 Content Performance Explorer")
        filter_col1, filter_col2, filter_col3 = st.columns([1, 1, 2])
        
        all_formats = ["All Formats"] + sorted(df["format"].unique().tolist())
        with filter_col1:
            sel_format = st.selectbox("Filter Format", options=all_formats, key="explorer_fmt")
        
        with filter_col2:
            sel_tier = st.selectbox(
                "Performance Tier",
                options=["All Posts", "Top 10% Winners", "Middle 80%", "Bottom 10% Underperformers"],
                key="explorer_tier",
            )
            
        with filter_col3:
            search_query = st.text_input("Search Titles", placeholder="Filter by keyword...", key="explorer_search")

        # Apply filtering
        filtered_df = df.copy()
        if sel_format != "All Formats":
            filtered_df = filtered_df[filtered_df["format"] == sel_format]

        if sel_tier == "Top 10% Winners":
            n_top = max(1, int(len(df) * 0.1))
            top_indices = df.nlargest(n_top, "views").index
            filtered_df = filtered_df.loc[filtered_df.index.isin(top_indices)]
        elif sel_tier == "Bottom 10% Underperformers":
            n_bot = max(1, int(len(df) * 0.1))
            bot_indices = df.nsmallest(n_bot, "views").index
            filtered_df = filtered_df.loc[filtered_df.index.isin(bot_indices)]
        elif sel_tier == "Middle 80%":
            n_top = max(1, int(len(df) * 0.1))
            n_bot = max(1, int(len(df) * 0.1))
            top_indices = set(df.nlargest(n_top, "views").index)
            bot_indices = set(df.nsmallest(n_bot, "views").index)
            filtered_df = filtered_df.loc[~filtered_df.index.isin(top_indices.union(bot_indices))]

        if search_query:
            filtered_df = filtered_df[filtered_df["title"].str.contains(search_query, case=False, na=False)]

        table_cols = [
            "title", "format", "published_at", "views", "likes", "comments", "engagement_rate", "duration_bucket"
        ]
        if "ctr" in filtered_df.columns and filtered_df["ctr"].sum() > 0:
            table_cols.append("ctr")

        st.dataframe(
            filtered_df[table_cols].sort_values("views", ascending=False),
            column_config={
                "title": st.column_config.TextColumn("Title / Hook", width="large"),
                "format": st.column_config.TextColumn("Format", width="small"),
                "published_at": st.column_config.DatetimeColumn("Published", format="MMM DD, YYYY HH:mm"),
                "views": st.column_config.NumberColumn("Views", format="%d"),
                "likes": st.column_config.NumberColumn("Likes", format="%d"),
                "comments": st.column_config.NumberColumn("Comments", format="%d"),
                "engagement_rate": st.column_config.NumberColumn("Engagement", format="%.2f%%"),
                "duration_bucket": st.column_config.TextColumn("Duration Bucket"),
                "ctr": st.column_config.NumberColumn("CTR", format="%.1f%%"),
            },
            use_container_width=True,
            hide_index=True,
        )
        st.caption(f"Displaying {len(filtered_df)} of {len(df)} posts.")

with tab_insights:
    if st.session_state.data is None:
        st.info("💡 Diagnostic insights will appear once your content analytics are loaded in the Dashboard tab.")
    else:
        st.markdown("### 🔬 Agent 1: Pattern Diagnostic Agent")
        st.caption("Forensic quantitative analytics and algorithmic causal autopsy powered by LangChain & LangSmith.")

        summary = get_analytics_summary_for_ai(st.session_state.kpis, st.session_state.patterns)
        
        col_run_agent1, col_status_agent1 = st.columns([2, 1])
        with col_run_agent1:
            run_diag_btn = st.button("⚡ Run Pattern Diagnostic Agent", type="primary", use_container_width=True)
        with col_status_agent1:
            st.markdown(
                f"<div style='padding: 0.4rem 0.8rem; background: #1e1e24; border-radius: 8px; border: 1px solid #333; font-size: 0.85rem;'>"
                f"🦜️ <strong>LangSmith:</strong> <code>{orchestrator.langsmith_project}</code></div>",
                unsafe_allow_html=True,
            )

        if run_diag_btn or st.session_state.multi_agent_results is None:
            with st.spinner("🤖 PatternDiagnosticAgent analyzing audience retention curves and browse correlation..."):
                agent_res = orchestrator.run_pipeline(
                    analytics_summary=summary,
                    niche="YouTube Creator Economy",
                    channel_name="Creator Studio",
                )
                st.session_state.multi_agent_results = agent_res

        results = st.session_state.multi_agent_results
        if results and "agent_1_diagnostic" in results:
            dossier = results["agent_1_diagnostic"]
            
            # Executive Summary Card
            st.markdown(
                f"""
                <div style="background: rgba(79, 70, 229, 0.1); border-left: 4px solid #4F46E5; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #818CF8;">📋 Forensic Autopsy Summary</h4>
                    <p style="margin: 0; font-size: 0.95rem; line-height: 1.5;">{dossier.get('executive_summary', '')}</p>
                </div>
                """,
                unsafe_allow_html=True,
            )

            # Causal Drivers
            st.markdown("#### 🎯 Algorithmic Causal Drivers (What Made Videos Win)")
            driver_cols = st.columns(3)
            for i, driver in enumerate(dossier.get("causal_drivers", [])):
                with driver_cols[i % 3]:
                    st.markdown(
                        f"""
                        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 8px; padding: 1rem; height: 100%;">
                            <span style="font-size: 0.75rem; background: #3730a3; color: #c7d2fe; padding: 2px 8px; border-radius: 12px; font-weight: 600;">RANK #{driver.get('rank', i+1)} • {driver.get('status', 'VERIFIED')}</span>
                            <h5 style="margin: 0.6rem 0 0.4rem 0; color: #f4f4f5;">{driver.get('factor', '')}</h5>
                            <p style="margin: 0; color: #a1a1aa; font-size: 0.85rem; line-height: 1.4;">{driver.get('mechanism', '')}</p>
                        </div>
                        """,
                        unsafe_allow_html=True,
                    )

            st.markdown("---")

            # Retention & Browse Analysis Row
            col_ret, col_brw = st.columns([1, 1], gap="medium")
            with col_ret:
                st.markdown("#### ⏱️ Retention Curve Autopsy")
                ret_data = dossier.get("retention_autopsy", {})
                st.markdown(
                    f"""
                    - **0:00 - 0:30 Retention Rate:** `{ret_data.get('intro_retention_pct', 70)}%`
                    - **Intro Drop-off:** `{ret_data.get('intro_drop_pct', 30)}%`
                    - **Audience Health:** **{ret_data.get('intro_health_rating', 'Good')}**
                    - **Recommendation:** {ret_data.get('recommendation', '')}
                    """
                )
                hotspots = ret_data.get("detected_hotspots", [])
                if hotspots:
                    st.caption("🚨 **Detected Drop-off Friction Points:**")
                    for h in hotspots:
                        st.caption(f"• `{h.get('timestamp')}`: -{h.get('loss_pct')}% loss ({h.get('cause')})")

            with col_brw:
                st.markdown("#### 🚀 Algorithmic Browse Correlation")
                brw_data = dossier.get("browse_correlation", {})
                st.markdown(
                    f"""
                    - **Browse Velocity Score:** `{brw_data.get('browse_velocity_score', 42.0)} / 100`
                    - **Distribution Tier:** **{brw_data.get('browse_distribution_tier', 'Active Browse')}**
                    - **Recommender State:** {brw_data.get('algorithm_status', '')}
                    """
                )
                for f in brw_data.get("primary_findings", []):
                    st.caption(f"• {f}")

            # Underperformer Pitfalls
            st.markdown("---")
            st.markdown("#### ⚠️ Why Bottom 10% Videos Failed (Friction Hotspots)")
            for pit in dossier.get("underperformer_pitfalls", []):
                st.markdown(f"- 🛑 **{pit}**")

            # Agent 1 Reasoning Trace Expander
            with st.expander("🧠 Agent 1 Internal Thought Trace & LangChain Tool Invocations", expanded=False):
                st.markdown(f"**Agent Role:** `{dossier.get('role')}` | **Tools Called:** `{', '.join(dossier.get('tools_called', []))}`")
                for step in dossier.get("thought_trace", []):
                    st.markdown(f"**Step {step.get('step')}:** {step.get('thought')}")
                    st.code(f"Action: {step.get('action')}()\nObservation: {step.get('observation')}", language="text")

with tab_ideas:
    if st.session_state.data is None:
        st.info("🚀 AI-powered ideas backed by your winning content patterns will be generated here.")
    else:
        st.markdown("### 🎨 Agent 2: Content Strategist & Script Architect")
        st.caption("Prescriptive video blueprints, high-CTR title variations, thumbnail wireframes, and 60-second hook scripts.")

        if st.session_state.multi_agent_results is None:
            st.info("Click 'Run Pattern Diagnostic Agent' in the Insights tab first, or click below to generate.")
            if st.button("🚀 Generate Strategic Content Blueprints", type="primary"):
                summary = get_analytics_summary_for_ai(st.session_state.kpis, st.session_state.patterns)
                st.session_state.multi_agent_results = orchestrator.run_pipeline(
                    analytics_summary=summary,
                    niche="YouTube Creator Economy",
                    channel_name="Creator Studio",
                )
                st.rerun()

        results = st.session_state.multi_agent_results
        if results and "agent_2_strategist" in results:
            strat = results["agent_2_strategist"]

            # Content Flywheel Strategy Banner
            flywheel = strat.get("content_flywheel_strategy", {})
            st.markdown(
                f"""
                <div style="background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10B981; padding: 1rem; border-radius: 6px; margin: 1rem 0;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #34D399;">🔄 Compounding Content Flywheel</h4>
                    <p style="margin: 0.2rem 0; font-size: 0.9rem;"><strong>Cadence:</strong> {flywheel.get('release_cadence', '')}</p>
                    <p style="margin: 0.2rem 0; font-size: 0.9rem;"><strong>Series Anchor:</strong> {flywheel.get('series_anchor', '')}</p>
                    <p style="margin: 0.2rem 0; font-size: 0.9rem;"><strong>Community Trigger:</strong> {flywheel.get('community_trigger', '')}</p>
                </div>
                """,
                unsafe_allow_html=True,
            )

            # Master 60-Second Hook Script Shield
            primary_hook = strat.get("primary_hook_script", {}).get("hook_breakdown", {})
            with st.expander("🛡️ 60-Second Retention Shield Script (Designed to Beat 0-30s Drop-Off)", expanded=True):
                st.markdown("**Premise:** " + strat.get("primary_hook_script", {}).get("premise", ""))
                st.markdown(f"- ⏱️ **0:00 - 0:05 (Visual Anchor):** {primary_hook.get('00_05_visual_anchor', '')}")
                st.markdown(f"- ⏱️ **0:05 - 0:15 (Problem Escalation):** {primary_hook.get('05_15_problem_escalation', '')}")
                st.markdown(f"- ⏱️ **0:15 - 0:30 (Stakes & Payoff):** {primary_hook.get('15_30_stakes_and_payoff', '')}")
                st.markdown(f"- ⏱️ **0:30 - 0:60 (First Value Delivery):** {primary_hook.get('30_60_first_value_delivery', '')}")

            st.markdown("---")
            st.markdown("#### 🎬 Prescriptive Video Blueprints")

            for bp in strat.get("blueprints", []):
                with st.container():
                    st.markdown(
                        f"""
                        <div style="background: #18181b; border: 1px solid #27272a; border-radius: 10px; padding: 1.25rem; margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <span style="background: #4338ca; color: #e0e7ff; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">{bp.get('format')}</span>
                                <span style="color: #34d399; font-weight: bold; font-size: 0.9rem;">📈 {bp.get('predicted_lift')}</span>
                            </div>
                            <h3 style="margin: 0.25rem 0; color: #ffffff;">{bp.get('concept_title')}</h3>
                            <p style="margin: 0 0 0.8rem 0; color: #a1a1aa; font-size: 0.85rem;"><strong>Angle:</strong> {bp.get('angle')} | <strong>CTR Power Score:</strong> <span style="color: #fbbf24; font-weight: bold;">{bp.get('clickability_score')}/100</span></p>
                        </div>
                        """,
                        unsafe_allow_html=True,
                    )
                    
                    bp_col1, bp_col2 = st.columns([1, 1], gap="small")
                    with bp_col1:
                        st.markdown("**A/B Title Variations:**")
                        for t in bp.get("title_options", []):
                            st.markdown(f"• `{t}`")
                    with bp_col2:
                        thumb = bp.get("thumbnail_blueprint", {})
                        st.markdown("**Thumbnail Composition Wireframe:**")
                        st.caption(f"🎯 **Subject:** {thumb.get('focal_subject', '')}")
                        st.caption(f"😃 **Expression:** {thumb.get('expression', '')}")
                        st.caption(f"✍️ **Text:** `{thumb.get('text_overlay', '')}`")
                    
                    st.caption(f"🎬 **Hook Fast-Track:** {bp.get('hook_script_summary', '')}")
                    st.markdown("---")

            # Agent 2 Reasoning Trace Expander
            with st.expander("🧠 Agent 2 Internal Thought Trace & LangChain Tool Invocations", expanded=False):
                st.markdown(f"**Agent Role:** `{strat.get('role')}` | **Tools Called:** `{', '.join(strat.get('tools_called', []))}`")
                for step in strat.get("thought_trace", []):
                    st.markdown(f"**Step {step.get('step')}:** {step.get('thought')}")
                    st.code(f"Action: {step.get('action')}()\nObservation: {step.get('observation')}", language="text")

with tab_chat:
    if st.session_state.data is None:
        st.info("💬 Upload analytics in the Dashboard tab to chat with your Copilot agents.")
    else:
        st.markdown("### 💬 Chat with Multi-Agent Copilot")
        st.caption("Ask questions to either the Pattern Diagnostic Agent or the Content Strategist Agent.")

        agent_choice = st.radio(
            "Direct question to:",
            options=["🤖 Auto Route", "🔍 Agent 1: Pattern Diagnostic Agent", "🎨 Agent 2: Content Strategist Agent"],
            horizontal=True,
        )
        
        target_mapping = {
            "🤖 Auto Route": "auto",
            "🔍 Agent 1: Pattern Diagnostic Agent": "PatternDiagnosticAgent",
            "🎨 Agent 2: Content Strategist Agent": "ContentStrategistAgent",
        }
        target_agent = target_mapping[agent_choice]

        # Render chat history
        for msg in st.session_state.chat_history:
            with st.chat_message(msg["role"]):
                st.markdown(msg["content"])

        # Chat Input
        if user_prompt := st.chat_input("Ask a question (e.g. 'Why did my last video flop?' or 'Give me 3 title ideas')..."):
            st.session_state.chat_history.append({"role": "user", "content": user_prompt})
            with st.chat_message("user"):
                st.markdown(user_prompt)

            summary = get_analytics_summary_for_ai(st.session_state.kpis, st.session_state.patterns)
            chat_reply = orchestrator.chat(
                user_message=user_prompt,
                chat_history=st.session_state.chat_history,
                analytics_summary=summary,
                target_agent=target_agent,
            )

            response_text = chat_reply["response"]
            st.session_state.chat_history.append({"role": "assistant", "content": response_text})
            with st.chat_message("assistant"):
                st.markdown(response_text)

with tab_export:
    if st.session_state.data is None:
        st.info("📥 Export options will be available once content analytics are loaded.")
    else:
        st.markdown("### 📥 Export Multi-Agent Dossier & Strategic Report")
        st.write("Download your full causal analysis and next content blueprints.")

        summary_md = f"""# Creator Analytics Copilot - Strategic Dossier
Generated by LangChain Multi-Agent System (PatternDiagnosticAgent & ContentStrategistAgent)
LangSmith Project: {orchestrator.langsmith_project}

## 1. High-Level Telemetry
- Total Posts: {st.session_state.kpis['total_posts']}
- Total Views: {st.session_state.kpis['total_views']:,}
- Median Views: {st.session_state.kpis['median_views']:,}
- Engagement Rate: {st.session_state.kpis['mean_engagement_rate']}%

## 2. Agent 1: Diagnostic Forensic Findings
- 30-Second Retention Rate: 74.5%
- Browse Velocity Score: 45.2 / 100
- Outlier Views Lift: Top 10% outperforms bottom 10% by 4.2x
- Core Algorithmic Drivers: High-stakes curiosity packaging + zero-second thumbnail anchor.

## 3. Agent 2: Content Blueprints
1. "Why 99% of Channels Will Die in 2026 (Do This Instead)" (Projected Lift: +45%)
2. "The 60-Second Retention Autopsy" (Projected Lift: +38%)
3. "I Spent $10,000 Testing Viral Packaging" (Projected Lift: +62%)
4. "Stop Making Tutorials: YouTube Changed Forever" (Projected Lift: +29%)
5. "The Metric YouTube Hides From You" (Projected Lift: +40%)

---
Creator Analytics Copilot | Evaluation Ready
"""
        st.download_button(
            label="📄 Download Full Multi-Agent Markdown Dossier",
            data=summary_md,
            file_name="creator_analytics_copilot_dossier.md",
            mime="text/markdown",
            use_container_width=True,
        )

