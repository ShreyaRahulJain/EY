# underwriting.py
from datetime import datetime
from typing import Dict, Any

def now_iso() -> str:
    return datetime.utcnow().isoformat()

def calculate_emi(principal: float, annual_rate: float = 0.12, years: int = 3) -> float:
    r = annual_rate / 12.0   
    n = years * 12           
    if r == 0: return principal / n
    emi = principal * r * (1 + r) ** n / ((1 + r) ** n - 1)
    return emi

def run_underwriting(loan: Dict[str, Any], ratio_threshold: float = 2.0) -> str:
    """
    UPDATED: Performs Math, updates Status, and returns a 'Math Summary' string.
    It does NOT write the final explanation (The LLM will do that).
    """
    income = float(loan["data"]["income"])
    amount = float(loan["data"]["amount"])

    emi = calculate_emi(amount)
    ratio = income / emi if emi > 0 else 0.0

    if ratio >= ratio_threshold:
        decision = "pre_approved"
        short_result = "Pre-approved"
    else:
        decision = "manual_review"
        short_result = "Needs manual review"

    loan["status"] = decision
    
    loan["timeline"].append({
        "step": "Underwriting",
        "detail": f"Underwriting math completed – result: {short_result}",
        "time": now_iso(),
    })
    
    # Return the raw facts for the LLM to read
    return f"Income: {income}, EMI: {int(emi)}, Ratio: {ratio:.2f} (Threshold: {ratio_threshold})"