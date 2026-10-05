import React from 'react';
import { X, Sparkles, Disc, Flame } from 'lucide-react';

interface ManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManifestoModal: React.FC<ManifestoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Editorial Header */}
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-3">
          <Sparkles className="w-4 h-4" />
          <span>Curatorial Manifesto</span>
        </div>

        <h2 className="font-display font-black text-2xl sm:text-3xl text-zinc-100 tracking-tight mb-4">
          Why The Underground Always Wins
        </h2>

        <div className="space-y-4 text-sm text-zinc-300 leading-relaxed font-sans">
          <p>
            Every monumental aesthetic revolution in contemporary music begins as an insulated subculture that corporate gatekeepers label unmarketable, crude, or abrasive.
          </p>
          <p>
            When punk rock erupted in the late 1970s, major labels dismissed three-chord distortions. When hip-hop was born in the South Bronx, commercial radio claimed it was a momentary party gimmick. When grunge took over Seattle, boardrooms were busy promoting polished hair-metal ballads.
          </p>
          <p>
            The modern rap underground is the direct intellectual heir to that countercultural continuum. In an era where algorithmic streaming monopolies reduce art to background utility music designed for office workers and gym treadmills, the underground reclaimed friction, danger, and uncompromising personal identity.
          </p>
          
          <div className="my-6 p-4 rounded-xl bg-zinc-900/80 border-l-2 border-amber-400 text-xs font-editorial-serif italic text-zinc-200 leading-relaxed">
            "We do not document the underground to help major labels commodify it. We document the underground because it is the only place on earth where human beings are still making music without asking for permission."
          </div>

          <h3 className="font-display font-bold text-base text-zinc-100 pt-2">
            The Three Inviolable Tenets of SUBCULTURE // REC
          </h3>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="font-mono text-amber-400 font-bold">01.</span>
              <span><strong className="text-zinc-200">Creative Sovereignty:</strong> Masters, publishing, and direct audience connections remain in the creator’s hands.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-amber-400 font-bold">02.</span>
              <span><strong className="text-zinc-200">Anti-Algorithmic Rigor:</strong> We celebrate deep cult devotion over superficial, passive viral metric spikes.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-amber-400 font-bold">03.</span>
              <span><strong className="text-zinc-200">Sonic Exploration:</strong> We treat bedroom producers and sound designers with the same critical reverence afforded to traditional orchestral composers.</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>

      </div>
    </div>
  );
};
