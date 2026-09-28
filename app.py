"""Creator Analytics Copilot - Entry Point Application."""

import streamlit as st
from dotenv import load_dotenv

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
if "data" not in st.session_state:
    st.session_state.data = None
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
        st.session_state.data = None
        st.session_state.stats = None
        st.session_state.ai_results = None
        st.session_state.chat_history = []
        st.rerun()

    st.caption("🔒 All data stays in your browser session.")

# Main Header
render_hero_header()
render_privacy_callout()

# Navigation Tabs
tab_overview, tab_insights, tab_ideas, tab_chat, tab_export = st.tabs(
    ["📊 Dashboard", "💡 Insights & Patterns", "🚀 Next 10 Ideas", "💬 Ask Your Data", "📥 Export & Reports"]
)

with tab_overview:
    st.info("👋 Welcome! Please upload your analytics file or load sample data to get started.")

with tab_insights:
    st.info("💡 Insights will appear once your content analytics are loaded.")

with tab_ideas:
    st.info("🚀 AI-powered ideas backed by your winning content patterns will be generated here.")

with tab_chat:
    st.info("💬 Chat with your analytics once your data is uploaded.")

with tab_export:
    st.info("📥 Export your comprehensive PDF and Markdown reports here.")
