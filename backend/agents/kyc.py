# agents/kyc.py
import re

def check_kyc(pan_number: str):
    """
    Returns True if valid, False if invalid.
    """
    pan_pattern = r"[A-Z]{5}[0-9]{4}[A-Z]"
    if re.fullmatch(pan_pattern, pan_number):
        return {"status": "success", "log": "KYC Verified "}
    else:
        return {"status": "failed", "log": "Invalid PAN Format "}