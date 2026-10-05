export type Category = 
  | 'Autonomous DIY' 
  | 'Sonic Inventions' 
  | 'Regional Movements' 
  | 'Internet Collectives' 
  | 'Abstract & Soul' 
  | 'Cultural Aesthetics';

export interface TrackRecommendation {
  title: string;
  artist: string;
  year: number;
  significance: string;
}

export interface ArticleComment {
  id: string;
  author: string;
  handle: string;
  timestamp: string;
  content: string;
  likes: number;
}

export interface ArtistPhoto {
  name: string;
  role: string;
  location: string;
  caption: string;
  visualTag: string; // e.g. "35mm Grain / London Underground"
  lightingTone: string; // e.g. "from-purple-900/60 via-zinc-900 to-black"
  accentColor: string;
  signatureSymbol: 'mic' | 'wave' | 'flame' | 'crown' | 'tape' | 'eye' | 'disc';
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: Category;
  author: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  publishedDate: string;
  readTime: string;
  featured: boolean;
  coverAccent: string; // Hex or gradient tone
  themeTag: string; // e.g. "Distribution & Rights", "Rage & Synths"
  keyArtists: string[];
  keyProducers: string[];
  artistPhotos: ArtistPhoto[]; // 2-3 photos of the artists mentioned
  pullQuote: string;
  pullQuoteAuthor: string;
  contentSections: {
    heading?: string;
    paragraphs: string[];
    callout?: {
      title: string;
      text: string;
    };
  }[];
  curatedTracks: TrackRecommendation[];
  statsOrImpact: {
    metric: string;
    label: string;
  }[];
}

export interface TimelineMilestone {
  date: string; // Exact date e.g. "August 15, 2011"
  year: string;
  title: string;
  artistOrMovement: string;
  artists: string[];
  region: string;
  era: '2008–2015: Foundations & DIY' | '2016–2019: Soundcloud & Experimental Vanguard' | '2020–2023: Opium, UK Insurgency & Abstract' | '2024–Present: The Sovereign Auteurs';
  description: string;
  culturalShift: string;
  keyWorks: string[];
}
