import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BlogArticle } from '../types/blog';
import { Bookmark, Clock, ArrowUpRight, Camera, ExternalLink } from 'lucide-react';

interface ArticleCardProps {
  article: BlogArticle;
  onSelect?: (article: BlogArticle) => void;
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
  const navigate = useNavigate();
  const leadArtist = article.featuredArtists?.[0];
  const otherArtists = article.featuredArtists?.slice(1) || [];

  const handleCardClick = (e: React.MouseEvent) => {
    // If click was on a button or link, let it handle its own action
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    if (onSelect) {
      onSelect(article);
    } else {
      navigate(`/article/${article.id}`);
    }
  };

  return (
    <article 
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col justify-between p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/90 transition-all duration-200"
    >
      <div>
        {/* Actual Artist Photography Card Header */}
        <div className="relative w-full h-48 mb-5 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800/80 flex items-center justify-center">
          {leadArtist?.imageUrl ? (
            <img
              src={leadArtist.imageUrl}
              alt={leadArtist.name}
              className="w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle at 75% 20%, ${article.coverAccent}, transparent 65%)`
              }}
            />
          )}

          {/* Vignette Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

          {/* Corner theme watermark */}
          <div className="absolute top-3 left-3 text-[10px] font-mono tracking-widest uppercase text-zinc-300 bg-black/60 px-2 py-0.5 rounded border border-zinc-800/60">
            {article.themeTag}
          </div>

          {/* Featured Artists Badge & Lead Artist Name */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/80 border border-zinc-800 text-[10px] font-mono text-zinc-300 mb-1 w-fit">
                <Camera className="w-3 h-3 text-amber-400" />
                <span>{article.featuredArtists.length} Artist Portraits</span>
              </div>
              {leadArtist && (
                <div className="text-xs font-display font-bold text-zinc-100 drop-shadow">
                  {leadArtist.name}
                </div>
              )}
            </div>

            {/* Other Artist Avatars */}
            {otherArtists.length > 0 && (
              <div className="flex items-center -space-x-2 shrink-0">
                {otherArtists.map((oa, oIdx) => (
                  <img
                    key={oIdx}
                    src={oa.imageUrl}
                    alt={oa.name}
                    title={oa.name}
                    className="w-7 h-7 rounded-full object-cover border-2 border-zinc-950 shadow-md"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Top-right actions: Open in new tab + Bookmark save toggle */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <a
              href={`/article/${article.id}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Open dispatch in new browser page / tab"
              className="p-1.5 rounded-md bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors border border-zinc-800/80 flex items-center justify-center"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={(e) => onToggleSave(article.id, e)}
              title={isSaved ? 'Remove from saved' : 'Save article'}
              className="p-1.5 rounded-md bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 transition-colors border border-zinc-800/80"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Zero-Pill Compliant Metadata */}
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
          <Link to={`/article/${article.id}`} className="hover:underline">
            {article.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed mb-3">
          {article.excerpt}
        </p>

        {/* Key artists highlighted */}
        <div className="text-[11px] font-mono text-zinc-500 mb-3 truncate">
          <span className="text-zinc-400 font-semibold">Featured:</span> {article.keyArtists.slice(0, 4).join(', ')}
        </div>
      </div>

      {/* Footer byline & read affordances */}
      <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center font-mono text-[10px] text-zinc-300 font-semibold">
            {article.author.avatarInitials}
          </div>
          <span className="text-zinc-300 font-medium">{article.author.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/article/${article.id}`}
            className="inline-flex items-center gap-1 text-zinc-400 group-hover:text-amber-400 font-medium transition-colors"
          >
            <span>Read Dispatch</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href={`/article/${article.id}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Open dispatch in new page"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-zinc-500 hover:text-amber-400 transition-colors"
          >
            <span>New Page</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
};
