import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  onOpenManifesto: () => void;
  onOpenSubmit: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenManifesto,
  onOpenSubmit,
}) => {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 py-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          
          {/* Brand & Editorial Column */}
          <div className="md:col-span-6 space-y-3">
            <span className="font-display font-extrabold text-lg tracking-wider text-zinc-100 uppercase">
              SUBCULTURE // REC
            </span>
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
              <Link 
                to="/"
                className="hover:text-amber-400 transition-colors"
              >
                All 10 Research Dispatches
              </Link>
            </div>
            <div>
              <Link 
                to="/timeline"
                className="hover:text-amber-400 transition-colors"
              >
                Underground Evolution Timeline
              </Link>
            </div>
            <div>
              <button 
                onClick={onOpenManifesto}
                className="hover:text-amber-400 transition-colors"
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
              onClick={onOpenSubmit}
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
