import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ARTICLES } from '../data/articles';

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
  const app = useApp();

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
          <div className="md:col-span-4 space-y-3">
            <Link
              to="/"
              onClick={() => {
                app.setShowSavedOnly(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-display font-extrabold text-lg tracking-wider text-zinc-100 hover:text-amber-400 transition-colors uppercase block"
              title="Return to Subculture Underground Rap Dispatches"
            >
              SUBCULTURE // REC
            </Link>
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
              Curatorial Navigation
            </div>
            <div>
              <Link 
                to="/"
                onClick={() => {
                  app.setShowSavedOnly(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-amber-400 transition-colors block py-0.5"
                title="Browse All 10 Underground Hip-Hop Dispatches"
              >
                Browse All 10 Underground Hip-Hop Dispatches
              </Link>
            </div>
            <div>
              <Link 
                to="/timeline"
                onClick={() => {
                  app.setShowSavedOnly(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-amber-400 transition-colors block py-0.5"
                title="Explore Underground Rap Evolution Timeline 2008–2026"
              >
                Explore Underground Rap Timeline 2008–2026
              </Link>
            </div>
            <div>
              <button 
                onClick={handleOpenManifesto}
                className="hover:text-amber-400 transition-colors text-left py-0.5 block"
              >
                Read Subculture Editorial Manifesto
              </button>
            </div>
          </div>

          {/* Field Submissions */}
          <div className="md:col-span-5 space-y-2 text-xs">
            <div className="text-zinc-200 font-bold uppercase tracking-wider mb-2 font-display">
              Field Submissions & Audio Audits
            </div>
            <p className="text-zinc-400 leading-relaxed max-w-sm">
              Independent underground tapes, leaked stems, and archival recordings audited continuously by independent music journalists.
            </p>
            <button
              onClick={handleOpenSubmit}
              className="mt-2 inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-mono transition-colors font-medium"
            >
              <span>Submit Underground Field Dispatch Tip →</span>
            </button>
          </div>

        </div>

        {/* Complete Curatorial Dispatches Directory with Strong Anchor Text */}
        <div className="mt-10 pt-8 border-t border-zinc-900">
          <div className="text-xs font-mono text-zinc-300 uppercase tracking-wider mb-4 font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Complete Internal Dispatches Index · Direct Curatorial Links</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
            {ARTICLES.map((article) => (
              <div key={article.id} className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700 transition-all">
                <span className="text-[10px] text-zinc-500 uppercase block mb-1">
                  {article.category}
                </span>
                <Link
                  to={`/${article.slug || article.id}`}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-zinc-300 hover:text-amber-400 font-medium transition-colors line-clamp-2 leading-snug"
                  title={`Read ${article.title}`}
                >
                  Read {article.mainKeyword || article.title}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 gap-4">
          <div>
            © {new Date().getFullYear()} SUBCULTURE SOUND ARCHIVE · <span className="text-zinc-400">undergroundrap.vercel.app</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-amber-400/80">undergroundrap.vercel.app</span>
            <span className="hidden sm:inline text-zinc-700">|</span>
            <span>UNCOMPROMISED ARTISTIC SOVEREIGNTY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
