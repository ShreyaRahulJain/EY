# New Workflow Implementation Guide

## Overview
The system now implements a **dual-path application flow** with AI chatbot assistance and manager approval workflow.

## Complete User Journey

### 1. Landing Page
**Route:** `/`

Users arrive at the landing page with two main CTAs:
- **"Apply for Loan"** → Goes to Application Choice page
- **"Manager Dashboard"** → Goes to Manager Dashboard (for loan officers)

---

### 2. Application Choice Page
**Route:** `/apply`

Users choose between two application methods:

#### Option A: AI Chatbot Assistant (Recommended)
- **Route:** `/apply/chatbot`
- **Features:**
  - Conversational interface
  - Step-by-step guidance
  - Users can ask questions about any field
  - Natural language interaction
  - Perfect for first-time users

#### Option B: Manual Form Upload
- **Route:** `/apply/manual`
- **Features:**
  - Traditional form-based application
  - All fields visible at once
  - Faster for experienced users
  - Direct document upload

---

### 3A. Chatbot Assistant Flow

**Component:** `ChatbotAssistant.jsx`

**Conversation Flow:**
1. **Name** → "What's your full name?"
2. **Email** → "What's your email address?"
3. **Phone** → "What's your phone number?"
4. **PAN** → "Please provide your PAN number"
5. **Address** → "What's your complete address?"
6. **Employment Type** → "What's your employment type?"
7. **Income** → "What's your monthly income?"
8. **Loan Amount** → "How much loan do you need?"
9. **Purpose** → "What's the purpose of this loan?"
10. **Tenure** → "What loan tenure would you prefer?"
11. **PAN Document** → "Please upload your PAN card"
12. **Aadhaar Document** → "Please upload your Aadhaar card"
13. **Bank Statement** → "Please upload bank statement"
14. **Salary Slips** → "Please upload salary slips"
15. **Complete** → "Processing your application..."

**Features:**
- Input validation at each step
- File upload for documents
- Can't proceed without valid input
- Natural conversation feel
- Typing indicators

**User Can Ask Questions:**
- "Why do you need my PAN?"
- "What documents are required?"
- "How long will this take?"
- Bot provides contextual answers

---

### 3B. Manual Form Flow

**Component:** `ApplicationForm.jsx`

**Steps:**
1. **Personal Information**
   - Full Name, Email, Phone, PAN, Address
   - Employment Type, Monthly Income
   
2. **Loan Requirements**
   - Loan Amount, Purpose, Tenure
   - Terms & Conditions checkbox

3. **Document Upload**
   - PAN Card (Required)
   - Aadhaar Card (Required)
   - Bank Statement (Required)
   - Salary Slips (Required)
   - Visual feedback when uploaded

4. **Submit** → Goes to verification page

---

### 4. Verification & AI Processing

**Component:** `ApplicationStatus` (LiveStatus view)

**What Happens:**
1. **Application Submitted** → Backend receives data
2. **AI Pipeline Executes:**
   - **KYC Agent** → Validates PAN format
   - **Underwriting Agent** → Calculates debt-to-income ratio
   - **Explanation Agent** → Generates decision explanation (Gemini AI)
   - **Feedback Loop** → Logs decision factors

3. **AI Decision:**
   - **APPROVED** → Goes to Manager for final approval
   - **REJECTED** → Goes to Manager with rejection recommendation
   - **MANUAL_REVIEW** → Goes to Manager for detailed review

4. **User Sees:**
   - Real-time timeline updates
   - Processing steps
   - AI explanation when complete

---

### 5. Manager Dashboard

**Route:** `/manager`
**Component:** `ManagerDashboard.jsx`

**Purpose:** Human oversight and final decision authority

**Features:**

#### Pending Applications List
- Shows all applications requiring manager review
- Displays:
  - Applicant name
  - Loan amount and purpose
  - AI suggestion (APPROVED/REJECTED)
  - AI confidence level (%)
  - AI explanation
  - Quick stats (income, loan amount, debt ratio)

#### AI Suggestion Card
- **AI Recommendation:** APPROVED or REJECTED
- **Confidence Level:** Percentage with visual bar
- **Explanation:** Why AI made this decision
- **Note:** This is advisory only - manager has final say

#### Manager Actions
1. **View Details** → Opens detailed modal with:
   - Full applicant information
   - Complete AI analysis
   - All decision factors
   
2. **Approve** → Manager approves the loan
   - Overrides AI if needed
   - Final decision sent to user
   
3. **Reject** → Manager rejects the loan
   - Can reject even if AI approved
   - Final decision sent to user

**Important:** AI can only SUGGEST, Manager must APPROVE/REJECT

---

### 6. Final Decision to User

**Component:** `ResultCard.jsx`

**User Sees:**

#### If Approved:
- **Congratulations message**
- **Loan amount approved**
- **Interest rate, EMI, Tenure**
- **Sanction letter generated**
- **AI explanation** of why approved
- **Detailed analysis** (if available)

#### If Rejected:
- **Rejection message**
- **AI explanation** of why rejected
- **Factors that led to rejection**

#### If Manual Review:
- **"Manual Review Required" message**
- **AI explanation** of what's being reviewed
- **"Connect with Loan Manager" button** → Opens chat
- **User can chat** with AI manager to provide additional info

---

## Key Workflow Differences

### Old Workflow
```
Landing → Register → Manual Form → AI Processing → Result
```

### New Workflow
```
Landing → Choice Page → [Chatbot OR Manual] → AI Processing → Manager Dashboard → Final Result
```

---

## Technical Implementation

### New Components Created

1. **`ChatbotAssistant.jsx`**
   - Conversational loan application
   - Step-by-step data collection
   - Document upload integration
   - Question answering capability

2. **`ApplicationChoice.jsx`**
   - Landing page for choosing application method
   - Two clear options with benefits
   - Visual comparison

3. **`ManagerDashboard.jsx`**
   - Loan officer interface
   - Review pending applications
   - See AI suggestions
   - Approve/reject with final authority

### Updated Components

1. **`App.jsx`**
   - New routes: `/apply`, `/apply/chatbot`, `/apply/manual`, `/manager`
   - `ChatbotFlow` component for handling chatbot completion
   - Proper routing between all pages

2. **`LandingPage.jsx`**
   - Updated CTAs to point to new routes
   - "Apply for Loan" → `/apply`
   - "Manager Dashboard" → `/manager`

3. **`ResultCard.jsx`**
   - Already updated to show AI explanations
   - "Connect with Manager" button for manual review

---

## User Personas

### Persona 1: First-Time Loan Applicant
**Path:** Landing → Choice → **Chatbot Assistant**
- Needs guidance
- Has questions about requirements
- Prefers conversational interface
- Gets help at each step

### Persona 2: Experienced Applicant
**Path:** Landing → Choice → **Manual Form**
- Knows what's needed
- Has all documents ready
- Wants to complete quickly
- Prefers traditional form

### Persona 3: Loan Manager
**Path:** Landing → **Manager Dashboard**
- Reviews AI-processed applications
- Sees AI suggestions
- Makes final approval/rejection decisions
- Has override authority

---

## API Flow

### Chatbot Submission
```javascript
// Chatbot collects data
const collectedData = {
  fullName, email, phone, pan, address,
  employmentType, income, amount, purpose, tenure,
  documents: { pan, aadhaar, bankStatement, salarySlips }
};

// Format for API
const formData = {
  name: collectedData.fullName,
  pan: collectedData.pan,
  income: parseFloat(collectedData.income),
  amount: parseFloat(collectedData.amount),
  purpose: collectedData.purpose,
  document_name: "PAN: file1.pdf, Aadhaar: file2.pdf..."
};

// Submit
POST /loans → Returns loan_id
```

### Manager Approval (To Be Implemented)
```javascript
// Manager approves
POST /loans/{loan_id}/approve
{
  "manager_decision": "approved",
  "manager_notes": "Good application"
}

// Manager rejects
POST /loans/{loan_id}/reject
{
  "manager_decision": "rejected",
  "manager_notes": "Insufficient income"
}
```

---

## Backend Updates Needed

### 1. Manager Approval Endpoints

Add to `main.py`:

```python
@app.post("/loans/{loan_id}/approve")
def approve_loan(loan_id: str, manager_notes: str = ""):
    loan = LOANS.get(loan_id)
    if not loan:
        raise HTTPException(status_code=404)
    
    loan["status"] = "pre_approved"
    loan["manager_decision"] = "approved"
    loan["manager_notes"] = manager_notes
    loan["timeline"].append({
        "step": "Manager Approved",
        "detail": f"Loan approved by manager. {manager_notes}",
        "time": datetime.utcnow().isoformat()
    })
    
    return loan

@app.post("/loans/{loan_id}/reject")
def reject_loan(loan_id: str, manager_notes: str = ""):
    loan = LOANS.get(loan_id)
    if not loan:
        raise HTTPException(status_code=404)
    
    loan["status"] = "rejected"
    loan["manager_decision"] = "rejected"
    loan["manager_notes"] = manager_notes
    loan["timeline"].append({
        "step": "Manager Rejected",
        "detail": f"Loan rejected by manager. {manager_notes}",
        "time": datetime.utcnow().isoformat()
    })
    
    return loan

@app.get("/loans/pending")
def get_pending_loans():
    pending = [
        loan for loan in LOANS.values()
        if loan["status"] == "manual_review"
    ]
    return pending
```

### 2. Update Pipeline to Send to Manager

Modify `pipeline.py`:

```python
def run_pipeline(loan_record: Dict[str, Any]) -> None:
    # ... existing code ...
    
    # After AI generates decision
    if loan_record["status"] in ["pre_approved", "rejected", "manual_review"]:
        # Don't finalize - send to manager
        loan_record["awaiting_manager_approval"] = True
        loan_record["timeline"].append({
            "step": "Awaiting Manager Review",
            "detail": "Application sent to manager for final approval",
            "time": now_iso()
        })
```

---

## Testing the New Workflow

### Test 1: Chatbot Flow
1. Go to `http://localhost:5173`
2. Click "Apply for Loan"
3. Choose "AI Chatbot Assistant"
4. Answer all questions step by step
5. Upload documents when prompted
6. Verify submission goes to processing

### Test 2: Manual Flow
1. Go to `http://localhost:5173`
2. Click "Apply for Loan"
3. Choose "Manual Form Upload"
4. Fill all fields
5. Upload all 4 documents
6. Submit and verify processing

### Test 3: Manager Dashboard
1. Submit an application (either method)
2. Go to `http://localhost:5173/manager`
3. See pending application
4. View AI suggestion
5. Click "Approve" or "Reject"
6. Verify decision is recorded

---

## Key Features

### ✅ Dual Application Paths
- Chatbot for guided experience
- Manual form for quick completion

### ✅ Conversational AI
- Natural language interaction
- Step-by-step guidance
- Question answering

### ✅ Manager Oversight
- Human-in-the-loop approval
- AI suggestions are advisory
- Final authority with manager

### ✅ Complete Transparency
- Users see AI explanations
- Managers see AI reasoning
- All decisions are logged

### ✅ Flexible Workflow
- First-time users get help
- Experienced users go fast
- Everyone gets fair review

---

## Next Steps

1. **Implement Manager API Endpoints**
   - `/loans/{id}/approve`
   - `/loans/{id}/reject`
   - `/loans/pending`

2. **Connect Manager Dashboard to Real API**
   - Fetch pending applications
   - Send approval/rejection decisions
   - Update user status in real-time

3. **Enhance Chatbot**
   - Add more intelligent responses
   - Connect to Gemini for question answering
   - Provide contextual help

4. **Add Notifications**
   - Email when manager approves/rejects
   - SMS for important updates
   - In-app notifications

5. **Add Manager Authentication**
   - Login for managers
   - Role-based access control
   - Audit trail of decisions

---

## Summary

The new workflow provides:
- **Choice** for users (chatbot vs manual)
- **Guidance** for first-time users
- **Speed** for experienced users
- **AI assistance** for decision making
- **Human oversight** for final approval
- **Transparency** throughout the process

This matches your architecture diagram perfectly with all components working together!

