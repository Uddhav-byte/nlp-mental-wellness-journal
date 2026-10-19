import React, { useState } from 'react';
import { Zap, Filter, ShieldAlert, Sparkles } from 'lucide-react';
import { SEVERITY_COLORS } from '../utils/pastelColors';

export default function StressTriggerCloud({ triggers = [] }) {
  const [selectedDomain, setSelectedDomain] = useState('all');

  const domains = [
    { id: 'all', label: 'All Triggers' },
    { id: 'work', label: 'Work & Career' },
    { id: 'health', label: 'Sleep & Health' },
    { id: 'relationships', label: 'Relationships' },
    { id: 'finances', label: 'Finances' },
    { id: 'daily_life', label: 'Daily Routine' },
  ];

  const filteredTriggers = selectedDomain === 'all'
    ? triggers
    : triggers.filter((t) => t.domain === selectedDomain);

  return (
    <div className="glass-card rounded-3xl p-6 shadow-pastel-card border border-white/90">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-pastel-peach-light border border-pastel-peach-border flex items-center justify-center text-orange-900">
            <Zap className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-800">Stress Trigger Semantic Cloud</h3>
            <p className="text-xs text-slate-500">NLP entity & stress vector detection</p>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {domains.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDomain(d.id)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedDomain === d.id
                  ? 'bg-slate-800 text-white font-semibold shadow-xs'
                  : 'bg-white/70 text-slate-600 hover:bg-white border border-slate-200/80'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trigger Pills Cloud */}
      <div className="py-5">
        {filteredTriggers.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-pastel-mint-light/50 border border-pastel-mint-border">
            <p className="text-sm font-medium text-emerald-800">
              🌿 No high stress triggers detected in this domain!
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Your recent reflections reflect emotional balance and calm.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {filteredTriggers.map((trig, idx) => {
              const sev = SEVERITY_COLORS[trig.severity] || SEVERITY_COLORS.medium;
              return (
                <div
                  key={idx}
                  className={`group flex items-center space-x-2 px-3.5 py-2 rounded-2xl border transition-all duration-200 shadow-2xs hover:scale-103 ${sev.bg} ${sev.border}`}
                >
                  <span className="font-medium text-slate-800 text-xs sm:text-sm">
                    {trig.trigger}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sev.badge}`}>
                    {trig.frequency}x
                  </span>
                  <span className="text-[10px] text-slate-500 hidden sm:inline">
                    ({trig.category})
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Empathetic Insight Note */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-pastel-peach-light via-pastel-cream to-pastel-lavender-light border border-pastel-peach-border flex items-start space-x-3">
        <Sparkles className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <span className="font-bold text-slate-900">Pattern Insight: </span>
          When work deadlines and meetings appear together, anxiety rises by ~35%. Setting explicit
          mental micro-boundaries before 6 PM can meaningfully reduce stress spillover into sleep.
        </div>
      </div>
    </div>
  );
}
