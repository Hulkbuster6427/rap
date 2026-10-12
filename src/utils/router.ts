import { BlogArticle } from '../types/blog';

export interface RouteState {
  tab: 'articles' | 'timeline';
  selectedArticle: BlogArticle | null;
  notFoundSlug: string | null;
}

export function getArticleUrl(article: BlogArticle): string {
  if (typeof window === 'undefined') return `?blog=${article.slug}`;
  return `${window.location.origin}${window.location.pathname}?blog=${article.slug}`;
}

export function parseCurrentRoute(articles: BlogArticle[]): RouteState {
  if (typeof window === 'undefined') return { tab: 'articles', selectedArticle: null, notFoundSlug: null };
  try {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('blog') || params.get('article');
    if (slug) {
      const norm = slug.trim().toLowerCase();
      const article = articles.find(a => (a.slug || '').toLowerCase() === norm || (a.id || '').toLowerCase() === norm);
      if (article) return { tab: 'articles', selectedArticle: article, notFoundSlug: null };
    }
  } catch {
    // ignore
  }
  return { tab: 'articles', selectedArticle: null, notFoundSlug: null };
}

export function findArticleBySlugOrId(articles: BlogArticle[], identifier: string): BlogArticle | undefined {
  if (!identifier || !Array.isArray(articles)) return undefined;
  const norm = identifier.trim().toLowerCase();
  return articles.find(a => (a.slug || '').toLowerCase() === norm || (a.id || '').toLowerCase() === norm);
}

export function navigateToArticle(article: BlogArticle): void {
  try {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('blog', article.slug);
      window.history.pushState({}, '', url.toString());
    }
  } catch {
    // ignore
  }
}

export function navigateToHome(): void {
  try {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('blog');
      url.searchParams.delete('article');
      window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
    }
  } catch {
    // ignore
  }
}

export function navigateToTimeline(): void {
  try {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'timeline');
      window.history.pushState({}, '', url.toString());
    }
  } catch {
    // ignore
  }
}

export async function copyArticleLink(article: BlogArticle): Promise<boolean> {
  const url = getArticleUrl(article);
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

export async function shareArticle(article: BlogArticle): Promise<{ shared: boolean; copied: boolean }> {
  const url = getArticleUrl(article);
  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({
        title: article.title,
        text: article.subtitle || article.excerpt,
        url,
      });
      return { shared: true, copied: false };
    }
  } catch {
    // ignore
  }
  const copied = await copyArticleLink(article);
  return { shared: false, copied };
}

export function updatePageMeta(article?: BlogArticle | null): void {
  try {
    if (typeof document !== 'undefined') {
      document.title = article ? `${article.title} // Subculture` : 'Subculture // The Underground Dispatch';
    }
  } catch {
    // ignore
  }
}
