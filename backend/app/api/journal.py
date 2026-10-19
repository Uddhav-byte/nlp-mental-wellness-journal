"""
MindHaven Journal & Analytics API Routes.
Provides full CRUD, real-time live emotion inference, CBT thought reframing,
and aggregated visual analytics for weekly trends, radar charts, and heatmaps.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from datetime import datetime, timedelta, timezone

from ..database import get_db
from ..models import JournalEntry
from ..schemas import (
    LiveAnalysisRequest,
    AnalysisResult,
    JournalEntryCreate,
    JournalEntryResponse,
    AnalyticsOverview,
    WeeklyMoodPoint,
    EmotionRadarPoint,
    TriggerInsight,
    HeatmapDay,
    ReframeRequest,
    ReframeResponse,
)
from ..nlp.emotion_analyzer import EmotionAnalyzer
from ..nlp.trigger_extractor import TriggerExtractor
from ..nlp.coping_engine import CopingEngine

router = APIRouter(prefix="/api", tags=["journal"])

# Shared NLP service instances
emotion_analyzer = EmotionAnalyzer()
trigger_extractor = TriggerExtractor()
coping_engine = CopingEngine()


def _format_entry_response(entry: JournalEntry) -> JournalEntryResponse:
    """Helper to convert ORM model with JSON fields into Pydantic schema."""
    emotion_scores = json.loads(entry.emotion_scores_json or "{}")
    triggers = json.loads(entry.triggers_json or "[]")
    highlights = json.loads(entry.highlights_json or "[]")
    tags = json.loads(entry.tags_json or "[]")

    coping_strategies = coping_engine.get_strategies(
        dominant_emotion=entry.dominant_emotion or "calm",
        triggers=triggers,
        wellness_score=entry.wellness_score or 50,
    )

    return JournalEntryResponse(
        id=entry.id,
        title=entry.title,
        content=entry.content,
        created_at=entry.created_at,
        user_mood_rating=entry.user_mood_rating or 7,
        dominant_emotion=entry.dominant_emotion or "calm",
        wellness_score=entry.wellness_score or 50,
        sentiment_polarity=entry.sentiment_polarity or 0.0,
        emotion_scores=emotion_scores,
        triggers=triggers,
        coping_strategies=coping_strategies,
        highlights=highlights,
        tags=tags,
    )


@router.post("/analyze-live", response_model=AnalysisResult)
def analyze_live(request: LiveAnalysisRequest):
    """
    Real-time inference endpoint for live draft typing.
    Returns emotions, triggers, and coping recommendations instantly.
    """
    analysis = emotion_analyzer.analyze(request.content)
    triggers = trigger_extractor.extract_triggers(request.content)
    strategies = coping_engine.get_strategies(
        dominant_emotion=analysis["dominant_emotion"],
        triggers=triggers,
        wellness_score=analysis["wellness_score"],
    )

    return AnalysisResult(
        dominant_emotion=analysis["dominant_emotion"],
        wellness_score=analysis["wellness_score"],
        sentiment_polarity=analysis["sentiment_polarity"],
        emotion_scores=analysis["emotion_scores"],
        triggers=triggers,
        coping_strategies=strategies,
        highlights=analysis["highlights"],
        engine=analysis["engine"],
    )


@router.post("/entries", response_model=JournalEntryResponse)
def create_entry(entry_in: JournalEntryCreate, db: Session = Depends(get_db)):
    """
    Saves a new daily journal entry, executes multi-class NLP pipeline,
    and returns full analysis with coping recommendations.
    """
    analysis = emotion_analyzer.analyze(entry_in.content)
    triggers = trigger_extractor.extract_triggers(entry_in.content)

    new_entry = JournalEntry(
        title=entry_in.title or "Daily Reflection",
        content=entry_in.content,
        user_mood_rating=entry_in.user_mood_rating,
        dominant_emotion=analysis["dominant_emotion"],
        wellness_score=analysis["wellness_score"],
        sentiment_polarity=analysis["sentiment_polarity"],
        emotion_scores_json=json.dumps(analysis["emotion_scores"]),
        triggers_json=json.dumps(triggers),
        highlights_json=json.dumps(analysis["highlights"]),
        tags_json=json.dumps(entry_in.tags or []),
        created_at=datetime.now(timezone.utc),
    )

    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    return _format_entry_response(new_entry)


@router.get("/entries", response_model=List[JournalEntryResponse])
def get_entries(
    emotion: Optional[str] = Query(None, description="Filter by dominant emotion"),
    search: Optional[str] = Query(None, description="Search query in content or title"),
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    """
    Retrieves stored journal entries with optional search and emotion filtering.
    """
    query = db.query(JournalEntry).order_by(JournalEntry.created_at.desc())

    if emotion:
        query = query.filter(JournalEntry.dominant_emotion == emotion.lower())

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (JournalEntry.content.ilike(search_filter))
            | (JournalEntry.title.ilike(search_filter))
        )

    entries = query.offset(offset).limit(limit).all()
    return [_format_entry_response(e) for e in entries]


@router.get("/entries/{entry_id}", response_model=JournalEntryResponse)
def get_entry(entry_id: int, db: Session = Depends(get_db)):
    """Retrieves a single journal entry by ID."""
    entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    return _format_entry_response(entry)


@router.delete("/entries/{entry_id}")
def delete_entry(entry_id: int, db: Session = Depends(get_db)):
    """Deletes a journal entry."""
    entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    db.delete(entry)
    db.commit()
    return {"status": "success", "message": f"Entry {entry_id} deleted"}


@router.get("/analytics/overview", response_model=AnalyticsOverview)
def get_analytics_overview(db: Session = Depends(get_db)):
    """
    Provides aggregated analytics for interactive UI widgets:
    - Weekly mood trend wave
    - Emotion radar chart
    - Stress trigger semantic insights
    - 30-day calendar heatmap
    """
    entries = db.query(JournalEntry).order_by(JournalEntry.created_at.asc()).all()

    # If DB is empty, auto-seed with sample entries so the user immediately experiences the UI
    if not entries:
        _seed_demo_entries(db)
        entries = db.query(JournalEntry).order_by(JournalEntry.created_at.asc()).all()

    total_entries = len(entries)
    avg_wellness = (
        int(sum(e.wellness_score for e in entries) / total_entries)
        if total_entries > 0
        else 70
    )

    # Calculate current streak (days with entries up to today)
    dates_with_entries = {e.created_at.strftime("%Y-%m-%d") for e in entries}
    streak = 0
    today = datetime.now(timezone.utc).date()
    curr = today
    while curr.strftime("%Y-%m-%d") in dates_with_entries:
        streak += 1
        curr -= timedelta(days=1)

    # Dominant overall emotion
    emotion_counts: dict[str, int] = {}
    for e in entries:
        emotion_counts[e.dominant_emotion] = (
            emotion_counts.get(e.dominant_emotion, 0) + 1
        )
    overall_dominant = (
        max(emotion_counts.items(), key=lambda x: x[1])[0]
        if emotion_counts
        else "calm"
    )

    # 1. Weekly Trend (Past 7 days)
    weekly_trend = []
    days_map = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    for i in range(6, -1, -1):
        target_date = today - timedelta(days=i)
        date_str = target_date.strftime("%Y-%m-%d")
        day_name = days_map[target_date.weekday()]

        day_entries = [
            e for e in entries if e.created_at.strftime("%Y-%m-%d") == date_str
        ]
        if day_entries:
            w_score = int(sum(e.wellness_score for e in day_entries) / len(day_entries))
            m_rating = int(
                sum(e.user_mood_rating or 7 for e in day_entries) / len(day_entries)
            )
            d_em = day_entries[-1].dominant_emotion
            count = len(day_entries)
        else:
            w_score = 65  # gentle baseline
            m_rating = 7
            d_em = "calm"
            count = 0

        weekly_trend.append(
            WeeklyMoodPoint(
                day=day_name,
                date=date_str,
                wellness_score=w_score,
                user_mood_rating=m_rating,
                dominant_emotion=d_em,
                entry_count=count,
            )
        )

    # 2. Emotion Radar Chart (Joy, Calm, Anxiety, Frustration, Sadness, Gratitude, Fatigue)
    emotions_list = [
        "joy",
        "calm",
        "anxiety",
        "frustration",
        "sadness",
        "gratitude",
        "fatigue",
    ]
    emotion_radar = []
    total_samples = 0
    accumulated_scores = {em: 0.0 for em in emotions_list}

    for e in entries:
        scores = json.loads(e.emotion_scores_json or "{}")
        for em in emotions_list:
            accumulated_scores[em] += scores.get(em, 0.1)
        total_samples += 1

    total_sum = sum(accumulated_scores.values()) or 1.0
    for em in emotions_list:
        pct = round((accumulated_scores[em] / total_sum) * 100, 1)
        emotion_radar.append(
            EmotionRadarPoint(
                emotion=em.capitalize(), score=int(pct), percentage=pct
            )
        )

    # 3. Stress Trigger Insights
    trigger_counter: dict[str, dict] = {}
    for e in entries:
        triggers = json.loads(e.triggers_json or "[]")
        for t in triggers:
            name = t["trigger"]
            if name not in trigger_counter:
                trigger_counter[name] = {
                    "trigger": name,
                    "category": t.get("category", "General"),
                    "domain": t.get("domain", "work"),
                    "frequency": 0,
                    "severity": t.get("severity", "medium"),
                }
            trigger_counter[name]["frequency"] += t.get("occurrences", 1)

    top_triggers = sorted(
        trigger_counter.values(), key=lambda x: x["frequency"], reverse=True
    )[:8]

    # 4. Heatmap Data (Last 30 days)
    heatmap = []
    for i in range(29, -1, -1):
        target_date = today - timedelta(days=i)
        date_str = target_date.strftime("%Y-%m-%d")
        day_entries = [
            e for e in entries if e.created_at.strftime("%Y-%m-%d") == date_str
        ]
        if day_entries:
            w_score = int(sum(e.wellness_score for e in day_entries) / len(day_entries))
            d_em = day_entries[-1].dominant_emotion
            count = len(day_entries)
        else:
            w_score = 0
            d_em = "none"
            count = 0

        heatmap.append(
            HeatmapDay(
                date=date_str,
                wellness_score=w_score,
                dominant_emotion=d_em,
                count=count,
            )
        )

    return AnalyticsOverview(
        total_entries=total_entries,
        current_streak=streak,
        average_wellness=avg_wellness,
        dominant_overall_emotion=overall_dominant,
        weekly_trend=weekly_trend,
        emotion_radar=emotion_radar,
        top_triggers=[TriggerInsight(**t) for t in top_triggers],
        heatmap=heatmap,
    )


@router.post("/coping/reframe", response_model=ReframeResponse)
def reframe_thought(req: ReframeRequest):
    """
    CBT Cognitive Thought Reframing Endpoint.
    Analyzes negative/anxious thought patterns and returns reframing perspectives.
    """
    reframed = coping_engine.reframe_thought(
        negative_thought=req.negative_thought,
        emotion=req.emotion or "anxiety",
    )
    return ReframeResponse(**reframed)


def _seed_demo_entries(db: Session):
    """Initializes rich demonstration journal entries spanning the last week."""
    sample_data = [
        {
            "days_ago": 6,
            "title": "Starting the week with clear intentions",
            "content": "Woke up early and had a warm cup of matcha. Felt peaceful and centered as I planned out my weekly priorities. Ready for the challenges ahead.",
            "user_mood_rating": 8,
        },
        {
            "days_ago": 5,
            "title": "Work deadlines creeping in",
            "content": "Feeling anxious about the upcoming project deadline on Friday. My manager scheduled an extra sprint meeting, and the workload feels a bit overwhelming. Need to pace myself.",
            "user_mood_rating": 5,
        },
        {
            "days_ago": 4,
            "title": "Frustrating communication block",
            "content": "Had an argument with a colleague regarding design decisions. It was frustrating and annoying because I felt unheard. Took a quick walk to cool down.",
            "user_mood_rating": 4,
        },
        {
            "days_ago": 3,
            "title": "Grounding in the evening",
            "content": "Tired and sleepy after a long day of coding. Did 10 minutes of breathing and listened to rain sounds. It helped quiet my restless mind.",
            "user_mood_rating": 6,
        },
        {
            "days_ago": 2,
            "title": "Breakthrough and genuine gratitude",
            "content": "Solved the bug that was keeping me up! So grateful for my supportive team member who reviewed my pull request. Feeling happy, relieved, and accomplished.",
            "user_mood_rating": 9,
        },
        {
            "days_ago": 1,
            "title": "Quiet evening reflection",
            "content": "Spent the evening reading by the window. Feeling calm and relaxed. Appreciating the little quiet moments after a hectic week.",
            "user_mood_rating": 8,
        },
        {
            "days_ago": 0,
            "title": "Present and hopeful today",
            "content": "Enjoying the fresh breeze this morning. Drinking green tea and feeling centered, optimistic, and thankful for where I am right now.",
            "user_mood_rating": 8,
        },
    ]

    for item in sample_data:
        analysis = emotion_analyzer.analyze(item["content"])
        triggers = trigger_extractor.extract_triggers(item["content"])
        entry_time = datetime.now(timezone.utc) - timedelta(days=item["days_ago"])

        entry = JournalEntry(
            title=item["title"],
            content=item["content"],
            user_mood_rating=item["user_mood_rating"],
            dominant_emotion=analysis["dominant_emotion"],
            wellness_score=analysis["wellness_score"],
            sentiment_polarity=analysis["sentiment_polarity"],
            emotion_scores_json=json.dumps(analysis["emotion_scores"]),
            triggers_json=json.dumps(triggers),
            highlights_json=json.dumps(analysis["highlights"]),
            tags_json=json.dumps(["reflection", analysis["dominant_emotion"]]),
            created_at=entry_time,
        )
        db.add(entry)

    db.commit()
