import React, { useState } from 'react';
import { BlogArticle } from '../types/blog';
import { ArrowRight, Bookmark, Sparkles, Disc, Radio, Camera, Link, Check } from 'lucide-react';

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
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const url = `${window.location.origin}/article/${article.slug || article.id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };
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

          {/* Main Keyword & Related Topic Tags */}
          {article.mainKeyword && (
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-400/15 border border-amber-400/40 text-amber-300 font-mono text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {article.mainKeyword}
              </span>
              {article.relatedKeywords?.slice(0, 2).map((kw, i) => (
                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 font-mono text-[11px]">
                  {kw}
                </span>
              ))}
            </div>
          )}

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

            <button
              onClick={handleCopyLink}
              title="Copy unique blog link to clipboard"
              className={`px-3.5 py-2.5 rounded-lg border text-xs font-mono flex items-center gap-2 transition-all ${
                copied
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                  : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-emerald-300">Link Copied!</span>
                </>
              ) : (
                <>
                  <Link className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy Link</span>
                </>
              )}
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

        {/* Right column: Archival Artist Photographic Dossier */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Photographic Triptych of Featured Artists */}
          <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-5 overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Camera className="w-3.5 h-3.5" />
                <span>ARCHIVAL DOSSIER · FEATURED ARTISTS</span>
              </span>
              <span className="text-[11px] font-mono text-zinc-500">3 VERIFIED PORTRAITS</span>
            </div>

            {/* 3-Artist Photography Grid */}
            <div className="grid grid-cols-3 gap-2.5 my-2">
              {article.featuredArtists?.map((fa, faIdx) => (
                <div key={faIdx} className="group/art relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 aspect-[4/5] flex flex-col justify-end">
                  <img
                    src={fa.imageUrl}
                    alt={fa.name}
                    className="absolute inset-0 w-full h-full object-cover object-top sm:object-center group-hover/art:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />
                  <div className="relative p-2 z-10">
                    <div className="text-[11px] font-display font-black text-zinc-100 truncate">
                      {fa.name}
                    </div>
                    <div className="text-[9px] font-mono text-amber-400/90 truncate">
                      {fa.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pull quote snapshot */}
            <blockquote className="text-xs text-zinc-300 italic border-l-2 border-amber-400/80 pl-3 mt-3">
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
