import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = Flask(__name__)
# Enable CORS so the React app can communicate with Flask
CORS(app)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY and GEMINI_API_KEY != "your_actual_api_key_here":
    genai.configure(api_key=GEMINI_API_KEY)
    # Recommended model
    model = genai.GenerativeModel('gemini-3.6-flash')
else:
    model = None

@app.route('/generate', methods=['POST'])
def generate_content():
    if not model:
        return jsonify({"error": "Gemini API key is missing or invalid. Please check your backend .env file."}), 500

    data = request.json
    
    if not data:
        return jsonify({"error": "Invalid JSON payload."}), 400

    content = data.get("content", "").strip()
    platforms = data.get("platforms", [])
    tone = data.get("tone", "professional")

    if not content:
        return jsonify({"error": "Content cannot be empty."}), 400

    if not platforms or not isinstance(platforms, list):
        return jsonify({"error": "At least one platform must be selected."}), 400

    valid_platforms = {"linkedin", "instagram", "x", "youtube"}
    selected_valid = [p for p in platforms if p in valid_platforms]
    
    if not selected_valid:
        return jsonify({"error": "Invalid platform selections."}), 400

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
        response = model.generate_content(prompt)
        
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
        return jsonify(result_json)

    except json.JSONDecodeError:
        return jsonify({"error": "Failed to parse the AI response as JSON. Please try again."}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred during AI generation: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
