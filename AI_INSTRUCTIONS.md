# RAG Assistant — AI Build Instructions
> Feed this file to AI at the start of every session. It tells the AI exactly what to build, in what order, with what stack.

---

## Project Summary

Build a **production-grade, locally-hosted RAG chatbot** for NLP/AI developers. It ingests technical documentation (LangChain, HuggingFace), stores embeddings in Qdrant Cloud, and answers developer questions using Llama 3 running locally via Ollama. The system is deployed on Azure Container Instances as a single Docker container. A simple chat UI is served directly from FastAPI.

**Privacy-first**: no OpenAI, no external LLM APIs. Everything runs locally except Qdrant Cloud.

---

## Tech Stack (non-negotiable, do not substitute)

| Layer | Tool |
|---|---|
| Language | Python 3.12 |
| Embedding model | `intfloat/multilingual-e5-base` (HuggingFace) |
| Vector database | Qdrant Cloud (via `qdrant-client`) |
| Relational DB | Placeholder (e.g., PostgreSQL for users/login - to be implemented later) |
| LLM | `llama3:8b-instruct-q4_K_M` via Ollama |
| RAG orchestration | LangChain |
| API | FastAPI |
| Frontend | React (Vite) with Tailwind CSS |
| Experiment tracking | MLflow (local tracking server) |
| Evaluation | RAGAS |
| Containerization | Docker (single image) |
| Deployment | Azure Container Instances (ACI) via Azure Container Registry (ACR) |

---

## Environment Variables

The AI must use these exact variable names everywhere. Never hardcode values.

```env
QDRANT_URL=https://your-cluster.cloud.qdrant.io
QDRANT_API_KEY=your_api_key_here
QDRANT_COLLECTION_NAME=rag_docs
EMBEDDING_MODEL=intfloat/multilingual-e5-base
OLLAMA_BASE_URL=http://localhost:11434
LLM_MODEL=llama3:8b-instruct-q4_K_M
MLFLOW_TRACKING_URI=./mlflow_runs
```

---

## Project File Structure

The AI must produce exactly this structure. Do not add extra files unless asked.

```
rag-assistant/
│
├── data/
│   └── docs/                   # raw .md files go here (LangChain + HuggingFace docs)
│
├── src/
│   ├── ingest.py               # Script 1: chunk + embed + upload to Qdrant
│   ├── retriever.py            # Script 2: Qdrant retriever wrapper
│   ├── chain.py                # Script 3: LangChain RAG chain (retriever + Ollama LLM)
│   ├── monitor.py              # Script 4: MLflow logging wrapper
│   └── evaluate.py             # Script 5: RAGAS evaluation script
│
├── api/
│   └── main.py                 # FastAPI app (API Backend)
│
├── frontend/                   # React app built with Vite + Tailwind CSS
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       └── index.css
│
├── .env                        # env vars (never commit this)
├── requirements.txt
├── Dockerfile
├── .dockerignore
└── README.md
```

---

## Script 1 — `src/ingest.py`

**Purpose:** Load all `.md` files from `data/docs/`, chunk them intelligently, embed using `multilingual-e5-base`, and upload to Qdrant.

**Requirements:**
- Use `RecursiveCharacterTextSplitter` with `chunk_size=512`, `chunk_overlap=64`
- Treat fenced code blocks (` ``` `) as atomic chunks — never split mid-code-block
- Add metadata to every chunk: `{"source": filename, "chunk_id": int}`
- Use `intfloat/multilingual-e5-base` from HuggingFace — prefix every passage with `"passage: "` before embedding (required by the model)
- Qdrant collection: use `QDRANT_COLLECTION_NAME` from env, vector size = 768, distance = Cosine
- If the collection already exists, skip recreation — just upsert
- Print progress: how many files loaded, how many chunks created, upload confirmation

---

## Script 2 — `src/retriever.py`

**Purpose:** Qdrant retriever that the RAG chain uses.

**Requirements:**
- Class `QdrantRetriever` with method `retrieve(query: str, top_k: int = 5) -> list[dict]`
- Prefix queries with `"query: "` before embedding (required by multilingual-e5-base)
- Return list of dicts: `{"text": str, "source": str, "score": float}`
- Handle connection errors gracefully — raise a clear custom exception `QdrantConnectionError`

---

## Script 3 — `src/chain.py`

**Purpose:** LangChain RAG chain that combines retriever + Ollama LLM.

**Requirements:**
- Use `ChatOllama` with model from env `LLM_MODEL`
- System prompt must be: *"You are a technical assistant for NLP and AI developers. Answer only based on the provided context. If the context does not contain enough information, say so clearly. Do not hallucinate."*
- Chain: `question → retriever → format context + question → LLM → answer`
- Return dict: `{"answer": str, "sources": list[str], "latency_ms": float}`
- Latency must be measured from chain invoke start to answer return

---

## Script 4 — `src/monitor.py`

**Purpose:** MLflow logging wrapper around the chain.

**Requirements:**
- Function `log_query(question, answer, sources, latency_ms, num_chunks_retrieved)`
- Each call = one MLflow run under experiment name `"rag_assistant"`
- Log as metrics: `latency_ms`, `num_chunks_retrieved`
- Log as params: `question` (truncated to 250 chars), `llm_model`, `embedding_model`
- Log as tags: `answer_length`, `source_count`
- Never let MLflow failures crash the main app — wrap in try/except, just print warning

---

## Script 5 — `src/evaluate.py`

**Purpose:** RAGAS evaluation on 10 sample questions.

**Requirements:**
- Hardcode 10 questions about LangChain/HuggingFace (e.g., "How do I create a custom LangChain tool?", "What is a HuggingFace pipeline?")
- Run each through the chain, collect: question, answer, retrieved contexts
- Evaluate with RAGAS metrics: `context_precision`, `answer_relevancy`, `faithfulness`
- Print a summary table and save results to `evaluation_results.json`

---

## FastAPI App — `api/main.py`

**Requirements:**
- `POST /query` → takes `{"question": str}`, returns `{"answer": str, "sources": list[str], "latency_ms": float}`
- `GET /health` → returns `{"status": "ok", "qdrant": bool, "ollama": bool}` (ping both services)
- Use `python-dotenv` to load `.env` at startup
- CORS enabled for all origins (needed for local dev)
- On startup, initialize the retriever and chain once (not per request)
- Include basic request logging (question + latency) using Python `logging`

---

## Frontend — `frontend/`

**Purpose:** Simple chat interface for the RAG assistant.

**Design requirements:**
- Built using React (Vite) and Tailwind CSS.
- Dark theme styling using Tailwind utility classes.
- Font: `JetBrains Mono` for code/terminal feel (load from Google Fonts)
- Layout: centered chat window, max-width 780px, full height
- Chat bubbles: user messages right-aligned, assistant messages left-aligned
- Each assistant message shows collapsible "Sources" section below the answer
- Input bar pinned to bottom with send button
- Typing indicator (3 animated dots) while waiting for response
- Calls `POST /query` — handle errors gracefully with an inline error message
- Responsive — must look good on mobile too

---

## Dockerfile

**Requirements:**
- Base image: `python:3.12-slim`
- Install Ollama inside the container (use the official install script)
- Pull the model at build time: `ollama pull llama3:8b-instruct-q4_K_M`
- Copy all project files
- Install Python requirements
- Expose port `8000`
- Entrypoint: start Ollama daemon first, then start FastAPI with `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- Use a shell script `start.sh` as entrypoint to handle the two-process startup

---

## `requirements.txt`

```
fastapi==0.111.0
uvicorn==0.29.0
python-dotenv==1.0.1
langchain==0.2.5
langchain-community==0.2.5
langchain-ollama==0.1.1
qdrant-client==1.9.1
sentence-transformers==3.0.1
transformers==4.41.2
torch==2.3.0
mlflow==2.13.2
ragas==0.1.9
python-multipart==0.0.9
```

---

## Azure Deployment (run these commands after Docker build)

```bash
# 1. Login
az login
az acr login --name <YOUR_ACR_NAME>

# 2. Build and push image
az acr build --registry <YOUR_ACR_NAME> --image rag-assistant:v1 .

# 3. Deploy to Azure Container Instances
az container create \
  --resource-group <YOUR_RG> \
  --name rag-assistant \
  --image <YOUR_ACR_NAME>.azurecr.io/rag-assistant:v1 \
  --ports 8000 \
  --cpu 4 \
  --memory 8 \
  --environment-variables \
    QDRANT_URL=<YOUR_QDRANT_URL> \
    QDRANT_API_KEY=<YOUR_QDRANT_KEY> \
    QDRANT_COLLECTION_NAME=rag_docs \
    EMBEDDING_MODEL=intfloat/multilingual-e5-base \
    OLLAMA_BASE_URL=http://localhost:11434 \
    LLM_MODEL=llama3:8b-instruct-q4_K_M \
    MLFLOW_TRACKING_URI=./mlflow_runs \
  --restart-policy OnFailure

# 4. Get public IP
az container show --resource-group <YOUR_RG> --name rag-assistant --query ipAddress.ip
```

---

## Session Instructions for AI

When you start a new session with AI, paste this at the top:

> "Here are the full build instructions for my RAG project: [paste this file]. Tonight we are building [SCRIPT NAME]. Build only that script. Follow the requirements exactly. Use the exact library versions in requirements.txt. Do not add features not listed. After you write the code, explain any part I might need to configure."

**Recommended build order for tonight:**
1. `src/ingest.py` → run it to populate Qdrant first
2. `src/retriever.py`
3. `src/chain.py`
4. `api/main.py` + `frontend/` (React App)
5. `src/monitor.py`
6. `Dockerfile` + deploy
7. `src/evaluate.py` (last, only for demo screenshots)
