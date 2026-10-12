import { BlogArticle } from '../types/blog';

export interface RouteState {
  tab: 'articles' | 'timeline';
  selectedArticle: BlogArticle | null;
  notFoundSlug: string | null;
}

function safeDecode(val: string): string {
  try {
    return decodeURIComponent(val);
  } catch {
    return val;
  }
}

/**
 * Returns the fully-qualified unique URL for an individual blog article.
 * Format: https://domain/blog/[slug]
 */
export function getArticleUrl(article: BlogArticle): string {
  if (typeof window === 'undefined') {
    return `/blog/${article.slug}`;
  }
  return `${window.location.origin}/blog/${article.slug}`;
}

/**
 * Parses current browser location (pathname, search params, and hash)
 * to determine the active route, selected article, or timeline tab.
 */
export function parseCurrentRoute(articles: BlogArticle[]): RouteState {
  try {
    if (typeof window === 'undefined') {
      return { tab: 'articles', selectedArticle: null, notFoundSlug: null };
    }

    const { pathname, search, hash } = window.location;

    // 1. Check Search Parameters (e.g. ?blog=slug or ?article=slug or ?tab=timeline)
    if (search) {
      try {
        const searchParams = new URLSearchParams(search);
        const searchBlog = searchParams.get('blog') || searchParams.get('article') || searchParams.get('id');
        const searchTab = searchParams.get('tab');

        if (searchTab === 'timeline') {
          return { tab: 'timeline', selectedArticle: null, notFoundSlug: null };
        }

        if (searchBlog) {
          const article = findArticleBySlugOrId(articles, searchBlog);
          if (article) {
            return { tab: 'articles', selectedArticle: article, notFoundSlug: null };
          }
          return { tab: 'articles', selectedArticle: null, notFoundSlug: searchBlog };
        }
      } catch (err) {
        console.warn('Failed parsing search params:', err);
      }
    }

    // 2. Check Hash Route (e.g. #/blog/slug or #blog-slug or #/timeline)
    if (hash) {
      const cleanHash = hash.replace(/^#\/?/, '');
      if (cleanHash === 'timeline') {
        return { tab: 'timeline', selectedArticle: null, notFoundSlug: null };
      }
      const hashMatch = cleanHash.match(/^(?:blog|article|dispatch)\/([^/?#]+)/i);
      if (hashMatch) {
        const candidate = safeDecode(hashMatch[1]);
        const article = findArticleBySlugOrId(articles, candidate);
        if (article) {
          return { tab: 'articles', selectedArticle: article, notFoundSlug: null };
        }
        return { tab: 'articles', selectedArticle: null, notFoundSlug: candidate };
      }
    }

    // 3. Check Pathname Route (e.g. /blog/slug, /article/slug, /timeline)
    const cleanPath = (pathname || '').replace(/^\/+|\/+$/g, '');

    if (!cleanPath || cleanPath === 'articles' || cleanPath === 'index.html' || cleanPath === 'index') {
      return { tab: 'articles', selectedArticle: null, notFoundSlug: null };
    }

    if (cleanPath === 'timeline') {
      return { tab: 'timeline', selectedArticle: null, notFoundSlug: null };
    }

    // Match /blog/:slug, /article/:slug, /dispatch/:slug, /posts/:slug
    const pathMatch = cleanPath.match(/^(?:blog|article|dispatch|posts)\/([^/?#]+)/i);
    if (pathMatch) {
      const candidate = safeDecode(pathMatch[1]);
      const article = findArticleBySlugOrId(articles, candidate);
      if (article) {
        return { tab: 'articles', selectedArticle: article, notFoundSlug: null };
      }
      return { tab: 'articles', selectedArticle: null, notFoundSlug: candidate };
    }

    // Fallback: check if the path itself is an article slug
    const directCandidate = safeDecode(cleanPath);
    const directArticle = findArticleBySlugOrId(articles, directCandidate);
    if (directArticle) {
      return { tab: 'articles', selectedArticle: directArticle, notFoundSlug: null };
    }

    // Unrecognized route -> default to home archive
    return { tab: 'articles', selectedArticle: null, notFoundSlug: null };
  } catch (err) {
    console.error('Fatal route parse recovery:', err);
    return { tab: 'articles', selectedArticle: null, notFoundSlug: null };
  }
}

/**
 * Matches an article by either slug or id (case-insensitive).
 */
export function findArticleBySlugOrId(articles: BlogArticle[], identifier: string): BlogArticle | undefined {
  if (!identifier || !Array.isArray(articles)) return undefined;
  const norm = identifier.trim().toLowerCase();
  const normNoDash = norm.replace(/-/g, '');

  return articles.find((a) => {
    if (!a) return false;
    const slug = (a.slug || '').toLowerCase();
    const id = (a.id || '').toLowerCase();
    return (
      slug === norm ||
      id === norm ||
      slug.replace(/-/g, '') === normNoDash ||
      id.replace(/-/g, '') === normNoDash
    );
  });
}

/**
 * Updates the browser URL to the unique article URL and synchronizes document metadata.
 */
export function navigateToArticle(article: BlogArticle, replace = false): void {
  const url = `/blog/${article.slug}`;
  if (typeof window !== 'undefined') {
    try {
      if (replace) {
        window.history.replaceState({ articleSlug: article.slug }, '', url);
      } else {
        window.history.pushState({ articleSlug: article.slug }, '', url);
      }
    } catch (err) {
      console.warn('history state update bypassed:', err);
    }
  }
  updatePageMeta(article);
}

/**
 * Updates the browser URL back to the home archive (/) and resets metadata.
 */
export function navigateToHome(replace = false): void {
  if (typeof window !== 'undefined') {
    try {
      if (replace) {
        window.history.replaceState({}, '', '/');
      } else {
        window.history.pushState({}, '', '/');
      }
    } catch (err) {
      console.warn('history state update bypassed:', err);
    }
  }
  updatePageMeta(null);
}

/**
 * Updates the browser URL to the timeline view (/timeline).
 */
export function navigateToTimeline(replace = false): void {
  if (typeof window !== 'undefined') {
    try {
      if (replace) {
        window.history.replaceState({ tab: 'timeline' }, '', '/timeline');
      } else {
        window.history.pushState({ tab: 'timeline' }, '', '/timeline');
      }
    } catch (err) {
      console.warn('history state update bypassed:', err);
    }
  }
  updatePageMeta(null);
}

/**
 * Copies the unique article URL to the clipboard.
 */
export async function copyArticleLink(article: BlogArticle): Promise<boolean> {
  const url = getArticleUrl(article);
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard write failed, trying fallback execCommand', err);
  }

  // Fallback for older or restricted environments
  try {
    if (typeof document !== 'undefined') {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch {
    return false;
  }
  return false;
}

/**
 * Native Web Share API integration with automatic fallback to clipboard copy.
 */
export async function shareArticle(article: BlogArticle): Promise<{ shared: boolean; copied: boolean }> {
  const url = getArticleUrl(article);
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: article.title,
        text: article.subtitle || article.excerpt,
        url,
      });
      return { shared: true, copied: false };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return { shared: false, copied: false };
      }
    }
  }

  const copied = await copyArticleLink(article);
  return { shared: false, copied };
}

/**
 * Dynamically updates the document title and OpenGraph / description meta tags.
 */
export function updatePageMeta(article?: BlogArticle | null): void {
  if (typeof document === 'undefined') return;

  try {
    if (article) {
      document.title = `${article.title} // Subculture`;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', article.subtitle || article.excerpt);
      }

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${article.title} // Subculture`);
      }

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', article.subtitle || article.excerpt);
      }
    } else {
      document.title = 'Subculture // The Underground Dispatch';

      const defaultDesc =
        'An independent music publication analyzing how modern underground rap carved its own autonomy, broke algorithmic monopolies, and redefined global contemporary music.';

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', defaultDesc);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', 'Subculture // The Underground Dispatch');

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', defaultDesc);
    }
  } catch (err) {
    console.warn('Meta update bypassed:', err);
  }
}
