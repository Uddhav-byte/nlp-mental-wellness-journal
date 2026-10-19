import React from 'react';
import { Calendar, Award, Flame } from 'lucide-react';
import { getEmotionMeta } from '../utils/pastelColors';

export default function MoodHeatmap({ heatmapData = [], currentStreak = 7 }) {
  const getCellColor = (day) => {
    if (!day || day.count === 0) return 'bg-slate-100/90 border-slate-200/50';
    const score = day.wellness_score;
    if (score >= 80) return 'bg-pastel-mint border-pastel-mint-border hover:ring-2 hover:ring-emerald-400';
    if (score >= 65) return 'bg-pastel-blue border-pastel-blue-border hover:ring-2 hover:ring-sky-400';
    if (score >= 50) return 'bg-pastel-lavender border-pastel-lavender-border hover:ring-2 hover:ring-purple-400';
    if (score >= 35) return 'bg-pastel-peach border-pastel-peach-border hover:ring-2 hover:ring-orange-400';
    return 'bg-pastel-rose border-pastel-rose-border hover:ring-2 hover:ring-rose-400';
  };

  const activeDays = heatmapData.filter((d) => d.count > 0).length;
  const consistency = Math.round((activeDays / (heatmapData.length || 30)) * 100);

  return (
    <div className="glass-card rounded-3xl p-6 shadow-pastel-card border border-white/90">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-pastel-lavender-light border border-pastel-lavender-border flex items-center justify-center text-purple-800">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-800">30-Day Mood Calendar</h3>
            <p className="text-xs text-slate-500">Continuous reflection rhythm & consistency</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pastel-mint text-emerald-800 border border-pastel-mint-border text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>{currentStreak} Day Streak</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-slate-700 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>{consistency}% Consistency</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="pt-4">
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
          {heatmapData.map((day, idx) => {
            const meta = getEmotionMeta(day.dominant_emotion);
            const dateObj = new Date(day.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={idx}
                className="group relative flex flex-col items-center justify-center aspect-square rounded-xl border transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105"
              >
                <div
                  className={`w-full h-full rounded-xl flex items-center justify-center text-xs font-medium transition-colors ${getCellColor(
                    day
                  )}`}
                >
                  {day.count > 0 ? (
                    <span className="text-[13px]">{meta.emoji}</span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {dateObj.getDate()}
                    </span>
                  )}
                </div>

                {/* Hover Popover */}
                <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none">
                  <div className="glass-card px-2.5 py-1.5 rounded-xl shadow-lg border border-white text-[11px] whitespace-nowrap text-slate-800">
                    <p className="font-bold">{formattedDate}</p>
                    {day.count > 0 ? (
                      <p className="text-slate-600">
                        {meta.label} • {day.wellness_score}/100
                      </p>
                    ) : (
                      <p className="text-slate-400">No reflection recorded</p>
                    )}
                  </div>
                  <div className="w-2 h-2 bg-white/80 rotate-45 -mt-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color Scale Legend */}
      <div className="flex flex-wrap items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 gap-2">
        <span>Emotional Wellness Spectrum:</span>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <span className="w-3.5 h-3.5 rounded-md bg-pastel-rose border border-pastel-rose-border" />
            <span className="text-[11px]">Distressed</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3.5 h-3.5 rounded-md bg-pastel-peach border border-pastel-peach-border" />
            <span className="text-[11px]">Tense</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3.5 h-3.5 rounded-md bg-pastel-lavender border border-pastel-lavender-border" />
            <span className="text-[11px]">Reflective</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3.5 h-3.5 rounded-md bg-pastel-blue border border-pastel-blue-border" />
            <span className="text-[11px]">Calm</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3.5 h-3.5 rounded-md bg-pastel-mint border border-pastel-mint-border" />
            <span className="text-[11px]">Joyful</span>
          </div>
        </div>
      </div>
    </div>
  );
}
