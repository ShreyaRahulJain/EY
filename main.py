# main.py
from typing import Dict, Any
import uuid

# Import BackgroundTasks and WebSocket
from fastapi import FastAPI, HTTPException, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from models import LoanRequest
from pipeline import create_empty_loan_record, run_pipeline
from pydantic import BaseModel
from backend.util.llm import chat_with_grok

class ChatMessage(BaseModel):
    loan_id: str
    message: str

app = FastAPI()

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, loan_id: str):
        await websocket.accept()
        self.active_connections[loan_id] = websocket

    def disconnect(self, loan_id: str):
        if loan_id in self.active_connections:
            del self.active_connections[loan_id]

    async def send_update(self, loan_id: str, message: dict):
        if loan_id in self.active_connections:
            try:
                await self.active_connections[loan_id].send_json(message)
            except:
                self.disconnect(loan_id)

manager = ConnectionManager()

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
    print(f"GET /loans/{loan_id} - Available loans: {list(LOANS.keys())}")
    loan = LOANS.get(loan_id)
    if not loan:
        print(f"Loan {loan_id} not found in {list(LOANS.keys())}")
        raise HTTPException(status_code=404, detail="Loan not found")
    
    print(f"GET /loans/{loan_id} - Returning: {loan}")
    return loan

@app.websocket("/ws/{loan_id}")
async def websocket_endpoint(websocket: WebSocket, loan_id: str):
    await manager.connect(websocket, loan_id)
    try:
        while True:
            # Keep connection alive and send updates when loan status changes
            data = await websocket.receive_text()
            
            # Send current loan status
            loan = LOANS.get(loan_id)
            if loan:
                await websocket.send_json(loan)
    except WebSocketDisconnect:
        manager.disconnect(loan_id)

@app.post("/chat")
async def chat_with_manager(chat_msg: ChatMessage):
    """
    Chat endpoint for user to communicate with AI manager
    """
    loan = LOANS.get(chat_msg.loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Import manager agent
    try:
        from backend.agents.manager import generate_manager_response
        
        # Generate AI manager response
        response_text = generate_manager_response(
            loan_data=loan["data"],
            user_message=chat_msg.message,
            chat_history=[]  # TODO: Implement chat history storage
        )
        
        return {
            "response": response_text,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        print(f"Chat error: {e}")
        return {
            "response": "Thank you for your message. I'm reviewing your application and will respond shortly.",
            "timestamp": datetime.utcnow().isoformat()
        }

class ChatbotMessage(BaseModel):
    message: str
    conversation_history: list
    collected_data: dict

@app.post("/chatbot")
async def chatbot_assistant(msg: ChatbotMessage):
    """
    Chatbot assistant for loan application
    Uses Gemini to intelligently guide users through the application
    """
    try:
        
        # Build context
        context = f"""
You are a helpful AI loan application assistant for OpenCred, a digital lending platform. Your role is to ease the entire loan application process and minimize the time customers spend on paperwork.

INTRODUCTION (if this is the first interaction):
- Introduce yourself as OpenCred's AI loan assistant
- Explain that you'll guide them through a simple, automated loan application process
- Mention that this will save them time compared to traditional bank visits
- Ask about their loan needs and reassure them that the process is secure and fast

PERSONALITY & APPROACH:
- Be warm, professional, and genuinely helpful
- Show enthusiasm about helping them achieve their financial goals
- Be persuasive about the benefits of digital lending (speed, convenience, transparency)
- Address concerns proactively but never be pushy or forceful
- Use encouraging language and celebrate small wins during the process
- If they seem hesitant, gently explain how you can help and the advantages

INFORMATION TO COLLECT (in natural conversation flow):
1. Full Name (accept any format)
2. Email Address 
3. Phone Number
4. PAN Number (accept ANY format - no validation needed)
5. Complete Address (accept any address format)
6. Employment Type (Salaried/Self-Employed/Business Owner)
7. Monthly Income (in rupees)
8. Loan Amount Needed (in rupees)
9. Loan Purpose (be supportive of their goals)
10. Loan Tenure (12/24/36/48/60 months)
11. Document Confirmation (ONLY ask this AFTER collecting ALL above information)

Already collected: {msg.collected_data}

Conversation so far:
{format_conversation(msg.conversation_history)}

User's message: {msg.message}

RESPONSE GUIDELINES:
1. If collecting information, respond with: "COLLECTED: field_name: value" followed by encouraging next steps
2. For PAN: Accept ANY format without validation
3. For document confirmation (ONLY ask after collecting ALL 10 pieces of information above):
   - Ask: "Great! Now I need to confirm - do you have all 4 required documents ready? (PAN Card, Aadhaar Card, Bank Statement for last 3 months, Salary Slips for last 3 months)"
   - If YES: respond EXACTLY with "COLLECTED: documentsConfirmed: yes" followed by "Perfect! I'll redirect you to the document upload page now."
   - If NO: Explain why each document is needed and encourage them to gather documents first
   - NEVER provide links or URLs. The system will handle the redirect automatically.
4. Answer questions thoroughly and relate back to how it helps their application
5. Be conversational - use their name when you have it
6. Show progress ("Great! We're halfway through" etc.)
7. Extract numbers from natural language (e.g., "50000 rupees" → 50000)
8. If they express doubts, address them with benefits: speed, security, transparency, no branch visits needed

CRITICAL: NEVER mention links, URLs, placeholders, or external pages. When documents are confirmed, just say you'll redirect them and the system will handle it automatically.

Remember: You're here to make their loan journey smooth and stress-free. Be their trusted guide through this important financial decision.
"""
        
        # Send to Grok via OpenRouter
        messages = [{"role": "system", "content": context}]
        
        # Add conversation history (last 2 messages to save tokens)
        recent_history = msg.conversation_history[-2:] if len(msg.conversation_history) > 2 else msg.conversation_history
        for hist_msg in recent_history:
            role = "user" if hist_msg.get("sender") == "user" else "assistant"
            messages.append({"role": role, "content": hist_msg.get("text", "")})
        
        # Add current message
        messages.append({"role": "user", "content": msg.message})
        
        response_text = chat_with_grok(messages, model="google/gemini-2.5-flash")
        
        print(f"[Chatbot] User: {msg.message}")
        print(f"[Chatbot] Grok response: {response_text}")
        
        # Parse if Gemini collected data
        collected_field = None
        collected_value = None
        
        if "COLLECTED:" in response_text:
            try:
                parts = response_text.split("COLLECTED:", 1)[1].split("\n", 1)
                if len(parts) > 0:
                    field_value = parts[0].strip()
                    if ":" in field_value:
                        collected_field, collected_value = field_value.split(":", 1)
                        collected_field = collected_field.strip()
                        collected_value = collected_value.strip()
                        print(f"[Chatbot] Collected {collected_field} = {collected_value}")
                        # Remove the COLLECTED line from response
                        response_text = parts[1].strip() if len(parts) > 1 else "Got it! What's next?"
            except Exception as e:
                print(f"[Chatbot] Parse error: {e}")
                pass
        
        return {
            "response": response_text.strip(),
            "collected_field": collected_field,
            "collected_value": collected_value,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        print(f"Chatbot error: {e}")
        return {
            "response": "I'm having trouble processing that. Could you please try again?",
            "collected_field": None,
            "collected_value": None,
            "timestamp": datetime.utcnow().isoformat()
        }

def format_conversation(history):
    if not history or len(history) == 0:
        return "No previous conversation"
    
    formatted = []
    # Only last 2 messages to minimize API calls
    for msg in history[-2:]:
        sender = "User" if msg.get('sender') == 'user' else "Assistant"
        formatted.append(f"{sender}: {msg.get('text', '')}")
    
    return "\n".join(formatted)

class ManagerDecision(BaseModel):
    loan_id: str
    decision: str  # "approved" or "rejected"
    comments: str

@app.get("/debug/loans")
def debug_loans():
    """Debug endpoint to see all loans"""
    return {"total_loans": len(LOANS), "loan_ids": list(LOANS.keys()), "loans": LOANS}

@app.get("/manager/pending")
def get_pending_loans():
    """Get all loans pending manager approval"""
    pending_loans = []
    for loan_id, loan_data in LOANS.items():
        if loan_data.get("status") == "pending_manager_approval":
            pending_loans.append({
                "loan_id": loan_id,
                "data": {
                    "name": loan_data["data"]["name"],
                    "amount": loan_data["data"]["amount"],
                    "purpose": loan_data["data"]["purpose"],
                    "pan": loan_data["data"]["pan"],
                    "income": loan_data["data"]["income"],
                },
                "sanction_letter": loan_data.get("sanction_letter", ""),
                "submitted_at": loan_data["timeline"][0]["time"] if loan_data["timeline"] else "",
                "ai_suggestion": "APPROVED",  # Since it reached manager, AI suggested approval
                "ai_confidence": 85,  # Mock confidence for display
                "ai_explanation": "Application meets all criteria and has been recommended for approval.",
            })
    return {"pending_loans": pending_loans}

@app.post("/manager/decision")
def manager_decision(decision: ManagerDecision):
    """Manager approves or rejects a loan"""
    loan = LOANS.get(decision.loan_id)
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    if loan["status"] != "pending_manager_approval":
        raise HTTPException(status_code=400, detail="Loan is not pending manager approval")
    
    # Update loan status based on manager decision
    if decision.decision == "approved":
        loan["status"] = "approved"
        loan["explanation"] = f"Congratulations! Your loan has been approved by our manager. {decision.comments}"
    else:
        loan["status"] = "rejected"
        loan["explanation"] = f"We regret to inform you that your loan application has been rejected. Reason: {decision.comments}"
    
    # Add timeline entry
    loan["timeline"].append({
        "step": "Manager Decision",
        "detail": f"Manager {decision.decision} the application: {decision.comments}",
        "time": datetime.utcnow().isoformat(),
    })
    
    return {"message": f"Loan {decision.decision} successfully", "loan_status": loan["status"]}

from datetime import datetime