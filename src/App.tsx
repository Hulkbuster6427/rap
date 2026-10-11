/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useParams, useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { ARTICLES } from './data/articles';
import { BlogArticle } from './types/blog';
import { Navbar } from './components/Navbar';
import { AudioCompanionPlayer } from './components/AudioCompanionPlayer';
import { HeroFeatured } from './components/HeroFeatured';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetail } from './components/ArticleDetail';
import { TimelineView } from './components/TimelineView';
import { ManifestoModal } from './components/ManifestoModal';
import { SubmitTrackModal } from './components/SubmitTrackModal';
import { Footer } from './components/Footer';
import { audioSynthEngine, AMBIENT_BEATS } from './utils/audioSynth';
import { Search, BookOpen, BookmarkCheck, Disc, ArrowLeft, ArrowUpRight } from 'lucide-react';

/**
 * Ensures smooth scroll restoration to the top of the viewport on route changes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

/**
 * Resolves an article by slug, id, or alias.
 */
function findArticle(slugOrParam?: string): BlogArticle | null {
  if (!slugOrParam) return null;
  const clean = slugOrParam.replace(/^[\/#]+|[\/#]+$/g, '').trim().toLowerCase();
  const slugPart = clean.startsWith('blog/') ? clean.replace('blog/', '') : clean;
  return (
    ARTICLES.find(
      (a) =>
        a.slug.toLowerCase() === slugPart ||
        a.id.toLowerCase() === slugPart ||
        a.aliases?.some((alias) => alias.toLowerCase() === slugPart)
    ) || null
  );
}

interface ArchiveViewProps {
  savedArticleIds: string[];
  onToggleSave: (id: string, e?: React.MouseEvent) => void;
  showSavedOnly: boolean;
  setShowSavedOnly: (val: boolean) => void;
}

function ArchiveView({
  savedArticleIds,
  onToggleSave,
  showSavedOnly,
  setShowSavedOnly,
}: ArchiveViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    document.title = 'Subculture Dispatch | The Underground Music Archive';
  }, []);

  const categories = [
    'All',
    'Autonomous DIY',
    'Sonic Inventions',
    'Regional Movements',
    'Internet Collectives',
    'Abstract & Soul',
    'Cultural Aesthetics',
  ];

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      if (showSavedOnly && !savedArticleIds.includes(article.id)) {
        return false;
      }
      if (selectedCategory !== 'All' && article.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(q);
        const matchesSubtitle = article.subtitle.toLowerCase().includes(q);
        const matchesExcerpt = article.excerpt.toLowerCase().includes(q);
        const matchesArtist = article.keyArtists.some((a) => a.toLowerCase().includes(q));
        const matchesProducer = article.keyProducers.some((p) => p.toLowerCase().includes(q));
        const matchesTag = article.themeTag.toLowerCase().includes(q);
        return matchesTitle || matchesSubtitle || matchesExcerpt || matchesArtist || matchesProducer || matchesTag;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, showSavedOnly, savedArticleIds]);

  const leadFeaturedArticle = ARTICLES.find((a) => a.featured) || ARTICLES[0];

  return (
    <div>
      {/* Hero Featured Article (shown when not filtering by search or saved) */}
      {!searchQuery && selectedCategory === 'All' && !showSavedOnly && (
        <HeroFeatured
          article={leadFeaturedArticle}
          isSaved={savedArticleIds.includes(leadFeaturedArticle.id)}
          onToggleSave={(id, e) => onToggleSave(id, e)}
        />
      )}

      {/* Section Header & Search / Filter Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curated Journal Archive</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-zinc-100 tracking-tight">
              {showSavedOnly ? 'Your Saved Dispatches' : 'Underground Dispatches & Monographs'}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              {showSavedOnly
                ? `Viewing ${filteredArticles.length} bookmarked research essays.`
                : `10 comprehensive investigative essays detailing how renegade rappers redefined contemporary sound.`}
            </p>
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search artists, producers, themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-200 text-xs placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500 hover:text-zinc-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setShowSavedOnly(false);
                }}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800/80'
                }`}
              >
                {cat}
              </button>
            );
          })}

          {savedArticleIds.length > 0 && (
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 flex items-center gap-1.5 ml-auto ${
                showSavedOnly
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Saved ({savedArticleIds.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Article Grid (3-column layout) */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              index={index}
              isSaved={savedArticleIds.includes(article.id)}
              onToggleSave={(id, e) => onToggleSave(id, e)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-xl border border-zinc-800 bg-zinc-950/60 p-8">
          <Disc className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-zinc-200 mb-1">
            No Matching Dispatches Found
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
            Try adjusting your search terms or clearing your category filters to explore the rest of the archive.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setShowSavedOnly(false);
            }}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

function TimelinePage() {
  useEffect(() => {
    document.title = 'Underground Evolution Timeline | Subculture Dispatch';
  }, []);
  return <TimelineView />;
}

interface ArticleViewWrapperProps {
  savedArticleIds: string[];
  onToggleSave: (id: string) => void;
  onPlayCompanion: (article: BlogArticle, beatId?: string) => void;
}

function ArticleViewWrapper({
  savedArticleIds,
  onToggleSave,
  onPlayCompanion,
}: ArticleViewWrapperProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const article = useMemo(() => findArticle(slug), [slug]);

  // Synchronize document title and URL normalization
  useEffect(() => {
    if (article) {
      document.title = `${article.title} | Subculture Dispatch`;
      const canonicalPath = `/${article.slug}`;
      if (location.pathname !== canonicalPath) {
        navigate(canonicalPath, { replace: true });
      }
    } else {
      document.title = 'Dispatch Not Found | Subculture Dispatch';
    }
  }, [article, location.pathname, navigate]);

  if (!article) {
    return <NotFoundView requestedSlug={slug} />;
  }

  return (
    <ArticleDetail
      article={article}
      onBack={() => navigate('/')}
      isSaved={savedArticleIds.includes(article.id)}
      onToggleSave={onToggleSave}
      onPlayCompanion={(beatId) => onPlayCompanion(article, beatId)}
      allArticles={ARTICLES}
      onSelectArticle={(nextArticle) => navigate(`/${nextArticle.slug}`)}
    />
  );
}

function NotFoundView({ requestedSlug }: { requestedSlug?: string }) {
  return (
    <div className="py-20 text-center max-w-2xl mx-auto px-4">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6 text-amber-400 font-mono text-2xl font-bold">
        404
      </div>
      <h2 className="font-display font-black text-2xl sm:text-3xl text-zinc-100 tracking-tight mb-3">
        Dispatch Not Found in Archive
      </h2>
      <p className="text-zinc-400 text-sm leading-relaxed mb-8">
        The requested URL {requestedSlug ? <code className="text-amber-400 font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">/{requestedSlug}</code> : ''} does not match any monograph in our catalog. You can return to the primary archive or explore one of the verified dispatches below.
      </p>

      <div className="mb-10 text-left bg-zinc-950 border border-zinc-800/80 rounded-xl p-6">
        <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-4 pb-2 border-b border-zinc-800">
          All 10 Curated Archival Monograph URLs:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {ARTICLES.map((art) => (
            <Link
              key={art.slug}
              to={`/${art.slug}`}
              className="group flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-amber-400/60 hover:bg-zinc-900 transition-all text-xs"
            >
              <span className="font-medium text-zinc-300 group-hover:text-amber-400 truncate pr-2">
                {art.title}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Main Archive</span>
      </Link>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Search & Filter state
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);

  // Saved bookmark IDs in localStorage
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('subculture_saved_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Audio Engine state
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [activeBeatId, setActiveBeatId] = useState<string>('subterranean-plugg');

  // Modals state
  const [isManifestoOpen, setIsManifestoOpen] = useState<boolean>(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);

  // Sync audio engine state changes
  useEffect(() => {
    audioSynthEngine.subscribe((playing, trackId) => {
      setIsAudioPlaying(playing);
      if (trackId) setActiveBeatId(trackId);
    });
    return () => {
      audioSynthEngine.stop();
    };
  }, []);

  // Save to localStorage when bookmarks change
  useEffect(() => {
    try {
      localStorage.setItem('subculture_saved_articles', JSON.stringify(savedArticleIds));
    } catch {
      // ignore
    }
  }, [savedArticleIds]);

  const handleToggleSave = (articleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedArticleIds((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId]
    );
  };

  const handleToggleAudio = () => {
    if (isAudioPlaying) {
      audioSynthEngine.stop();
    } else {
      audioSynthEngine.play(activeBeatId);
    }
  };

  const handleTrackSelect = (trackId: string) => {
    setActiveBeatId(trackId);
    audioSynthEngine.play(trackId);
  };

  // Trigger beat matching article's subgenre
  const handlePlayCompanionForArticle = (article: BlogArticle, overrideBeatId?: string) => {
    if (overrideBeatId) {
      handleTrackSelect(overrideBeatId);
      return;
    }
    let target = 'subterranean-plugg';
    if (article.category === 'Sonic Inventions' || article.themeTag.includes('Rage')) {
      target = 'nightmare-rage-808';
    } else if (article.category === 'Abstract & Soul') {
      target = 'abstract-drumless-soul';
    } else if (article.category === 'Regional Movements') {
      target = 'motor-city-bounce';
    } else if (article.themeTag.includes('Big Bang') || article.themeTag.includes('2016')) {
      target = 'bedroom-3am-cloud';
    }

    setActiveBeatId(target);
    audioSynthEngine.play(target);
  };

  const activeBeat = AMBIENT_BEATS.find((b) => b.id === activeBeatId);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-zinc-100 selection:bg-amber-400 selection:text-black">
      <ScrollToTop />

      {/* Top Navigation Bar */}
      <Navbar
        onOpenManifesto={() => setIsManifestoOpen(true)}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        activeBeatName={activeBeat?.name}
        savedCount={savedArticleIds.length}
        showingSavedOnly={showSavedOnly}
        onToggleSavedOnly={() => {
          if (location.pathname !== '/') {
            navigate('/');
          }
          setShowSavedOnly(!showSavedOnly);
        }}
      />

      {/* Audio Companion Bar */}
      <AudioCompanionPlayer
        isAudioPlaying={isAudioPlaying}
        activeBeatId={activeBeatId}
        onTrackSelect={handleTrackSelect}
        onTogglePlay={handleToggleAudio}
      />

      {/* Main View Area with First-Class React Router Routes */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {/* Main Articles Archive */}
          <Route
            path="/"
            element={
              <ArchiveView
                savedArticleIds={savedArticleIds}
                onToggleSave={handleToggleSave}
                showSavedOnly={showSavedOnly}
                setShowSavedOnly={setShowSavedOnly}
              />
            }
          />
          <Route path="/articles" element={<Navigate to="/" replace />} />

          {/* Timeline View */}
          <Route path="/timeline" element={<TimelinePage />} />

          {/* Direct Article URLs (e.g. /len-lancey-foux-jim-legxacy) */}
          <Route
            path="/:slug"
            element={
              <ArticleViewWrapper
                savedArticleIds={savedArticleIds}
                onToggleSave={(id) => handleToggleSave(id)}
                onPlayCompanion={handlePlayCompanionForArticle}
              />
            }
          />

          {/* Backward compatibility for /blog/:slug routes */}
          <Route
            path="/blog/:slug"
            element={
              <ArticleViewWrapper
                savedArticleIds={savedArticleIds}
                onToggleSave={(id) => handleToggleSave(id)}
                onPlayCompanion={handlePlayCompanionForArticle}
              />
            }
          />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </main>

      {/* Publication Footer */}
      <Footer
        onOpenManifesto={() => setIsManifestoOpen(true)}
        onOpenSubmit={() => setIsSubmitOpen(true)}
      />

      {/* Manifesto Modal */}
      <ManifestoModal
        isOpen={isManifestoOpen}
        onClose={() => setIsManifestoOpen(false)}
      />

      {/* Submit Track Modal */}
      <SubmitTrackModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
      />
    </div>
  );
}
