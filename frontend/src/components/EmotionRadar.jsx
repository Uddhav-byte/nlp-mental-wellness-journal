import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { PieChart, Sparkles } from 'lucide-react';
import { getEmotionMeta } from '../utils/pastelColors';

export default function EmotionRadar({ emotionData = [] }) {
  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const meta = getEmotionMeta(data.emotion);
      return (
        <div className="glass-card p-2.5 rounded-xl shadow-md border border-white text-xs">
          <p className="font-semibold text-slate-800 flex items-center space-x-1">
            <span>{meta.emoji}</span>
            <span>{data.emotion}</span>
          </p>
          <p className="text-slate-600 mt-0.5">
            Weight: <span className="font-bold text-slate-800">{data.percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-3xl p-6 shadow-pastel-card border border-white/90">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-pastel-mint-light border border-pastel-mint-border flex items-center justify-center text-emerald-800">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-800">Emotion Balance Radar</h3>
            <p className="text-xs text-slate-500">Multi-class transformer distribution</p>
          </div>
        </div>
      </div>

      <div className="w-full h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={emotionData}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis
              dataKey="emotion"
              tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 40]} stroke="#CBD5E1" tick={false} />
            <Tooltip content={customTooltip} />
            <Radar
              name="Emotion Share"
              dataKey="percentage"
              stroke="#52B788"
              fill="#D8F3DC"
              fillOpacity={0.65}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Mini Legend Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100">
        {emotionData.slice(0, 4).map((item) => {
          const meta = getEmotionMeta(item.emotion);
          return (
            <div
              key={item.emotion}
              className="flex items-center justify-between p-2 rounded-xl bg-white/70 border border-slate-200/60 text-xs"
            >
              <span className="flex items-center space-x-1 text-slate-600">
                <span>{meta.emoji}</span>
                <span className="truncate">{item.emotion}</span>
              </span>
              <span className="font-bold text-slate-800">{item.percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
