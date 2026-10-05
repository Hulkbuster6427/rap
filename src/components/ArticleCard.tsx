import React from 'react';
import { BlogArticle } from '../types/blog';
import { Bookmark, Clock, ArrowUpRight } from 'lucide-react';

interface ArticleCardProps {
  article: BlogArticle;
  onSelect: (article: BlogArticle) => void;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  index: number;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onSelect,
  isSaved,
  onToggleSave,
  index,
}) => {
  return (
    <article 
      onClick={() => onSelect(article)}
      className="group cursor-pointer flex flex-col justify-between p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/90 transition-all duration-200"
    >
      <div>
        {/* Stylized Visual Card Art (SVG Graphic Texture) */}
        <div className="relative w-full h-44 mb-5 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800/80 flex items-center justify-center">
          {/* Ambient colored lighting gradient */}
          <div 
            className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
            style={{
              background: `radial-gradient(circle at 75% 20%, ${article.coverAccent}, transparent 65%)`
            }}
          />

          {/* Bespoke Geometric Motif per Article */}
          <svg className="w-full h-full p-4 text-zinc-700/40 group-hover:text-zinc-600/60 transition-colors" viewBox="0 0 300 150" fill="none">
            {index % 4 === 0 && (
              // Audio Waveform & 808 Grid
              <>
                <line x1="20" y1="75" x2="280" y2="75" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 30 75 Q 60 15, 90 75 T 150 75 T 210 75 T 270 75" stroke={article.coverAccent} strokeWidth="1.5" strokeOpacity="0.7" />
                <rect x="50" y="40" width="8" height="70" rx="2" fill="currentColor" opacity="0.3" />
                <rect x="70" y="25" width="8" height="100" rx="2" fill={article.coverAccent} opacity="0.5" />
                <rect x="90" y="55" width="8" height="40" rx="2" fill="currentColor" opacity="0.3" />
                <rect x="110" y="30" width="8" height="90" rx="2" fill="currentColor" opacity="0.4" />
                <rect x="130" y="15" width="8" height="120" rx="2" fill={article.coverAccent} opacity="0.6" />
                <rect x="150" y="45" width="8" height="60" rx="2" fill="currentColor" opacity="0.3" />
                <rect x="170" y="35" width="8" height="80" rx="2" fill="currentColor" opacity="0.4" />
                <rect x="190" y="60" width="8" height="30" rx="2" fill="currentColor" opacity="0.3" />
                <rect x="210" y="20" width="8" height="110" rx="2" fill={article.coverAccent} opacity="0.5" />
                <rect x="230" y="50" width="8" height="50" rx="2" fill="currentColor" opacity="0.3" />
                <circle cx="260" cy="30" r="16" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
              </>
            )}

            {index % 4 === 1 && (
              // Modular Synthesizer Patch Cord Geometry
              <>
                <circle cx="50" cy="50" r="12" stroke={article.coverAccent} strokeWidth="2" opacity="0.8" />
                <circle cx="50" cy="50" r="4" fill={article.coverAccent} />
                <circle cx="150" cy="110" r="12" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                <circle cx="150" cy="110" r="4" fill="currentColor" />
                <circle cx="250" cy="40" r="12" stroke={article.coverAccent} strokeWidth="2" opacity="0.8" />
                <circle cx="250" cy="40" r="4" fill={article.coverAccent} />
                <path d="M 50 50 C 70 140, 130 140, 150 110" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                <path d="M 150 110 C 180 30, 220 20, 250 40" stroke={article.coverAccent} strokeWidth="2.5" />
                <line x1="20" y1="130" x2="280" y2="130" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
              </>
            )}

            {index % 4 === 2 && (
              // Vinyl Record & Cassette Reel Geometry
              <>
                <circle cx="150" cy="75" r="60" stroke="currentColor" strokeWidth="1" />
                <circle cx="150" cy="75" r="48" stroke="currentColor" strokeWidth="0.8" strokeDasharray="4 4" />
                <circle cx="150" cy="75" r="36" stroke="currentColor" strokeWidth="0.8" />
                <circle cx="150" cy="75" r="24" stroke={article.coverAccent} strokeWidth="1.5" opacity="0.8" />
                <circle cx="150" cy="75" r="8" fill={article.coverAccent} opacity="0.9" />
                <line x1="30" y1="20" x2="110" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                <line x1="30" y1="28" x2="80" y2="28" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                <line x1="190" y1="130" x2="270" y2="130" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              </>
            )}

            {index % 4 === 3 && (
              // Syncopated Metronome Grid & Step Sequencer
              <>
                <rect x="30" y="30" width="240" height="90" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                <line x1="90" y1="30" x2="90" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                <line x1="150" y1="30" x2="150" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                <line x1="210" y1="30" x2="210" y2="120" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                <circle cx="60" cy="60" r="10" fill={article.coverAccent} opacity="0.7" />
                <circle cx="120" cy="90" r="10" fill="currentColor" opacity="0.5" />
                <circle cx="180" cy="60" r="10" fill={article.coverAccent} opacity="0.8" />
                <circle cx="240" cy="75" r="10" fill="currentColor" opacity="0.5" />
              </>
            )}
          </svg>

          {/* Corner theme watermark */}
          <div className="absolute top-3 left-3 text-[10px] font-mono tracking-widest uppercase text-zinc-400">
            {article.themeTag}
          </div>

          {/* Bookmark save toggle */}
          <button
            onClick={(e) => onToggleSave(article.id, e)}
            title={isSaved ? 'Remove from saved' : 'Save article'}
            className="absolute top-3 right-3 p-1.5 rounded-md bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors border border-zinc-800/80"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Zero-Pill Compliant Metadata: clean unboxed text with typographic separators */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2 font-mono">
          <span className="text-amber-400/90 font-medium">{article.category}</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>{article.publishedDate}</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-500" />
            {article.readTime}
          </span>
        </div>

        {/* Article Title */}
        <h3 className="font-display font-bold text-lg text-zinc-100 group-hover:text-amber-400 transition-colors leading-snug mb-2 text-balance">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed mb-4">
          {article.excerpt}
        </p>
      </div>

      {/* Footer byline & read affordance */}
      <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center font-mono text-[10px] text-zinc-300 font-semibold">
            {article.author.avatarInitials}
          </div>
          <span className="text-zinc-300 font-medium">{article.author.name}</span>
        </div>

        <span className="inline-flex items-center gap-1 text-zinc-400 group-hover:text-amber-400 font-medium transition-colors">
          <span>Read Dispatch</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};
