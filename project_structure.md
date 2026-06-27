# Project Architecture and File Structure Overview

> **Note to LLMs and Agents:** Read this file to understand the current state of the repository, the planned future state, and where to put new code. Do not randomly add files without consulting this guide.

## Current Architecture (As of Today)

The project currently uses a split backend/frontend structure:
1. **Frontend (`website/`)**: A Flask application serving raw HTML/CSS templates. It uses Alpine.js for interactivity.
2. **Backend API (`api/`)**: A FastAPI application that will handle the RAG intelligence (retrieval, embeddings, LLM generation).

Both are containerized together using `Dockerfile` and orchestrated via `start.sh`.

## Planned Future Architecture (Tomorrow / Soon)

We are planning to transition the stack:
- **Frontend**: Moving away from Flask + Alpine.js to **React (Vite) + Tailwind CSS** for better performance, developer experience, and modern UI capabilities.
- **Database**: We plan to introduce a relational database (like **PostgreSQL** or **SQLite**) to handle user authentication, login, and saving chat histories.
- **Vector Database**: **Qdrant Cloud** will remain the primary database for vector embeddings.
- **LLM**: We will integrate an LLM via LangChain (to be determined, currently avoiding Ollama by default until a choice is finalized).

## Directory Guide

Here is what each folder does, and what it *will* do:

```text
rag-assistant/
│
├── api/                        # Backend API (FastAPI)
│   └── main.py                 # Exposes /query and /health endpoints. Will connect to src/ later.
│
├── website/                    # CURRENT Frontend (Flask) - DEPRECATED SOON
│   ├── app.py                  # Flask routes
│   ├── static/                 # CSS/JS files
│   └── templates/              # HTML files
│
├── frontend/                   # FUTURE Frontend (React + Tailwind)
│   └── (To be scaffolded)      # Will replace the website/ directory.
│
├── src/                        # FUTURE ML/RAG Logic
│   ├── ingest.py               # Will handle chunking and Qdrant uploads
│   ├── retriever.py            # Will wrap the Qdrant client
│   └── chain.py                # Will run the LangChain logic
│
├── data/                       # FUTURE Documentation Storage
│   └── docs/                   # Where raw .md files to be embedded are stored
│
├── .env                        # Local environment variables
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Builds the image for the app
└── start.sh                    # Starts both the backend and frontend
```

### Action Items for Next Session
1. Delete the old `website/` directory and `WEBSITE_INSTRUCTIONS.md`.
2. Run `npx create-vite` to scaffold the `frontend/` directory.
3. Setup Tailwind CSS.
4. Update `start.sh` to run the React dev server instead of Flask.
5. Create the database connection for user login.
