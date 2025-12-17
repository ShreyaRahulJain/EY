# agents/explanation.py
from ..util.llm import chat_with_grok

def generate_explanation(loan_data: dict, status: str, math_details: str):
    
    prompt = f"""
        You are a bank loan officer writing to a customer.

        Customer Name: {loan_data['name']}
        Loan Status: {status}
        Analysis Details: {math_details}

        Write a professional 2-sentence message to {loan_data['name']}.

        INSTRUCTIONS:
        1. If 'pre_approved': Congratulate them warmly and mention next steps.
        2. If 'manual_review' or 'rejected': Explain the reason clearly without technical jargon.
        3. Be professional, empathetic, and clear.
        4. Do NOT mention AI, algorithms, or automated systems.
        5. Write as if you personally reviewed their application.

        """
    
    try:
        messages = [
            {"role": "system", "content": "You are a helpful bank loan officer."},
            {"role": "user", "content": prompt}
        ]
        response = chat_with_grok(messages, model="google/gemini-2.5-flash")
        return response.strip()
    except Exception as e:
        print(f"ERROR {e}")
        return f"Application is {status}."