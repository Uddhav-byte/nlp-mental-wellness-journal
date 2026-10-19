import React from 'react';
import { PenLine, BarChart3, Sparkles, BookOpen, Flame, Music, HeartHandshake } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, streak = 7, soundOpen, setSoundOpen }) {
  const tabs = [
    { id: 'dashboard', label: 'Journal & Wellness', icon: PenLine },
    { id: 'analytics', label: 'Mood Trends', icon: BarChart3 },
    { id: 'coping', label: 'Coping Studio', icon: Sparkles },
    { id: 'history', label: 'Journal History', icon: BookOpen },
  ];

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 border-b border-pastel-lavender/40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pastel-lavender via-pastel-mint to-pastel-peach flex items-center justify-center shadow-pastel-soft transition-transform hover:scale-105">
              <span className="text-2xl">🌿</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-slate-800">
                  Mind<span className="text-pastel-lavender-dark">Haven</span>
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-pastel-mint text-emerald-800 border border-pastel-mint-border">
                  NLP AI
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Empathetic Mental Wellness Journal</p>
            </div>
          </div>

          {/* Navigation Pill Switcher */}
          <nav className="hidden md:flex items-center space-x-1 p-1.5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-pastel-lavender to-pastel-blue text-slate-800 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-pastel-cream'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-pastel-lavender-dark' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Ambient Sound, Streak & Date */}
          <div className="flex items-center space-x-3">
            {/* Ambient Sound Trigger */}
            <button
              onClick={() => setSoundOpen(!soundOpen)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
                soundOpen
                  ? 'bg-pastel-mint text-emerald-800 border-pastel-mint-border shadow-sm'
                  : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-pastel-mint-light'
              }`}
              title="Calming Ambient Sounds"
            >
              <Music className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sounds</span>
            </button>

            {/* Streak Badge */}
            <div className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pastel-peach-light to-pastel-lemon-light border border-pastel-peach-border text-slate-700 text-xs font-semibold shadow-sm">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span>{streak}d Streak</span>
            </div>

            {/* Date Tag */}
            <div className="hidden lg:block text-right pl-1">
              <p className="text-xs font-medium text-slate-700">{todayStr}</p>
              <p className="text-[11px] text-slate-600">Peaceful evening</p>
            </div>
          </div>
        </div>

        {/* Mobile Submenu Navigation */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-1 px-2 text-xs font-medium ${
                  isActive ? 'text-pastel-lavender-dark font-bold' : 'text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span>{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
