# pipeline.py
from datetime import datetime
from typing import Dict, Any

from models import LoanRequest
from kyc import run_kyc_check
from underwriting import run_underwriting
from backend.agents.explain import generate_explanation# <--- IMPORT YOUR AI AGENT

def now_iso() -> str:
    return datetime.utcnow().isoformat()

def create_empty_loan_record(req: LoanRequest) -> Dict[str, Any]:
    # (Keep your friend's existing code here, it's fine)
    data = req.dict()
    record: Dict[str, Any] = {
        "data": data,
        "status": "submitted",
        "explanation": "Processing...", # Placeholder
        "timeline": [
            {"step": "Submitted", "detail": "Application received", "time": now_iso()}
        ],
    }
    return record

def run_pipeline(loan_record: Dict[str, Any]) -> None:
    """
    The Multi-Agent Workflow:
    1. KYC Agent
    2. Underwriting Agent (Math)
    3. AI Agent (Explanation)
    """
    print("--- Starting Pipeline ---")
    
    # 1. Run KYC
    run_kyc_check(loan_record)
    
    # 2. Run Underwriting (Math)
    # We capture the 'math_summary' string returned by the function
    math_summary = run_underwriting(loan_record)
    
    # 3. Run AI Explanation (The New Part!)
    # We pass the math summary to Gemini
    print("--- Calling Gemini LLM ---")
    ai_text = generate_explanation(
        loan_data=loan_record["data"],
        status=loan_record["status"],
        math_details=math_summary
    )
    
    print(f"AI Generated Text: {ai_text}")
    
    # Save AI result to the record
    loan_record["explanation"] = ai_text
    
    loan_record["timeline"].append({
        "step": "AI Explanation",
        "detail": "Generated decision letter via Gemini.",
        "time": now_iso(),
    })
    print("--- Pipeline Finished ---")
    print(f"Final loan_record explanation: {loan_record['explanation']}")