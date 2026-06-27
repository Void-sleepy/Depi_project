# Customer Support RAG-Powered Intelligent Chatbot

This repository contains the backend and frontend shells for a RAG assistant UI. The frontend is a modern React application built with Vite and Tailwind CSS. The backend is a FastAPI service that handles all query intelligence.

## Architecture

- `api/main.py` - local FastAPI stub for `/health` and `/query`
- `frontend/` - React frontend application (Vite + Tailwind CSS)
- `website/` - (Legacy) Old Flask application serving the UI, pending deletion
- `project_structure.md` - Guide to the repository layout and planned changes
- `requirements.txt` - Python dependencies for backend
- `.env` - local runtime configuration
- `Dockerfile` - Containerization instructions
- `start.sh` - Startup script for the container
- `AI_INSTRUCTIONS.md` - AI Build Instructions

## Local setup

### Backend Setup (FastAPI)
1. Create and activate a Python virtual environment.
2. Install dependencies: `pip install -r requirements.txt`.
3. Set environment variables in `.env`.
4. Run the backend:
```bash
uvicorn api.main:app --reload --port 8000
```

### Frontend Setup (React)
1. Ensure Node.js and npm are installed.
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Run the development server:
```bash
npm run dev
```

Open `http://localhost:5173` for the UI.

## Notes
- The frontend expects the FastAPI service to expose `GET /health` and `POST /query` on `http://localhost:8000`.
- A local stub implementation lives in `api/main.py` for development.
- Refer to `project_structure.md` for information on upcoming architectural changes to the Database layer.
