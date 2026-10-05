import React, { useState } from 'react';
import { SUBGENRE_MATRIX } from '../data/soundMatrix';
import { Sliders, Cpu, Activity, Music, Disc } from 'lucide-react';

interface SoundMatrixViewProps {
  onPlaySubgenreBeat?: (subgenreName: string) => void;
}

export const SoundMatrixView: React.FC<SoundMatrixViewProps> = ({ onPlaySubgenreBeat }) => {
  const [selectedGenreIndex, setSelectedGenreIndex] = useState<number>(0);
  const activeEntry = SUBGENRE_MATRIX[selectedGenreIndex];

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-3">
          <Cpu className="w-4 h-4" />
          <span>Acoustic Engineering & Subgenre Matrix</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-zinc-100 tracking-tight mb-4">
          The Sonic Architectures of the Modern Underground
        </h2>
        <p className="text-zinc-400 text-base max-w-2xl mx-auto leading-relaxed">
          Behind every cultural wave lies a distinct technological footprint—cracked VST plugins, unquantized swing tempos, and hardware saturation.
        </p>
      </div>

      {/* Interactive Subgenre Selector Tabs (Interactive filter controls allowed by constitution) */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-zinc-900/80 border border-zinc-800 rounded-xl mb-8">
        {SUBGENRE_MATRIX.map((entry, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedGenreIndex(idx)}
            className={`px-4 py-2 text-xs font-mono font-medium rounded-lg transition-all ${
              selectedGenreIndex === idx
                ? 'bg-amber-400 text-zinc-950 font-bold shadow-md'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
            }`}
          >
            {entry.genre}
          </button>
        ))}
      </div>

      {/* Active Subgenre Detailed Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
        
        {/* Left Column: Technical Overview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider">
              {activeEntry.originEra}
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="font-mono text-xs text-zinc-400">
              Epicenter: {activeEntry.culturalEpicenter}
            </span>
          </div>

          <h3 className="font-display font-black text-3xl text-zinc-100">
            {activeEntry.genre}
          </h3>

          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Target Tempo Range
                </div>
                <div className="font-mono text-lg font-bold text-zinc-100 tabular-nums">
                  {activeEntry.bpmRange}
                </div>
              </div>
            </div>

            {onPlaySubgenreBeat && (
              <button
                onClick={() => onPlaySubgenreBeat(activeEntry.genre)}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-mono text-amber-400 flex items-center gap-1.5 transition-colors"
              >
                <Music className="w-3.5 h-3.5" />
                <span>Trigger Beat Sample</span>
              </button>
            )}
          </div>

          <div>
            <h4 className="font-display font-bold text-sm text-zinc-200 uppercase tracking-wider mb-2">
              Defining Sonic Mechanics
            </h4>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
              {activeEntry.definingCharacteristics}
            </p>
          </div>

          {/* Key DAW Tools & VST Plugins */}
          <div>
            <h4 className="font-display font-bold text-sm text-zinc-200 uppercase tracking-wider mb-3">
              Signature VST Plugins & Production Hardware
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeEntry.signatureDAWPlugins.map((plugin, i) => (
                <div 
                  key={i} 
                  className="px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-1.5"
                >
                  <Cpu className="w-3 h-3 text-amber-400/80" />
                  <span>{plugin}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Key Pioneers & Lineage */}
        <div className="lg:col-span-5 space-y-6">
          {/* Flagship Artists */}
          <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800">
            <h4 className="font-display font-bold text-xs text-zinc-400 uppercase tracking-wider mb-3 pb-2 border-b border-zinc-800">
              Flagship Vocalists & Innovators
            </h4>
            <div className="space-y-2">
              {activeEntry.flagshipArtists.map((artist, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-zinc-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="font-semibold">{artist}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Essential Producers */}
          <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800">
            <h4 className="font-display font-bold text-xs text-zinc-400 uppercase tracking-wider mb-3 pb-2 border-b border-zinc-800">
              Essential Beat Architects
            </h4>
            <div className="space-y-2">
              {activeEntry.essentialProducers.map((prod, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-zinc-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span className="font-semibold">{prod}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
