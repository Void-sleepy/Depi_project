FROM python:3.12-slim

# Install Node.js and npm
RUN apt-get update && apt-get install -y nodejs npm

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# Install frontend dependencies and build
RUN cd frontend && npm install && npm run build

# Expose API port
EXPOSE 8000

# Start FastAPI which now serves the built frontend
ENTRYPOINT ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
