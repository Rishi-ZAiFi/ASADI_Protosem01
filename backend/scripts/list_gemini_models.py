import os
import sys
import httpx

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.config import settings

def main():
    api_key = settings.LLM_API_KEY
    if not api_key:
        print("Error: No API key found in settings.")
        sys.exit(1)
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    try:
        response = httpx.get(url)
        response.raise_for_status()
        data = response.json()
        models = [m.get("name") for m in data.get("models", [])]
        print("Available models:")
        for m in models:
            print(f" - {m}")
    except Exception as e:
        print(f"Error listing models: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text}")

if __name__ == "__main__":
    main()
