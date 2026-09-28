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
from src.ui import inject_custom_css, render_hero_header, render_privacy_callout

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
if "stats" not in st.session_state:
    st.session_state.stats = None
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
        for key in ["raw_df", "data", "platform", "column_mapping", "load_warnings", "stats", "ai_results", "chat_history"]:
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

# Ingestion Section (rendered in Dashboard if data not present or at top)
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
                st.success("Loaded sample dataset!")
                st.rerun()

    else:
        # Data is loaded - Show top status & Mapping Tweaker
        col_status, col_btn = st.columns([3, 1])
        with col_status:
            st.markdown(
                f"**Loaded Platform:** `{st.session_state.platform}` | "
                f"**Total Posts:** `{len(st.session_state.data):,}` | "
                f"**Date Range:** `{st.session_state.data['published_at'].min().strftime('%b %d, %Y')}` to `{st.session_state.data['published_at'].max().strftime('%b %d, %Y')}`"
            )
            for w in st.session_state.load_warnings:
                st.caption(f"ℹ️ {w}")
        with col_btn:
            if st.button("🔄 Upload Different File", use_container_width=True):
                st.session_state.data = None
                st.session_state.raw_df = None
                st.session_state.stats = None
                st.session_state.ai_results = None
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
                        st.session_state.stats = None  # Invalidate stats to recompute
                        st.session_state.ai_results = None
                        st.success("Column mapping updated and analytics refreshed!")
                        st.rerun()

        # Data preview
        with st.expander("👀 Data Preview (First 5 Rows)", expanded=False):
            display_cols = ["title", "published_at", "views", "likes", "comments", "format", "duration_seconds", "engagement_rate"]
            st.dataframe(st.session_state.data[display_cols].head(5), use_container_width=True)

        st.markdown("---")
        st.write("Analytics dashboard cards and charts will render here once Milestone 3 & 4 are connected.")

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
