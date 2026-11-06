"""Gemini AI integration with strict Pydantic validation, retries, and offline fallback."""

import os
import json
import time
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

from src.config import GEMINI_MODEL, API_TIMEOUT_SECONDS, MAX_RETRIES
from src.insights import (
    generate_rule_based_insights,
    generate_rule_based_ideas,
    answer_data_query_rule_based,
)


# Pydantic Schemas for Strict Structured Output
class InsightItem(BaseModel):
    statement: str = Field(description="Clear, plain-language description of the pattern and its lift.")
    dimension: str = Field(description="The dimension analyzed, e.g. Format, Time Window, Title Psychology.")
    confidence: str = Field(description="Confidence rating: High, Medium, or Low.")
    sample_size: int = Field(description="Number of posts backing this insight.")
    caveat: Optional[str] = Field(default=None, description="Cautionary note if sample size is small or variance is high.")


class HypothesisItem(BaseModel):
    topic: str = Field(description="Title of the observed pattern.")
    hypothesis: str = Field(description="Hypothesis explaining the algorithmic or human psychology reason behind the performance.")


class ContentIdeaItem(BaseModel):
    title: str = Field(description="Compelling, click-worthy title applying the winning title features.")
    hook: str = Field(description="First 3-second hook or opening line for the content.")
    format: str = Field(description="Recommended content format (e.g. Shorts, Longform, Carousel).")
    best_posting_slot: str = Field(description="Optimal day/time to publish this content.")
    data_backed_reason: str = Field(description="Direct reference to the data pattern justifying this idea.")


class GeminiAnalysisResponse(BaseModel):
    what_worked: List[InsightItem] = Field(description="Top 3 to 5 winning patterns backed by positive lift.")
    what_didnt: List[InsightItem] = Field(description="2 to 4 underperforming patterns with negative lift.")
    why_hypotheses: List[HypothesisItem] = Field(description="3 to 5 hypotheses explaining why the winning content succeeded.")
    next_10_ideas: List[ContentIdeaItem] = Field(description="Exactly 10 tailored content ideas based on the data.")


def get_api_key(custom_key: Optional[str] = None) -> Optional[str]:
    """Retrieves API key from session override or environment variable."""
    if custom_key and custom_key.strip():
        return custom_key.strip()
    return os.environ.get("GEMINI_API_KEY", "").strip() or None


def generate_ai_analysis(
    summary_for_ai: Dict[str, Any],
    kpis: Dict[str, Any],
    patterns: Dict[str, Any],
    custom_api_key: Optional[str] = None,
) -> Dict[str, Any]:
    """Generates complete AI synthesis using Gemini with Pydantic validation and fallback."""
    api_key = get_api_key(custom_api_key)

    # Offline / Rule-based Fallback if no key is provided
    if not api_key or api_key == "your_key_here":
        rule_insights = generate_rule_based_insights(kpis, patterns)
        rule_ideas = generate_rule_based_ideas(kpis, patterns)
        return {
            "source": "rule_based",
            "message": "Generated via deterministic rule engine (no Gemini API key detected).",
            "what_worked": rule_insights["what_worked"],
            "what_didnt": rule_insights["what_didnt"],
            "why_hypotheses": rule_insights["why_hypotheses"],
            "next_10_ideas": rule_ideas,
        }

    try:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=api_key)

        prompt = f"""
You are an expert Social Media Strategist and Data Analyst for top YouTube and TikTok creators.
Analyze the following aggregated summary statistics from a creator's catalog.
Note: You are given ONLY computed statistical summaries (averages, medians, lifts, and feature distributions). NO raw user rows are provided.

SUMMARY DATA:
{json.dumps(summary_for_ai, indent=2)}

TASK:
1. Identify 'what_worked' (3-5 top patterns with positive lift).
2. Identify 'what_didnt' (2-4 underperforming patterns).
3. Formulate 'why_hypotheses' (3-5 deep, plausible hypotheses based on viewer psychology and recommendation algorithm dynamics). Every explanation must be explicitly presented as an empirical hypothesis, not an absolute guarantee.
4. Generate 'next_10_ideas': Exactly 10 specific, high-yield content ideas applying the creator's winning formats, hooks, and optimal posting times.

IMPORTANT GUIDELINES:
- Stay strictly grounded in the provided numbers. Do not fabricate metrics.
- Keep tone empowering, clear, and actionable for a non-technical creator.
- Every idea must specify a title, opening 3-second hook, format, best_posting_slot, and data_backed_reason.
"""

        # Retry loop with exponential backoff
        for attempt in range(MAX_RETRIES):
            try:
                response = client.models.generate_content(
                    model=GEMINI_MODEL,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=GeminiAnalysisResponse,
                        temperature=0.3,
                    ),
                )
                
                # Parse structured JSON into Pydantic model
                parsed_data = json.loads(response.text)
                validated = GeminiAnalysisResponse.model_validate(parsed_data)

                return {
                    "source": "gemini_ai",
                    "message": f"Synthesized by Gemini ({GEMINI_MODEL}) with data validation.",
                    "what_worked": [item.model_dump() for item in validated.what_worked],
                    "what_didnt": [item.model_dump() for item in validated.what_didnt],
                    "why_hypotheses": [item.model_dump() for item in validated.why_hypotheses],
                    "next_10_ideas": [item.model_dump() for item in validated.next_10_ideas],
                }

            except Exception as e:
                if attempt == MAX_RETRIES - 1:
                    raise e
                time.sleep(1.5 * (attempt + 1))

    except Exception as e:
        # Graceful fallback on API error
        rule_insights = generate_rule_based_insights(kpis, patterns)
        rule_ideas = generate_rule_based_ideas(kpis, patterns)
        return {
            "source": "rule_based_fallback",
            "message": f"Gemini API request failed ({str(e)}). Fallen back to rule-based engine.",
            "what_worked": rule_insights["what_worked"],
            "what_didnt": rule_insights["what_didnt"],
            "why_hypotheses": rule_insights["why_hypotheses"],
            "next_10_ideas": rule_ideas,
        }


def ask_your_data_ai(
    query: str,
    summary_for_ai: Dict[str, Any],
    kpis: Dict[str, Any],
    patterns: Dict[str, Any],
    chat_history: List[Dict[str, str]],
    custom_api_key: Optional[str] = None,
) -> str:
    """Answers user queries grounded in computed stats using Gemini with strict boundaries, or falls back to rule-based Q&A."""
    api_key = get_api_key(custom_api_key)

    if not api_key or api_key == "your_key_here":
        return answer_data_query_rule_based(query, kpis, patterns)

    try:
        from google import genai

        client = genai.Client(api_key=api_key)

        history_context = "\n".join([f"{msg['role'].upper()}: {msg['content']}" for msg in chat_history[-4:]])

        prompt = f"""
You are the Creator Analytics Copilot AI. You answer creator questions strictly grounded in their computed channel analytics summary.

SUMMARY CHANNEL DATA:
{json.dumps(summary_for_ai, indent=2)}

RECENT CHAT CONTEXT:
{history_context}

CREATOR QUESTION:
"{query}"

RULES:
1. Ground your answer ONLY in the numbers and patterns present in the SUMMARY CHANNEL DATA above.
2. If the user asks something that the data cannot answer (e.g. subscriber demographics, competitor stats, off-platform metrics, exact future view predictions), explicitly reply:
   "Based on your uploaded dataset, there is insufficient data to answer this question. The current data only covers [mention what is present, like post views, formats, and posting times]."
3. Keep answers concise, direct, and easy to digest in 15 seconds. Use bold text for key figures.
"""
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )
        return response.text

    except Exception:
        return answer_data_query_rule_based(query, kpis, patterns)
