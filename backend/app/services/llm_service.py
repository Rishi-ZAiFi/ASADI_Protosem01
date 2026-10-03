import os
import json
import re
from typing import Dict, Any, Optional
import time
import httpx
from langsmith import traceable
from app.config import settings

class LLMProvider:
    def generate(self, prompt: str) -> Dict[str, Any]:
        raise NotImplementedError
    def generate_structured(self, prompt: str, schema_cls: type) -> Any:
        raise NotImplementedError

class GeminiLLMProvider(LLMProvider):
    def __init__(self, api_key: str = None, model: str = None):
        self.api_key = api_key or settings.LLM_API_KEY
        self.model = model or settings.GEMINI_MODEL
        
        # Validate model against models.list
        if self.api_key and os.environ.get("TEST_FAKE_LLM") != "1":
            url = f"https://generativelanguage.googleapis.com/v1beta/models?key={self.api_key}"
            try:
                res = httpx.get(url, timeout=10.0)
                res.raise_for_status()
                available_models = [m.get("name") for m in res.json().get("models", [])]
                model_path = f"models/{self.model}" if not self.model.startswith("models/") else self.model
                if model_path not in available_models:
                    raise ValueError(f"Configured model '{self.model}' is not available for this API key. Available models: {available_models}")
            except httpx.HTTPError as e:
                print(f"Warning: Failed to validate model {self.model}: {e}")

    @traceable(name="GeminiLLMProvider.generate", run_type="llm")
    def generate(self, prompt: str) -> Dict[str, Any]:
        if os.environ.get("TEST_FAKE_LLM") == "1":
            print("WARNING: Using fake LLM generation as TEST_FAKE_LLM=1")
            return self._generate_fallback(prompt)
            
        if not self.api_key or self.api_key == "your_gemini_api_key_here":
            raise ValueError("Invalid or missing Gemini API key and TEST_FAKE_LLM is not set.")

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "responseMimeType": "application/json"
            }
        }

        max_attempts = 4
        for attempt in range(max_attempts):
            try:
                with httpx.Client(timeout=45.0) as client:
                    res = client.post(url, json=payload)
                    res.raise_for_status()
                    data = res.json()
                    
                    if "usageMetadata" in data:
                        usage = data["usageMetadata"]
                        print(f"[Tokens] Prompt: {usage.get('promptTokenCount', 0)}, Candidates: {usage.get('candidatesTokenCount', 0)}, Total: {usage.get('totalTokenCount', 0)}")
                    
                    text_out = data["candidates"][0]["content"]["parts"][0]["text"]
                    return self._parse_json_response(text_out)
            except httpx.HTTPStatusError as e:
                status = e.response.status_code
                if status in (429, 503) and attempt < max_attempts - 1:
                    sleep_time = 2 ** attempt
                    print(f"Gemini API returned {status}. Retrying in {sleep_time}s... (Attempt {attempt+1}/{max_attempts})")
                    time.sleep(sleep_time)
                    continue
                raise RuntimeError(f"Gemini API Error {status}: {e.response.text}") from e
            except Exception as e:
                raise RuntimeError(f"Gemini API request failed: {str(e)}") from e

    @traceable(name="GeminiLLMProvider.generate_structured", run_type="llm")
    def generate_structured(self, prompt: str, schema_cls: type) -> Any:
        if os.environ.get("TEST_FAKE_LLM") == "1":
            print("WARNING: Using fake LLM generation as TEST_FAKE_LLM=1")
            return schema_cls.model_validate(self._generate_fallback(prompt))
            
        if not self.api_key or self.api_key == "your_gemini_api_key_here":
            raise ValueError("Invalid or missing Gemini API key and TEST_FAKE_LLM is not set.")

        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={self.api_key}"
        
        # We need to map standard JSON schema to Gemini's expected schema format
        json_schema = schema_cls.model_json_schema()
        
        def map_schema(s):
            if "type" not in s:
                s["type"] = "string"
            if s["type"] == "object":
                props = s.get("properties", {})
                req = s.get("required", [])
                for k, v in props.items():
                    props[k] = map_schema(v)
                return {"type": "OBJECT", "properties": props, "required": req}
            elif s["type"] == "array":
                return {"type": "ARRAY", "items": map_schema(s.get("items", {}))}
            elif s["type"] == "string":
                return {"type": "STRING"}
            elif s["type"] == "integer":
                return {"type": "INTEGER"}
            elif s["type"] == "number":
                return {"type": "NUMBER"}
            elif s["type"] == "boolean":
                return {"type": "BOOLEAN"}
            return {"type": "STRING"}
            
        gemini_schema = map_schema(json_schema)

        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "responseMimeType": "application/json",
                "responseSchema": gemini_schema
            }
        }

        start_t = time.time()
        max_attempts = 4
        retry_count = 0
        for attempt in range(max_attempts):
            try:
                with httpx.Client(timeout=45.0) as client:
                    res = client.post(url, json=payload)
                    res.raise_for_status()
                    data = res.json()
                    
                    duration = time.time() - start_t
                    if "usageMetadata" in data:
                        usage = data["usageMetadata"]
                        print(f"[LLM Call] Duration: {duration:.2f}s, Retries: {retry_count} | [Tokens] Prompt: {usage.get('promptTokenCount', 0)}, Candidates: {usage.get('candidatesTokenCount', 0)}, Total: {usage.get('totalTokenCount', 0)}")
                    else:
                        print(f"[LLM Call] Duration: {duration:.2f}s, Retries: {retry_count}")
                    
                    text_out = data["candidates"][0]["content"]["parts"][0]["text"]
                    parsed = self._parse_json_response(text_out)
                    return schema_cls.model_validate(parsed)
            except httpx.HTTPStatusError as e:
                status = e.response.status_code
                if status in (429, 503) and attempt < max_attempts - 1:
                    retry_count += 1
                    sleep_time = 2 ** attempt
                    print(f"Gemini API returned {status}. Retrying in {sleep_time}s... (Attempt {attempt+1}/{max_attempts})")
                    time.sleep(sleep_time)
                    continue
                raise RuntimeError(f"Gemini API Error {status}: {e.response.text}") from e
            except Exception as e:
                raise RuntimeError(f"Gemini API request failed: {str(e)}") from e

    def _parse_json_response(self, text: str) -> Dict[str, Any]:
        try:
            # Clean possible markdown code fences
            cleaned = re.sub(r"^```json\s*", "", text, flags=re.MULTILINE)
            cleaned = re.sub(r"```$", "", cleaned, flags=re.MULTILINE).strip()
            return json.loads(cleaned)
        except Exception as e:
            raise ValueError(f"Failed to parse JSON response from LLM: {str(e)}\nRaw text: {text}") from e

    def _generate_fallback(self, prompt: str) -> Dict[str, Any]:
        # Extract topic from prompt heuristic
        topic_match = re.search(r"- Topic:\s*(.+)", prompt)
        topic_str = topic_match.group(1).strip() if topic_match else "AI & Technology"
        
        post_type_match = re.search(r"- Requested Post Type:\s*(.+)", prompt)
        post_type = post_type_match.group(1).strip() if post_type_match else "educational"

        return {
            "hook": f"Here is what nobody tells you about {topic_str} 🚀",
            "body": (
                f"Here is what nobody tells you about {topic_str} 🚀\n\n"
                f"Most creators focus on surface-level tactics, but the real secret to {topic_str} comes down to 3 core principles:\n\n"
                f"1. Consistency over intensity\n"
                f"2. Leveraging historical data & analytics\n"
                f"3. Building authentic engagement\n\n"
                f"When you master these, everything changes."
            ),
            "cta": f"What's your biggest takeaway on {topic_str}? Drop a comment below! 👇",
            "hashtags": ["#contentstrategy", "#ai", "#creator", "#growth", "#productivity"],
            "image_text": "",
            "visual_brief": ""
        }

class LLMService:
    @staticmethod
    def get_provider() -> LLMProvider:
        provider_name = settings.LLM_PROVIDER.lower()
        if provider_name == "gemini":
            return GeminiLLMProvider()
        return GeminiLLMProvider()
