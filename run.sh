#!/bin/bash
# MindHaven Development Server Runner

echo "🌿 Starting MindHaven NLP Mental Wellness Platform..."

# Activate virtual environment
if [ -d ".venv" ]; then
    source .venv/bin/activate
fi

# Function to stop background processes on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $(jobs -p) 2>/dev/null
    exit
}
trap cleanup SIGINT SIGTERM

echo "Starting FastAPI Backend on http://localhost:8001..."
uvicorn backend.app.main:app --host 0.0.0.0 --port 8001 --reload &

echo "Starting React Frontend on http://localhost:5173..."
cd frontend && npm run dev &

wait
