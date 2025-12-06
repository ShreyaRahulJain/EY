# pipeline.py
from datetime import datetime
from typing import Dict, Any

from models import LoanRequest
from kyc import run_kyc_check
from underwriting import run_underwriting

def now_iso() -> str:
    return datetime.utcnow().isoformat()

def create_empty_loan_record(req: LoanRequest) -> Dict[str, Any]:
    data = req.dict()
    record: Dict[str, Any] = {
        "data": data,
        "status": "submitted",
        "explanation": "",
        "timeline": [
            {
                "step": "Submitted",
                "detail": "Loan application submitted",
                "time": now_iso(),
            }
        ],
    }

    # Fake document upload step in timeline if provided
    doc_name = data.get("document_name")
    if doc_name:
        record["timeline"].append({
            "step": "Document Upload",
            "detail": f"Document '{doc_name}' received (dummy upload).",
            "time": now_iso(),
        })

    return record

def run_pipeline(loan_record: Dict[str, Any]) -> None:
    """
    Tiny v1 "multi-agent" pipeline:
    1. KYC
    2. Underwriting
    """
    run_kyc_check(loan_record)
    run_underwriting(loan_record)
