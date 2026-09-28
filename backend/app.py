import os
import json
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List, Optional
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = FastAPI()

# Enable CORS so the React app can communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY and GEMINI_API_KEY != "your_actual_api_key_here":
    genai.configure(api_key=GEMINI_API_KEY)
    # Recommended model
    model = genai.GenerativeModel('gemini-3.6-flash')
else:
    model = None

class GenerateRequest(BaseModel):
    content: str
    platforms: List[str]
    tone: Optional[str] = "professional"

@app.post('/generate')
async def generate_content(request_data: GenerateRequest):
    if not model:
        return JSONResponse(
            status_code=500,
            content={"error": "Gemini API key is missing or invalid. Please check your backend .env file."}
        )

    content = request_data.content.strip()
    platforms = request_data.platforms
    tone = request_data.tone

    if not content:
        return JSONResponse(status_code=400, content={"error": "Content cannot be empty."})

    if not platforms:
        return JSONResponse(status_code=400, content={"error": "At least one platform must be selected."})

    valid_platforms = {"linkedin", "instagram", "x", "youtube"}
    selected_valid = [p for p in platforms if p in valid_platforms]
    
    if not selected_valid:
        return JSONResponse(status_code=400, content={"error": "Invalid platform selections."})

    prompt = f"""
You are an expert social media content repurposing assistant.
Your task is to take the following original content and adapt it for specific social media platforms in a {tone} tone.
Do not simply copy the original content. Adapt it to fit the best practices of each selected platform.
Preserve the original meaning and do not invent facts that are not present in the source content.

Original Content:
\"\"\"
{content}
\"\"\"

Please generate content ONLY for the following platforms: {", ".join(selected_valid)}

Platform Guidelines:
- linkedin: Professional, useful and informative, strong opening, natural formatting, appropriate hashtags.
- instagram: Attention-grabbing opening, short paragraphs, engaging caption, relevant hashtags.
- x: Concise, clear, strong hook, stay within appropriate post length. If the content requires multiple posts, create a short thread.
- youtube: Catchy but relevant title, detailed description, suggested tags, simple video outline.

Output Format:
You MUST return STRICTLY VALID JSON. Do not include Markdown blocks (like ```json), do not include any explanatory text around the JSON.
The JSON must follow this exact structure, including only the requested platforms:
{{
  "linkedin": "...",
  "instagram": "...",
  "x": "...",
  "youtube": {{
    "title": "...",
    "description": "...",
    "tags": ["...", "..."],
    "outline": "..."
  }}
}}
"""
    try:
        response = await model.generate_content_async(prompt)
        
        # Parse the JSON response
        text = response.text.strip()
        # Clean markdown code blocks if the model accidentally includes them
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()

        result_json = json.loads(text)
        return result_json

    except json.JSONDecodeError:
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to parse the AI response as JSON. Please try again."}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"An error occurred during AI generation: {str(e)}"}
        )

# Ensure FastAPI uses the exact JSON syntax error format the frontend expects 
# (though Pydantic will catch structural issues, we handle the most basic ones)
from fastapi.exceptions import RequestValidationError
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=400,
        content={"error": "Invalid JSON payload or missing fields."}
    )

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=5000, reload=True)
