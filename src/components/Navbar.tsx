import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';

interface NavbarProps {
  onOpenManifesto: () => void;
  onOpenSubmit: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  activeBeatName?: string;
  savedCount: number;
  onToggleSavedOnly?: () => void;
  showingSavedOnly?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenManifesto,
  onOpenSubmit,
  isAudioPlaying,
  onToggleAudio,
  activeBeatName,
  savedCount,
  onToggleSavedOnly,
  showingSavedOnly,
}) => {
  const location = useLocation();
  const isTimeline = location.pathname === '/timeline';
  const isHome = location.pathname === '/' || location.pathname === '/articles';

  return (
    <header className="sticky top-0 z-40 bg-[#0b0c10]/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <Link 
            to="/"
            className="text-left group focus-visible:outline-none"
          >
            <span className="font-display font-extrabold text-xl tracking-wider text-zinc-100 group-hover:text-amber-400 transition-colors uppercase">
              SUBCULTURE // REC
            </span>
          </Link>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link
            to="/"
            className={`transition-colors hover:text-zinc-100 pb-0.5 ${
              isHome && !showingSavedOnly
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : ''
            }`}
          >
            Essays & Dispatches
          </Link>

          <Link
            to="/timeline"
            className={`transition-colors hover:text-zinc-100 pb-0.5 ${
              isTimeline
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : ''
            }`}
          >
            Underground Timeline
          </Link>

          <button
            onClick={onOpenManifesto}
            className="transition-colors hover:text-zinc-100"
          >
            Manifesto
          </button>

          {onToggleSavedOnly && (
            <button
              onClick={onToggleSavedOnly}
              className={`transition-colors hover:text-zinc-100 flex items-center gap-1.5 ${
                showingSavedOnly ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              <span>Saved Archive</span>
              {savedCount > 0 && (
                <span className="font-mono text-xs text-zinc-400 tabular-nums">
                  ({savedCount})
                </span>
              )}
            </button>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* Audio companion pill button */}
          <button
            onClick={onToggleAudio}
            title={isAudioPlaying ? 'Mute ambient underground synthesizer' : 'Play ambient underground beats while reading'}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2 border transition-all ${
              isAudioPlaying
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-zinc-900 border-zinc-700/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500'
            }`}
          >
            {isAudioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline truncate max-w-[110px]">
                  {activeBeatName || 'Audio Active'}
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                <span className="hidden sm:inline">Play Ambience</span>
              </>
            )}
          </button>

          {/* Submit dispatch button */}
          <button
            onClick={onOpenSubmit}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-950 bg-amber-400 hover:bg-amber-300 transition-colors whitespace-nowrap font-display uppercase tracking-wider"
          >
            Submit Tip
          </button>
        </div>

      </div>

      {/* Mobile nav bar row */}
      <div className="md:hidden flex items-center justify-around px-4 py-2 border-t border-zinc-800/60 bg-[#0b0c10] text-xs font-medium text-zinc-400">
        <Link
          to="/"
          className={`py-1 ${isHome && !showingSavedOnly ? 'text-amber-400 font-semibold' : ''}`}
        >
          Articles (10)
        </Link>
        <Link
          to="/timeline"
          className={`py-1 ${isTimeline ? 'text-amber-400 font-semibold' : ''}`}
        >
          Detailed Timeline
        </Link>
        <button
          onClick={onOpenManifesto}
          className="py-1 hover:text-zinc-200"
        >
          Manifesto
        </button>
      </div>
    </header>
  );
};
