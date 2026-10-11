import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ARTICLES } from '../data/articles';
import { ArticleDetail } from '../components/ArticleDetail';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Disc } from 'lucide-react';

export const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { savedArticleIds, toggleSaveArticle, playCompanionForArticle } = useApp();

  const article = useMemo(() => {
    if (!id) return null;

    // 1. Direct ID or slug match
    const direct = ARTICLES.find((a) => a.id === id || a.slug === id);
    if (direct) return direct;

    // 2. Case-insensitive match
    const lower = id.toLowerCase();
    const caseMatch = ARTICLES.find((a) => a.id.toLowerCase() === lower || a.slug?.toLowerCase() === lower);
    if (caseMatch) return caseMatch;

    // 3. Numeric index match (e.g., /article/1 or /article/0)
    const num = parseInt(id, 10);
    if (!isNaN(num)) {
      if (num >= 1 && num <= ARTICLES.length) return ARTICLES[num - 1];
      if (num >= 0 && num < ARTICLES.length) return ARTICLES[num];
    }

    // 4. art-XX format (e.g. /article/art-01)
    const artMatch = id.match(/art-(\d+)/i);
    if (artMatch) {
      const idx = parseInt(artMatch[1], 10) - 1;
      if (idx >= 0 && idx < ARTICLES.length) return ARTICLES[idx];
    }

    // 5. Partial slug match
    const partial = ARTICLES.find((a) => a.id.includes(lower) || (a.slug && a.slug.includes(lower)));
    if (partial) return partial;

    return null;
  }, [id]);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} — Subculture // Rec`;
    } else {
      document.title = `Dispatch Not Found — Subculture // Rec`;
    }
    return () => {
      document.title = 'Subculture // The Underground Dispatch';
    };
  }, [article]);

  if (!article) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6 text-zinc-500">
          <Disc className="w-8 h-8" />
        </div>
        <div className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-2">
          404 · Archival Error
        </div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-100 mb-3">
          Dispatch Not Found
        </h1>
        <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
          The requested underground research dispatch or monograph could not be retrieved from the catalog.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display font-bold text-xs uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Journal Archive</span>
        </button>
      </div>
    );
  }

  return (
    <ArticleDetail
      key={article.id}
      article={article}
      onBack={() => {
        navigate('/');
      }}
      isSaved={savedArticleIds.includes(article.id)}
      onToggleSave={(artId) => toggleSaveArticle(artId)}
      onPlayCompanion={(overrideBeatId) => playCompanionForArticle(article, overrideBeatId)}
      allArticles={ARTICLES}
      onSelectArticle={(nextArt) => {
        navigate(`/article/${nextArt.id}`);
      }}
    />
  );
};
