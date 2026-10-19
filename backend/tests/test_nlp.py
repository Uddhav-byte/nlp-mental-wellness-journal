"""
Unit tests for MindHaven NLP modules:
- EmotionAnalyzer
- TriggerExtractor
- CopingEngine
"""

import pytest
from app.nlp.emotion_analyzer import EmotionAnalyzer
from app.nlp.trigger_extractor import TriggerExtractor
from app.nlp.coping_engine import CopingEngine


def test_emotion_analyzer_joy():
    analyzer = EmotionAnalyzer()
    text = "I am so happy and thrilled today! Accomplished all my goals and celebrated with friends."
    result = analyzer.analyze(text)

    assert result["dominant_emotion"] in ["joy", "gratitude"]
    assert result["wellness_score"] > 60
    assert result["sentiment_polarity"] > 0
    assert "joy" in result["emotion_scores"]
    assert len(result["highlights"]) > 0


def test_emotion_analyzer_anxiety():
    analyzer = EmotionAnalyzer()
    text = "Feeling extremely anxious and worried about tomorrow's presentation. Heart is racing and I'm stressed."
    result = analyzer.analyze(text)

    assert result["dominant_emotion"] in ["anxiety", "fatigue"]
    assert result["wellness_score"] < 60
    assert result["sentiment_polarity"] < 0.2


def test_emotion_analyzer_negation():
    analyzer = EmotionAnalyzer()
    text = "I am not happy with the current outcome, but trying my best."
    result = analyzer.analyze(text)

    # Should not classify as pure joy due to negation handling
    assert result["dominant_emotion"] != "joy"


def test_trigger_extractor():
    extractor = TriggerExtractor()
    text = "I have a tight project deadline tomorrow and an urgent client meeting. My manager added more tasks."
    triggers = extractor.extract_triggers(text)

    assert len(triggers) > 0
    trigger_names = [t["trigger"].lower() for t in triggers]
    assert any(t in ["deadline", "deadlines", "meeting", "meetings", "manager", "project"] for t in trigger_names)
    assert any(t["category"] == "Work & Career" for t in triggers)


def test_coping_engine_anxiety():
    engine = CopingEngine()
    strategies = engine.get_strategies(
        dominant_emotion="anxiety",
        triggers=[{"trigger": "Deadline", "category": "Work & Career"}],
        wellness_score=40,
    )

    assert len(strategies) >= 2
    types = [s["type"] for s in strategies]
    assert "breathing" in types or "grounding" in types


def test_cbt_reframe():
    engine = CopingEngine()
    thought = "I ruined everything and I am a total failure at work."
    res = engine.reframe_thought(thought, emotion="frustration")

    assert res["detected_distortion"] in ["Catastrophizing", "All-or-Nothing Thinking", "Subjective Over-identification"]
    assert len(res["constructive_reframes"]) > 0
    assert "affirmation" in res["action_affirmation"].lower() or len(res["action_affirmation"]) > 0
