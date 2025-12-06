# kyc.py
import re
from datetime import datetime
from typing import Dict, Any

PAN_REGEX = r"^[A-Z]{5}[0-9]{4}[A-Z]$"

def now_iso() -> str:
    return datetime.utcnow().isoformat()

def run_kyc_check(loan: Dict[str, Any]) -> None:
    """
    Updates the loan dict in-place:
    - Adds a KYC timeline event
    - Marks status as 'kyc_completed'
    """
    pan = loan["data"]["pan"].upper().strip()
    pan_valid = bool(re.match(PAN_REGEX, pan))

    if pan_valid:
        pan_msg = "PAN format valid."
    else:
        pan_msg = "Invalid PAN format."

    doc_name = loan["data"].get("document_name")
    if doc_name:
        doc_msg = f"Dummy document '{doc_name}' marked as OK."
    else:
        doc_msg = "No document provided, dummy document check skipped."

    detail = f"KYC check completed – {pan_msg} {doc_msg}"

    loan["timeline"].append({
        "step": "KYC Check",
        "detail": detail,
        "time": now_iso(),
    })

    # Optional intermediate status
    loan["status"] = "kyc_completed"
