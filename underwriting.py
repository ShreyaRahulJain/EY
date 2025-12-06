# underwriting.py
from datetime import datetime
from typing import Dict, Any

def now_iso() -> str:
    return datetime.utcnow().isoformat()

def calculate_emi(principal: float, annual_rate: float = 0.12, years: int = 3) -> float:
    """
    Returns monthly EMI for given principal, annual interest rate, and tenure (years).
    """
    r = annual_rate / 12.0   # monthly interest rate
    n = years * 12           # total months
    if r == 0:
        return principal / n
    emi = principal * r * (1 + r) ** n / ((1 + r) ** n - 1)
    return emi

def run_underwriting(loan: Dict[str, Any], ratio_threshold: float = 2.0) -> None:
    """
    Uses income/EMI ratio to decide:
    - 'pre_approved' or 'manual_review'
    Adds explanation and underwriting timeline event.
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

    explanation = (
        f"Monthly income: {income:.2f}, EMI: {emi:.2f}, "
        f"income/EMI ratio: {ratio:.2f}. "
    )
    if decision == "pre_approved":
        explanation += (
            f"Since the ratio is ≥ {ratio_threshold}, the loan is pre-approved."
        )
    else:
        explanation += (
            f"Since the ratio is < {ratio_threshold}, the loan requires manual review."
        )

    loan["status"] = decision
    loan["explanation"] = explanation

    loan["timeline"].append({
        "step": "Underwriting",
        "detail": f"Underwriting completed – result: {short_result}",
        "time": now_iso(),
    })
