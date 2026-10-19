"""
MindHaven FastAPI Application Entry Point.
NLP-Powered Mental Wellness & Sentiment Journal API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base
from .api.journal import router as journal_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database tables
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="MindHaven NLP Mental Wellness API",
    description="Empathetic, multi-class emotion analysis, stress trigger detection, and AI coping strategies for daily journaling.",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for frontend applications
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(journal_router)


@app.get("/")
def root():
    return {
        "app": "MindHaven NLP Mental Wellness API",
        "status": "healthy",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
