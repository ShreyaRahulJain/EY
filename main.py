# main.py
from typing import Dict, Any
import uuid

# Import BackgroundTasks
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from models import LoanRequest
from pipeline import create_empty_loan_record, run_pipeline

app = FastAPI()

# Add CORS middleware to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],  # Vite's ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LOANS: Dict[str, Dict[str, Any]] = {}

@app.post("/loans")
def create_loan(req: LoanRequest, background_tasks: BackgroundTasks):
    """
    Now accepts background_tasks to run AI without blocking.
    """
    loan_id = str(uuid.uuid4())
    loan_record = create_empty_loan_record(req)

    LOANS[loan_id] = loan_record

    # --- THE CHANGE ---
    # Instead of running it NOW, we schedule it for immediately after return.
    background_tasks.add_task(run_pipeline, loan_record)

    return {
        "loan_id": loan_id,
        "status": "processing", # Initial status is processing
        "explanation": "Our AI agents are analyzing your file...",
        "timeline": loan_record["timeline"],
    }

@app.get("/loans/{loan_id}")
def get_loan(loan_id: str):
    loan = LOANS.get(loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    print(f"GET /loans/{loan_id} - Returning: {loan}")
    return loan