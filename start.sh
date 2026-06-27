#!/bin/bash

# Start FastAPI backend in the background
echo "Starting FastAPI backend on port 8000..."
uvicorn api.main:app --host 0.0.0.0 --port 8000 &

# Start Vite frontend in the foreground
echo "Starting React frontend on port 5173..."
cd frontend
npm run dev -- --host 0.0.0.0 --port 5173
