import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.llm_service import LLMService

def main():
    provider = LLMService.get_provider()
    
    topics = [
        "The evolution of deep learning in 2024",
        "How to bake the perfect sourdough bread",
        "Top 3 productivity hacks for remote workers"
    ]
    
    print("--- 4: SMOKE TEST (REAL KEY) ---")
    for i, topic in enumerate(topics):
        b0_prompt = f"Write an Instagram post about {topic}.\n- Topic: {topic}\nReturn JSON with 'hook', 'caption', 'cta', 'hashtags', and 'slides'."
        
        try:
            res = provider.generate(b0_prompt)
            print(f"\n[Topic {i+1}]: {topic}")
            print("Verbatim Caption Output:")
            print("-" * 40)
            print(res.get("caption", "<No caption found>"))
            print("-" * 40)
        except Exception as e:
            print(f"Error on topic {i+1}: {e}")

if __name__ == "__main__":
    main()
