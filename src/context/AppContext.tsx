import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BlogArticle } from '../types/blog';
import { audioSynthEngine, AMBIENT_BEATS } from '../utils/audioSynth';

interface AppContextType {
  savedArticleIds: string[];
  toggleSaveArticle: (articleId: string, e?: React.MouseEvent) => void;
  isAudioPlaying: boolean;
  activeBeatId: string;
  activeBeatName?: string;
  toggleAudio: () => void;
  selectTrack: (trackId: string) => void;
  playCompanionForArticle: (article?: BlogArticle, overrideBeatId?: string) => void;
  isManifestoOpen: boolean;
  setIsManifestoOpen: (open: boolean) => void;
  isSubmitOpen: boolean;
  setIsSubmitOpen: (open: boolean) => void;
  showSavedOnly: boolean;
  setShowSavedOnly: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Saved bookmarks state in localStorage
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('subculture_saved_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);

  // Audio Engine state
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [activeBeatId, setActiveBeatId] = useState<string>('subterranean-plugg');

  // Modals state
  const [isManifestoOpen, setIsManifestoOpen] = useState<boolean>(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);

  // Sync audio engine state changes
  useEffect(() => {
    audioSynthEngine.subscribe((playing, trackId) => {
      setIsAudioPlaying(playing);
      if (trackId) setActiveBeatId(trackId);
    });
    return () => {
      audioSynthEngine.stop();
    };
  }, []);

  // Save to localStorage when bookmarks change
  useEffect(() => {
    try {
      localStorage.setItem('subculture_saved_articles', JSON.stringify(savedArticleIds));
    } catch {
      // ignore
    }
  }, [savedArticleIds]);

  const toggleSaveArticle = (articleId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedArticleIds((prev) =>
      prev.includes(articleId) ? prev.filter((id) => id !== articleId) : [...prev, articleId]
    );
  };

  const toggleAudio = () => {
    if (isAudioPlaying) {
      audioSynthEngine.stop();
    } else {
      audioSynthEngine.play(activeBeatId);
    }
  };

  const selectTrack = (trackId: string) => {
    setActiveBeatId(trackId);
    audioSynthEngine.play(trackId);
  };

  const playCompanionForArticle = (article?: BlogArticle, overrideBeatId?: string) => {
    if (overrideBeatId) {
      selectTrack(overrideBeatId);
      return;
    }
    if (!article) {
      toggleAudio();
      return;
    }

    let target = 'subterranean-plugg';
    if (article.category === 'Sonic Inventions' || article.themeTag.includes('Rage')) {
      target = 'nightmare-rage-808';
    } else if (article.category === 'Abstract & Soul') {
      target = 'abstract-drumless-soul';
    } else if (article.category === 'Regional Movements') {
      target = 'motor-city-bounce';
    } else if (article.themeTag.includes('Big Bang') || article.themeTag.includes('2016')) {
      target = 'bedroom-3am-cloud';
    }

    setActiveBeatId(target);
    audioSynthEngine.play(target);
  };

  const activeBeat = AMBIENT_BEATS.find((b) => b.id === activeBeatId);

  return (
    <AppContext.Provider
      value={{
        savedArticleIds,
        toggleSaveArticle,
        isAudioPlaying,
        activeBeatId,
        activeBeatName: activeBeat?.name,
        toggleAudio,
        selectTrack,
        playCompanionForArticle,
        isManifestoOpen,
        setIsManifestoOpen,
        isSubmitOpen,
        setIsSubmitOpen,
        showSavedOnly,
        setShowSavedOnly,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return ctx;
};
