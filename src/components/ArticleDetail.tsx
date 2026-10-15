import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlogArticle, ArticleComment } from '../types/blog';
import { SectionArtistPhoto } from './SectionArtistPhoto';
import { 
  ArrowLeft, Bookmark, Volume2, Clock, Calendar, 
  MessageSquare, ThumbsUp, Send, Check, Music2, Disc3, 
  ChevronRight, Sparkles, Camera, Link as LinkIcon, Copy, ExternalLink, Tag, BookOpen, HelpCircle
} from 'lucide-react';

interface ArticleDetailProps {
  article: BlogArticle;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onPlayCompanion: (beatId?: string) => void;
  allArticles: BlogArticle[];
  onSelectArticle: (article: BlogArticle) => void;
}

function highlightKeywords(text: string, keywords: string[]): React.ReactNode {
  if (!text || !keywords || keywords.length === 0) return text;

  const validKeywords = keywords
    .map((k) => k?.trim())
    .filter((k): k is string => Boolean(k))
    .sort((a, b) => b.length - a.length);

  if (validKeywords.length === 0) return text;

  const escaped = validKeywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');

  const parts = text.split(regex);
  return parts.map((part, index) => {
    const isMatch = validKeywords.some((kw) => kw.toLowerCase() === part.toLowerCase());
    if (isMatch) {
      return (
        <mark
          key={index}
          className="bg-amber-400/20 text-amber-300 font-semibold px-1.5 py-0.5 rounded border border-amber-400/40 not-italic shadow-[0_0_10px_rgba(251,191,36,0.15)] mx-0.5 inline-block"
        >
          {part}
        </mark>
      );
    }
    return part;
  });
}

function renderParagraphContent(text: string, keywords: string[]): React.ReactNode {
  if (!text) return null;

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      elements.push(highlightKeywords(beforeText, keywords));
    }

    const label = match[1];
    const href = match[2];
    const isExternal = href.startsWith('http://') || href.startsWith('https://');

    if (isExternal) {
      elements.push(
        <a
          key={`outbound-link-${match.index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 font-semibold underline underline-offset-2 decoration-amber-400/60 hover:text-amber-300 transition-colors inline-flex items-baseline gap-1"
          title={`${label} (opens external trusted source)`}
        >
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 inline-block shrink-0 text-amber-400/80 translate-y-0.5" />
        </a>
      );
    } else {
      elements.push(
        <Link
          key={`link-${match.index}`}
          to={href}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-amber-400 font-semibold underline underline-offset-2 decoration-amber-400/60 hover:text-amber-300 transition-colors"
          title={label}
        >
          {label}
        </Link>
      );
    }

    lastIndex = linkRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    const afterText = text.substring(lastIndex);
    elements.push(highlightKeywords(afterText, keywords));
  }

  return elements.length > 0 ? elements : highlightKeywords(text, keywords);
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  onBack,
  isSaved,
  onToggleSave,
  onPlayCompanion,
  allArticles,
  onSelectArticle,
}) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [fontSizeMode, setFontSizeMode] = useState<'normal' | 'large'>('normal');
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  
  // Comments state persisted in localStorage
  const storageKey = `comments_${article.id}`;
  const [comments, setComments] = useState<ArticleComment[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Seeded authentic comments
    return [
      {
        id: 'c1',
        author: 'Marcus Cole',
        handle: '@mcole_wav',
        timestamp: '2 hours ago',
        content: 'This breakdown hits the nail on the head. Major labels spent a decade acting like A&R was still about artist development, when in reality the underground was doing all the R&D on zero budget.',
        likes: 14,
      },
      {
        id: 'c2',
        author: 'Elena Rostova',
        handle: '@elena_synth',
        timestamp: 'Yesterday',
        content: 'The section on cracked VSTs and Purity presets is pure history. People forget how much sonic innovation came from kids refusing to use standard 4/4 quantization.',
        likes: 9,
      },
    ];
  });

  const [newCommentText, setNewCommentText] = useState<string>('');
  const [newCommentName, setNewCommentName] = useState<string>('');

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save comments to localStorage
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: ArticleComment = {
      id: Date.now().toString(),
      author: newCommentName.trim() || 'Subculture Reader',
      handle: `@${(newCommentName.trim() || 'reader').toLowerCase().replace(/\s+/g, '')}`,
      timestamp: 'Just now',
      content: newCommentText.trim(),
      likes: 0,
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    setNewCommentText('');
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleLikeComment = (commentId: string) => {
    const updated = comments.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
    setComments(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const articleUrl = typeof window !== 'undefined' 
    ? `${(window.location.hostname.includes('vercel.app') || window.location.hostname === 'localhost') ? window.location.origin : 'https://underground-rap.vercel.app'}/${article.slug || article.id}` 
    : `https://underground-rap.vercel.app/${article.slug || article.id}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(articleUrl);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      }
    } catch {
      // ignore
    }
  };

  // Find next article
  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const nextArticle = allArticles[(currentIndex + 1) % allArticles.length];

  return (
    <div className="relative pb-24">
      {/* Sticky Reading Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-zinc-800/40 z-30">
        <div 
          className="h-full bg-amber-400 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Utility & Return Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-b border-zinc-800/80 mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-amber-400 transition-colors group"
          title="Browse All 10 Underground Hip-Hop Dispatches"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Browse All 10 Underground Hip-Hop Dispatches</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio companion trigger tailored to article */}
          <button
            onClick={() => onPlayCompanion()}
            className="px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Listen Along</span>
          </button>

          {/* Font size toggle */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs font-mono text-zinc-400">
            <button
              onClick={() => setFontSizeMode('normal')}
              className={`px-2 py-1 rounded ${fontSizeMode === 'normal' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'hover:text-zinc-200'}`}
              title="Standard font size"
            >
              A
            </button>
            <button
              onClick={() => setFontSizeMode('large')}
              className={`px-2 py-1 rounded text-sm ${fontSizeMode === 'large' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'hover:text-zinc-200'}`}
              title="Large comfortable font size"
            >
              A+
            </button>
          </div>

          {/* Bookmark */}
          <button
            onClick={() => onToggleSave(article.id)}
            title={isSaved ? 'Remove from saved' : 'Save article'}
            className="p-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>

          {/* Copy Unique Blog Link Button with explicit feedback */}
          <button
            onClick={handleCopyLink}
            title="Copy unique blog link for sharing"
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
              copiedShare
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-amber-400'
            }`}
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-emerald-300">Link Copied!</span>
              </>
            ) : (
              <>
                <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Article Header (Editorial Typography) */}
      <header className="max-w-4xl mx-auto mb-12">
        {/* Zero-Pill Unboxed Text Metadata */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-4">
          <span className="text-amber-400 font-semibold uppercase">{article.category}</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>{article.publishedDate}</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            {article.readTime}
          </span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>{article.themeTag}</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-zinc-100 tracking-tight leading-[1.1] mb-6 text-balance">
          {article.title}
        </h1>

        <p className="font-editorial-serif italic text-lg sm:text-xl text-zinc-300 leading-relaxed mb-8">
          {article.subtitle}
        </p>

        {/* Byline row */}
        <div className="flex items-center justify-between py-4 border-y border-zinc-800/80 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-amber-400">
              {article.author.avatarInitials}
            </div>
            <div>
              <div className="font-semibold text-zinc-200">{article.author.name}</div>
              <div className="text-xs text-zinc-400">{article.author.role}</div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span>CURATORIAL ARCHIVE</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Curated Editorial Keyword & Topic Index Bar */}
        {(article.mainKeyword || (article.relatedKeywords && article.relatedKeywords.length > 0)) && (
          <div className="mt-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5 pb-2 border-b border-zinc-800/60">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-zinc-300">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Curatorial Topic Index · Key Search Terms</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400/80 uppercase">
                {1 + (article.relatedKeywords?.length || 0)} Monitored Keywords
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {article.mainKeyword && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">Main Keyword:</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400/15 border border-amber-400/40 text-amber-300 font-semibold font-mono text-xs shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    {article.mainKeyword}
                  </span>
                </div>
              )}

              {article.relatedKeywords && article.relatedKeywords.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap sm:ml-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Related Keywords:</span>
                  {article.relatedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-800/90 border border-zinc-700/80 text-zinc-200 font-mono text-xs hover:border-zinc-500 transition-colors"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </header>

      {/* Asymmetric Reading Grid: 70% Prose Narrative / 30% Curatorial Rail */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Reading Column */}
        <main className="lg:col-span-8">
          <div 
            className={`prose prose-invert max-w-none text-zinc-300 leading-[1.8] ${
              fontSizeMode === 'large' ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
            }`}
          >
            {/* Opening Lead Paragraph with Drop Cap & Highlighted Keywords */}
            <p className="first-letter:text-5xl first-letter:font-editorial-serif first-letter:font-bold first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:mt-1 font-editorial-serif text-lg sm:text-xl text-zinc-200 leading-relaxed mb-8">
              {renderParagraphContent(article.excerpt, [article.mainKeyword, ...(article.relatedKeywords || [])])}
            </p>

            {/* Content Sections with Artist Photos placed beside / at end of each section */}
            {article.contentSections.map((section, idx) => (
              <div key={idx} className="mb-12">
                {section.heading && (
                  <div className="mt-10 mb-4 pb-2 border-b border-zinc-800/60">
                    {section.heading.trim().endsWith('?') && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-amber-400 font-semibold mb-1 uppercase tracking-wider">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>AEO Direct Answer Topic</span>
                      </div>
                    )}
                    <h2 className="font-display font-bold text-2xl text-zinc-100 tracking-tight">
                      {section.heading}
                    </h2>
                  </div>
                )}

                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="mb-5 text-zinc-300 font-sans font-normal leading-[1.85]">
                    {renderParagraphContent(
                      p,
                      idx === 0 && pIdx === 0 ? [article.mainKeyword, ...(article.relatedKeywords || [])] : []
                    )}
                  </p>
                ))}

                {/* Section-Specific Artist Photo & Spotify Profile */}
                {section.artistProfile && (
                  <SectionArtistPhoto artist={section.artistProfile} />
                )}

                {/* Callout block */}
                {section.callout && (
                  <aside className="my-8 p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 text-zinc-200">
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{section.callout.title}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-300 font-sans">
                      {section.callout.text}
                    </p>
                  </aside>
                )}
              </div>
            ))}

            {/* Editorial Pull Quote */}
            <figure className="my-12 py-8 px-6 border-y border-zinc-800 text-center">
              <blockquote className="font-editorial-serif italic text-2xl sm:text-3xl text-zinc-100 leading-snug mb-3">
                "{article.pullQuote}"
              </blockquote>
              <figcaption className="text-xs font-mono text-amber-400/90 uppercase tracking-widest">
                — {article.pullQuoteAuthor}
              </figcaption>
            </figure>
          </div>

          {/* Interactive Comments & Community Discourse */}
          <section className="mt-16 pt-10 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-bold text-xl text-zinc-100">
                  Reader Notes & Discourse ({comments.length})
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                Independent Field Notes
              </span>
            </div>

            {/* Comment submission form */}
            <form onSubmit={handleAddComment} className="mb-8 p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Your Name or Moniker (e.g. CrateDigger99)"
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  className="w-full sm:w-72 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div className="mb-3">
                <textarea
                  rows={3}
                  placeholder="Contribute your perspective on this subcultural shift or artist movement..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 text-sm focus:border-amber-400 focus:outline-none leading-relaxed"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-zinc-950 font-display font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Dispatch Note</span>
                </button>
              </div>
            </form>

            {/* Comments list */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-zinc-200">{comment.author}</span>
                      <span className="font-mono text-zinc-500">{comment.handle}</span>
                      <span className="text-zinc-600">·</span>
                      <span className="text-zinc-500">{comment.timestamp}</span>
                    </div>

                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="font-mono tabular-nums">{comment.likes}</span>
                    </button>
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Next Article Read Affordance */}
          <div className="mt-12 p-6 rounded-xl border border-zinc-800/80 bg-zinc-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
                Next In Curatorial Archive
              </div>
              <Link
                to={`/${nextArticle.slug || nextArticle.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="font-display font-bold text-lg text-zinc-100 hover:text-amber-400 transition-colors block"
                title={`Read ${nextArticle.title}`}
              >
                {nextArticle.title}
              </Link>
            </div>

            <Link
              to={`/${nextArticle.slug || nextArticle.id}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-display uppercase tracking-wider font-bold flex items-center gap-2 transition-all shadow-md shrink-0"
              title={`Read ${nextArticle.title}`}
            >
              <span>Read {nextArticle.mainKeyword || nextArticle.title} dispatch</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Related Curatorial Dispatches with Strong Anchor Text */}
          <section aria-label="Related Underground Dispatches" className="mt-12 pt-8 border-t border-zinc-800/80">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-2 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Related Curatorial Dispatches</span>
            </div>
            <h3 className="font-display font-bold text-xl text-zinc-100 mb-5">
              Explore Connected Sound Movements & Blueprints
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allArticles
                .filter((a) => a.id !== article.id && a.id !== nextArticle.id)
                .slice(0, 2)
                .map((relArt) => (
                  <div key={relArt.id} className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-900/50 hover:border-amber-400/50 transition-all flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
                        {relArt.category} · {relArt.themeTag}
                      </span>
                      <h4 className="font-display font-bold text-base text-zinc-200 mb-2">
                        <Link 
                          to={`/${relArt.slug || relArt.id}`}
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          className="hover:text-amber-400 transition-colors"
                          title={`Read ${relArt.title}`}
                        >
                          {relArt.title}
                        </Link>
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {relArt.excerpt}
                      </p>
                    </div>
                    <Link
                      to={`/${relArt.slug || relArt.id}`}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 font-mono"
                      title={`Explore ${relArt.title}`}
                    >
                      <span>Explore {relArt.mainKeyword || relArt.title} dispatch</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
            </div>
          </section>

          {/* Fan FAQ Quick Reference Banner */}
          {article.faqs && article.faqs.length > 0 && (
            <div className="mt-10 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-zinc-100">
                    Frequently Asked Questions · Favorite Movement Rappers
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Direct AEO answers covering {article.keyArtists.slice(0, 3).join(', ')} are detailed on the right-hand curatorial rail.
                  </p>
                </div>
              </div>
              <a 
                href="#fan-faqs"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-amber-400/30 text-xs font-mono text-amber-400 hover:text-amber-300 font-bold transition-colors shrink-0"
                title="Jump to Favorite Rappers FAQ on the right rail"
              >
                <span>Read Direct Answers</span>
                <span>↓</span>
              </a>
            </div>
          )}
        </main>

        {/* Right Margin Rail: Curatorial Breakdown */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Key Movement Figures */}
          <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <h4 className="font-display font-bold text-sm text-zinc-200 uppercase tracking-wider mb-4 pb-2 border-b border-zinc-800 flex items-center justify-between">
              <span>Key Movement Figures</span>
              <span className="text-xs font-mono text-zinc-500 tabular-nums">01</span>
            </h4>
            <div className="space-y-2">
              {article.keyArtists.map((artist, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span className="font-medium text-zinc-200">{artist}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Producers & Sonic Architects */}
          <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <h4 className="font-display font-bold text-sm text-zinc-200 uppercase tracking-wider mb-4 pb-2 border-b border-zinc-800 flex items-center justify-between">
              <span>Producers & Sound Designers</span>
              <span className="text-xs font-mono text-zinc-500 tabular-nums">02</span>
            </h4>
            <div className="space-y-2">
              {article.keyProducers.map((prod, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span className="font-medium text-zinc-200">{prod}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Essential Track Archetypes */}
          <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <h4 className="font-display font-bold text-sm text-zinc-200 uppercase tracking-wider mb-4 pb-2 border-b border-zinc-800 flex items-center justify-between">
              <span>Essential Sound Documents</span>
              <span className="text-xs font-mono text-zinc-500 tabular-nums">03</span>
            </h4>
            <div className="space-y-4">
              {article.curatedTracks.map((track, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-zinc-200">
                      "{track.title}"
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 tabular-nums">
                      {track.year}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 mb-2">
                    {track.artist}
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed">
                    {track.significance}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quantitative Impact Box */}
          <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <h4 className="font-display font-bold text-sm text-zinc-200 uppercase tracking-wider mb-4 pb-2 border-b border-zinc-800 flex items-center justify-between">
              <span>Subcultural Metrics</span>
              <span className="text-xs font-mono text-zinc-500 tabular-nums">04</span>
            </h4>
            <div className="space-y-3">
              {article.statsOrImpact.map((item, idx) => (
                <div key={idx} className="border-b border-zinc-800/60 pb-2.5 last:border-b-0 last:pb-0">
                  <div className="font-mono text-sm font-bold text-amber-400 tabular-nums">
                    {item.metric}
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Movement Directory with Strong Anchor Text */}
          <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <h4 className="font-display font-bold text-sm text-zinc-200 uppercase tracking-wider mb-4 pb-2 border-b border-zinc-800 flex items-center justify-between">
              <span>Underground Archive Index</span>
              <span className="text-xs font-mono text-zinc-500 tabular-nums">05</span>
            </h4>
            <div className="space-y-2.5">
              {allArticles.map((item) => {
                const isCurrent = item.id === article.id;
                return (
                  <div key={item.id} className="text-xs font-mono">
                    {isCurrent ? (
                      <span className="text-amber-400 font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span className="line-clamp-1">Current: {item.mainKeyword}</span>
                      </span>
                    ) : (
                      <Link
                        to={`/${item.slug || item.id}`}
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 group"
                        title={`Read ${item.title}`}
                      >
                        <span className="w-1 h-1 rounded-full bg-zinc-600 group-hover:bg-amber-400 transition-colors" />
                        <span className="line-clamp-1">See {item.mainKeyword} dispatch</span>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 06. Fan FAQs: Favorite Rappers Q&A (AEO Answer Engine Optimized) */}
          {article.faqs && article.faqs.length > 0 && (
            <section 
              id="fan-faqs"
              aria-label="Frequently Asked Questions About Featured Underground Rappers" 
              className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900/95 via-zinc-900/70 to-zinc-950 border border-amber-500/40 shadow-[0_4px_30px_rgba(245,158,11,0.08)] scroll-mt-24"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold mb-1">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>AEO Direct Answers</span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-zinc-100 uppercase tracking-wider">
                    Favorite Rappers FAQ
                  </h4>
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded tabular-nums">
                  06
                </span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Direct answers to what fans and crate-diggers ask most about their favorite artists in this movement.
              </p>

              <div className="space-y-4">
                {article.faqs.map((faq, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/80 hover:border-amber-400/40 transition-colors"
                  >
                    {faq.featuredArtist && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-mono text-amber-400 font-bold mb-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>{faq.featuredArtist}</span>
                      </div>
                    )}
                    <h5 className="font-display font-bold text-xs sm:text-sm text-zinc-100 leading-snug mb-2.5">
                      {faq.question}
                    </h5>
                    <div className="p-3 rounded-lg bg-zinc-900/80 border-l-2 border-amber-400">
                      <span className="text-[9px] font-mono text-amber-400/90 uppercase tracking-widest block font-bold mb-1">
                        Direct Answer
                      </span>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </aside>

      </div>
    </div>
  );
};
