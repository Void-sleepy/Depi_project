# Project Architecture and File Structure Overview

> **Note to LLMs and Agents:** Read this file to understand the current state of the repository, the planned future state, and where to put new code. Do not randomly add files without consulting this guide.

## Current Architecture (As of Today)

The project currently uses a split backend/frontend structure:
1. **Frontend (`frontend/`)**: A modern React application created with Vite, styled using Tailwind CSS v4. It contains the Landing page and Chat UI.
2. **Backend API (`api/`)**: A FastAPI application that currently mocks the endpoints and will eventually handle the RAG intelligence (retrieval, embeddings, LLM generation).
3. **Legacy Frontend (`website/`)**: The old Flask/Alpine.js website folder. **DO NOT MODIFY**. This is slated for deletion once the React app is fully verified.

## Planned Future Architecture

We are planning to transition the backend stack:
- **Database**: We plan to introduce a relational database (like **PostgreSQL** or **SQLite**) to handle user authentication, login, and saving chat histories.
- **Vector Database**: **Qdrant Cloud** will remain the primary database for vector embeddings.
- **LLM**: We will integrate an LLM via LangChain (to be determined, currently avoiding Ollama by default until a choice is finalized).

## Directory Guide

Here is what each folder does:

```text
rag-assistant/
│
├── api/                        # Backend API (FastAPI)
│   └── main.py                 # Exposes /query and /health endpoints. Will connect to src/ later.
│
├── frontend/                   # CURRENT Frontend (React + Vite + Tailwind CSS)
│   ├── src/                    # React Components and Pages
│   ├── package.json            # NPM dependencies
│   └── vite.config.js          # Vite configuration
│
├── website/                    # LEGACY Frontend (Flask) - PENDING DELETION
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
2. Update `start.sh` to run the React dev server (`npm run dev` in `frontend/`) instead of Flask.
3. Create the database connection for user login.
