import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ARTICLES } from '../data/articles';
import { ArticleDetail } from '../components/ArticleDetail';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Disc } from 'lucide-react';

export const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { savedArticleIds, toggleSaveArticle, playCompanionForArticle } = useApp();

  const article = ARTICLES.find((a) => a.id === id || a.slug === id);

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
