import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Volume2, VolumeX, Radio, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab?: 'articles' | 'timeline';
  onSelectTab?: (tab: 'articles' | 'timeline') => void;
  onOpenManifesto?: () => void;
  onOpenSubmit?: () => void;
  isAudioPlaying?: boolean;
  onToggleAudio?: () => void;
  activeBeatName?: string;
  savedCount?: number;
  onToggleSavedOnly?: () => void;
  showingSavedOnly?: boolean;
  selectedArticleTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab: propCurrentTab,
  onSelectTab: propOnSelectTab,
  onOpenManifesto: propOnOpenManifesto,
  onOpenSubmit: propOnOpenSubmit,
  isAudioPlaying: propIsAudioPlaying,
  onToggleAudio: propOnToggleAudio,
  activeBeatName: propActiveBeatName,
  savedCount: propSavedCount,
  onToggleSavedOnly: propOnToggleSavedOnly,
  showingSavedOnly: propShowingSavedOnly,
  selectedArticleTitle,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const app = useApp();

  const isTimeline = propCurrentTab ? propCurrentTab === 'timeline' : location.pathname.startsWith('/timeline');
  const isArticles = propCurrentTab ? propCurrentTab === 'articles' : !isTimeline;
  const isAudioPlaying = propIsAudioPlaying ?? app.isAudioPlaying;
  const onToggleAudio = propOnToggleAudio ?? app.toggleAudio;
  const activeBeatName = propActiveBeatName ?? app.activeBeatName;
  const savedCount = propSavedCount ?? app.savedArticleIds.length;
  const showingSavedOnly = propShowingSavedOnly ?? app.showSavedOnly;

  const handleGoArticles = () => {
    app.setShowSavedOnly(false);
    if (propOnSelectTab) {
      propOnSelectTab('articles');
    } else {
      navigate('/');
    }
  };

  const handleGoTimeline = () => {
    app.setShowSavedOnly(false);
    if (propOnSelectTab) {
      propOnSelectTab('timeline');
    } else {
      navigate('/timeline');
    }
  };

  const handleToggleSaved = () => {
    if (propOnToggleSavedOnly) {
      propOnToggleSavedOnly();
    } else {
      app.setShowSavedOnly(!app.showSavedOnly);
      if (location.pathname !== '/') {
        navigate('/');
      }
    }
  };

  const handleOpenManifesto = propOnOpenManifesto ?? (() => app.setIsManifestoOpen(true));
  const handleOpenSubmit = propOnOpenSubmit ?? (() => app.setIsSubmitOpen(true));

  return (
    <header className="sticky top-0 z-40 bg-[#0b0c10]/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <Link 
            to="/"
            onClick={() => app.setShowSavedOnly(false)}
            className="text-left group focus-visible:outline-none"
            title="Return to Subculture Underground Rap Dispatches"
            aria-label="Subculture Underground Rap Dispatches Home"
          >
            <span className="font-display font-extrabold text-xl tracking-wider text-zinc-100 group-hover:text-amber-400 transition-colors uppercase">
              SUBCULTURE // REC
            </span>
          </Link>

          {selectedArticleTitle && (
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-zinc-500 pl-3 border-l border-zinc-800">
              <span className="text-amber-400 font-semibold tracking-wider">DISPATCH:</span>
              <span className="text-zinc-400 max-w-xs truncate">{selectedArticleTitle}</span>
            </div>
          )}
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link
            to="/"
            onClick={() => app.setShowSavedOnly(false)}
            className={`transition-colors hover:text-zinc-100 pb-0.5 ${
              isArticles && !showingSavedOnly
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : ''
            }`}
            title="Browse All 10 Underground Hip-Hop Dispatches"
          >
            All 10 Research Dispatches
          </Link>

          <Link
            to="/timeline"
            onClick={() => app.setShowSavedOnly(false)}
            className={`transition-colors hover:text-zinc-100 pb-0.5 ${
              isTimeline
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : ''
            }`}
            title="Explore Underground Rap Timeline 2008–2026"
          >
            Underground Evolution Timeline
          </Link>

          <button
            onClick={handleOpenManifesto}
            className="transition-colors hover:text-zinc-100"
          >
            Manifesto
          </button>

          <button
            onClick={handleToggleSaved}
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
        </nav>

        {/* Zone 3: Primary action + Audio controls */}
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
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Companion Synth</span>
              </>
            )}
          </button>

          {/* Submit Field Recording CTA */}
          <button
            onClick={handleOpenSubmit}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-400/60 text-zinc-200 hover:text-amber-400 text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Submit Track</span>
            <span className="sm:hidden">Submit</span>
          </button>
        </div>

      </div>
    </header>
  );
};
