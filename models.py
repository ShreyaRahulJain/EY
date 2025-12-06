# models.py
from pydantic import BaseModel
from typing import Optional

class LoanRequest(BaseModel):
    name: str
    pan: str
    income: float        # monthly income
    amount: float        # loan amount
    purpose: str
    # fake "document upload" – just send a name/string in v1
    document_name: Optional[str] = None
