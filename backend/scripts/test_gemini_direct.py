import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import settings
import httpx

def main():
    api_key = settings.LLM_API_KEY
    if not api_key:
        print("No LLM_API_KEY found in settings.")
        return
        
    print("API Key configured (length: {})".format(len(api_key)))
    
    model_name = settings.LLM_MODEL or "gemini-2.5-flash"
    print(f"Model: {model_name}")
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [{"text": "Hello"}]
        }],
        "generationConfig": {
            "temperature": 0.7,
            "responseMimeType": "application/json"
        }
    }
    
    try:
        with httpx.Client(timeout=45.0) as client:
            res = client.post(url, json=payload)
            res.raise_for_status()
            data = res.json()
            print("Response:", data)
    except httpx.HTTPStatusError as e:
        print("--- FULL RAW EXCEPTION ---")
        print(f"Type: {type(e).__name__}")
        print(f"Status Code: {e.response.status_code}")
        print(f"Response Body: {e.response.text}")
    except Exception as e:
        print("--- FULL RAW EXCEPTION ---")
        print(f"Type: {type(e).__name__}")
        print(f"Message: {str(e)}")

if __name__ == "__main__":
    main()
