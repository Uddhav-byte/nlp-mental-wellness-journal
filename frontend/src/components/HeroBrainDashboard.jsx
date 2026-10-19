import React from 'react';
import { Target, Activity, Compass, TrendingUp, Sparkles, ArrowUpRight, Heart, Brain } from 'lucide-react';
import pastelBrainImg from '../assets/pastel_brain.jpg';
import { getEmotionMeta } from '../utils/pastelColors';

export default function HeroBrainDashboard({ analytics, onOpenEditor, onOpenCoping }) {
  const wellness = analytics?.average_wellness || 74;
  const stressLevel = Math.max(10, 100 - wellness);
  const dominantEmotion = analytics?.dominant_overall_emotion || 'calm';
  const dominantMeta = getEmotionMeta(dominantEmotion);

  return (
    <div className="relative w-full rounded-3xl p-6 sm:p-10 mb-8 overflow-hidden bg-gradient-to-b from-white/90 via-pastel-cream/70 to-pastel-lavender-light/40 border border-white/80 shadow-pastel-card">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-pastel-lavender/30 via-pastel-blue/20 to-pastel-mint/30 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Greeting Typography */}
      <div className="relative z-10 max-w-2xl mb-8">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Hello, <span className="font-serif italic font-normal text-slate-800">Uddhav</span> 👋 How are you{' '}
          <span className="relative inline-block text-slate-950 font-black">
            feeling
            <span className="absolute bottom-1 left-0 w-full h-2.5 bg-pastel-lavender/60 -z-10 rounded-full" />
          </span>{' '}
          today?
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-3 flex items-center space-x-2">
          <span>Your mental wellness telemetry is stable.</span>
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pastel-mint text-emerald-800 border border-pastel-mint-border">
            <span>{dominantMeta.emoji}</span>
            <span>{dominantMeta.label} State</span>
          </span>
        </p>
      </div>

      {/* 3D Brain Centerpiece with Floating Telemetry Cards */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 my-4">
        {/* Left Telemetry Card */}
        <div className="w-full lg:w-64 flex flex-col items-center lg:items-end">
          <div className="relative group w-full sm:w-60 glass-card p-5 rounded-3xl shadow-pastel-soft border border-white hover:scale-102 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">Goal Progress</span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Status: <span className="text-slate-700">Consistent</span></p>
            <div className="text-3xl font-extrabold text-slate-900 mt-2 flex items-baseline space-x-1">
              <span>{analytics?.current_streak ? analytics.current_streak * 10 + 15 : 65}%</span>
            </div>

            {/* Visual connector line to brain (desktop) */}
            <div className="hidden lg:block absolute -right-12 top-1/2 -translate-y-1/2 w-12 border-t-2 border-dashed border-pastel-lavender-border">
              <div className="absolute -right-1.5 -top-1 w-2 h-2 rounded-full bg-pastel-lavender-dark" />
            </div>
          </div>
        </div>

        {/* Center 3D Pastel Lilac Brain Asset */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center animate-float">
            {/* Soft backdrop blur halo */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-purple-200/50 via-pink-100/40 to-blue-200/50 blur-2xl" />
            
            <img
              src={pastelBrainImg}
              alt="Pastel 3D Brain Telemetry"
              className="relative z-10 w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-500 cursor-pointer"
              onClick={onOpenEditor}
              title="Click to record today's reflection"
            />
          </div>
        </div>

        {/* Right Telemetry Cards (Stacked) */}
        <div className="w-full lg:w-64 flex flex-col items-center lg:items-start space-y-4">
          {/* Stress Level Card */}
          <div className="relative group w-full sm:w-60 glass-card p-5 rounded-3xl shadow-pastel-soft border border-white hover:scale-102 transition-all duration-300">
            {/* Visual connector line to brain (desktop) */}
            <div className="hidden lg:block absolute -left-12 top-1/2 -translate-y-1/2 w-12 border-t-2 border-dashed border-pastel-lavender-border">
              <div className="absolute -left-1.5 -top-1 w-2 h-2 rounded-full bg-pastel-lavender-dark" />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">Stress Level</span>
              <div className="w-8 h-8 rounded-xl bg-pastel-peach-light border border-pastel-peach-border flex items-center justify-center text-orange-700">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Status: <span className="text-emerald-700 font-bold">Low / Manageable</span></p>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">
              <span>{stressLevel}%</span>
            </div>
          </div>

          {/* Focus Power Card */}
          <div className="relative group w-full sm:w-60 glass-card p-5 rounded-3xl shadow-pastel-soft border border-white hover:scale-102 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-600">Focus Power</span>
              <div className="w-8 h-8 rounded-xl bg-pastel-blue-light border border-pastel-blue-border flex items-center justify-center text-sky-800">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Status: <span className="text-slate-700 font-bold">High Resilience</span></p>
            <div className="text-3xl font-extrabold text-slate-900 mt-2 flex items-baseline space-x-1">
              <span>48</span>
              <span className="text-sm font-semibold text-slate-500">mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar with Quick Action Buttons */}
      <div className="relative z-10 pt-6 mt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-xs text-slate-600">
          <span className="flex items-center space-x-1.5 font-semibold text-slate-800">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Neuro-Telemetry:</span>
          </span>
          <span className="hidden sm:inline">Reflections parsed via DistilRoBERTa Multi-Class Pipeline</span>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={onOpenEditor}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-md hover:bg-slate-800 hover:scale-102 transition-all"
          >
            <span>Write Reflection</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenCoping}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pastel-lavender via-pastel-mint to-pastel-peach text-slate-800 text-xs font-bold border border-white shadow-xs hover:shadow-pastel-soft transition-all"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Start 4-7-8 Breathing</span>
          </button>
        </div>
      </div>
    </div>
  );
}
