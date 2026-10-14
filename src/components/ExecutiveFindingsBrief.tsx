import React from 'react';
import { BookOpen } from 'lucide-react';

export const ExecutiveFindingsBrief: React.FC = () => {
  return (
    <section 
      aria-label="Core Publication Thesis"
      className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.06)]"
    >
      <div className="flex items-center gap-2 text-[11px] font-mono text-amber-400 uppercase tracking-widest mb-2 font-bold">
        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
        <span>Publication Overview · Core Thesis</span>
      </div>
      <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-sans">
        For over a decade, commercial streaming algorithms and radio gatekeepers promoted sterilized, risk-averse formulas. In response, an uncoordinated worldwide counter-insurgency erupted from South London basements, Detroit living rooms, Atlanta home studios, and encrypted Discord channels. This website investigates <span className="text-amber-300 font-semibold">10 historical dispatches</span> that prove true artistic innovation, community devotion, and financial sovereignty always stem from the underground.
      </p>
    </section>
  );
};
