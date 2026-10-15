import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ARTICLES } from '../data/articles';
import { BlogArticle } from '../types/blog';
import { HeroFeatured } from '../components/HeroFeatured';
import { ArticleCard } from '../components/ArticleCard';
import { useApp } from '../context/AppContext';
import { Search, BookOpen, BookmarkCheck, Disc } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { savedArticleIds, toggleSaveArticle, showSavedOnly, setShowSavedOnly } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: string[] = [
    'All',
    'Autonomous DIY',
    'Sonic Inventions',
    'Regional Movements',
    'Internet Collectives',
    'Abstract & Soul',
    'Cultural Aesthetics',
  ];

  // Filter and search logic
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      // Saved filter
      if (showSavedOnly && !savedArticleIds.includes(article.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && article.category !== selectedCategory) {
        return false;
      }

      // Search query
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

  const handleOpenArticle = (article: BlogArticle) => {
    navigate(`/${article.slug || article.id}`);
  };

  return (
    <div>
      {/* Hero Featured Article (shown when not filtering by search or saved) */}
      {!searchQuery && selectedCategory === 'All' && !showSavedOnly && (
        <HeroFeatured
          article={leadFeaturedArticle}
          onSelect={handleOpenArticle}
          isSaved={savedArticleIds.includes(leadFeaturedArticle.id)}
          onToggleSave={(id, e) => toggleSaveArticle(id, e)}
        />
      )}

      {/* Section Header & Search / Filter Controls */}
      <div id="dispatches" className="mb-8 space-y-4 scroll-mt-20">
        
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

        {/* Interactive Category Filter Tabs */}
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

      {/* Article Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              index={index}
              onSelect={handleOpenArticle}
              isSaved={savedArticleIds.includes(article.id)}
              onToggleSave={(id, e) => toggleSaveArticle(id, e)}
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
};
