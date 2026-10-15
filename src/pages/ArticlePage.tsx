import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

    // 3. Alias match
    const aliasMatch = ARTICLES.find((a) =>
      a.aliases?.some((al) => al.toLowerCase() === lower || al.toLowerCase().replace(/-/g, '') === lower.replace(/-/g, ''))
    );
    if (aliasMatch) return aliasMatch;

    // 4. Numeric index match (e.g., /article/1 or /article/0)
    const num = parseInt(id, 10);
    if (!isNaN(num)) {
      if (num >= 1 && num <= ARTICLES.length) return ARTICLES[num - 1];
      if (num >= 0 && num < ARTICLES.length) return ARTICLES[num];
    }

    // 5. art-XX format (e.g. /article/art-01)
    const artMatch = id.match(/art-(\d+)/i);
    if (artMatch) {
      const idx = parseInt(artMatch[1], 10) - 1;
      if (idx >= 0 && idx < ARTICLES.length) return ARTICLES[idx];
    }

    // 6. Partial slug match
    const partial = ARTICLES.find((a) => a.id.includes(lower) || (a.slug && a.slug.includes(lower)));
    if (partial) return partial;

    return null;
  }, [id]);

  useEffect(() => {
    const siteDesc = "Explore the evolution of modern underground rap through investigative monographs, sonic blueprints, and audio companions. Read all 10 curated dispatches now.";
    const metaDesc = document.querySelector('meta[name="description"]');

    if (article) {
      document.title = article.title;
      if (metaDesc) {
        metaDesc.setAttribute('content', `${article.title}. ${article.subtitle || article.excerpt}`);
      }

      // Inject Schema.org FAQPage structured data for AEO (Answer Engine Optimization)
      if (article.faqs && article.faqs.length > 0) {
        const existingScript = document.getElementById('article-faq-jsonld');
        if (existingScript) existingScript.remove();

        const script = document.createElement('script');
        script.id = 'article-faq-jsonld';
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': article.faqs.map((faq) => ({
            '@type': 'Question',
            'name': faq.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': faq.answer,
            },
          })),
        });
        document.head.appendChild(script);
      }
    } else {
      document.title = 'Dispatch Not Found | Subculture';
    }

    return () => {
      document.title = 'Subculture // The Underground Dispatch';
      if (metaDesc) {
        metaDesc.setAttribute('content', siteDesc);
      }
      const existingScript = document.getElementById('article-faq-jsonld');
      if (existingScript) existingScript.remove();
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
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
          title="Browse All 10 Underground Hip-Hop Dispatches"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All 10 Underground Hip-Hop Dispatches</span>
        </Link>
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
        navigate(`/${nextArt.slug || nextArt.id}`);
      }}
    />
  );
};
