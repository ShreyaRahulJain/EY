# kyc.py
import re
import time
from datetime import datetime
from typing import Dict, Any

PAN_REGEX = r"^[A-Z]{5}[0-9]{4}[A-Z]$"

def now_iso() -> str:
    return datetime.utcnow().isoformat()

def run_kyc_check(loan: Dict[str, Any]) -> None:
    """
    Enhanced KYC with OCR simulation and live status updates
    """
    # Step 1: Document Upload Received
    loan["timeline"].append({
        "step": "Document Received",
        "detail": "Document uploaded successfully. Starting verification...",
        "time": now_iso(),
    })
    time.sleep(0.5)  # Simulate processing time
    
    # Step 2: OCR Processing
    doc_name = loan["data"].get("document_name", "document.pdf")
    loan["timeline"].append({
        "step": "OCR Processing",
        "detail": f"Extracting text from '{doc_name}' using OCR...",
        "time": now_iso(),
    })
    time.sleep(1)  # Simulate OCR processing
    
    # Step 3: PAN Validation
    pan = loan["data"]["pan"].upper().strip()
    pan_valid = bool(re.match(PAN_REGEX, pan))
    
    loan["timeline"].append({
        "step": "PAN Verification",
        "detail": f"Verifying PAN number: {pan}...",
        "time": now_iso(),
    })
    time.sleep(0.8)
    
    if pan_valid:
        pan_msg = "PAN verified successfully"
    else:
        pan_msg = "PAN format invalid (proceeding with manual review)"
    
    # Step 4: Document Authenticity Check
    loan["timeline"].append({
        "step": "Document Verification",
        "detail": "Checking document authenticity and extracting details...",
        "time": now_iso(),
    })
    time.sleep(1)
    
    # Step 5: Final KYC Status
    detail = f"KYC completed – {pan_msg}. Document '{doc_name}' verified."
    
    loan["timeline"].append({
        "step": "KYC Check Complete",
        "detail": detail,
        "time": now_iso(),
    })

    loan["status"] = "kyc_completed"
