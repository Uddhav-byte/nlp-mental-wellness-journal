"""
Pydantic schemas for MindHaven API requests and responses.
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
from datetime import datetime


class LiveAnalysisRequest(BaseModel):
    content: str = Field(..., description="Draft journal text to analyze")


class StressTriggerItem(BaseModel):
    trigger: str
    category: str
    domain: str
    severity: str
    occurrences: int
    snippet: str


class CopingStrategyItem(BaseModel):
    id: str
    title: str
    category: str
    type: str
    icon: str
    duration: str
    tag: str
    accent: str
    summary: str
    steps: List[str]


class AnalysisResult(BaseModel):
    dominant_emotion: str
    wellness_score: int
    sentiment_polarity: float
    emotion_scores: Dict[str, float]
    triggers: List[StressTriggerItem]
    coping_strategies: List[CopingStrategyItem]
    highlights: List[str]
    engine: str


class JournalEntryCreate(BaseModel):
    title: Optional[str] = "Daily Reflection"
    content: str = Field(..., min_length=1, description="Full journal entry body")
    user_mood_rating: Optional[int] = Field(default=7, ge=1, le=10)
    tags: Optional[List[str]] = Field(default_factory=list)


class JournalEntryResponse(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    user_mood_rating: int
    dominant_emotion: str
    wellness_score: int
    sentiment_polarity: float
    emotion_scores: Dict[str, float]
    triggers: List[StressTriggerItem]
    coping_strategies: List[CopingStrategyItem]
    highlights: List[str]
    tags: List[str]

    model_config = ConfigDict(from_attributes=True)


class WeeklyMoodPoint(BaseModel):
    day: str
    date: str
    wellness_score: int
    user_mood_rating: int
    dominant_emotion: str
    entry_count: int


class EmotionRadarPoint(BaseModel):
    emotion: str
    score: int
    percentage: float


class TriggerInsight(BaseModel):
    trigger: str
    category: str
    domain: str
    frequency: int
    severity: str


class HeatmapDay(BaseModel):
    date: str
    wellness_score: int
    dominant_emotion: str
    count: int


class AnalyticsOverview(BaseModel):
    total_entries: int
    current_streak: int
    average_wellness: int
    dominant_overall_emotion: str
    weekly_trend: List[WeeklyMoodPoint]
    emotion_radar: List[EmotionRadarPoint]
    top_triggers: List[TriggerInsight]
    heatmap: List[HeatmapDay]


class ReframeRequest(BaseModel):
    negative_thought: str
    emotion: Optional[str] = "anxiety"


class ReframeResponse(BaseModel):
    original_thought: str
    detected_distortion: str
    reframing_guidance: str
    constructive_reframes: List[str]
    action_affirmation: str
