import React, { useState, useEffect } from 'react';
import { BlogArticle, ArticleComment } from '../types/blog';
import { SectionArtistPhoto } from './SectionArtistPhoto';
import { 
  ArrowLeft, Bookmark, Share2, Volume2, Clock, Calendar, 
  MessageSquare, ThumbsUp, Send, Check, Music2, Disc3, 
  ChevronRight, Sparkles, Camera, Link, Copy, ExternalLink
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
    ? `${window.location.origin}${window.location.pathname}?blog=${article.slug}` 
    : `?blog=${article.slug}`;

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

  const handleShareNative = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.subtitle || article.excerpt,
          url: articleUrl,
        });
      } else {
        await handleCopyLink();
      }
    } catch {
      // ignore
    }
  };

  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl)}`;
  const redditShareUrl = `https://reddit.com/submit?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(article.title)}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + articleUrl)}`;

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
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-amber-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to All Dispatches</span>
        </button>

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
                <Link className="w-3.5 h-3.5 text-amber-400" />
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

        {/* Unique Individual Blog URL Permashare Bar */}
        <div className="mt-4 p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-zinc-800 text-amber-400 shrink-0 border border-zinc-700/60">
              <Link className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-0.5">
                <span className="text-zinc-300 font-semibold">Individual Dispatch URL</span>
                <span className="text-zinc-600">·</span>
                <span className="text-amber-400/90">Direct Link</span>
              </div>
              <div className="text-xs font-mono text-zinc-300 truncate selection:bg-amber-400 selection:text-black" title={articleUrl}>
                {articleUrl}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              title="Copy direct unique link to clipboard"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-sm ${
                copiedShare
                  ? 'bg-emerald-500 text-zinc-950 font-bold'
                  : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold'
              }`}
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-zinc-950" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Blog Link</span>
                </>
              )}
            </button>

            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on X / Twitter"
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
            >
              <span className="sr-only">X / Twitter</span>
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>

            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Share on WhatsApp"
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
            >
              <span className="sr-only">WhatsApp</span>
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.677.15-.2.301-.776.978-.952 1.179-.175.2-.351.226-.652.075s-1.27-.468-2.42-1.494c-.895-.798-1.5-1.783-1.676-2.084-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.928-2.234-.244-.588-.492-.508-.677-.518-.175-.009-.376-.011-.577-.011s-.526.075-.802.376c-.276.301-1.053 1.028-1.053 2.508s1.078 2.908 1.228 3.109c.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.721.229 1.377.197 1.895.12.578-.087 1.78-.727 2.03-1.43.251-.702.251-1.304.175-1.43-.075-.125-.276-.201-.577-.351zM12.04 21.75c-1.733 0-3.432-.457-4.93-1.325l-.353-.205-3.667.962.979-3.574-.225-.358a9.71 9.71 0 01-1.494-5.21C2.35 6.645 6.69 2.305 12.04 2.305c2.59 0 5.025 1.009 6.857 2.841 1.832 1.832 2.84 4.267 2.84 6.854 0 5.395-4.34 9.75-9.697 9.75z"/></svg>
            </a>

            <button
              onClick={handleShareNative}
              title="Share via device options"
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
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
            {/* Opening Lead Paragraph with Drop Cap */}
            <p className="first-letter:text-5xl first-letter:font-editorial-serif first-letter:font-bold first-letter:text-amber-400 first-letter:float-left first-letter:mr-3 first-letter:mt-1 font-editorial-serif text-lg sm:text-xl text-zinc-200 leading-relaxed mb-8">
              {article.excerpt}
            </p>

            {/* Content Sections with Artist Photos placed beside / at end of each section */}
            {article.contentSections.map((section, idx) => (
              <div key={idx} className="mb-12">
                {section.heading && (
                  <h2 className="font-display font-bold text-2xl text-zinc-100 tracking-tight mt-10 mb-4 pb-2 border-b border-zinc-800/60">
                    {section.heading}
                  </h2>
                )}

                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="mb-5 text-zinc-300 font-sans font-normal leading-[1.85]">
                    {p}
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

          {/* End of Essay Permalink & Dispatch Signal Box */}
          <div className="my-12 p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                  <Link className="w-3.5 h-3.5" />
                  <span>Individual Dispatch Permalink</span>
                </div>
                <h3 className="font-display font-bold text-lg text-zinc-100">
                  Share this specific essay
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                  Each Subculture dispatch has its own unique, permanent URL. Copy and send it to open directly to this monograph.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  onClick={handleCopyLink}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all ${
                    copiedShare
                      ? 'bg-emerald-500 text-zinc-950 font-bold shadow-lg'
                      : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold shadow-lg hover:shadow-amber-400/20'
                  }`}
                >
                  {copiedShare ? (
                    <>
                      <Check className="w-4 h-4 text-zinc-950" />
                      <span>Direct Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Direct Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-zinc-400">
              <span className="truncate max-w-md text-zinc-400">
                {articleUrl}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={twitterShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  Share on X
                </a>
                <span className="text-zinc-700">·</span>
                <a
                  href={redditShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  Reddit
                </a>
                <span className="text-zinc-700">·</span>
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
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
                Next In Archive
              </div>
              <div className="font-display font-bold text-lg text-zinc-100">
                {nextArticle.title}
              </div>
            </div>

            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onSelectArticle(nextArticle);
              }}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-display uppercase tracking-wider font-bold flex items-center gap-2 transition-colors shrink-0"
            >
              <span>Read Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
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

        </aside>

      </div>
    </div>
  );
};
