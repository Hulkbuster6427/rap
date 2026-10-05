import React, { useState, useEffect } from 'react';
import { AMBIENT_BEATS, audioSynthEngine } from '../utils/audioSynth';
import { Play, Square, Volume2, Disc, Sliders, ChevronDown, ChevronUp } from 'lucide-react';

interface AudioCompanionPlayerProps {
  isAudioPlaying: boolean;
  activeBeatId: string;
  onTrackSelect: (trackId: string) => void;
  onTogglePlay: () => void;
}

export const AudioCompanionPlayer: React.FC<AudioCompanionPlayerProps> = ({
  isAudioPlaying,
  activeBeatId,
  onTrackSelect,
  onTogglePlay,
}) => {
  const [volume, setVolume] = useState<number>(0.4);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [waveformData, setWaveformData] = useState<number[]>([10, 15, 25, 40, 20, 35, 50, 30, 20, 15]);

  const activeBeat = AMBIENT_BEATS.find((b) => b.id === activeBeatId) || AMBIENT_BEATS[0];

  useEffect(() => {
    let animId: number;
    const updateVisualizer = () => {
      if (isAudioPlaying) {
        const raw = audioSynthEngine.getAnalyserData();
        const sampled: number[] = [];
        for (let i = 0; i < 16; i++) {
          const val = raw[i * 2] || 0;
          sampled.push(Math.max(6, Math.min(100, Math.round((val / 255) * 100))));
        }
        setWaveformData(sampled);
      } else {
        setWaveformData(new Array(16).fill(6));
      }
      animId = requestAnimationFrame(updateVisualizer);
    };

    animId = requestAnimationFrame(updateVisualizer);
    return () => cancelAnimationFrame(animId);
  }, [isAudioPlaying]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioSynthEngine.setVolume(val);
  };

  return (
    <div className="border-b border-zinc-800/80 bg-zinc-950/70 text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Left info & controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={onTogglePlay}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isAudioPlaying
                  ? 'bg-amber-400 text-zinc-950 shadow-[0_0_14px_rgba(245,158,11,0.4)]'
                  : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
              }`}
              title={isAudioPlaying ? 'Stop playback' : 'Play ambient underground synthesis'}
            >
              {isAudioPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-zinc-100 font-semibold text-xs tracking-tight">
                  {activeBeat.name}
                </span>
                <span className="text-zinc-500 font-mono text-[11px] hidden sm:inline">
                  [{activeBeat.subgenre} · {activeBeat.bpm} BPM]
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate max-w-xs sm:max-w-md">
                {activeBeat.description}
              </p>
            </div>
          </div>

          {/* Center real-time synthesized waveform visualizer */}
          <div className="hidden lg:flex items-center gap-1 h-5 px-3 py-1 bg-zinc-900/80 rounded border border-zinc-800">
            {waveformData.slice(0, 14).map((h, i) => (
              <span
                key={i}
                className="w-1 rounded-sm transition-all duration-75"
                style={{
                  height: `${Math.max(4, (h / 100) * 20)}px`,
                  backgroundColor: isAudioPlaying ? (i % 2 === 0 ? '#f59e0b' : '#d97706') : '#3f3f46',
                }}
              />
            ))}
          </div>

          {/* Right actions: switch track, volume, expand */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Volume slider */}
            <div className="hidden sm:flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-zinc-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-zinc-800 accent-amber-400 rounded cursor-pointer"
                title={`Volume: ${Math.round(volume * 100)}%`}
              />
            </div>

            {/* Toggle sound selection dropdown */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
            >
              <Disc className="w-3.5 h-3.5 text-amber-400" />
              <span>Crate Select</span>
              {isExpanded ? <ChevronUp className="w-3 h-3 text-zinc-500" /> : <ChevronDown className="w-3 h-3 text-zinc-500" />}
            </button>
          </div>

        </div>

        {/* Expanded selector tray */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pb-1">
            {AMBIENT_BEATS.map((beat) => {
              const isSelected = beat.id === activeBeatId;
              return (
                <button
                  key={beat.id}
                  onClick={() => {
                    onTrackSelect(beat.id);
                  }}
                  className={`p-2.5 rounded text-left transition-all border ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-200'
                      : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-semibold text-zinc-200 truncate">
                      {beat.name}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400/90 tabular-nums">
                      {beat.bpm} BPM
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    {beat.subgenre}
                  </div>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
