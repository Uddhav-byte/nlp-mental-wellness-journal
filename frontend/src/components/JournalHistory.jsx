import React, { useState, useEffect } from 'react';
import { Search, Filter, Trash2, Download, Calendar, Tag, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import { getEntries, deleteEntry } from '../utils/api';
import { EMOTIONS, getEmotionMeta, SEVERITY_COLORS } from '../utils/pastelColors';

export default function JournalHistory({ refreshSignal }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getEntries({
        search: search.trim() || undefined,
        emotion: selectedEmotion !== 'all' ? selectedEmotion : undefined,
      });
      setEntries(data);
    } catch (err) {
      console.error('Failed to fetch journal history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [search, selectedEmotion, refreshSignal]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this reflection entry?')) return;
    try {
      await deleteEntry(id);
      setEntries(entries.filter((entry) => entry.id !== id));
      if (selectedEntry && selectedEntry.id === id) {
        setSelectedEntry(null);
      }
    } catch (err) {
      console.error('Failed to delete entry:', err);
    }
  };

  const exportAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mindhaven_journal_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportAsMarkdown = () => {
    let md = `# MindHaven Personal Journal Export\nExported on: ${new Date().toLocaleDateString()}\n\n---\n\n`;
    entries.forEach((e) => {
      md += `## ${e.title}\n`;
      md += `**Date:** ${new Date(e.created_at).toLocaleString()} | **Dominant Emotion:** ${e.dominant_emotion.toUpperCase()} | **Wellness Score:** ${e.wellness_score}/100\n\n`;
      md += `${e.content}\n\n`;
      if (e.triggers && e.triggers.length > 0) {
        md += `**Detected Stress Triggers:** ${e.triggers.map((t) => t.trigger).join(', ')}\n\n`;
      }
      md += `---\n\n`;
    });

    const dataStr = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(md);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mindhaven_journal_${new Date().toISOString().split('T')[0]}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Search & Export Toolbar */}
      <div className="glass-card rounded-3xl p-6 shadow-pastel-card border border-white/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl">📖</span>
              <h2 className="text-2xl font-serif font-bold text-slate-800">Journal Timeline & Archive</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Private, local reflection records with emotional telemetry & coping recommendations.
            </p>
          </div>

          {/* Privacy Export Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={exportAsMarkdown}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              title="Export all entries as Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .MD</span>
            </button>
            <button
              onClick={exportAsJSON}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              title="Export all data as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .JSON</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entries or keywords..."
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white/80 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-pastel-lavender-dark"
            />
          </div>

          {/* Emotion Pill Filters */}
          <div className="flex items-center space-x-1 overflow-x-auto w-full pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedEmotion('all')}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedEmotion === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'bg-white/70 text-slate-600 hover:bg-white border border-slate-200'
              }`}
            >
              All States
            </button>
            {Object.entries(EMOTIONS).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setSelectedEmotion(key)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap border transition-colors ${
                  selectedEmotion === key
                    ? `${meta.bg} ${meta.text} ${meta.border} font-bold shadow-xs`
                    : 'bg-white/70 text-slate-600 border-slate-200 hover:bg-white'
                }`}
              >
                <span>{meta.emoji}</span>
                <span>{meta.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Entry Cards List */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">
          Loading your journal entries...
        </div>
      ) : entries.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-slate-500">
          <p className="text-base font-semibold text-slate-700">No reflections matched your criteria.</p>
          <p className="text-xs text-slate-400 mt-1">Try clearing filters or write a new reflection entry!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {entries.map((entry) => {
            const meta = getEmotionMeta(entry.dominant_emotion);
            const dateStr = new Date(entry.created_at).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="glass-card rounded-3xl p-5 shadow-pastel-card border border-white/90 hover:scale-101 hover:shadow-pastel-glow transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-medium text-slate-500 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                    </span>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center space-x-1 ${meta.bg} ${meta.text} border ${meta.border}`}>
                        <span>{meta.emoji}</span>
                        <span>{meta.label}</span>
                      </span>
                      <button
                        onClick={(e) => handleDelete(entry.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-800 mt-3 mb-1 line-clamp-1">
                    {entry.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {entry.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-slate-700">Wellness:</span>
                    <span className="font-bold text-slate-900">{entry.wellness_score}/100</span>
                  </div>

                  {/* Triggers indicator */}
                  {entry.triggers && entry.triggers.length > 0 ? (
                    <div className="flex items-center space-x-1 text-[11px] text-orange-700 bg-pastel-peach-light px-2 py-0.5 rounded-md border border-pastel-peach-border">
                      <span>⚡ {entry.triggers.length} trigger{entry.triggers.length > 1 ? 's' : ''}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-emerald-700 bg-pastel-mint-light px-2 py-0.5 rounded-md border border-pastel-mint-border">
                      🌿 Balanced
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Entry Detail Reader Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="glass-card w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl border border-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1.5 ${getEmotionMeta(selectedEntry.dominant_emotion).bg} ${getEmotionMeta(selectedEntry.dominant_emotion).text}`}>
                <span>{getEmotionMeta(selectedEntry.dominant_emotion).emoji}</span>
                <span>{getEmotionMeta(selectedEntry.dominant_emotion).label} State</span>
              </span>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="py-4">
              <span className="text-xs text-slate-400">
                {new Date(selectedEntry.created_at).toLocaleString()}
              </span>
              <h2 className="text-xl font-serif font-bold text-slate-800 mt-1 mb-3">
                {selectedEntry.title}
              </h2>
              <div className="p-4 rounded-2xl bg-white/60 border border-slate-200/80 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                {selectedEntry.content}
              </div>
            </div>

            {/* AI Tailored Coping Strategies */}
            {selectedEntry.coping_strategies && selectedEntry.coping_strategies.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pastel-lavender-dark" />
                  <span>Personalized Coping Recommendations:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedEntry.coping_strategies.map((strat, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-pastel-cream border border-slate-200/80 text-xs">
                      <p className="font-bold text-slate-800">{strat.title}</p>
                      <p className="text-slate-600 mt-1 line-clamp-2">{strat.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
