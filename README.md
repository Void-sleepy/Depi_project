# Customer Support RAG-Powered Intelligent Chatbot

This repository contains the backend and frontend shells for a RAG assistant UI. The FastAPI service handles all query intelligence. Currently, the frontend is built with Flask and Alpine.js, but a transition to React (Vite) and Tailwind CSS is planned.

## Architecture

- `api/main.py` - local FastAPI stub for `/health` and `/query`
- `website/` - Current Flask application serving the UI
- `frontend/` - (Planned) Future React application
- `project_structure.md` - Guide to the repository layout and planned changes
- `requirements.txt` - Python dependencies
- `.env` - local runtime configuration
- `Dockerfile` - Containerization instructions
- `start.sh` - Startup script for the container
- `AI_INSTRUCTIONS.md` - AI Build Instructions

## Local setup

1. Create and activate a Python virtual environment.
2. Install dependencies: `pip install -r requirements.txt`.
3. Set environment variables in `.env`.

### Run the App

Start both the backend and frontend by running the startup script, or run them manually:

```bash
# Terminal 1: Backend
uvicorn api.main:app --reload --port 8000

# Terminal 2: Frontend
cd website
python -m flask --app app run --port 5000
```

Open `http://localhost:5000` for the UI.

## Notes
- The website expects the FastAPI service to expose `GET /health` and `POST /query`.
- A local stub implementation lives in `api/main.py` for development.
- Refer to `project_structure.md` for information on upcoming architectural changes to React and the Database layer.
