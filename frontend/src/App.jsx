import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AmbientSoundPlayer from './components/AmbientSoundPlayer';
import DailyJournalEditor from './components/DailyJournalEditor';
import WeeklyMoodChart from './components/WeeklyMoodChart';
import EmotionRadar from './components/EmotionRadar';
import MoodHeatmap from './components/MoodHeatmap';
import StressTriggerCloud from './components/StressTriggerCloud';
import CopingStudio from './components/CopingStudio';
import JournalHistory from './components/JournalHistory';
import { getAnalyticsOverview } from './utils/api';
import { Sparkles, Heart, Shield, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [soundOpen, setSoundOpen] = useState(false);
  const [refreshSignal, setRefreshSignal] = useState(0);

  const [analytics, setAnalytics] = useState({
    total_entries: 7,
    current_streak: 7,
    average_wellness: 74,
    dominant_overall_emotion: 'calm',
    weekly_trend: [],
    emotion_radar: [],
    top_triggers: [],
    heatmap: [],
  });
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalyticsOverview();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics overview:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [refreshSignal]);

  const handleEntryCreated = (newEntry) => {
    setRefreshSignal((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-pastel-lavender selection:text-pastel-lavender-dark">
      {/* Top Calming Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streak={analytics.current_streak}
        soundOpen={soundOpen}
        setSoundOpen={setSoundOpen}
      />

      {/* Floating Procedural Web Audio Soundscape Player */}
      <AmbientSoundPlayer isOpen={soundOpen} onClose={() => setSoundOpen(false)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: JOURNAL & CORE DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Grid: Journal Composer + Weekly Wave Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7">
                <DailyJournalEditor onEntryCreated={handleEntryCreated} />
              </div>

              <div className="lg:col-span-5 space-y-6">
                <WeeklyMoodChart weeklyData={analytics.weekly_trend} />

                {/* Quick Coping & Mindfulness Teaser */}
                <div className="glass-card rounded-3xl p-6 shadow-pastel-card border border-white/90">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🫁</span>
                      <h3 className="font-serif font-bold text-base text-slate-800">
                        Quick 4-7-8 Breathing
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('coping')}
                      className="text-xs text-pastel-lavender-dark font-semibold hover:underline"
                    >
                      Open Studio →
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Feeling anxious or overwhelmed? Take 3 minutes with our interactive breathing circle to recalibrate your nervous system.
                  </p>
                  <button
                    onClick={() => setActiveTab('coping')}
                    className="w-full mt-4 py-2.5 rounded-2xl bg-gradient-to-r from-pastel-mint to-pastel-blue text-xs font-semibold text-slate-800 border border-pastel-mint-border shadow-xs hover:shadow-pastel-soft transition-all"
                  >
                    Start Breathing Circle
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Row: Emotion Radar & Top Stress Triggers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <EmotionRadar emotionData={analytics.emotion_radar} />
              <StressTriggerCloud triggers={analytics.top_triggers} />
            </div>
          </div>
        )}

        {/* TAB 2: DEEP ANALYTICS & MOOD TRENDS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <WeeklyMoodChart weeklyData={analytics.weekly_trend} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <EmotionRadar emotionData={analytics.emotion_radar} />
              <StressTriggerCloud triggers={analytics.top_triggers} />
            </div>

            <MoodHeatmap
              heatmapData={analytics.heatmap}
              currentStreak={analytics.current_streak}
            />
          </div>
        )}

        {/* TAB 3: COPING STUDIO */}
        {activeTab === 'coping' && (
          <div className="animate-in fade-in duration-300">
            <CopingStudio />
          </div>
        )}

        {/* TAB 4: JOURNAL TIMELINE & ARCHIVE */}
        {activeTab === 'history' && (
          <div className="animate-in fade-in duration-300">
            <JournalHistory refreshSignal={refreshSignal} />
          </div>
        )}
      </main>

      {/* Aesthetic Footer with Privacy Assurance */}
      <footer className="w-full border-t border-pastel-lavender/30 bg-white/40 backdrop-blur-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-base">🌿</span>
            <span className="font-serif font-bold text-slate-700">MindHaven</span>
            <span>— Empathetic NLP Wellness & Sentiment Journal</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Private Local Storage</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-pastel-rose" />
              <span>Built with Empathy & Transformers</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
