"""
SQLAlchemy ORM Data Models for MindHaven Mental Wellness Journal.
"""

from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from datetime import datetime, timezone
from .database import Base


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), default="Daily Reflection")
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Self-reported mood rating (1 - 10)
    user_mood_rating = Column(Integer, default=7)

    # NLP Derived Metrics
    dominant_emotion = Column(String(50), index=True)
    wellness_score = Column(Integer, default=50) # 0 to 100
    sentiment_polarity = Column(Float, default=0.0) # -1.0 to 1.0

    # JSON-encoded fields for rich NLP output
    emotion_scores_json = Column(Text, default="{}")
    triggers_json = Column(Text, default="[]")
    highlights_json = Column(Text, default="[]")
    tags_json = Column(Text, default="[]")
