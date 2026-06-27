from time import perf_counter

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


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
    latency_ms = int((perf_counter() - start) * 1000)

    return {
        "answer": (
            "The RAG pipeline is not connected yet. "
            f"Your question was received: **{question}**"
        ),
        "sources": [],
        "latency_ms": latency_ms,
    }
