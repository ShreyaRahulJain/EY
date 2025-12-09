# agents/explanation.py
from ..util.llm import get_gemini_model

def generate_explanation(loan_data: dict, status: str, math_details: str):
    model = get_gemini_model()
    
    prompt = f"""
        You are a helpful bank loan officer.

        Customer Name: {loan_data['name']}

        Loan Status: {status}

        

        Technical Data: {math_details}

        

        Task: Write a 2-sentence message to {loan_data['name']}.

        

        CRITICAL INSTRUCTIONS:

        1. If status is 'pre_approved', Congratulate them enthusiastically.

        2. If status is 'manual_review' or 'rejected', YOU MUST EXPLAIN WHY based on the Technical Data (e.g., "High EMI compared to income").

        3. Be polite but clear. Do not use technical jargon like "Ratio".

        """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"ERROR {e}")
        return f"Application is {status}."