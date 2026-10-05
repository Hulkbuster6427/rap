/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ARTICLES } from './data/articles';
import { BlogArticle, Category } from './types/blog';
import { Navbar } from './components/Navbar';
import { AudioCompanionPlayer } from './components/AudioCompanionPlayer';
import { HeroFeatured } from './components/HeroFeatured';
import { ArticleCard } from './components/ArticleCard';
import { ArticleDetail } from './components/ArticleDetail';
import { TimelineView } from './components/TimelineView';
import { SoundMatrixView } from './components/SoundMatrixView';
import { ManifestoModal } from './components/ManifestoModal';
import { SubmitTrackModal } from './components/SubmitTrackModal';
import { Footer } from './components/Footer';
import { audioSynthEngine, AMBIENT_BEATS } from './utils/audioSynth';
import { Search, SlidersHorizontal, BookOpen, BookmarkCheck, Flame, Disc } from 'lucide-react';

export default function App() {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [currentTab, setCurrentTab] = useState<'articles' | 'timeline' | 'sound-matrix'>('articles');
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
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
  const handlePlayCompanionForArticle = (overrideBeatId?: string) => {
    if (overrideBeatId) {
      handleTrackSelect(overrideBeatId);
      return;
    }
    if (!selectedArticle) {
      handleToggleAudio();
      return;
    }

    // Match appropriate synth pattern
    let target = 'subterranean-plugg';
    if (selectedArticle.category === 'Sonic Inventions' || selectedArticle.themeTag.includes('Rage')) {
      target = 'nightmare-rage-808';
    } else if (selectedArticle.category === 'Abstract & Soul') {
      target = 'abstract-drumless-soul';
    } else if (selectedArticle.category === 'Regional Movements') {
      target = 'motor-city-bounce';
    } else if (selectedArticle.themeTag.includes('Big Bang') || selectedArticle.themeTag.includes('2016')) {
      target = 'bedroom-3am-cloud';
    }

    setActiveBeatId(target);
    audioSynthEngine.play(target);
  };

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

  const categories: (string)[] = [
    'All',
    'Autonomous DIY',
    'Sonic Inventions',
    'Regional Movements',
    'Internet Collectives',
    'Abstract & Soul',
    'Cultural Aesthetics',
  ];

  const leadFeaturedArticle = ARTICLES.find((a) => a.featured) || ARTICLES[0];
  const activeBeat = AMBIENT_BEATS.find((b) => b.id === activeBeatId);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-zinc-100 selection:bg-amber-400 selection:text-black">
      
      {/* Strict 3-zone top bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setSelectedArticle(null);
          setCurrentTab(tab);
          setShowSavedOnly(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenManifesto={() => setIsManifestoOpen(true)}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        activeBeatName={activeBeat?.name}
        savedCount={savedArticleIds.length}
        showingSavedOnly={showSavedOnly}
        onToggleSavedOnly={() => {
          setSelectedArticle(null);
          setCurrentTab('articles');
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

      {/* Main View Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: Long-Form Article Reader */}
        {selectedArticle ? (
          <ArticleDetail
            article={selectedArticle}
            onBack={() => {
              setSelectedArticle(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isSaved={savedArticleIds.includes(selectedArticle.id)}
            onToggleSave={(id) => handleToggleSave(id)}
            onPlayCompanion={handlePlayCompanionForArticle}
            allArticles={ARTICLES}
            onSelectArticle={(art) => {
              setSelectedArticle(art);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          <>
            {/* VIEW 2: Timeline */}
            {currentTab === 'timeline' && <TimelineView />}

            {/* VIEW 3: Sonic Matrix & DAWs */}
            {currentTab === 'sound-matrix' && (
              <SoundMatrixView
                onPlaySubgenreBeat={(genreName) => {
                  let target = 'subterranean-plugg';
                  if (genreName.includes('Rage')) target = 'nightmare-rage-808';
                  else if (genreName.includes('Plugg')) target = 'subterranean-plugg';
                  else if (genreName.includes('Michigan')) target = 'motor-city-bounce';
                  else if (genreName.includes('Soul')) target = 'abstract-drumless-soul';
                  else if (genreName.includes('Cloud')) target = 'bedroom-3am-cloud';
                  handleTrackSelect(target);
                }}
              />
            )}

            {/* VIEW 4: Main Articles Collection (Default) */}
            {currentTab === 'articles' && (
              <div>
                {/* Hero Featured Article (shown when not filtering by search or saved) */}
                {!searchQuery && selectedCategory === 'All' && !showSavedOnly && (
                  <HeroFeatured
                    article={leadFeaturedArticle}
                    onSelect={(article) => {
                      setSelectedArticle(article);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    isSaved={savedArticleIds.includes(leadFeaturedArticle.id)}
                    onToggleSave={(id, e) => handleToggleSave(id, e)}
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

                  {/* Interactive Category Filter Tabs (allowed buttons for state filtering) */}
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

                {/* Article Grid (Bespoke 3-column editorial layout) */}
                {filteredArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArticles.map((article, index) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        index={index}
                        onSelect={(art) => {
                          setSelectedArticle(art);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        isSaved={savedArticleIds.includes(article.id)}
                        onToggleSave={(id, e) => handleToggleSave(id, e)}
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
            )}
          </>
        )}

      </div>

      {/* Publication Footer */}
      <Footer
        onSelectTab={(tab) => {
          setSelectedArticle(null);
          setCurrentTab(tab);
          setShowSavedOnly(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
