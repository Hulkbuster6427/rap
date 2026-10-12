import { BlogArticle } from '../types/blog';

export interface RouteState {
  tab: 'articles' | 'timeline';
  selectedArticle: BlogArticle | null;
  notFoundSlug: string | null;
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
  if (typeof window === 'undefined') {
    return { tab: 'articles', selectedArticle: null, notFoundSlug: null };
  }

  const { pathname, search, hash } = window.location;

  // 1. Check Search Parameters (e.g. ?blog=slug or ?article=slug or ?tab=timeline)
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

  // 2. Check Hash Route (e.g. #/blog/slug or #blog-slug or #/timeline)
  if (hash) {
    const cleanHash = hash.replace(/^#\/?/, '');
    if (cleanHash === 'timeline') {
      return { tab: 'timeline', selectedArticle: null, notFoundSlug: null };
    }
    const hashMatch = cleanHash.match(/^(?:blog|article|dispatch)\/([^/?#]+)/i);
    if (hashMatch) {
      const candidate = hashMatch[1];
      const article = findArticleBySlugOrId(articles, candidate);
      if (article) {
        return { tab: 'articles', selectedArticle: article, notFoundSlug: null };
      }
      return { tab: 'articles', selectedArticle: null, notFoundSlug: candidate };
    }
  }

  // 3. Check Pathname Route (e.g. /blog/slug, /article/slug, /timeline)
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '');

  if (!cleanPath || cleanPath === 'articles') {
    return { tab: 'articles', selectedArticle: null, notFoundSlug: null };
  }

  if (cleanPath === 'timeline') {
    return { tab: 'timeline', selectedArticle: null, notFoundSlug: null };
  }

  // Match /blog/:slug, /article/:slug, /dispatch/:slug, /posts/:slug
  const pathMatch = cleanPath.match(/^(?:blog|article|dispatch|posts)\/([^/?#]+)/i);
  if (pathMatch) {
    const candidate = decodeURIComponent(pathMatch[1]);
    const article = findArticleBySlugOrId(articles, candidate);
    if (article) {
      return { tab: 'articles', selectedArticle: article, notFoundSlug: null };
    }
    return { tab: 'articles', selectedArticle: null, notFoundSlug: candidate };
  }

  // Fallback: check if the path itself is an article slug
  const directArticle = findArticleBySlugOrId(articles, decodeURIComponent(cleanPath));
  if (directArticle) {
    return { tab: 'articles', selectedArticle: directArticle, notFoundSlug: null };
  }

  // Unrecognized route
  return { tab: 'articles', selectedArticle: null, notFoundSlug: null };
}

/**
 * Matches an article by either slug or id (case-insensitive).
 */
export function findArticleBySlugOrId(articles: BlogArticle[], identifier: string): BlogArticle | undefined {
  const norm = identifier.trim().toLowerCase();
  return articles.find(
    (a) =>
      a.slug.toLowerCase() === norm ||
      a.id.toLowerCase() === norm ||
      a.slug.toLowerCase().replace(/-/g, '') === norm.replace(/-/g, '')
  );
}

/**
 * Updates the browser URL to the unique article URL and synchronizes document metadata.
 */
export function navigateToArticle(article: BlogArticle, replace = false): void {
  const url = `/blog/${article.slug}`;
  if (typeof window !== 'undefined') {
    if (replace) {
      window.history.replaceState({ articleSlug: article.slug }, '', url);
    } else {
      window.history.pushState({ articleSlug: article.slug }, '', url);
    }
  }
  updatePageMeta(article);
}

/**
 * Updates the browser URL back to the home archive (/) and resets metadata.
 */
export function navigateToHome(replace = false): void {
  if (typeof window !== 'undefined') {
    if (replace) {
      window.history.replaceState({}, '', '/');
    } else {
      window.history.pushState({}, '', '/');
    }
  }
  updatePageMeta(null);
}

/**
 * Updates the browser URL to the timeline view (/timeline).
 */
export function navigateToTimeline(replace = false): void {
  if (typeof window !== 'undefined') {
    if (replace) {
      window.history.replaceState({ tab: 'timeline' }, '', '/timeline');
    } else {
      window.history.pushState({ tab: 'timeline' }, '', '/timeline');
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
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch (err) {
    console.warn('Clipboard write failed, trying fallback execCommand', err);
  }

  // Fallback for older or restricted environments
  try {
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
  } catch {
    return false;
  }
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
      // User aborted share modal is not an error
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
}
