import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, CloudRain, Waves, Wind, Radio, X } from 'lucide-react';

export default function AmbientSoundPlayer({ isOpen, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('rain');
  const [volume, setVolume] = useState(0.5);

  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const activeNodesRef = useRef([]);

  const tracks = [
    { id: 'rain', label: 'Gentle Rain', icon: CloudRain, color: 'bg-pastel-blue text-sky-800' },
    { id: 'waves', label: 'Ocean Waves', icon: Waves, color: 'bg-pastel-mint text-emerald-800' },
    { id: 'wind', label: 'Breeze', icon: Wind, color: 'bg-pastel-lavender text-purple-800' },
    { id: 'brown', label: 'Deep Brown Noise', icon: Radio, color: 'bg-pastel-peach text-orange-900' },
  ];

  // Initialize Web Audio Context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const stopAllAudio = () => {
    activeNodesRef.current.forEach((node) => {
      try {
        if (node.stop) node.stop();
        node.disconnect();
      } catch (e) {
        // Ignored
      }
    });
    activeNodesRef.current = [];
  };

  const startSound = (type, currentVol) => {
    stopAllAudio();
    const ctx = getAudioContext();

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(currentVol, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    if (type === 'rain' || type === 'wind') {
      // Pink-ish noise
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else {
      // Brown noise for ocean and brown noise mode
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    }

    const whiteNoiseSource = ctx.createBufferSource();
    whiteNoiseSource.buffer = noiseBuffer;
    whiteNoiseSource.loop = true;

    // Filter tuning
    const filter = ctx.createBiquadFilter();

    if (type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      whiteNoiseSource.connect(filter);
      filter.connect(masterGain);
    } else if (type === 'waves') {
      // Lowpass filter modulated by LFO to simulate rolling surf
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8s wave period
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(300, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      whiteNoiseSource.connect(filter);
      filter.connect(masterGain);
      activeNodesRef.current.push(lfo, lfoGain);
    } else if (type === 'wind') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(180, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      whiteNoiseSource.connect(filter);
      filter.connect(masterGain);
      activeNodesRef.current.push(lfo, lfoGain);
    } else {
      // Pure Brown Noise
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, ctx.currentTime);
      whiteNoiseSource.connect(filter);
      filter.connect(masterGain);
    }

    whiteNoiseSource.start();
    activeNodesRef.current.push(whiteNoiseSource, filter, masterGain);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
    } else {
      startSound(currentTrack, volume);
      setIsPlaying(true);
    }
  };

  const switchTrack = (trackId) => {
    setCurrentTrack(trackId);
    if (isPlaying) {
      startSound(trackId, volume);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 glass-card p-5 rounded-3xl shadow-pastel-card border border-white/80 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🎧</span>
          <h4 className="text-sm font-semibold text-slate-800">Mindful Soundscapes</h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 my-4">
        {tracks.map((t) => {
          const Icon = t.icon;
          const isSelected = currentTrack === t.id;
          return (
            <button
              key={t.id}
              onClick={() => switchTrack(t.id)}
              className={`flex items-center space-x-2 p-2.5 rounded-2xl text-xs font-medium border transition-all ${
                isSelected
                  ? `${t.color} border-current shadow-sm scale-102`
                  : 'bg-white/60 text-slate-600 border-slate-200 hover:bg-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={togglePlayback}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-transform active:scale-95 ${
            isPlaying
              ? 'bg-pastel-peach text-orange-900 border border-pastel-peach-border'
              : 'bg-gradient-to-r from-pastel-mint to-pastel-blue text-emerald-900 border border-pastel-mint-border'
          }`}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isPlaying ? 'Pause' : 'Play Sound'}</span>
        </button>

        <div className="flex items-center space-x-2 w-32">
          {volume === 0 ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-slate-500" />
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pastel-lavender-dark"
          />
        </div>
      </div>
    </div>
  );
}
