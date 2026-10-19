"""
MindHaven Multi-Class Emotion and Sentiment Analysis Engine.
Combines Transformer-based neural inference (DistilBERT) with a high-precision,
low-latency calibrated emotion lexicon & negation-aware rule fallback.
"""

from typing import Dict, Any, List, Optional
import re
import math


class EmotionAnalyzer:
    """
    Multi-class emotion analyzer categorizing input text into:
    - Joy / Happiness
    - Calm / Contentment
    - Anxiety / Fear
    - Frustration / Anger
    - Sadness / Low Mood
    - Gratitude / Warmth
    - Fatigue / Burnout
    """

    EMOTIONS = ["joy", "calm", "anxiety", "frustration", "sadness", "gratitude", "fatigue"]

    # Valence weights for calculating wellness score (0 - 100)
    EMOTION_VALENCE = {
        "joy": 0.95,
        "calm": 0.85,
        "gratitude": 0.90,
        "anxiety": -0.70,
        "frustration": -0.80,
        "sadness": -0.85,
        "fatigue": -0.60,
    }

    # Curated lexicon with valence & emotion affinities
    LEXICON = {
        # Joy
        "happy": {"joy": 2.5, "calm": 0.5},
        "joy": {"joy": 3.0},
        "excited": {"joy": 2.8},
        "delighted": {"joy": 2.7},
        "wonderful": {"joy": 2.5},
        "amazing": {"joy": 2.6},
        "great": {"joy": 2.0, "calm": 0.5},
        "fantastic": {"joy": 2.8},
        "proud": {"joy": 2.4, "gratitude": 0.8},
        "accomplished": {"joy": 2.2, "calm": 1.0},
        "laugh": {"joy": 2.0},
        "smile": {"joy": 1.8, "calm": 0.8},
        "cheerful": {"joy": 2.2},
        "blessed": {"joy": 1.8, "gratitude": 2.8},
        "thrilled": {"joy": 2.9},

        # Calm
        "peaceful": {"calm": 2.8, "joy": 0.6},
        "calm": {"calm": 3.0},
        "relaxed": {"calm": 2.7},
        "serene": {"calm": 2.8},
        "tranquil": {"calm": 2.8},
        "quiet": {"calm": 1.5},
        "rested": {"calm": 2.0},
        "centered": {"calm": 2.4},
        "balanced": {"calm": 2.3, "joy": 0.5},
        "mindful": {"calm": 2.2},
        "breathe": {"calm": 1.8},
        "content": {"calm": 2.5, "joy": 1.0},
        "easygoing": {"calm": 1.8},

        # Anxiety
        "anxious": {"anxiety": 3.0},
        "nervous": {"anxiety": 2.6},
        "worried": {"anxiety": 2.7},
        "stress": {"anxiety": 2.4, "fatigue": 1.0},
        "stressed": {"anxiety": 2.5, "fatigue": 1.2},
        "panic": {"anxiety": 3.2},
        "panicking": {"anxiety": 3.2},
        "scared": {"anxiety": 2.5},
        "fear": {"anxiety": 2.6},
        "overwhelmed": {"anxiety": 2.8, "fatigue": 2.0},
        "restless": {"anxiety": 2.2},
        "dread": {"anxiety": 2.9, "sadness": 1.0},
        "jittery": {"anxiety": 2.2},
        "uneasy": {"anxiety": 2.0},
        "impending": {"anxiety": 1.8},
        "apprehensive": {"anxiety": 2.3},

        # Frustration
        "angry": {"frustration": 3.0},
        "frustrated": {"frustration": 3.0},
        "annoyed": {"frustration": 2.4},
        "irritated": {"frustration": 2.5},
        "mad": {"frustration": 2.8},
        "furious": {"frustration": 3.5},
        "resentful": {"frustration": 2.6, "sadness": 0.8},
        "hate": {"frustration": 2.8},
        "hated": {"frustration": 2.8},
        "disgusted": {"frustration": 2.5},
        "impatient": {"frustration": 2.0},
        "unfair": {"frustration": 2.2},
        "fed up": {"frustration": 2.8, "fatigue": 1.5},

        # Sadness
        "sad": {"sadness": 3.0},
        "depressed": {"sadness": 3.2, "fatigue": 1.2},
        "unhappy": {"sadness": 2.5},
        "crying": {"sadness": 2.8},
        "cried": {"sadness": 2.8},
        "lonely": {"sadness": 2.7, "anxiety": 0.8},
        "alone": {"sadness": 1.8},
        "heartbroken": {"sadness": 3.4},
        "hopeless": {"sadness": 3.2, "anxiety": 1.0},
        "disappointed": {"sadness": 2.3, "frustration": 1.0},
        "hurt": {"sadness": 2.4, "frustration": 1.0},
        "empty": {"sadness": 2.5, "fatigue": 1.2},
        "grief": {"sadness": 3.2},
        "gloomy": {"sadness": 2.0},

        # Gratitude
        "grateful": {"gratitude": 3.2, "joy": 1.0},
        "thankful": {"gratitude": 3.0, "calm": 0.8},
        "appreciation": {"gratitude": 2.6},
        "appreciate": {"gratitude": 2.6},
        "love": {"gratitude": 2.0, "joy": 2.2},
        "loved": {"gratitude": 2.2, "joy": 2.0},
        "kind": {"gratitude": 1.8, "calm": 0.8},
        "kindness": {"gratitude": 2.0},
        "warmth": {"gratitude": 1.8, "calm": 1.5},
        "cherish": {"gratitude": 2.4, "joy": 1.0},

        # Fatigue
        "tired": {"fatigue": 2.6},
        "exhausted": {"fatigue": 3.2},
        "burnout": {"fatigue": 3.4, "anxiety": 1.2},
        "burned out": {"fatigue": 3.4},
        "drained": {"fatigue": 2.8, "sadness": 0.8},
        "sleepy": {"fatigue": 2.0},
        "lethargic": {"fatigue": 2.5},
        "weary": {"fatigue": 2.5},
        "depleted": {"fatigue": 2.7},
        "no energy": {"fatigue": 2.8},
    }

    INTENSIFIERS = {
        "very": 1.4,
        "really": 1.4,
        "extremely": 1.8,
        "so": 1.3,
        "super": 1.4,
        "incredibly": 1.7,
        "terribly": 1.6,
        "immensely": 1.6,
        "deeply": 1.5,
        "quite": 1.2,
        "completely": 1.5,
        "totally": 1.4,
        "a bit": 0.7,
        "slightly": 0.6,
        "somewhat": 0.8,
        "barely": 0.5,
    }

    NEGATIONS = {"not", "never", "no", "hardly", "barely", "scarcely", "cannot", "can't", "don't", "didn't", "won't"}

    def __init__(self):
        self._transformer_pipeline = None
        self._transformer_attempted = False

    def _init_transformer(self):
        """Attempts to load the cached multi-class emotion transformer pipeline."""
        if self._transformer_attempted:
            return
        self._transformer_attempted = True
        try:
            from transformers import pipeline
            model_name = "j-hartmann/emotion-english-distilroberta-base"
            self._transformer_pipeline = pipeline(
                "text-classification",
                model=model_name,
                top_k=None,
                device=-1,
                model_kwargs={"local_files_only": True}
            )
        except Exception:
            # Gracefully and immediately use calibrated semantic rule engine
            self._transformer_pipeline = None

    def analyze(self, text: str) -> Dict[str, Any]:
        """
        Analyze input journal text and return emotional state, scores, and highlights.
        """
        if not text or not text.strip():
            return self._empty_response()

        cleaned_text = text.strip()

        # Check if transformer pipeline can be used
        scores = None
        used_model = "heuristic-lexicon"
        try:
            self._init_transformer()
            if self._transformer_pipeline:
                transformer_res = self._transformer_pipeline(cleaned_text[:512])
                scores = self._parse_transformer_output(transformer_res)
                used_model = "distilroberta-emotion-transformer"
        except Exception:
            scores = None

        if not scores:
            scores = self._analyze_lexicon(cleaned_text)

        # Calculate dominant emotion
        dominant_emotion = max(scores.items(), key=lambda x: x[1])[0]

        # Calculate overall wellness score (0 - 100) & sentiment polarity (-1.0 to 1.0)
        polarity = sum(scores[em] * self.EMOTION_VALENCE[em] for em in self.EMOTIONS)
        wellness_score = int(max(0, min(100, (polarity + 1.0) * 50)))

        # Key phrases / emotional highlights
        highlights = self._extract_highlights(cleaned_text, dominant_emotion)

        return {
            "dominant_emotion": dominant_emotion,
            "wellness_score": wellness_score,
            "sentiment_polarity": round(polarity, 3),
            "emotion_scores": {k: round(v, 4) for k, v in scores.items()},
            "highlights": highlights,
            "engine": used_model,
        }

    def _parse_transformer_output(self, output: Any) -> Dict[str, float]:
        """Maps DistilRoBERTa emotions (joy, sadness, anger, fear, surprise, disgust, neutral) to wellness schema."""
        if isinstance(output, list) and len(output) > 0 and isinstance(output[0], list):
            output = output[0]

        raw = {item["label"].lower(): item["score"] for item in output}

        # Map to our 7-class schema: joy, calm, anxiety, frustration, sadness, gratitude, fatigue
        mapped = {
            "joy": raw.get("joy", 0.0) * 0.9 + raw.get("surprise", 0.0) * 0.1,
            "calm": raw.get("neutral", 0.0) * 0.7 + raw.get("joy", 0.0) * 0.3,
            "anxiety": raw.get("fear", 0.0) * 0.85 + raw.get("surprise", 0.0) * 0.15,
            "frustration": raw.get("anger", 0.0) * 0.8 + raw.get("disgust", 0.0) * 0.2,
            "sadness": raw.get("sadness", 0.0) * 0.85,
            "gratitude": raw.get("joy", 0.0) * 0.6 + raw.get("neutral", 0.0) * 0.4,
            "fatigue": raw.get("sadness", 0.0) * 0.4 + raw.get("neutral", 0.0) * 0.3 + (0.1 if raw.get("fear", 0.0) > 0.2 else 0.0),
        }

        # Softmax normalize
        return self._normalize_scores(mapped)

    def _analyze_lexicon(self, text: str) -> Dict[str, float]:
        """Advanced rule and lexicon based emotion scoring with negation & intensifiers."""
        scores = {e: 0.05 for e in self.EMOTIONS}  # baseline smoothing
        text_lower = text.lower()
        sentences = re.split(r"[.!?\n]+", text_lower)

        for sent in sentences:
            words = re.findall(r"\b[a-z'-]+\b", sent)
            if not words:
                continue

            for idx, word in enumerate(words):
                # Check for bigrams first (e.g. "burned out", "fed up", "no energy")
                bigram = f"{words[idx-1]} {word}" if idx > 0 else ""
                matched_term = None

                if bigram in self.LEXICON:
                    matched_term = bigram
                elif word in self.LEXICON:
                    matched_term = word

                if not matched_term:
                    continue

                term_data = self.LEXICON[matched_term]

                # Check preceding window (up to 3 words) for intensifiers or negations
                window = words[max(0, idx - 3):idx]
                multiplier = 1.0
                negated = False

                for prev_word in window:
                    if prev_word in self.INTENSIFIERS:
                        multiplier *= self.INTENSIFIERS[prev_word]
                    if prev_word in self.NEGATIONS:
                        negated = True

                for emotion, weight in term_data.items():
                    effective_weight = weight * multiplier
                    if negated:
                        # Invert emotion affinity
                        if emotion in ["joy", "calm", "gratitude"]:
                            scores["sadness"] += effective_weight * 0.7
                            scores["anxiety"] += effective_weight * 0.3
                        else:
                            scores["calm"] += effective_weight * 0.6
                            scores["joy"] += effective_weight * 0.4
                    else:
                        scores[emotion] += effective_weight

        # Softmax normalize so probabilities sum to 1.0
        return self._normalize_scores(scores)

    def _normalize_scores(self, raw_scores: Dict[str, float]) -> Dict[str, float]:
        """Applies temperature softmax to raw scores."""
        # Temperature controls peakiness
        temp = 1.2
        exp_scores = {k: math.exp(v / temp) for k, v in raw_scores.items()}
        total_exp = sum(exp_scores.values()) or 1.0
        return {k: exp_scores[k] / total_exp for k in self.EMOTIONS}

    def _extract_highlights(self, text: str, dominant_emotion: str) -> List[str]:
        """Extracts key sentences that represent the dominant emotional tone."""
        sentences = [s.strip() for s in re.split(r"[.!?\n]+", text) if len(s.strip()) > 10]
        if not sentences:
            return [text[:80] + ("..." if len(text) > 80 else "")]

        scored_sentences = []
        for s in sentences:
            s_lower = s.lower()
            relevance = 0.0
            for word, affinities in self.LEXICON.items():
                if word in s_lower and dominant_emotion in affinities:
                    relevance += affinities[dominant_emotion]
            scored_sentences.append((relevance, s))

        scored_sentences.sort(key=lambda x: x[0], reverse=True)
        return [s for _, s in scored_sentences[:3] if s]

    def _empty_response(self) -> Dict[str, Any]:
        uniform = 1.0 / len(self.EMOTIONS)
        return {
            "dominant_emotion": "calm",
            "wellness_score": 50,
            "sentiment_polarity": 0.0,
            "emotion_scores": {e: uniform for e in self.EMOTIONS},
            "highlights": [],
            "engine": "empty",
        }
