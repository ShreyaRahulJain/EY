# agents/orchestrator.py
from agents import kyc, underwriting, explain
# import database (Assume you have this set up as discussed before)

def run_pipeline(loan_id, user_data):
    print(f"--- Starting Pipeline for {user_data['name']} ---")
    
    # 1. KYC
    kyc_res = kyc.check_kyc(user_data['pan'])
    print(kyc_res['log'])
    
    if kyc_res['status'] == "failed":
        # Stop here if KYC fails
        return {"status": "REJECTED", "note": "Invalid ID"}

    # 2. Underwriting (Calling your dummy rule for now)
    uw_res = underwriting.evaluate_risk(user_data['income'], user_data['amount'])
    print(uw_res['log'])
    
    # 3. Explanation (The LLM)
    ai_msg = explain.generate_explanation(user_data['name'], uw_res)
    print(f"AI Says: {ai_msg}")
    
    # Return everything to be saved to DB
    return {
        "status": uw_res['decision'],
        "explanation": ai_msg,
        "technical_details": uw_res
    }