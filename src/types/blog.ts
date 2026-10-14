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

export interface ArtistProfile {
  name: string;
  role: string;
  location: string;
  caption: string;
  imageUrl: string;
  backupImageUrl?: string;
  fallbackGradient: string;
  signatureSymbol: 'mic' | 'wave' | 'flame' | 'crown' | 'tape' | 'eye' | 'disc';
}

export interface ArticleContentSection {
  heading?: string;
  paragraphs: string[];
  artistProfile?: ArtistProfile; // Real artist portrait placed directly beside or at the end of this section
  callout?: {
    title: string;
    text: string;
  };
}

export interface BlogArticle {
  id: string;
  slug: string;
  aliases?: string[];
  mainKeyword: string;
  relatedKeywords: string[];
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
  featuredArtists: ArtistProfile[]; // Verified artist profiles with real portraits
  pullQuote: string;
  pullQuoteAuthor: string;
  contentSections: ArticleContentSection[];
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
