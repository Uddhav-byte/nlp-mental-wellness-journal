import React, { useState, useEffect } from 'react';
import { Wind, Eye, Sparkles, Play, Pause, RotateCcw, CheckCircle2, ArrowRight, Heart, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';
import { reframeThought } from '../utils/api';

export default function CopingStudio({ initialThought = '' }) {
  const [activeTab, setActiveTab] = useState('breathing');

  // Breathing Circle State (4-7-8 method)
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale'); // 'Inhale' (4s), 'Hold' (7s), 'Exhale' (8s)
  const [countdown, setCountdown] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  // Grounding Checklist State
  const [groundingChecks, setGroundingChecks] = useState({
    see: [false, false, false, false, false],
    touch: [false, false, false, false],
    hear: [false, false, false],
    smell: [false, false],
    taste: [false],
  });

  // CBT Reframer State
  const [thoughtInput, setThoughtInput] = useState(initialThought);
  const [reframeLoading, setReframeLoading] = useState(false);
  const [reframeResult, setReframeResult] = useState(null);

  // 4-7-8 Breathing Loop Timer
  useEffect(() => {
    let timer = null;
    if (isBreathing) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // Transition phases
            if (breathPhase === 'Inhale') {
              setBreathPhase('Hold');
              return 7;
            } else if (breathPhase === 'Hold') {
              setBreathPhase('Exhale');
              return 8;
            } else {
              setBreathPhase('Inhale');
              setCycleCount((c) => {
                const nextCycle = c + 1;
                if (nextCycle === 4) {
                  try {
                    confetti({
                      particleCount: 50,
                      spread: 50,
                      origin: { y: 0.5 },
                      colors: ['#D8F3DC', '#D0E1FD', '#EBE4FF'],
                    });
                  } catch (e) {}
                }
                return nextCycle;
              });
              return 4;
            }
          }
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBreathing, breathPhase]);

  const toggleBreathing = () => {
    if (!isBreathing) {
      setBreathPhase('Inhale');
      setCountdown(4);
      setIsBreathing(true);
    } else {
      setIsBreathing(false);
    }
  };

  const resetBreathing = () => {
    setIsBreathing(false);
    setBreathPhase('Inhale');
    setCountdown(4);
    setCycleCount(0);
  };

  const toggleGroundingItem = (sense, idx) => {
    setGroundingChecks((prev) => {
      const copy = { ...prev };
      const arr = [...copy[sense]];
      arr[idx] = !arr[idx];
      copy[sense] = arr;
      return copy;
    });
  };

  const handleReframeSubmit = async (e) => {
    e.preventDefault();
    if (!thoughtInput.trim()) return;

    setReframeLoading(true);
    try {
      const res = await reframeThought(thoughtInput);
      setReframeResult(res);
    } catch (err) {
      console.error('Failed to reframe thought:', err);
    } finally {
      setReframeLoading(false);
    }
  };

  // Calculate grounding progress
  const totalGroundingItems = 15;
  const completedGrounding =
    groundingChecks.see.filter(Boolean).length +
    groundingChecks.touch.filter(Boolean).length +
    groundingChecks.hear.filter(Boolean).length +
    groundingChecks.smell.filter(Boolean).length +
    groundingChecks.taste.filter(Boolean).length;
  const groundingPct = Math.round((completedGrounding / totalGroundingItems) * 100);

  return (
    <div className="space-y-6">
      {/* Studio Header & Tab Switcher */}
      <div className="glass-card rounded-3xl p-6 shadow-pastel-card border border-white/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✨</span>
              <h2 className="text-2xl font-serif font-bold text-slate-800">Mindfulness & Coping Studio</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Scientifically grounded somatic and cognitive interventions tailored to calm distress and anxiety.
            </p>
          </div>

          {/* Module Switcher */}
          <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-white/80 border border-slate-200">
            <button
              onClick={() => setActiveTab('breathing')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'breathing'
                  ? 'bg-pastel-blue text-sky-900 border border-pastel-blue-border shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>4-7-8 Breathing</span>
            </button>

            <button
              onClick={() => setActiveTab('grounding')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'grounding'
                  ? 'bg-pastel-mint text-emerald-900 border border-pastel-mint-border shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>5-4-3-2-1 Sensory</span>
            </button>

            <button
              onClick={() => setActiveTab('reframe')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'reframe'
                  ? 'bg-pastel-lavender text-purple-900 border border-pastel-lavender-border shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>CBT Reframer</span>
            </button>
          </div>
        </div>

        {/* 1. GUIDED 4-7-8 BREATHING CIRCLE */}
        {activeTab === 'breathing' && (
          <div className="pt-8 pb-4 flex flex-col items-center justify-center">
            {/* Visual Animated Breathing Orb */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Outer Pulsing Rings */}
              <div
                className={`absolute inset-0 rounded-full transition-transform duration-1000 ${
                  isBreathing
                    ? breathPhase === 'Inhale'
                      ? 'scale-115 bg-pastel-blue/40 blur-xl'
                      : breathPhase === 'Hold'
                      ? 'scale-115 bg-pastel-mint/50 blur-xl'
                      : 'scale-90 bg-pastel-lavender/40 blur-xl'
                    : 'scale-100 bg-pastel-cream blur-md'
                }`}
              />

              {/* Middle Aesthetic Ring */}
              <div
                className={`absolute w-56 h-56 rounded-full border-2 border-dashed transition-all duration-700 ${
                  isBreathing ? 'border-pastel-lavender-dark/40 rotate-180' : 'border-slate-200'
                }`}
              />

              {/* Inner Pulsing Circle */}
              <div
                className={`w-44 h-44 rounded-full flex flex-col items-center justify-center shadow-pastel-card border-2 border-white transition-all duration-700 ${
                  breathPhase === 'Inhale'
                    ? 'bg-gradient-to-tr from-pastel-blue via-white to-pastel-mint scale-110 text-sky-900'
                    : breathPhase === 'Hold'
                    ? 'bg-gradient-to-tr from-pastel-mint via-white to-pastel-lemon scale-110 text-emerald-900'
                    : 'bg-gradient-to-tr from-pastel-lavender via-white to-pastel-peach scale-95 text-purple-900'
                }`}
              >
                <span className="text-xs uppercase tracking-widest font-semibold opacity-75">
                  {breathPhase}
                </span>
                <span className="font-serif text-5xl font-bold my-1">{countdown}</span>
                <span className="text-[11px] opacity-75">
                  {breathPhase === 'Inhale' && 'Slowly through nose'}
                  {breathPhase === 'Hold' && 'Hold gently'}
                  {breathPhase === 'Exhale' && 'Smoothly through mouth'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3 mt-8">
              <button
                onClick={toggleBreathing}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-2xl text-sm font-semibold shadow-pastel-soft transition-all active:scale-95 ${
                  isBreathing
                    ? 'bg-pastel-peach text-orange-900 border border-pastel-peach-border'
                    : 'bg-gradient-to-r from-pastel-mint to-pastel-blue text-slate-800 border border-pastel-mint-border'
                }`}
              >
                {isBreathing ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isBreathing ? 'Pause Breathing' : 'Start 4-7-8 Session'}</span>
              </button>

              <button
                onClick={resetBreathing}
                className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                title="Reset Session"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Cycles Completed */}
            <p className="text-xs text-slate-500 mt-4">
              Cycles Completed: <span className="font-bold text-slate-800">{cycleCount} / 4 target</span>
            </p>
          </div>
        )}

        {/* 2. 5-4-3-2-1 SENSORY GROUNDING CHECKLIST */}
        {activeTab === 'grounding' && (
          <div className="pt-4 space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-pastel-mint-light border border-pastel-mint-border">
              <div>
                <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                  Sensory Re-orientation Progress
                </p>
                <p className="text-sm font-bold text-emerald-950 mt-0.5">
                  {completedGrounding} of 15 sensory anchors acknowledged ({groundingPct}%)
                </p>
              </div>
              <div className="w-32 h-2.5 bg-white rounded-full overflow-hidden border border-pastel-mint-border">
                <div
                  className="h-full bg-gradient-to-r from-pastel-mint-dark to-emerald-600 transition-all duration-300"
                  style={{ width: `${groundingPct}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 5 Things You See */}
              <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5 uppercase">
                  <span>👀 5 Things You Can See</span>
                </h4>
                <div className="space-y-1.5">
                  {groundingChecks.see.map((checked, i) => (
                    <button
                      key={i}
                      onClick={() => toggleGroundingItem('see', i)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-colors border ${
                        checked
                          ? 'bg-pastel-mint text-emerald-900 border-pastel-mint-border font-medium line-through'
                          : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-pastel-cream'
                      }`}
                    >
                      <span>Item #{i + 1}: Notice color, shape, or light reflecting</span>
                      <CheckCircle2 className={`w-4 h-4 ${checked ? 'text-emerald-700 fill-pastel-mint' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Things You Touch */}
              <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5 uppercase">
                  <span>🖐️ 4 Textures You Can Touch</span>
                </h4>
                <div className="space-y-1.5">
                  {groundingChecks.touch.map((checked, i) => (
                    <button
                      key={i}
                      onClick={() => toggleGroundingItem('touch', i)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-colors border ${
                        checked
                          ? 'bg-pastel-blue text-sky-900 border-pastel-blue-border font-medium line-through'
                          : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-pastel-cream'
                      }`}
                    >
                      <span>Texture #{i + 1}: Fabric, smooth desk, warm mug, phone</span>
                      <CheckCircle2 className={`w-4 h-4 ${checked ? 'text-sky-700 fill-pastel-blue' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Sounds */}
              <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5 uppercase">
                  <span>👂 3 Sounds You Can Hear</span>
                </h4>
                <div className="space-y-1.5">
                  {groundingChecks.hear.map((checked, i) => (
                    <button
                      key={i}
                      onClick={() => toggleGroundingItem('hear', i)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-colors border ${
                        checked
                          ? 'bg-pastel-lavender text-purple-900 border-pastel-lavender-border font-medium line-through'
                          : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-pastel-cream'
                      }`}
                    >
                      <span>Sound #{i + 1}: Distant traffic, hum of computer, breath</span>
                      <CheckCircle2 className={`w-4 h-4 ${checked ? 'text-purple-700 fill-pastel-lavender' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* 2 Scents & 1 Taste */}
              <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/80 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5 uppercase mb-1.5">
                    <span>👃 2 Things You Smell</span>
                  </h4>
                  <div className="space-y-1.5">
                    {groundingChecks.smell.map((checked, i) => (
                      <button
                        key={i}
                        onClick={() => toggleGroundingItem('smell', i)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-colors border ${
                          checked
                            ? 'bg-pastel-peach text-orange-950 border-pastel-peach-border font-medium line-through'
                            : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-pastel-cream'
                        }`}
                      >
                        <span>Scent #{i + 1}: Fresh air, tea, paper, lotion</span>
                        <CheckCircle2 className={`w-4 h-4 ${checked ? 'text-orange-700 fill-pastel-peach' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5 uppercase mb-1.5">
                    <span>👅 1 Taste You Notice</span>
                  </h4>
                  <button
                    onClick={() => toggleGroundingItem('taste', 0)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-colors border ${
                      groundingChecks.taste[0]
                        ? 'bg-pastel-lemon text-amber-950 border-pastel-lemon-border font-medium line-through'
                        : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-pastel-cream'
                    }`}
                  >
                    <span>Sip of water, mint, or natural neutral palate</span>
                    <CheckCircle2 className={`w-4 h-4 ${groundingChecks.taste[0] ? 'text-amber-700 fill-pastel-lemon' : 'text-slate-300'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. CBT COGNITIVE THOUGHT REFRAMER */}
        {activeTab === 'reframe' && (
          <div className="pt-4 space-y-6">
            <form onSubmit={handleReframeSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Enter an Anxious or Frustrating Thought
                </label>
                <textarea
                  rows={3}
                  value={thoughtInput}
                  onChange={(e) => setThoughtInput(e.target.value)}
                  placeholder="e.g., I'm completely behind on deadlines and going to fail this project..."
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-pastel-lavender-dark text-sm leading-relaxed"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={reframeLoading || !thoughtInput.trim()}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-semibold shadow-sm transition-all ${
                    !thoughtInput.trim()
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pastel-lavender to-pastel-blue text-purple-950 hover:shadow-pastel-glow border border-pastel-lavender-border'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{reframeLoading ? 'Reframing...' : 'Reframe With CBT Assistant'}</span>
                </button>
              </div>
            </form>

            {/* Reframing Results */}
            {reframeResult && (
              <div className="p-6 rounded-3xl bg-white/90 border border-pastel-lavender/60 shadow-pastel-soft space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🧠</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        Identified Cognitive Distortion:{' '}
                        <span className="text-purple-700">{reframeResult.detected_distortion}</span>
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-pastel-cream border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-900 mb-1">Empathetic Guidance:</p>
                  <p>{reframeResult.reframing_guidance}</p>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Constructive Cognitive Reframes:
                  </h5>
                  <div className="space-y-2">
                    {reframeResult.constructive_reframes.map((reframe, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-2xl bg-gradient-to-r from-pastel-mint-light to-pastel-blue-light border border-pastel-mint-border text-xs text-slate-800 flex items-start space-x-2.5"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-medium">{reframe}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-pastel-lavender/40 border border-pastel-lavender-border text-center">
                  <p className="text-[11px] font-semibold text-purple-800 uppercase tracking-widest mb-1">
                    Daily Anchoring Affirmation
                  </p>
                  <p className="font-serif italic text-sm font-medium text-purple-950">
                    "{reframeResult.action_affirmation}"
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
