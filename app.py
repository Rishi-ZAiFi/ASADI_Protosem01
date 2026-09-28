"""Creator Analytics Copilot - Entry Point Application."""

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
        help="Optional: If omitted, the app will read GEMINI_API_KEY from .env or use deterministic rule-based insights.",
    )
    if api_key_input:
        st.session_state["CUSTOM_GEMINI_KEY"] = api_key_input

    st.markdown("---")
    if st.button("🗑️ Clear My Data", use_container_width=True):
        for key in ["raw_df", "data", "platform", "column_mapping", "load_warnings", "kpis", "patterns", "ai_results", "chat_history"]:
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
        st.info("💡 Insights will appear once your content analytics are loaded.")
    else:
        st.info("💡 Insights engine is being connected in Milestone 5.")

with tab_ideas:
    if st.session_state.data is None:
        st.info("🚀 AI-powered ideas backed by your winning content patterns will be generated here.")
    else:
        st.info("🚀 Ideas generator is being connected in Milestone 6.")

with tab_chat:
    if st.session_state.data is None:
        st.info("💬 Chat with your analytics once your data is uploaded.")
    else:
        st.info("💬 Ask Your Data chat is being connected in Milestone 6.")

with tab_export:
    if st.session_state.data is None:
        st.info("📥 Export your comprehensive PDF and Markdown reports here.")
    else:
        st.info("📥 Export features are being connected in Milestone 7.")
