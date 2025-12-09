import os 
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def get_gemini_model():
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    # for m in genai.list_models():
    #    print(m.name)
    return genai.GenerativeModel("gemini-2.5-flash")
#get_gemini_model()
