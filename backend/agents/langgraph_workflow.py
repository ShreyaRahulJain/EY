# agents/langgraph_workflow.py
"""
LangGraph Workflow for Multi-Agent Loan Processing
This provides a stateful workflow orchestration for the loan processing pipeline
"""

from typing import TypedDict, Annotated, Sequence
from datetime import datetime
import operator

# State definition for the workflow
class LoanApplicationState(TypedDict):
    """State that gets passed between agents"""
    loan_id: str
    applicant_name: str
    pan: str
    income: float
    amount: float
    purpose: str
    document_name: str
    
    # Processing state
    status: str
    explanation: str
    timeline: list
    
    # Agent outputs
    kyc_result: dict
    underwriting_result: dict
    ai_explanation: str
    
    # Feedback loop
    feedback: Annotated[Sequence[str], operator.add]
    iteration_count: int

# Agent node functions
def kyc_agent_node(state: LoanApplicationState) -> LoanApplicationState:
    """KYC Verification Agent Node"""
    from . import kyc
    
    print(f"[LangGraph] Running KYC Agent for {state['applicant_name']}")
    
    kyc_result = kyc.check_kyc(state['pan'])
    
    state['kyc_result'] = kyc_result
    state['timeline'].append({
        "step": "KYC Verification",
        "detail": kyc_result['log'],
        "time": datetime.utcnow().isoformat()
    })
    
    # Update status based on KYC
    if kyc_result['status'] == 'failed':
        state['status'] = 'rejected'
        state['feedback'].append("KYC failed - invalid PAN format")
    else:
        state['feedback'].append("KYC passed")
    
    return state

def underwriting_agent_node(state: LoanApplicationState) -> LoanApplicationState:
    """Underwriting Agent Node"""
    from . import underwriting
    
    print(f"[LangGraph] Running Underwriting Agent")
    
    uw_result = underwriting.evaluate_risk(state['income'], state['amount'])
    
    state['underwriting_result'] = uw_result
    state['timeline'].append({
        "step": "Underwriting Analysis",
        "detail": uw_result['log'],
        "time": datetime.utcnow().isoformat()
    })
    
    # Update status based on underwriting
    if uw_result['decision'] == 'APPROVED':
        state['status'] = 'pre_approved'
        state['feedback'].append(f"Underwriting approved - ratio {uw_result['ratio']:.2f}x")
    elif uw_result['decision'] == 'REJECTED':
        state['status'] = 'rejected'
        state['feedback'].append(f"Underwriting rejected - high debt ratio {uw_result['ratio']:.2f}x")
    else:
        state['status'] = 'manual_review'
        state['feedback'].append(f"Manual review needed - ratio {uw_result['ratio']:.2f}x")
    
    return state

def explanation_agent_node(state: LoanApplicationState) -> LoanApplicationState:
    """AI Explanation Agent Node"""
    from . import explain
    
    print(f"[LangGraph] Running Explanation Agent")
    
    # Prepare data for explanation
    loan_data = {
        'name': state['applicant_name'],
        'amount': state['amount'],
        'income': state['income']
    }
    
    math_details = f"Income: ₹{state['income']}, Loan: ₹{state['amount']}, Ratio: {state['underwriting_result']['ratio']:.2f}x"
    
    ai_explanation = explain.generate_explanation(
        loan_data=loan_data,
        status=state['status'],
        math_details=math_details
    )
    
    state['ai_explanation'] = ai_explanation
    state['explanation'] = ai_explanation
    state['timeline'].append({
        "step": "AI Explanation Generated",
        "detail": "Gemini AI generated decision explanation",
        "time": datetime.utcnow().isoformat()
    })
    
    return state

def feedback_loop_node(state: LoanApplicationState) -> LoanApplicationState:
    """
    Self-improving feedback loop
    Analyzes the decision and feedback to improve future decisions
    """
    print(f"[LangGraph] Running Feedback Loop")
    
    # Collect feedback
    feedback_summary = " | ".join(state['feedback'])
    
    state['timeline'].append({
        "step": "Feedback Loop",
        "detail": f"Iteration {state['iteration_count']}: {feedback_summary}",
        "time": datetime.utcnow().isoformat()
    })
    
    # Increment iteration
    state['iteration_count'] += 1
    
    # Log for learning (in production, this would train/update models)
    print(f"[Feedback] Decision: {state['status']}, Factors: {feedback_summary}")
    
    return state

# Conditional edges
def should_continue_to_underwriting(state: LoanApplicationState) -> str:
    """Decide if we should continue to underwriting or stop"""
    if state['status'] == 'rejected':
        return "explanation"  # Skip underwriting, go straight to explanation
    return "underwriting"

def should_run_feedback(state: LoanApplicationState) -> str:
    """Decide if we need feedback loop"""
    if state['status'] in ['pre_approved', 'rejected', 'manual_review']:
        return "feedback"
    return "end"

# Build the workflow graph
def create_loan_workflow():
    """
    Create the LangGraph workflow
    Note: This is a simplified version. Full LangGraph requires the langgraph library.
    For now, we'll use a simple sequential flow with conditional logic.
    """
    
    workflow_steps = {
        "kyc": kyc_agent_node,
        "underwriting": underwriting_agent_node,
        "explanation": explanation_agent_node,
        "feedback": feedback_loop_node
    }
    
    return workflow_steps

def run_langgraph_pipeline(loan_data: dict) -> dict:
    """
    Execute the LangGraph workflow
    """
    # Initialize state
    state = LoanApplicationState(
        loan_id=loan_data.get('loan_id', 'unknown'),
        applicant_name=loan_data['name'],
        pan=loan_data['pan'],
        income=loan_data['income'],
        amount=loan_data['amount'],
        purpose=loan_data['purpose'],
        document_name=loan_data.get('document_name', ''),
        status='processing',
        explanation='',
        timeline=[],
        kyc_result={},
        underwriting_result={},
        ai_explanation='',
        feedback=[],
        iteration_count=0
    )
    
    print("[LangGraph] Starting workflow execution...")
    
    # Execute workflow
    workflow = create_loan_workflow()
    
    # Step 1: KYC
    state = workflow['kyc'](state)
    
    # Step 2: Underwriting (conditional)
    if state['status'] != 'rejected':
        state = workflow['underwriting'](state)
    
    # Step 3: Explanation
    state = workflow['explanation'](state)
    
    # Step 4: Feedback Loop
    state = workflow['feedback'](state)
    
    print(f"[LangGraph] Workflow completed. Final status: {state['status']}")
    
    return {
        'status': state['status'],
        'explanation': state['explanation'],
        'timeline': state['timeline'],
        'feedback': state['feedback']
    }

