FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# Make the start script executable
RUN chmod +x start.sh

# Expose API and Website ports
EXPOSE 8000
EXPOSE 5000

# Start both FastAPI and Flask
ENTRYPOINT ["./start.sh"]
