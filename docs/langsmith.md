# LangSmith Tracing & Telemetry Guide

## Overview

LangSmith tracing allows detailed execution monitoring and step-by-step telemetry of the Instagram Voice Replicator LangGraph pipeline.

## Configuration & Environment Variables

Tracing is **OFF by default** to protect user privacy. It will only activate when explicitly enabled via environment variable.

- `ENABLE_LANGSMITH`: Set to `1` to enable tracing. If absent or set to any other value, tracing is explicitly disabled even if `LANGSMITH_API_KEY` is present.
- `LANGSMITH_API_KEY`: API key for accessing LangSmith services.
- `LANGSMITH_PROJECT`: Name of the LangSmith project to send trace logs to (maps to `LANGCHAIN_PROJECT`).
- `DATA_PROVENANCE`: Provenance tag attached to traces (`synthetic` or `real`).

## Trace Tags & Metadata

Each graph execution trace is tagged automatically with:
- `variant`: Pipeline variant (`best_of_n`, `revise`, or `both`).
- `data_provenance`: Data source provenance (`synthetic` or `real`).

## Privacy & Security Warning

> [!WARNING]
> Enabling LangSmith tracing transmits post captions, topics, generated drafts, and stylistic feedback to third-party LangSmith servers.
> Only set `ENABLE_LANGSMITH=1` when processing real creator data **with explicit consent from that creator**.
> Never print or hardcode API keys or secret environment variables in documentation, logs, or reports.
