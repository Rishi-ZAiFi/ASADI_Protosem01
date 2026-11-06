"""Data loader and ingestion module for Creator Analytics Copilot."""

import io
import re
from typing import Tuple, List, Optional, Union
from pathlib import Path
import pandas as pd
from src.config import MAX_UPLOAD_SIZE_MB, ALLOWED_EXTENSIONS


class DataValidationError(Exception):
    """Raised when uploaded file fails validation."""
    pass


def validate_file_metadata(file_name: str, file_size_bytes: int) -> None:
    """Validates file extension and size constraints."""
    ext = file_name.split(".")[-1].lower() if "." in file_name else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise DataValidationError(
            f"Unsupported file format '.{ext}'. Please upload a CSV or XLSX file."
        )

    max_bytes = MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if file_size_bytes > max_bytes:
        raise DataValidationError(
            f"File size ({file_size_bytes / (1024*1024):.1f} MB) exceeds the maximum allowed limit of {MAX_UPLOAD_SIZE_MB} MB."
        )


def clean_numeric_value(val: Union[str, int, float]) -> Optional[float]:
    """Cleans numeric values from messy strings like '1,234', '12.5%', '1.5k', '$200'."""
    if pd.isna(val) or val is None or val == "":
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)

    s = str(val).strip().lower()
    
    # Remove currency symbols and surrounding spaces
    s = re.sub(r"[\$€£₹]", "", s)
    
    # Check for percentage
    is_percent = "%" in s
    s = s.replace("%", "").strip()

    # Check for K/M/B abbreviations
    multiplier = 1.0
    if s.endswith("k"):
        multiplier = 1e3
        s = s[:-1].strip()
    elif s.endswith("m"):
        multiplier = 1e6
        s = s[:-1].strip()
    elif s.endswith("b"):
        multiplier = 1e9
        s = s[:-1].strip()

    # Remove commas and spaces
    s = s.replace(",", "").strip()

    try:
        num = float(s) * multiplier
        return num
    except (ValueError, TypeError):
        return 0.0


def clean_dataframe(df: pd.DataFrame) -> Tuple[pd.DataFrame, List[str]]:
    """Cleans column names, handles messy formats, removes duplicates, and logs operations."""
    warnings: List[str] = []

    if df.empty:
        raise DataValidationError("The uploaded file contains no data.")

    # 1. Clean column names (strip whitespace)
    df.columns = [str(c).strip() for c in df.columns]

    # 2. Check and remove exact duplicate rows
    initial_rows = len(df)
    df = df.drop_duplicates().copy()
    duplicates_removed = initial_rows - len(df)
    if duplicates_removed > 0:
        warnings.append(f"Removed {duplicates_removed} exact duplicate row(s).")

    # 3. Strip string columns
    for col in df.select_dtypes(include=["object", "string"]).columns:
        df[col] = df[col].astype(str).str.strip()

    return df, warnings


def load_file(file_source: Union[str, Path, io.BytesIO], file_name: str) -> Tuple[pd.DataFrame, List[str]]:
    """Loads a CSV or Excel file and returns cleaned dataframe with parsing messages."""
    ext = file_name.split(".")[-1].lower() if "." in file_name else ""

    try:
        if ext == "csv":
            df = pd.read_csv(file_source)
        elif ext in ["xlsx", "xls"]:
            df = pd.read_excel(file_source)
        else:
            raise DataValidationError(f"Unsupported file extension: {ext}")
    except Exception as e:
        raise DataValidationError(f"Failed to parse file: {str(e)}")

    return clean_dataframe(df)
