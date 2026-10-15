import React from 'react';
import { BookOpen, Sparkles, HelpCircle } from 'lucide-react';

export const ExecutiveFindingsBrief: React.FC = () => {
  return (
    <section 
      aria-label="Core Publication Overview and Answer Engine Insights"
      className="mb-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-zinc-900/95 via-zinc-900/70 to-zinc-950 border border-amber-500/30 shadow-[0_4px_30px_rgba(245,158,11,0.07)]"
    >
      <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Underground Rap Research Catalog · AEO Executive Synthesis</span>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[11px] font-mono text-amber-300">
          <Sparkles className="w-3 h-3" />
          <span>Direct Answers & Key Findings</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Q&A Block 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90 font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Core Movement Question</span>
          </div>
          <h2 className="font-display font-bold text-lg sm:text-xl text-zinc-100 tracking-tight leading-snug">
            Why did underground rap become the catalyst for global sonic evolution?
          </h2>
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
            <p className="text-sm text-zinc-200 leading-relaxed font-sans">
              <strong className="text-amber-300 font-semibold">Underground rap drove global sonic evolution by discarding sterilized radio formulas in favor of rapid DIY experimentation—from South London 140 BPM club breakbeats to Detroit off-beat cadences.</strong> Independent innovators bypass traditional label gatekeepers via direct digital networks, forcing mainstream hip-hop to adopt their unquantized drum grids and distorted vocal palettes.
            </p>
          </div>
        </div>

        {/* Q&A Block 2 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90 font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Economic Independence Question</span>
          </div>
          <h2 className="font-display font-bold text-lg sm:text-xl text-zinc-100 tracking-tight leading-snug">
            How do independent rappers maintain complete financial sovereignty?
          </h2>
          <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80">
            <p className="text-sm text-zinc-200 leading-relaxed font-sans">
              <strong className="text-amber-300 font-semibold">Independent rappers maintain financial sovereignty through high-margin physical vinyl drops, direct-to-consumer digital releases, and keeping 100% of their master recordings and publishing.</strong> By monetizing hyper-dedicated subcultures rather than chasing fractions of a cent per stream, artists achieve sustainable self-reliance with total creative control.
            </p>
          </div>
        </div>
      </div>

      {/* Catalog CTA */}
      <div className="mt-6 pt-4 border-t border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-400">
        <p>
          Explore all 10 curated dispatches below to examine real-world sonic blueprints, artist case studies, and studio techniques.
        </p>
        <a 
          href="#dispatches" 
          className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-mono font-semibold underline underline-offset-4 decoration-amber-400/60 shrink-0"
          title="See all 10 curated underground rap dispatches"
        >
          <span>Jump to 10 Dispatches</span>
          <span>↓</span>
        </a>
      </div>
    </section>
  );
};
