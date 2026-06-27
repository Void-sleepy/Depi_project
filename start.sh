#!/bin/bash

# Start FastAPI backend in the background
echo "Starting FastAPI backend on port 8000..."
uvicorn api.main:app --host 0.0.0.0 --port 8000 &

# Start Flask frontend in the foreground
echo "Starting Flask frontend on port 5000..."
cd website
python -m flask --app app run --host 0.0.0.0 --port 5000
