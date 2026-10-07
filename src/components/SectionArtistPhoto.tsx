import React, { useState } from 'react';
import { ArtistProfile } from '../types/blog';
import { Camera, MapPin, Mic, Radio, Flame, Crown, Disc, Eye } from 'lucide-react';

interface SectionArtistPhotoProps {
  artist: ArtistProfile;
}

export const SectionArtistPhoto: React.FC<SectionArtistPhotoProps> = ({ artist }) => {
  const [imageError, setImageError] = useState<boolean>(false);

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
    <figure className="my-10 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/90 shadow-2xl transition-all duration-300 not-prose">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 items-stretch">
        
        {/* Visual Photo Area */}
        <div className="md:col-span-6 relative min-h-[300px] sm:min-h-[340px] overflow-hidden bg-zinc-900 flex items-center justify-center">
          {!imageError && artist.imageUrl ? (
            <img
              src={artist.imageUrl}
              alt={`Archival photograph of ${artist.name}`}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-top sm:object-center grayscale contrast-125 hover:grayscale-0 transition-all duration-700 scale-100 hover:scale-105"
            />
          ) : (
            <div 
              className={`w-full h-full min-h-[300px] bg-gradient-to-br ${artist.fallbackGradient} p-6 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/70 border border-zinc-800">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{artist.location}</span>
                </span>
                <span className="text-[10px] uppercase font-mono text-zinc-400 bg-black/50 px-2 py-0.5 rounded border border-zinc-800/60">
                  ARCHIVAL NEGATIVE
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

          {/* Top Camera Label */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/85 backdrop-blur-md border border-zinc-800 text-[11px] font-mono text-zinc-300">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Documented Portrait</span>
          </div>

          {/* Bottom Watermark */}
          <div className="absolute bottom-3 left-3 text-[11px] font-mono text-zinc-300 flex items-center gap-1.5 bg-black/70 px-2.5 py-0.5 rounded border border-zinc-800/60">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>{artist.location}</span>
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

          {/* Verified Provenance Footer */}
          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>PROVENANCE: INDEPENDENT ARCHIVE</span>
            <span className="text-amber-400/90 uppercase">VERIFIED ARTIST</span>
          </div>
        </div>

      </div>
    </figure>
  );
};
