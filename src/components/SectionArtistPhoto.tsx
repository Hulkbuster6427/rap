import React, { useState, useEffect, useRef } from 'react';
import { ArtistProfile } from '../types/blog';
import { Camera, MapPin, Mic, Radio, Flame, Crown, Disc, Eye, Upload, RotateCcw, Image as ImageIcon } from 'lucide-react';

interface SectionArtistPhotoProps {
  artist: ArtistProfile;
}

export const SectionArtistPhoto: React.FC<SectionArtistPhotoProps> = ({ artist }) => {
  const storageKey = `subculture_photo_${artist.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  
  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return artist.imageUrl;
  });

  const [hasCustomPhoto, setHasCustomPhoto] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem(storageKey));
    } catch {
      return false;
    }
  });

  const [imageError, setImageError] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCurrentSrc(saved);
        setHasCustomPhoto(true);
        setImageError(false);
        return;
      }
    } catch {
      // ignore
    }
    setCurrentSrc(artist.imageUrl);
    setHasCustomPhoto(false);
    setImageError(false);
  }, [artist.imageUrl, storageKey]);

  const handleImageError = () => {
    if (artist.backupImageUrl && currentSrc !== artist.backupImageUrl && !hasCustomPhoto) {
      setCurrentSrc(artist.backupImageUrl);
    } else {
      setImageError(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        try {
          localStorage.setItem(storageKey, result);
        } catch {
          // localStorage might be full for very huge files
        }
        setCurrentSrc(result);
        setHasCustomPhoto(true);
        setImageError(false);
        setShowUploadModal(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    try {
      localStorage.setItem(storageKey, urlInput.trim());
    } catch {
      // ignore
    }
    setCurrentSrc(urlInput.trim());
    setHasCustomPhoto(true);
    setImageError(false);
    setUrlInput('');
    setShowUploadModal(false);
  };

  const handleResetPhoto = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setCurrentSrc(artist.imageUrl);
    setHasCustomPhoto(false);
    setImageError(false);
    setShowUploadModal(false);
  };

  const renderSymbol = () => {
    switch (artist.signatureSymbol) {
      case 'mic':
        return <Mic className="w-6 h-6 text-amber-400" />;
      case 'wave':
        return <Radio className="w-6 h-6 text-cyan-400" />;
      case 'flame':
        return <Flame className="w-6 h-6 text-rose-500" />;
      case 'crown':
        return <Crown className="w-6 h-6 text-amber-300" />;
      case 'eye':
        return <Eye className="w-6 h-6 text-purple-400" />;
      case 'disc':
      default:
        return <Disc className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <figure className="my-10 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/90 shadow-2xl transition-all duration-300 not-prose relative">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch">
        
        {/* Visual Photo Area */}
        <div className="md:col-span-6 relative min-h-[320px] sm:min-h-[360px] overflow-hidden bg-zinc-900 flex items-center justify-center group">
          {!imageError && currentSrc ? (
            <img
              src={currentSrc}
              alt={`Archival photograph of ${artist.name}`}
              referrerPolicy="no-referrer"
              onError={handleImageError}
              className="w-full h-full object-cover object-top sm:object-center grayscale contrast-115 group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
            />
          ) : (
            <div 
              className={`w-full h-full min-h-[320px] bg-gradient-to-br ${artist.fallbackGradient} p-6 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/70 border border-zinc-800">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{artist.location}</span>
                </span>
                <span className="text-[10px] uppercase font-mono text-zinc-400 bg-black/50 px-2 py-0.5 rounded border border-zinc-800/60">
                  DOCUMENTED PORTRAIT
                </span>
              </div>

              <div className="my-auto text-center py-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-zinc-900/95 border-2 border-amber-400/80 flex items-center justify-center shadow-2xl mb-3">
                  {renderSymbol()}
                </div>
                <div className="font-display font-black text-2xl text-zinc-100 tracking-wide">
                  {artist.name}
                </div>
                <div className="text-xs font-mono text-amber-400/90 mt-1">
                  {artist.role}
                </div>
              </div>

              <div className="text-[10px] font-mono text-zinc-500 text-center tracking-widest uppercase">
                PORTRAIT ARCHIVE · 35MM MONOCHROME
              </div>
            </div>
          )}

          {/* Vignette Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

          {/* Top Camera Label & Custom Upload Indicator */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/85 backdrop-blur-md border border-zinc-800 text-[11px] font-mono text-zinc-300">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>{hasCustomPhoto ? 'Custom Portrait' : 'Documented Portrait'}</span>
            </div>
            {hasCustomPhoto && (
              <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded">
                User Provided
              </span>
            )}
          </div>

          {/* Bottom Watermark */}
          <div className="absolute bottom-3 left-3 text-[11px] font-mono text-zinc-300 flex items-center gap-1.5 bg-black/70 px-2.5 py-0.5 rounded border border-zinc-800/60">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>{artist.location}</span>
          </div>

          {/* Hover Action to Upload/Replace Photo */}
          <div className="absolute top-3 right-3 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900/95 hover:bg-zinc-800 text-zinc-200 hover:text-amber-300 border border-zinc-700/80 text-[11px] font-mono shadow-lg transition-all"
              title={`Upload or replace photo for ${artist.name}`}
            >
              <Upload className="w-3 h-3 text-amber-400" />
              <span>Upload / Replace Photo</span>
            </button>
          </div>
        </div>

        {/* Narrative Context Column */}
        <div className="md:col-span-6 p-6 sm:p-7 flex flex-col justify-between bg-zinc-950/95">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Movement Figure</span>
            </div>
            
            <h4 className="font-display font-black text-2xl sm:text-3xl text-zinc-100 mb-1">
              {artist.name}
            </h4>

            <div className="text-xs font-mono text-zinc-400 mb-4 pb-3 border-b border-zinc-800/80">
              {artist.role}
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed font-sans mb-4">
              {artist.caption}
            </p>
          </div>

          {/* Verified Provenance Footer & Upload Button */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-zinc-500">
            <span>PROVENANCE: {hasCustomPhoto ? 'CONTRIBUTED ARCHIVE' : 'INDEPENDENT ARCHIVE'}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-amber-400/90 hover:text-amber-300 hover:underline flex items-center gap-1 text-[11px]"
              >
                <Upload className="w-3 h-3" />
                <span>Change Photo</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Upload / Replace Photo Modal */}
      {showUploadModal && (
        <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md p-6 flex flex-col justify-center items-center rounded-2xl animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-700/80 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <h5 className="font-mono text-sm font-semibold text-zinc-100">
                  Provide Photo for {artist.name}
                </h5>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-zinc-400 hover:text-zinc-200 text-xs font-mono px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            {/* Option 1: File Upload */}
            <div className="mb-4">
              <label className="block text-xs font-mono text-zinc-300 mb-2">
                1. Upload from your device (JPG, PNG, WebP)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600/60 text-xs font-mono text-zinc-100 hover:text-amber-300 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Photo from Device...</span>
              </button>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink mx-3 text-[10px] font-mono text-zinc-500 uppercase">OR</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            {/* Option 2: Image URL */}
            <form onSubmit={handleApplyUrl} className="mb-4">
              <label className="block text-xs font-mono text-zinc-300 mb-2">
                2. Paste Direct Image Link (URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/artist.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={!urlInput.trim()}
                  className="px-3 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black text-xs font-mono font-medium transition-colors"
                >
                  Apply
                </button>
              </div>
            </form>

            {/* Reset Option */}
            {hasCustomPhoto && (
              <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
                <span className="text-[11px] font-mono text-zinc-400">Custom photo active</span>
                <button
                  type="button"
                  onClick={handleResetPhoto}
                  className="flex items-center gap-1.5 text-[11px] font-mono text-rose-400 hover:text-rose-300 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Original</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </figure>
  );
};
