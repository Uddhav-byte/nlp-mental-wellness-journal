import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Activity, TrendingUp, Sparkles } from 'lucide-react';
import { getEmotionMeta } from '../utils/pastelColors';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const meta = getEmotionMeta(data.dominant_emotion);

    return (
      <div className="glass-card p-3 rounded-2xl shadow-pastel-card border border-white text-xs space-y-1.5">
        <div className="flex items-center justify-between font-semibold text-slate-700 pb-1 border-b border-slate-100">
          <span>{data.day}, {data.date}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${meta.bg} ${meta.text}`}>
            {meta.emoji} {meta.label}
          </span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-500">Wellness Index:</span>
          <span className="font-bold text-slate-800 text-sm">{data.wellness_score}/100</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-500">Self Rating:</span>
          <span className="font-semibold text-slate-700">{data.user_mood_rating}/10</span>
        </div>
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-500">Reflections:</span>
          <span className="text-slate-600">{data.entry_count} entries</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function WeeklyMoodChart({ weeklyData = [] }) {
  const avgScore = weeklyData.length
    ? Math.round(weeklyData.reduce((acc, curr) => acc + curr.wellness_score, 0) / weeklyData.length)
    : 70;

  return (
    <div className="glass-card rounded-3xl p-6 shadow-pastel-card border border-white/90">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-pastel-blue-light border border-pastel-blue-border flex items-center justify-center text-sky-800">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-800">Weekly Mood Wave</h3>
            <p className="text-xs text-slate-500">7-day emotional trajectory & resilience</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs px-3 py-1 rounded-full bg-pastel-mint text-emerald-800 border border-pastel-mint-border font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Avg: {avgScore}/100</span>
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-64 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="pastelWave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D8CCFE" stopOpacity={0.6} />
                <stop offset="60%" stopColor="#D0E1FD" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D8F3DC" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE1" vertical={false} />

            <XAxis
              dataKey="day"
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={8}
            />

            <YAxis
              domain={[0, 100]}
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              ticks={[20, 40, 60, 80, 100]}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="wellness_score"
              stroke="#8B7EC8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#pastelWave)"
              activeDot={{
                r: 6,
                fill: '#FFFFFF',
                stroke: '#8B7EC8',
                strokeWidth: 3,
                className: 'filter drop-shadow-md',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Footer */}
      <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-pastel-lavender-dark" />
          <span>Curved interpolation illustrates gentle psychological recovery rhythms</span>
        </span>
        <span className="text-[11px] text-slate-400">Values 0 (distress) - 100 (thriving)</span>
      </div>
    </div>
  );
}
