import React from 'react';
import { ArtistPhoto } from '../types/blog';
import { Mic, Radio, Flame, Crown, Disc, Eye, Sparkles, MapPin } from 'lucide-react';

interface ArtistPhotoCardProps {
  photo: ArtistPhoto;
}

export const ArtistPhotoCard: React.FC<ArtistPhotoCardProps> = ({ photo }) => {
  const renderSymbol = () => {
    switch (photo.signatureSymbol) {
      case 'mic':
        return <Mic className="w-8 h-8 text-amber-400/80" />;
      case 'wave':
        return <Radio className="w-8 h-8 text-cyan-400/80" />;
      case 'flame':
        return <Flame className="w-8 h-8 text-rose-500/80" />;
      case 'crown':
        return <Crown className="w-8 h-8 text-amber-300/80" />;
      case 'eye':
        return <Eye className="w-8 h-8 text-purple-400/80" />;
      case 'disc':
      default:
        return <Disc className="w-8 h-8 text-emerald-400/80" />;
    }
  };

  return (
    <figure className="group rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between">
      {/* Visual Photo Area */}
      <div 
        className={`relative w-full h-52 sm:h-56 bg-gradient-to-b ${photo.lightingTone} flex flex-col justify-between p-4 overflow-hidden`}
      >
        {/* Subtle grid and grain overlay */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
            backgroundSize: '16px 16px'
          }}
        />

        {/* Ambient glow bloom */}
        <div 
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-2xl opacity-30 pointer-events-none"
          style={{ backgroundColor: photo.accentColor }}
        />

        {/* Top Tag & Location Bar */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-zinc-800/80 backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>{photo.location}</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono bg-black/40 px-2 py-0.5 rounded">
            {photo.visualTag}
          </span>
        </div>

        {/* Center Iconic Stylized Portrait Vector */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-900/90 border border-zinc-700/80 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:border-amber-400/60 transition-transform duration-300">
            {renderSymbol()}
          </div>
          <div className="mt-2 font-display font-black text-lg text-zinc-100 tracking-wide">
            {photo.name}
          </div>
          <div className="text-xs font-mono text-zinc-400">
            {photo.role}
          </div>
        </div>

        {/* Bottom subtle film watermark */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-800/40">
          <span>PORTRAIT ARCHIVE</span>
          <span className="tabular-nums font-semibold" style={{ color: photo.accentColor }}>
            ISO 400 · RAW
          </span>
        </div>
      </div>

      {/* Caption & Context Narrative */}
      <figcaption className="p-4 bg-zinc-900/50 border-t border-zinc-800/80 text-xs text-zinc-400 leading-relaxed font-sans">
        <strong className="text-zinc-200 block mb-1 font-display tracking-tight text-xs">
          {photo.name} — Cultural Context:
        </strong>
        {photo.caption}
      </figcaption>
    </figure>
  );
};
