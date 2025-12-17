import os
import requests
from dotenv import load_dotenv

load_dotenv()

def chat_with_grok(messages, model="google/gemini-2.5-flash"):
    """Chat with Grok model via OpenRouter using requests"""
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": model,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1000
    }
    
    try:
        print(f"[DEBUG] Sending to OpenRouter: {model}")
        print(f"[DEBUG] API Key exists: {bool(os.getenv('OPENROUTER_API_KEY'))}")
        print(f"[DEBUG] Messages count: {len(messages)}")
        
        response = requests.post(url, headers=headers, json=data)
        
        print(f"[DEBUG] Response status: {response.status_code}")
        print(f"[DEBUG] Response text: {response.text}")
        
        response.raise_for_status()
        
        result = response.json()
        return result["choices"][0]["message"]["content"]
        
    except Exception as e:
        print(f"OpenRouter API error: {e}")
        if hasattr(e, 'response') and e.response:
            print(f"Error response: {e.response.text}")
        return "I'm having trouble connecting right now. Please try again."
