export const SITE_URL = 'https://underground-rap.vercel.app';

export const SITE_CONFIG = {
  name: 'Subculture // The Underground Dispatch',
  shortName: 'Underground Rap',
  url: 'https://underground-rap.vercel.app',
  ogImage: 'https://underground-rap.vercel.app/artists/lancey-foux.jpg',
  description: 'Explore the evolution of modern underground rap through investigative monographs, sonic blueprints, and audio companions. Read all 10 curated dispatches now.',
  author: 'Subculture Archival Editorial',
  twitterHandle: '@undergroundrap',
};

export function getFullUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return `${window.location.origin}${cleanPath}`;
  }
  return `${SITE_URL}${cleanPath}`;
}
