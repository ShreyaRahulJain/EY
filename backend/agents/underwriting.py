# agents/underwriting.py

def evaluate_risk(income: float, loan_amount: float):
    """
    DUMMY VERSION for testing Agents.
    Teammate will replace this logic later.
    """
    # Simple Dummy Logic: If loan is more than 5x income, reject.
    threshold = 5.0
    actual_ratio = loan_amount / income
    
    if actual_ratio > threshold:
        return {
            "decision": "REJECTED",
            "reason_code": "HIGH_DEBT",
            "ratio": actual_ratio,
            "log": f"Risk Check: Loan is {actual_ratio}x income. Too high."
        }
    else:
        return {
            "decision": "APPROVED",
            "reason_code": "GOOD_INCOME",
            "ratio": actual_ratio,
            "log": "Risk Check: Income is sufficient."
        }