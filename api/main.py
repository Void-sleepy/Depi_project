import os
import requests
from dotenv import load_dotenv
from time import perf_counter

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

# Load environment variables from the root .env file
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="RAG Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Since it's served from same origin, or just keeping it broad for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/query")
def query(payload: QueryRequest) -> dict[str, object]:
    start = perf_counter()
    question = payload.question.strip()
    
    ai_model_url = os.getenv("ai_model")
    if not ai_model_url:
        answer = "Error: 'ai_model' URL not configured in .env"
    else:
        ai_model_query_url = ai_model_url.rstrip("/") + "/query"
        try:
            response = requests.post(ai_model_query_url, json={"question": question}, timeout=300)
            if response.status_code == 200:
                data = response.json()
                # Assuming the response has an 'answer' field or fallback to returning the whole dict as string
                answer = data.get("answer", str(data))
            else:
                answer = f"Remote API Error (Status {response.status_code}): {response.text}"
        except Exception as e:
            answer = f"Failed to connect to remote AI model"
            
    latency_ms = int((perf_counter() - start) * 1000)

    return {
        "answer": answer,
        "sources": [],
        "latency_ms": latency_ms,
    }

# Serve Frontend
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "dist")

if os.path.exists(os.path.join(frontend_dist, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

@app.get("/{catchall:path}")
def serve_frontend(catchall: str):
    file_path = os.path.join(frontend_dist, catchall)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    
    index_path = os.path.join(frontend_dist, "index.html")
    if os.path.isfile(index_path):
        return FileResponse(index_path)
        
    return {"error": "Frontend not built yet. Run 'npm run build' in the frontend directory."}
