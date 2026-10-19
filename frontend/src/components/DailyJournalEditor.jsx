import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Send, Tag, Smile, Compass, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { analyzeLive, createEntry } from '../utils/api';
import { EMOTIONS, getEmotionMeta, SEVERITY_COLORS } from '../utils/pastelColors';

export default function DailyJournalEditor({ onEntryCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userRating, setUserRating] = useState(7);
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState(['mindfulness']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live NLP Feedback State
  const [liveAnalysis, setLiveAnalysis] = useState({
    dominant_emotion: 'calm',
    wellness_score: 75,
    sentiment_polarity: 0.25,
    emotion_scores: {
      joy: 0.2,
      calm: 0.5,
      anxiety: 0.1,
      frustration: 0.05,
      sadness: 0.05,
      gratitude: 0.1,
      fatigue: 0.0,
    },
    triggers: [],
    highlights: [],
  });

  const promptSuggestions = [
    "What moment brought you a feeling of genuine calm today?",
    "Did a specific conversation or deadline cause tension?",
    "What is one thought you would like to let go of tonight?",
    "Who or what made you smile or feel supported today?",
  ];

  const debounceTimeoutRef = useRef(null);

  // Trigger live analysis with debouncing
  useEffect(() => {
    if (!content.trim() || content.trim().length < 10) return;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    setIsAnalyzing(true);
    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const result = await analyzeLive(content);
        setLiveAnalysis(result);
      } catch (err) {
        console.error('Live analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 450);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [content]);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      const clean = currentTag.trim().replace(/^#/, '');
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim() || 'Daily Reflection',
        content: content.trim(),
        user_mood_rating: userRating,
        tags: tags,
      };

      const saved = await createEntry(payload);

      // Trigger delightful confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D8F3DC', '#E7DEFE', '#FFE5D9', '#D6E5FA', '#FCE1E8'],
        });
      } catch (err) {
        // Confetti fallback
      }

      // Reset form
      setContent('');
      setTitle('');
      setTags(['mindfulness']);
      setUserRating(7);

      if (onEntryCreated) {
        onEntryCreated(saved);
      }
    } catch (err) {
      console.error('Failed to save journal entry:', err);
      alert('Could not save your entry. Please verify server connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dominantMeta = getEmotionMeta(liveAnalysis.dominant_emotion);

  const getMoodEmoji = (val) => {
    if (val <= 2) return '🌧️ Distressed';
    if (val <= 4) return '☁️ Struggling';
    if (val <= 6) return '⛅ Neutral';
    if (val <= 8) return '🌸 Content';
    return '✨ Joyful';
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 shadow-pastel-card border border-white/90">
      {/* Header & Inspiration Prompts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-pastel-lavender/30 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">✍️</span>
            <h2 className="text-2xl font-serif font-bold text-slate-800 tracking-tight">
              Today's Reflection
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Express freely. MindHaven NLP detects emotional nuances and offers empathetic coping strategies.
          </p>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          {isAnalyzing ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-pastel-lavender text-purple-900 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Analyzing Nuances...</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-pastel-mint-light text-emerald-800 border border-pastel-mint-border">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>NLP Transformer Active</span>
            </span>
          )}
        </div>
      </div>

      {/* Guided Prompt Chips */}
      <div className="py-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Guided Prompts (Click to inspire)
        </p>
        <div className="flex flex-wrap gap-2">
          {promptSuggestions.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (!content) {
                  setContent(prompt + '\n\n');
                } else {
                  setContent(content + '\n' + prompt + '\n');
                }
              }}
              className="text-xs px-3 py-1.5 rounded-xl bg-white/70 hover:bg-pastel-peach-light text-slate-600 hover:text-slate-900 border border-slate-200/80 transition-colors shadow-2xs text-left"
            >
              💭 {prompt}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Title input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give today's entry a calm title (e.g. Quiet afternoon breakthroughs)..."
            className="w-full px-4 py-3 rounded-2xl bg-white/60 border border-slate-200/90 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-pastel-lavender-border text-base font-medium transition-all"
          />
        </div>

        {/* Main Content Area */}
        <div className="relative">
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write what is weighing on your mind or uplifting you today... As you write, MindHaven's multi-class transformer will softly track your emotions below."
            className="w-full px-5 py-4 rounded-3xl bg-white/80 border border-slate-200/90 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-3 focus:ring-pastel-lavender-border text-base leading-relaxed resize-y transition-all shadow-inner"
          />
        </div>

        {/* Real-time NLP Interactive Intelligence Bar */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-pastel-cream via-white to-pastel-lavender-light border border-pastel-lavender/40 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Live Detected Emotion Badges */}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Live Emotion State
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {Object.entries(liveAnalysis.emotion_scores).map(([emKey, score]) => {
                  const meta = getEmotionMeta(emKey);
                  const isDominant = liveAnalysis.dominant_emotion === emKey;
                  const pct = Math.round(score * 100);
                  if (pct < 10 && !isDominant) return null;

                  return (
                    <div
                      key={emKey}
                      className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
                        isDominant
                          ? `${meta.bg} ${meta.text} ${meta.border} shadow-sm ring-2 ring-white scale-105 font-bold`
                          : 'bg-white/80 text-slate-600 border-slate-200'
                      }`}
                    >
                      <span>{meta.emoji}</span>
                      <span>{meta.label}</span>
                      <span className="opacity-75 font-mono text-[10px]">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Wellness Score Gauge */}
            <div className="flex items-center space-x-3 bg-white/80 px-4 py-2 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="transition-all duration-700 ease-out"
                    strokeDasharray={`${liveAnalysis.wellness_score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke={dominantMeta.barColor}
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-serif text-sm font-bold text-slate-800">
                  {liveAnalysis.wellness_score}
                </span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Wellness Index</p>
                <p className="text-xs font-bold capitalize text-slate-800">
                  {dominantMeta.label} Vibe
                </p>
              </div>
            </div>
          </div>

          {/* Detected Stress Triggers (if any) */}
          {liveAnalysis.triggers && liveAnalysis.triggers.length > 0 && (
            <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Detected Triggers:</span>
              {liveAnalysis.triggers.map((trig, idx) => {
                const sevColor = SEVERITY_COLORS[trig.severity] || SEVERITY_COLORS.medium;
                return (
                  <span
                    key={idx}
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg text-xs font-medium border ${sevColor.bg} ${sevColor.text} ${sevColor.border}`}
                  >
                    <span>⚡ {trig.trigger}</span>
                    <span className="text-[10px] opacity-75">({trig.category})</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Mood Slider & Tag Manager */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Mood Rating Slider */}
          <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center space-x-1.5">
                <Smile className="w-3.5 h-3.5 text-pastel-lavender-dark" />
                <span>Self-Reported Mood</span>
              </label>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-pastel-mint text-emerald-800 border border-pastel-mint-border">
                {getMoodEmoji(userRating)} ({userRating}/10)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={userRating}
              onChange={(e) => setUserRating(parseInt(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-pastel-rose via-pastel-lemon to-pastel-mint rounded-lg appearance-none cursor-pointer accent-pastel-lavender-dark"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Low Energy</span>
              <span>Balanced</span>
              <span>Thriving</span>
            </div>
          </div>

          {/* Tags */}
          <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/80">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
              <Tag className="w-3.5 h-3.5 text-pastel-lavender-dark" />
              <span>Theme Tags (Press Enter)</span>
            </label>
            <div className="flex flex-wrap gap-1.5 items-center">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-medium bg-pastel-lavender/60 text-purple-900 border border-pastel-lavender-border"
                >
                  <span>#{t}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    className="hover:text-purple-600 text-purple-400 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="+ tag"
                className="text-xs px-2.5 py-1 rounded-xl bg-transparent border border-dashed border-slate-300 text-slate-700 placeholder-slate-400 focus:outline-hidden focus:border-pastel-lavender-dark w-20"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-semibold shadow-pastel-soft transition-all duration-200 ${
              !content.trim()
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pastel-lavender via-pastel-mint to-pastel-peach text-slate-800 hover:shadow-pastel-glow hover:scale-102 active:scale-98 border border-white'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving Reflections...' : 'Save & Analyze Entry'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
