import React from 'react';
import { BlogArticle } from '../types/blog';
import { ArrowRight, Bookmark, Sparkles, Disc, Radio, Camera } from 'lucide-react';

interface HeroFeaturedProps {
  article: BlogArticle;
  onSelect: (article: BlogArticle) => void;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  article,
  onSelect,
  isSaved,
  onToggleSave,
}) => {
  return (
    <section className="relative rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-[#0b0c10] p-6 sm:p-8 lg:p-10 mb-12 overflow-hidden shadow-2xl">
      {/* Background ambient lighting */}
      <div 
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: article.coverAccent }}
      />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left column: Editorial Narrative */}
        <div className="lg:col-span-7">
          {/* Zero-pill unboxed text kicker */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400 mb-3">
            <span className="text-amber-400 font-semibold tracking-wider uppercase">Lead Investigation</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{article.category}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{article.readTime}</span>
            {article.featuredArtists && article.featuredArtists.length > 0 && (
              <>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span className="flex items-center gap-1 text-zinc-300">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>{article.featuredArtists.length} Documented Artist Portraits</span>
                </span>
              </>
            )}
          </div>

          {/* Headline with text-balance */}
          <h1 
            onClick={() => onSelect(article)}
            className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-zinc-100 hover:text-amber-400 cursor-pointer transition-colors leading-[1.15] mb-4 text-balance"
          >
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed mb-6">
            {article.subtitle}
          </p>

          <p className="text-sm text-zinc-400 leading-relaxed mb-6 line-clamp-3">
            {article.excerpt}
          </p>

          {/* Key artists highlighted */}
          <div className="mb-6 pt-4 border-t border-zinc-800/80">
            <div className="text-xs font-mono text-zinc-400 mb-2 uppercase tracking-wider">
              Central Movement Figures
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-300">
              {article.keyArtists.map((artist, i) => (
                <span key={i} className="inline-flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-amber-400" />
                  <span className="font-medium">{artist}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Actions & Byline */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onSelect(article)}
              className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display font-bold text-sm tracking-wider uppercase flex items-center gap-2 transition-all shadow-lg hover:shadow-amber-400/20"
            >
              <span>Read Full Essay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => onToggleSave(article.id, e)}
              className="px-3.5 py-2.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-xs font-mono flex items-center gap-2 transition-colors"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{isSaved ? 'Saved in Archive' : 'Save for Later'}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2.5 ml-auto text-xs text-zinc-400">
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-zinc-200">
                {article.author.avatarInitials}
              </div>
              <div>
                <div className="text-zinc-200 font-medium">{article.author.name}</div>
                <div className="text-[11px] text-zinc-400">{article.author.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Graphic Artwork & Stats Showcase */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Visual Showcase Graphic */}
          <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-6 overflow-hidden flex flex-col justify-between h-72">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Disc className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span>ARCHIVAL ISSUE #01</span>
              </span>
              <span>INDEPENDENCE RATIO</span>
            </div>

            {/* Stylized vinyl and soundwave vector */}
            <div className="my-auto flex items-center justify-center py-4">
              <svg className="w-48 h-32" viewBox="0 0 200 120" fill="none">
                <circle cx="100" cy="60" r="54" stroke="#3f3f46" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="100" cy="60" r="42" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
                <circle cx="100" cy="60" r="28" stroke="#3f3f46" strokeWidth="1" />
                <circle cx="100" cy="60" r="14" fill="#f59e0b" opacity="0.8" />
                
                {/* Dynamic radial needle track */}
                <line x1="100" y1="60" x2="150" y2="25" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="150" cy="25" r="3" fill="#ffffff" />
              </svg>
            </div>

            {/* Pull quote snapshot */}
            <blockquote className="text-xs text-zinc-300 italic border-l-2 border-amber-400/80 pl-3">
              "{article.pullQuote}"
            </blockquote>
          </div>

          {/* Quantitative Impact Row */}
          <div className="grid grid-cols-3 gap-2">
            {article.statsOrImpact.map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
                <div className="font-mono text-base font-bold text-amber-400 tabular-nums">
                  {item.metric}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-tight">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
