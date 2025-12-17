# Quick Setup Guide

## One-Time Setup

### 1. Backend Setup (5 minutes)

```bash
# Navigate to EY directory
cd EY

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo GEMINI_API_KEY=your_key_here > .env
# Then edit .env and replace 'your_key_here' with your actual Gemini API key
```

### 2. Frontend Setup (3 minutes)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## Running the Application

### Terminal 1 - Backend
```bash
cd EY
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
uvicorn main:app --reload
```
**Backend runs on**: http://127.0.0.1:8000

### Terminal 2 - Frontend
```bash
cd EY/frontend
npm run dev
```
**Frontend runs on**: http://localhost:5173

## Get Your Gemini API Key

1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Paste it in your `.env` file

## Testing the Application

1. Open http://localhost:5173
2. Fill the form:
   - Name: John Doe
   - PAN: ABCDE1234F
   - Income: 50000
   - Amount: 500000
   - Purpose: Home Renovation
   - Upload any image/PDF as document
3. Submit and watch the magic!

## Troubleshooting

### Backend Issues

**Error: ModuleNotFoundError**
```bash
pip install -r requirements.txt
```

**Error: No module named 'dotenv'**
```bash
pip install python-dotenv
```

**Error: GEMINI_API_KEY not found**
- Make sure `.env` file exists in `EY` directory
- Check that the API key is correct

### Frontend Issues

**Error: Cannot find module**
```bash
cd frontend
npm install
```

**Error: Port 5173 already in use**
- Kill the existing process or use a different port:
```bash
npm run dev -- --port 5174
```

**Tailwind styles not loading**
```bash
# Restart the dev server
# Press Ctrl+C, then:
npm run dev
```

## Package Versions

### Python (Backend)
- fastapi==0.115.5
- uvicorn==0.32.1
- google-generativeai==0.8.3
- python-dotenv==1.0.1
- pydantic==2.10.3

### Node.js (Frontend)
- react==19.2.0
- vite==7.2.4
- tailwindcss==3.4.0

## Common Commands

### Backend
```bash
# Install new package
pip install package_name

# Update requirements.txt
pip freeze > requirements.txt

# Check running processes
# Windows: netstat -ano | findstr :8000
# Mac/Linux: lsof -i :8000
```

### Frontend
```bash
# Install new package
npm install package-name

# Update all packages
npm update

# Build for production
npm run build
```


