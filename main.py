# main.py
from typing import Dict, Any
import uuid

from fastapi import FastAPI, HTTPException

from models import LoanRequest
from pipeline import create_empty_loan_record, run_pipeline

app = FastAPI()

# Simple in-memory store for v1
LOANS: Dict[str, Dict[str, Any]] = {}

@app.post("/loans")
def create_loan(req: LoanRequest):
    loan_id = str(uuid.uuid4())
    loan_record = create_empty_loan_record(req)

    LOANS[loan_id] = loan_record

    # Run simple "agents" synchronously for v1
    run_pipeline(loan_record)

    return {
        "loan_id": loan_id,
        "status": loan_record["status"],
        "explanation": loan_record["explanation"],
        "timeline": loan_record["timeline"],
    }

@app.get("/loans/{loan_id}")
def get_loan(loan_id: str):
    loan = LOANS.get(loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")

    return {
        "loan_id": loan_id,
        "status": loan["status"],
        "explanation": loan["explanation"],
        "timeline": loan["timeline"],
        "data": loan["data"],
    }
