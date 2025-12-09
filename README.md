# EY Techathon 6.0 - Intelligent Lending System

An AI-powered loan application system with real-time document verification, OCR processing, and intelligent underwriting using Google Gemini.

## Features

- **Document Upload & OCR Simulation**: Drag-and-drop document upload with simulated OCR processing
- **Real-time Status Updates**: Live tracking of application progress (like GPay)
- **AI-Powered Explanations**: Google Gemini generates personalized loan decision explanations
- **Multi-Agent Architecture**: KYC, Underwriting, and AI Explanation agents
- **Modern Banking UI**: Professional, responsive design with Tailwind CSS
- **Instant Decisions**: Automated loan approval/rejection based on financial metrics

## Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **Google Gemini AI**: For generating explanations
- **Pydantic**: Data validation
- **Python 3.8+**

### Frontend
- **React 19**: Modern UI library
- **Vite**: Fast build tool
- **Tailwind CSS v3**: Utility-first CSS framework
- **Axios**: HTTP client

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- Google Gemini API Key ([Get it here](https://aistudio.google.com/app/apikey))

### Backend Setup

1. **Navigate to the EY directory**:
   ```bash
   cd EY
   ```

2. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file** in the `EY` directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Run the backend server**:
   ```bash
   uvicorn main:app --reload
   ```
   
   Backend will run on: `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   
   Frontend will run on: `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. Fill out the loan application form:
   - Full Name
   - PAN Number
   - Monthly Income
   - Loan Amount
   - Purpose
   - **Upload Document** (PAN Card or Aadhaar - JPG/PNG/PDF)
3. Submit the application
4. Watch real-time progress:
   - Document Received ✓
   - OCR Processing 🔍
   - PAN Verification 🆔
   - Document Verification ✓
   - KYC Complete ✓
   - Underwriting 📊
   - AI Explanation 🤖
5. Get instant decision with AI-generated explanation

## Project Structure

```
EY/
├── backend/
│   ├── agents/          # AI agent modules (not used in main flow)
│   └── util/
│       └── llm.py       # Gemini AI configuration
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DocumentUpload.jsx
│   │   │   ├── LiveStatus.jsx
│   │   │   ├── LoanForm.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   └── Timeline.jsx
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── index.css
│   └── package.json
├── main.py              # FastAPI application
├── models.py            # Pydantic models
├── pipeline.py          # Multi-agent workflow
├── kyc.py              # KYC verification with OCR simulation
├── underwriting.py     # Loan underwriting logic
├── requirements.txt    # Python dependencies
├── .env                # Environment variables (create this!)
└── README.md
```

## API Endpoints

### POST `/loans`
Submit a new loan application
- **Request Body**: `LoanRequest` (name, pan, income, amount, purpose, document_name)
- **Response**: `{ loan_id, status, explanation, timeline }`

### GET `/loans/{loan_id}`
Get loan application status
- **Response**: Full loan record with timeline and explanation

## Loan Approval Logic

The system uses EMI-to-Income ratio for underwriting:
- **EMI** = (Loan Amount × 0.01) / 12
- **EMI Ratio** = EMI / Monthly Income

**Decision Rules**:
- EMI Ratio < 0.3 → **Pre-approved** ✅
- 0.3 ≤ EMI Ratio < 0.5 → **Manual Review** ⚠️
- EMI Ratio ≥ 0.5 → **Rejected** ❌

## Environment Variables

Create a `.env` file in the `EY` directory:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

## Development

### Backend
```bash
# Run with auto-reload
uvicorn main:app --reload

# Run on custom port
uvicorn main:app --reload --port 8080
```

### Frontend
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Future Enhancements

- [ ] Real OCR integration (Tesseract/Google Vision API)
- [ ] Actual PAN verification API integration
- [ ] Credit score check (CIBIL API)
- [ ] Document authenticity verification
- [ ] Face matching for photo ID
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication
- [ ] Email notifications
- [ ] PDF sanction letter generation

## Team

EY Techathon 6.0 Project

## License

MIT License

