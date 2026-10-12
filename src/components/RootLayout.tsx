import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { AudioCompanionPlayer } from './AudioCompanionPlayer';
import { Footer } from './Footer';
import { ManifestoModal } from './ManifestoModal';
import { SubmitTrackModal } from './SubmitTrackModal';
import { ScrollToTop } from './ScrollToTop';
import { useApp } from '../context/AppContext';

export const RootLayout: React.FC = () => {
  const app = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c10] text-zinc-100 selection:bg-amber-400 selection:text-black">
      <ScrollToTop />
      
      {/* 3-zone Top Bar with Navigation */}
      <Navbar />

      {/* Audio Companion Synthesizer Engine Bar (Preserved across all page routes) */}
      <AudioCompanionPlayer
        isAudioPlaying={app.isAudioPlaying}
        activeBeatId={app.activeBeatId}
        onTrackSelect={app.selectTrack}
        onTogglePlay={app.toggleAudio}
      />

      {/* Route Outlet */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Publication Footer */}
      <Footer />

      {/* Manifesto Modal */}
      <ManifestoModal
        isOpen={app.isManifestoOpen}
        onClose={() => app.setIsManifestoOpen(false)}
      />

      {/* Submit Track Modal */}
      <SubmitTrackModal
        isOpen={app.isSubmitOpen}
        onClose={() => app.setIsSubmitOpen(false)}
      />
    </div>
  );
};
