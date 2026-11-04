"""Tests for loader and mapping modules."""

import pytest
import pandas as pd
from src.loader import validate_file_metadata, clean_numeric_value, clean_dataframe, DataValidationError
from src.mapping import (
    detect_platform,
    suggest_column_mapping,
    validate_mapping,
    extract_title_features,
    normalize_dataset,
    PLATFORM_YOUTUBE,
    PLATFORM_INSTAGRAM,
    PLATFORM_TIKTOK,
    PLATFORM_GENERIC,
)
from src.config import SAMPLE_DATA_PATH


def test_validate_file_metadata():
    # Valid files
    validate_file_metadata("analytics.csv", 1024 * 1024)
    validate_file_metadata("report.xlsx", 5 * 1024 * 1024)

    # Invalid extension
    with pytest.raises(DataValidationError, match="Unsupported file format"):
        validate_file_metadata("malicious.exe", 100)

    # Oversized file
    with pytest.raises(DataValidationError, match="exceeds the maximum allowed limit"):
        validate_file_metadata("huge.csv", 26 * 1024 * 1024)


def test_clean_numeric_value():
    assert clean_numeric_value("1,234") == 1234.0
    assert clean_numeric_value("12.5%") == 12.5
    assert clean_numeric_value("1.5k") == 1500.0
    assert clean_numeric_value("2.4M") == 2400000.0
    assert clean_numeric_value("$250") == 250.0
    assert clean_numeric_value("   45   ") == 45.0
    assert clean_numeric_value("") == 0.0
    assert clean_numeric_value(None) == 0.0
    assert clean_numeric_value("invalid_text") == 0.0


def test_clean_dataframe_duplicates():
    df = pd.DataFrame({
        " Title ": ["Post A", "Post B", "Post A"],
        " Views ": ["1,000", "2,000", "1,000"],
    })
    cleaned, warnings = clean_dataframe(df)
    assert len(cleaned) == 2
    assert "Title" in cleaned.columns
    assert "Views" in cleaned.columns
    assert len(warnings) == 1
    assert "duplicate" in warnings[0].lower()


def test_detect_platform():
    yt_cols = ["Video title", "Video publish time", "Views", "Watch time (hours)"]
    assert detect_platform(yt_cols) == PLATFORM_YOUTUBE

    ig_cols = ["Post caption", "Reach", "Saves", "Likes"]
    assert detect_platform(ig_cols) == PLATFORM_INSTAGRAM

    tt_cols = ["Video Title", "Total Play Time", "Video Views"]
    assert detect_platform(tt_cols) == PLATFORM_TIKTOK

    generic_cols = ["Title", "Date", "Views"]
    assert detect_platform(generic_cols) == PLATFORM_GENERIC


def test_suggest_and_validate_mapping():
    cols = ["Content Title", "Publish Date", "Views", "Likes", "Comments"]
    mapping = suggest_column_mapping(cols)
    assert mapping["title"] == "Content Title"
    assert mapping["published_at"] == "Publish Date"
    assert mapping["views"] == "Views"
    
    is_valid, missing = validate_mapping(mapping)
    assert is_valid is True
    assert len(missing) == 0


def test_extract_title_features():
    feat = extract_title_features("Why 99% of Creators Fail at AI?")
    assert feat["has_question"] is True
    assert feat["has_number"] is True
    assert feat["title_length_words"] == 7

    feat2 = extract_title_features("My honest review of this camera")
    assert feat2["has_question"] is False
    assert feat2["has_number"] is False


def test_normalize_dataset_and_sample_file():
    assert SAMPLE_DATA_PATH.exists()
    df = pd.read_csv(SAMPLE_DATA_PATH)
    mapping = suggest_column_mapping(df.columns)
    normalized = normalize_dataset(df, mapping)
    
    assert len(normalized) == len(df)
    assert "views" in normalized.columns
    assert "engagement_rate" in normalized.columns
    assert "duration_bucket" in normalized.columns
    assert "time_of_day_bucket" in normalized.columns
    assert normalized["views"].iloc[0] > 0
