# Customer Support RAG-Powered Intelligent Chatbot

This repository contains the backend and frontend shells for a Retrieval-Augmented Generation (RAG) assistant UI. The project provides an intelligent chatbot interface for customer support, leveraging vector embeddings and Large Language Models (LLMs).

## Architecture & Technology Stack

The project uses a modern, split architecture:

- **Frontend**: A React 19 application built with Vite, styled using Tailwind CSS v4. It handles the chat UI and renders rich markdown responses.
- **Backend (API Gateway)**: An Express.js (Node.js) server (`server.js`) that serves as an API Gateway. It proxies requests to AI models and handles health checks.
- **ML & RAG Module**: A Python module (`module/`) utilizing LangChain, Qdrant (Vector Database), HuggingFace Embeddings, and Ollama (or remote models like Lightning AI) for processing documents and generating answers.

For a detailed breakdown of the system flow, refer to [System Architecture](system_architecture.md).

## Project Structure

- `server.js` - Express backend server and API Gateway.
- `frontend/` - React frontend application (Vite + Tailwind CSS).
- `module/` - Python ML/RAG logic (LangChain, Qdrant integration).
- `system_architecture.md` - Detailed system flow and infrastructure guide.
- `project_structure.md` - Guide to the repository layout and planned changes.
- `package.json` - Node.js dependencies and scripts.
- `.env` - Local runtime configuration.

*(Note: The `website/` directory is a legacy Flask application pending deletion.)*

## Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+) and npm
- [Python 3.9+](https://www.python.org/)
- [Git](https://git-scm.com/)

### 1. Environment Configuration
Clone the repository and set up your `.env` file (configure your `ai_model` endpoint if using a remote AI proxy).

### 2. Running the Backend (Express API)
The Express server acts as a proxy for the remote/local AI models and serves the frontend build in production.
```bash
# Install dependencies
npm install

# Start the Express server (runs on http://localhost:8000)
npm start
```

### 3. Running the Frontend (React Development Server)
To run the frontend with hot-module reloading:
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser for the UI. The frontend expects the backend API to be running on `http://localhost:8000`.

### 4. Production Build
To build the frontend and serve it entirely via the Express backend:
```bash
# In the root directory, run:
npm run build

# Start the server:
npm start
```
The application will be accessible at `http://localhost:8000`.

## Documentation
- **[System Architecture](system_architecture.md)**: Diagrams and detailed flow of the RAG system.
- **[Project Structure](project_structure.md)**: Overview of the codebase and planned future updates.
