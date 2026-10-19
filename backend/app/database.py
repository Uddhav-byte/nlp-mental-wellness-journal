"""
MindHaven SQLite Database Configuration and Session Management.
Ensures local, private data persistence with zero third-party leakage.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./mindhaven.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency yields an isolated database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
