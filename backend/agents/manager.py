# agents/manager.py
from ..util.llm import get_gemini_model

def generate_manager_response(loan_data: dict, user_message: str, chat_history: list = None):
    """
    Manager Agent - Provides personalized responses to user queries
    Uses Gemini to generate contextual, helpful responses
    """
    model = get_gemini_model()
    
    # Build context from loan data
    context = f"""
    You are a helpful and empathetic loan manager reviewing a loan application.
    
    Applicant Details:
    - Name: {loan_data.get('name', 'N/A')}
    - Loan Amount Requested: ₹{loan_data.get('amount', 'N/A')}
    - Monthly Income: ₹{loan_data.get('income', 'N/A')}
    - Purpose: {loan_data.get('purpose', 'N/A')}
    - Current Status: {loan_data.get('status', 'Under Review')}
    
    Previous Chat History:
    {format_chat_history(chat_history) if chat_history else 'No previous messages'}
    
    User's Current Message: {user_message}
    
    Instructions:
    1. Be professional, empathetic, and helpful
    2. Provide specific information about their application when possible
    3. If they ask about status, explain what's being reviewed
    4. If they ask about documents, confirm what's been received
    5. If they mention additional income or information, acknowledge it and note it for review
    6. Keep responses concise (2-3 sentences max)
    7. Always maintain a positive, supportive tone
    
    Generate a helpful response:
    """
    
    try:
        response = model.generate_content(context)
        return response.text.strip()
    except Exception as e:
        print(f"Manager Agent Error: {e}")
        return "Thank you for your message. I'm reviewing your application carefully and will get back to you shortly."

def format_chat_history(chat_history: list) -> str:
    """Format chat history for context"""
    if not chat_history:
        return "No previous messages"
    
    formatted = []
    for msg in chat_history[-5:]:  # Last 5 messages for context
        sender = "User" if msg.get('sender') == 'user' else "Manager"
        formatted.append(f"{sender}: {msg.get('message', msg.get('text', ''))}")
    
    return "\n".join(formatted)

def analyze_for_approval_decision(loan_data: dict, chat_context: str):
    """
    Analyzes chat conversation and additional information to make approval decision
    This is called when manager decides to approve/reject based on conversation
    """
    model = get_gemini_model()
    
    prompt = f"""
    You are a senior loan manager making a final decision on a loan application.
    
    Application Details:
    - Name: {loan_data.get('name')}
    - Requested Amount: ₹{loan_data.get('amount')}
    - Monthly Income: ₹{loan_data.get('income')}
    - Purpose: {loan_data.get('purpose')}
    
    Conversation Summary:
    {chat_context}
    
    Based on the application and conversation, provide:
    1. Decision: APPROVED or REJECTED
    2. Brief explanation (2 sentences)
    
    Format your response as:
    DECISION: [APPROVED/REJECTED]
    EXPLANATION: [Your explanation]
    """
    
    try:
        response = model.generate_content(prompt)
        return parse_decision_response(response.text)
    except Exception as e:
        print(f"Decision Analysis Error: {e}")
        return {
            "decision": "manual_review",
            "explanation": "Additional review required."
        }

def parse_decision_response(response_text: str) -> dict:
    """Parse the AI response into structured decision"""
    lines = response_text.strip().split('\n')
    decision = "manual_review"
    explanation = ""
    
    for line in lines:
        if line.startswith("DECISION:"):
            decision_text = line.replace("DECISION:", "").strip().upper()
            if "APPROVED" in decision_text:
                decision = "pre_approved"
            elif "REJECTED" in decision_text:
                decision = "rejected"
        elif line.startswith("EXPLANATION:"):
            explanation = line.replace("EXPLANATION:", "").strip()
    
    return {
        "decision": decision,
        "explanation": explanation or response_text
    }

