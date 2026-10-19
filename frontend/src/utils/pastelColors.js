/**
 * Pastel color definitions and emotion metadata for MindHaven UI.
 */

export const EMOTIONS = {
  joy: {
    label: "Joy",
    emoji: "🌸",
    bg: "bg-pastel-mint",
    bgLight: "bg-pastel-mint-light",
    border: "border-pastel-mint-border",
    text: "text-emerald-800",
    glow: "rgba(216, 243, 220, 0.7)",
    barColor: "#52B788",
    description: "Happiness, vitality, fulfillment",
  },
  calm: {
    label: "Calm",
    emoji: "🌊",
    bg: "bg-pastel-blue",
    bgLight: "bg-pastel-blue-light",
    border: "border-pastel-blue-border",
    text: "text-sky-800",
    glow: "rgba(214, 229, 250, 0.7)",
    barColor: "#5A8DEE",
    description: "Peace, tranquility, equilibrium",
  },
  anxiety: {
    label: "Anxiety",
    emoji: "💜",
    bg: "bg-pastel-lavender",
    bgLight: "bg-pastel-lavender-light",
    border: "border-pastel-lavender-border",
    text: "text-purple-800",
    glow: "rgba(231, 222, 254, 0.7)",
    barColor: "#8B7EC8",
    description: "Tension, anticipation, worry",
  },
  frustration: {
    label: "Frustration",
    emoji: "🍑",
    bg: "bg-pastel-peach",
    bgLight: "bg-pastel-peach-light",
    border: "border-pastel-peach-border",
    text: "text-orange-900",
    glow: "rgba(255, 229, 217, 0.7)",
    barColor: "#E07A5F",
    description: "Irritation, blocked goals, anger",
  },
  sadness: {
    label: "Sadness",
    emoji: "🌧️",
    bg: "bg-slate-200",
    bgLight: "bg-slate-100",
    border: "border-slate-300",
    text: "text-slate-700",
    glow: "rgba(203, 213, 225, 0.7)",
    barColor: "#64748B",
    description: "Grief, melancholy, heavy heart",
  },
  gratitude: {
    label: "Gratitude",
    emoji: "🌷",
    bg: "bg-pastel-rose",
    bgLight: "bg-pastel-rose-light",
    border: "border-pastel-rose-border",
    text: "text-rose-800",
    glow: "rgba(252, 225, 232, 0.7)",
    barColor: "#D81B60",
    description: "Appreciation, warmth, love",
  },
  fatigue: {
    label: "Fatigue",
    emoji: "☕",
    bg: "bg-amber-100",
    bgLight: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    glow: "rgba(254, 243, 199, 0.7)",
    barColor: "#B45309",
    description: "Burnout, exhaustion, depleted energy",
  },
};

export const SEVERITY_COLORS = {
  high: {
    bg: "bg-pastel-rose-light",
    border: "border-pastel-rose-border",
    text: "text-rose-700",
    badge: "bg-rose-100 text-rose-800",
  },
  medium: {
    bg: "bg-pastel-peach-light",
    border: "border-pastel-peach-border",
    text: "text-orange-800",
    badge: "bg-orange-100 text-orange-800",
  },
  low: {
    bg: "bg-pastel-blue-light",
    border: "border-pastel-blue-border",
    text: "text-sky-800",
    badge: "bg-sky-100 text-sky-800",
  },
};

export function getEmotionMeta(emotionKey) {
  if (!emotionKey) return EMOTIONS.calm;
  const key = emotionKey.toLowerCase();
  return EMOTIONS[key] || EMOTIONS.calm;
}
