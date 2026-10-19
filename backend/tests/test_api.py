"""
Integration tests for MindHaven FastAPI endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

# Ensure clean SQLite database for tests
Base.metadata.create_all(bind=engine)
client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_analyze_live():
    response = client.post(
        "/api/analyze-live",
        json={"content": "Woke up feeling peaceful and enjoying the quiet morning sun."},
    )
    assert response.status_code == 200
    data = response.json()
    assert "dominant_emotion" in data
    assert "wellness_score" in data
    assert "emotion_scores" in data
    assert "coping_strategies" in data


def test_create_and_get_entry():
    entry_payload = {
        "title": "A serene afternoon",
        "content": "Had a cup of green tea, went for a mindful walk, and finished reading my favorite book.",
        "user_mood_rating": 8,
        "tags": ["mindfulness", "nature"],
    }
    create_res = client.post("/api/entries", json=entry_payload)
    assert create_res.status_code == 200
    entry_data = create_res.json()
    assert entry_data["title"] == "A serene afternoon"
    assert entry_data["id"] is not None
    assert entry_data["wellness_score"] > 50

    # Retrieve entries
    list_res = client.get("/api/entries")
    assert list_res.status_code == 200
    entries = list_res.json()
    assert len(entries) >= 1


def test_analytics_overview():
    res = client.get("/api/analytics/overview")
    assert res.status_code == 200
    data = res.json()
    assert "weekly_trend" in data
    assert len(data["weekly_trend"]) == 7
    assert "emotion_radar" in data
    assert "heatmap" in data
    assert len(data["heatmap"]) == 30


def test_cbt_reframe_endpoint():
    res = client.post(
        "/api/coping/reframe",
        json={
            "negative_thought": "I should have worked harder on the deadline and now I'm a complete failure.",
            "emotion": "anxiety",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert "detected_distortion" in data
    assert "constructive_reframes" in data
    assert len(data["constructive_reframes"]) > 0
