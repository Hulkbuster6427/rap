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
  year: string;
  title: string;
  artistOrMovement: string;
  description: string;
  culturalShift: string;
}

export interface SubgenreMatrixEntry {
  genre: string;
  bpmRange: string;
  originEra: string;
  signatureDAWPlugins: string[];
  definingCharacteristics: string;
  flagshipArtists: string[];
  essentialProducers: string[];
  culturalEpicenter: string;
}
