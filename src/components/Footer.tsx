import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface FooterProps {
  onSelectTab?: (tab: 'articles' | 'timeline') => void;
  onOpenManifesto?: () => void;
  onOpenSubmit?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenManifesto,
  onOpenSubmit,
}) => {
  const navigate = useNavigate();
  const app = useApp();

  const handleGoArticles = () => {
    app.setShowSavedOnly(false);
    if (onSelectTab) onSelectTab('articles');
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoTimeline = () => {
    app.setShowSavedOnly(false);
    if (onSelectTab) onSelectTab('timeline');
    navigate('/timeline');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenManifesto = () => {
    if (onOpenManifesto) onOpenManifesto();
    else app.setIsManifestoOpen(true);
  };

  const handleOpenSubmit = () => {
    if (onOpenSubmit) onOpenSubmit();
    else app.setIsSubmitOpen(true);
  };

  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 py-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          
          {/* Brand & Editorial Column */}
          <div className="md:col-span-6 space-y-3">
            <button
              onClick={handleGoArticles}
              className="font-display font-extrabold text-lg tracking-wider text-zinc-100 hover:text-amber-400 transition-colors uppercase text-left"
            >
              SUBCULTURE // REC
            </button>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              An independent archive and music publication documenting the artistic autonomy, sonic inventions, and cultural hegemony of modern underground rap.
            </p>
            <div className="text-[11px] font-mono text-zinc-500 pt-2">
              Vol. IV · Archival Monograph · Published Bi-Weekly
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-2 text-xs font-mono">
            <div className="text-zinc-200 font-bold uppercase tracking-wider mb-2 font-display">
              Curatorial Index
            </div>
            <div>
              <button 
                onClick={handleGoArticles}
                className="hover:text-amber-400 transition-colors text-left"
              >
                All 10 Research Dispatches
              </button>
            </div>
            <div>
              <button 
                onClick={handleGoTimeline}
                className="hover:text-amber-400 transition-colors text-left"
              >
                Underground Evolution Timeline
              </button>
            </div>
            <div>
              <button 
                onClick={handleOpenManifesto}
                className="hover:text-amber-400 transition-colors text-left"
              >
                Editorial Manifesto
              </button>
            </div>
          </div>

          {/* Dispatches & Tips */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <div className="text-zinc-200 font-bold uppercase tracking-wider mb-2 font-display">
              Field Submissions
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Submissions audited continuously by independent music journalists.
            </p>
            <button
              onClick={handleOpenSubmit}
              className="mt-2 inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-mono transition-colors font-medium"
            >
              <span>Send Field Dispatch Tip →</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 gap-4">
          <div>
            © {new Date().getFullYear()} SUBCULTURE SOUND ARCHIVE. All commentary and curatorial essays independently produced.
          </div>
          <div className="flex items-center gap-4">
            <span>UNCOMPROMISED ARTISTIC SOVEREIGNTY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
