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

# Install frontend dependencies
RUN cd frontend && npm install

# Make the start script executable
RUN chmod +x start.sh

# Expose API and React ports
EXPOSE 8000
EXPOSE 5173

# Start both FastAPI and Vite
ENTRYPOINT ["./start.sh"]
