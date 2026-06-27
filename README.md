# Customer Support RAG-Powered Intelligent Chatbot

This repository contains the website shell for a RAG assistant UI. The Flask app serves the frontend, and the FastAPI service handles all query intelligence separately.

## Layout

- `website/app.py` - Flask entrypoint (`/` landing, `/chat` chat UI)
- `website/templates/landing.html` - landing page
- `website/templates/chat.html` - chat page template
- `website/static/css/tokens.css` - design tokens
- `website/static/css/landing.css` - landing page styles
- `website/static/css/chat.css` - chat UI styles
- `website/static/js/landing.js` - landing scroll animations
- `website/static/js/chat.js` - Alpine chat state and API calls
- `api/main.py` - local FastAPI stub for `/health` and `/query`
- `requirements.txt` - shared Python dependencies
- `.env` - local runtime configuration

## Local setup

1. Create and activate the shared virtual environment.
2. Install dependencies with `pip install -r requirements.txt`.
3. Set `FASTAPI_URL=http://localhost:8000` in `.env` if needed.

## Run the apps

Start the FastAPI service first, then start the website.

In VS Code, you can also run the `start all` task from the Tasks menu.

```bash
uvicorn api.main:app --reload --port 8000
python website/app.py
```

Open `http://localhost:5000` for the landing page, or `http://localhost:5000/chat` for the chat UI.

## Notes

- The website expects the FastAPI service to expose `GET /health` and `POST /query`.
- A local stub implementation lives in `api/main.py` for development.
- The UI stores chat sessions in browser localStorage (`devdocs_sessions`).
