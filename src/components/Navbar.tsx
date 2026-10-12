import React from 'react';
import { Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: 'articles' | 'timeline';
  onSelectTab: (tab: 'articles' | 'timeline') => void;
  onOpenManifesto: () => void;
  onOpenSubmit: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  activeBeatName?: string;
  savedCount: number;
  onToggleSavedOnly?: () => void;
  showingSavedOnly?: boolean;
  selectedArticleTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenManifesto,
  onOpenSubmit,
  isAudioPlaying,
  onToggleAudio,
  activeBeatName,
  savedCount,
  onToggleSavedOnly,
  showingSavedOnly,
  selectedArticleTitle,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0c10]/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSelectTab('articles')}
            className="text-left group focus-visible:outline-none"
            title="Return to home journal archive"
          >
            <span className="font-display font-extrabold text-xl tracking-wider text-zinc-100 group-hover:text-amber-400 transition-colors uppercase">
              SUBCULTURE // REC
            </span>
          </button>

          {selectedArticleTitle && (
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-zinc-500 pl-3 border-l border-zinc-800">
              <span className="text-amber-400 font-semibold tracking-wider">DISPATCH:</span>
              <span className="text-zinc-400 max-w-xs truncate">{selectedArticleTitle}</span>
            </div>
          )}
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <button
            onClick={() => onSelectTab('articles')}
            className={`transition-colors hover:text-zinc-100 pb-0.5 ${
              currentTab === 'articles' && !showingSavedOnly
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : ''
            }`}
          >
            Essays & Dispatches
          </button>

          <button
            onClick={() => onSelectTab('timeline')}
            className={`transition-colors hover:text-zinc-100 pb-0.5 ${
              currentTab === 'timeline'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : ''
            }`}
          >
            Underground Timeline
          </button>

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
        <button
          onClick={() => onSelectTab('articles')}
          className={`py-1 ${currentTab === 'articles' && !showingSavedOnly ? 'text-amber-400 font-semibold' : ''}`}
        >
          Articles (10)
        </button>
        <button
          onClick={() => onSelectTab('timeline')}
          className={`py-1 ${currentTab === 'timeline' ? 'text-amber-400 font-semibold' : ''}`}
        >
          Detailed Timeline
        </button>
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
