# 🌿 MindHaven — NLP-Powered Mental Wellness & Sentiment Journal

> An empathetic, aesthetic web application that tracks emotional well-being using Natural Language Processing (NLP), visualizes mood trends through interactive pastel charts, and provides personalized AI-generated coping strategies.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org)
[![HuggingFace](https://img.shields.io/badge/HuggingFace-Transformers-FFD21E?logo=huggingface&logoColor=black)](https://huggingface.co)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Overview & The Concept

Mental health and journaling are deeply personal. While standard journaling apps act as passive digital notepads, **MindHaven** combines predictive Natural Language Processing with compassionate design:

1. **Multi-Class Emotion Analysis**: Categorizes reflections across 7 distinct psychological states (**Joy**, **Calm**, **Anxiety**, **Frustration**, **Sadness**, **Gratitude**, **Fatigue**) using fine-tuned Hugging Face Transformers (`DistilRoBERTa` / `DistilBERT`) paired with a high-precision calibrated lexical fallback engine.
2. **Stress Trigger & Vector Detection**: Identifies environmental and cognitive triggers (e.g. Work Deadlines, Sleep/Insomnia, Conflict, Finances, Academics) and assigns situational severity.
3. **Interactive Pastel Visualizer**: Designed strictly in soothing **pastel aesthetics** (lavender, matcha mint, baby peach, powder blue, warm sand) featuring a **Weekly Mood Wave** area chart, an **Emotion Radar**, and a **30-Day Mood Heatmap**.
4. **AI-Generated Coping Studio**:
   - **Interactive 4-7-8 Breathing Circle**: Pulsing animated visual orb (Inhale 4s, Hold 7s, Exhale 8s) to stimulate vagal nerve regulation.
   - **5-4-3-2-1 Sensory Grounding**: Interactive somatic de-escalation checklist.
   - **CBT Cognitive Reframing Assistant**: Analyzes automatic negative thoughts, identifies cognitive distortions (Catastrophizing, All-or-Nothing), and suggests balanced reframes.
5. **Procedural Ambient Soundscapes**: Synthesizes Gentle Rain, Ocean Waves, Whispering Wind, and Brown Noise on-the-fly using the browser's native **Web Audio API** — 100% offline, zero audio asset downloads.
6. **Privacy-First Architecture**: All entries are stored locally in an encrypted SQLite database. Zero external telemetry or third-party logging of sensitive thoughts.

---

## 🎨 UI Aesthetic & Design Concepts

MindHaven uses a custom pastel design system crafted to invoke psychological tranquility:
- **Calm & Peaceful**: `#D6E5FA` (Soft Sky Blue)
- **Joy & Vitality**: `#D8F3DC` (Matcha Mint)
- **Reflective & Mindful**: `#E7DEFE` (Powder Lavender)
- **Tension & Urgency**: `#FFE5D9` (Soft Peach Coral)
- **Gentle Care & Warmth**: `#FCE1E8` (Blush Rose)

---

## 🏗️ Architecture

```
journal_machine_learning/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── journal.py         # CRUD, Live NLP, Analytics, CBT Reframing
│   │   ├── nlp/
│   │   │   ├── __init__.py
│   │   │   ├── emotion_analyzer.py # Multi-class Transformer + Heuristic Engine
│   │   │   ├── trigger_extractor.py# Situational Stress Vector Identification
│   │   │   └── coping_engine.py    # CBT, Somatic & Mindfulness Generator
│   │   ├── database.py             # SQLite engine & session management
│   │   ├── models.py               # SQLAlchemy ORM models
│   │   ├── schemas.py              # Pydantic v2 validation models
│   │   └── main.py                 # FastAPI application entrypoint & CORS
│   ├── tests/
│   │   ├── test_api.py             # API endpoint integration tests
│   │   └── test_nlp.py             # NLP multi-class & trigger unit tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Header, Streak tracker, Sound toggle
│   │   │   ├── DailyJournalEditor.jsx # Live debounced NLP editor + badges
│   │   │   ├── WeeklyMoodChart.jsx # Recharts curved wave area graph
│   │   │   ├── EmotionRadar.jsx    # 7-axis emotion balance radar
│   │   │   ├── MoodHeatmap.jsx     # 30-day pastel calendar grid
│   │   │   ├── StressTriggerCloud.jsx # Semantic trigger pills & domain filters
│   │   │   ├── CopingStudio.jsx    # 4-7-8 Breathing, 5-4-3-2-1, CBT Reframer
│   │   │   ├── AmbientSoundPlayer.jsx # Web Audio API procedural sound player
│   │   │   └── JournalHistory.jsx  # Searchable timeline, JSON/MD export
│   │   ├── utils/
│   │   │   ├── api.js              # REST client helpers
│   │   │   └── pastelColors.js     # Emotion palettes & metadata
│   │   ├── App.jsx                 # Main layout & state orchestrator
│   │   ├── index.css               # Pastel gradient mesh & glassmorphism
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── run.sh                          # One-command dual server launcher
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+** (Python 3.12 recommended)
- **Node.js 18+** & npm

### 1. Backend Setup
```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install backend dependencies
pip install -r backend/requirements.txt
pip install transformers torch --extra-index-url https://download.pytorch.org/whl/cpu

# Run backend tests
PYTHONPATH=backend pytest backend/tests -v
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run build
```

### 3. Run MindHaven
You can launch both the backend and frontend with a single command:
```bash
./run.sh
```
Or run them separately:
- **Backend API**: `uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload`
- **Frontend App**: `cd frontend && npm run dev`

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze-live` | Real-time debounced NLP inference for draft text |
| `POST` | `/api/entries` | Save new reflection and trigger full NLP pipeline |
| `GET` | `/api/entries` | List reflections with search & emotion filters |
| `GET` | `/api/entries/{id}` | Retrieve single reflection details |
| `DELETE` | `/api/entries/{id}` | Delete reflection |
| `GET` | `/api/analytics/overview` | Weekly mood wave, radar data, triggers & heatmap |
| `POST` | `/api/coping/reframe` | CBT Cognitive thought reframing assistant |
| `GET` | `/health` | API health check |

---

## 🌿 GitHub Contribution Graph Sync

To push this repository to your GitHub profile and have every commit reflected on your contribution graph:

```bash
# 1. Create a new repository on your GitHub account (e.g. named 'nlp-mental-wellness-journal')
# 2. Add your remote
git remote add origin https://github.com/Uddhav-byte/nlp-mental-wellness-journal.git

# 3. Push to main branch
git branch -M main
git push -u origin main
```
Your commits are already authored by `Uddhav-byte <uddhavladia@gmail.com>`, so all commits will immediately light up your contribution graph!

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
