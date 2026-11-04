"""Configuration and constants for Creator Analytics Copilot."""

import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
ASSETS_DIR = BASE_DIR / "assets"
SAMPLE_DATA_PATH = ASSETS_DIR / "sample_data.csv"
CSS_PATH = ASSETS_DIR / "style.css"
SCREENSHOTS_DIR = ASSETS_DIR / "screenshots"

# Upload Constraints
MAX_UPLOAD_SIZE_MB = 25
ALLOWED_EXTENSIONS = ["csv", "xlsx", "xls"]

# Supported Platforms
PLATFORM_YOUTUBE = "YouTube Studio"
PLATFORM_INSTAGRAM = "Instagram Insights"
PLATFORM_TIKTOK = "TikTok Analytics"
PLATFORM_GENERIC = "Generic Social Analytics"

PLATFORMS = [
    PLATFORM_YOUTUBE,
    PLATFORM_INSTAGRAM,
    PLATFORM_TIKTOK,
    PLATFORM_GENERIC,
]

# Canonical Schema fields required for analytics
CANONICAL_COLUMNS = {
    "title": "Title / Caption / Hook",
    "published_at": "Published Date & Time",
    "views": "Views / Impressions / Reach",
    "likes": "Likes / Reactions",
    "comments": "Comments",
    "shares": "Shares / Reposts",
    "format": "Format (Video, Reel/Short, Carousel, Image, Text)",
    "duration_seconds": "Duration (seconds)",
    "watch_time_hours": "Watch Time (hours)",
    "ctr": "Click-Through Rate (%)",
}

# Required minimum columns for core analytics
MINIMUM_REQUIRED_COLUMNS = ["title", "published_at", "views"]

# Confidence Thresholds
CONFIDENCE_HIGH_SAMPLE = 25
CONFIDENCE_MED_SAMPLE = 10
CONFIDENCE_HIGH_LIFT = 0.25  # 25% lift vs median
CONFIDENCE_MED_LIFT = 0.10   # 10% lift vs median

# Gemini Model Config
GEMINI_MODEL = "gemini-2.5-flash"
API_TIMEOUT_SECONDS = 30
MAX_RETRIES = 3

# LangChain & LangSmith Config
DEFAULT_LANGCHAIN_PROJECT = "creator-analytics-copilot"
LANGCHAIN_DEFAULT_ENDPOINT = "https://api.smith.langchain.com"

