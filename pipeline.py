# pipeline.py
from datetime import datetime
from typing import Dict, Any

from models import LoanRequest
from kyc import run_kyc_check
from underwriting import run_underwriting
from backend.agents.explain import generate_explanation# <--- IMPORT YOUR AI AGENT
from backend.util.llm import chat_with_grok

def now_iso() -> str:
    return datetime.utcnow().isoformat()

def generate_sanction_letter(loan_data: dict, math_details: str) -> str:
    """Generate AI-powered sanction letter for manager review"""
    
    prompt = f"""
    Generate a professional loan sanction letter based on the following information:
    
    Applicant Details:
    - Name: {loan_data['name']}
    - PAN: {loan_data['pan']}
    - Income: ₹{loan_data['income']} per month
    - Loan Amount: ₹{loan_data['amount']}
    - Purpose: {loan_data['purpose']}
    
    AI Analysis: {math_details}
    
    Create a formal sanction letter that includes:
    1. Loan approval recommendation
    2. Approved amount and tenure
    3. Interest rate (suggest market rate 10-12%)
    4. Key terms and conditions
    5. Required documents for final disbursement
    
    Format as a professional bank sanction letter.
    """
    
    try:
        messages = [
            {"role": "system", "content": "You are a professional loan officer creating sanction letters."},
            {"role": "user", "content": prompt}
        ]
        
        sanction_letter = chat_with_grok(messages, model="google/gemini-2.5-flash")
        return sanction_letter
        
    except Exception as e:
        print(f"Error generating sanction letter: {e}")
        return f"Loan Sanction Letter for {loan_data['name']} - Amount: ₹{loan_data['amount']} - Pending Manager Review"

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
    
    # 3. Generate Sanction Letter for Manager Review
    print("--- Generating Sanction Letter ---")
    
    # Only generate sanction letter if pre-approved by AI
    if loan_record["status"] == "pre_approved":
        sanction_letter = generate_sanction_letter(
            loan_data=loan_record["data"],
            math_details=math_summary
        )
        
        # Set status to pending manager approval
        loan_record["status"] = "pending_manager_approval"
        loan_record["sanction_letter"] = sanction_letter
        loan_record["explanation"] = "Your application has been processed and is now pending manager approval."
        
        loan_record["timeline"].append({
            "step": "Sanction Generated",
            "detail": "AI generated sanction letter, awaiting manager approval.",
            "time": now_iso(),
        })
        
        print(f"Sanction Letter Generated: {sanction_letter}")
        
    else:
        # If rejected or manual review, generate explanation as before
        ai_text = generate_explanation(
            loan_data=loan_record["data"],
            status=loan_record["status"],
            math_details=math_summary
        )
        
        loan_record["explanation"] = ai_text
        loan_record["timeline"].append({
            "step": "AI Decision",
            "detail": f"Application {loan_record['status']}",
            "time": now_iso(),
        })
    
    print("--- Pipeline Finished ---")
    print(f"Final status: {loan_record['status']}")