import os
import requests
from dotenv import load_dotenv
from time import perf_counter

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load environment variables from the root .env file
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="RAG Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://127.0.0.1:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/query")
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
            answer = f"rip"
            
    latency_ms = int((perf_counter() - start) * 1000)

    return {
        "answer": answer,
        "sources": [],
        "latency_ms": latency_ms,
    }
