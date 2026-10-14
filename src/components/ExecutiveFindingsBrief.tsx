import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ARTICLES } from '../data/articles';
import { 
  FileText, Sparkles, TrendingUp, Radio, ChevronDown, ChevronUp, 
  ArrowRight, ShieldCheck, Zap, Disc3, Layers
} from 'lucide-react';

interface ExecutiveFindingsBriefProps {
  onSelectArticle?: (slug: string) => void;
}

export const ExecutiveFindingsBrief: React.FC<ExecutiveFindingsBriefProps> = ({ onSelectArticle }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const handleOpen = (slug: string) => {
    if (onSelectArticle) {
      onSelectArticle(slug);
    } else {
      navigate(`/${slug}`);
    }
  };

  return (
    <section 
      aria-label="Executive Summary and Research Findings"
      className="mb-10 rounded-2xl bg-gradient-to-b from-zinc-900/90 via-zinc-950/95 to-black border border-amber-500/30 shadow-[0_0_24px_rgba(245,158,11,0.08)] overflow-hidden"
    >
      {/* Top Banner Header */}
      <div className="p-5 sm:p-6 pb-4 border-b border-zinc-800/80 bg-zinc-950/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-1.5">
            <span className="px-2 py-0.5 rounded bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider text-[10px]">
              Curatorial Brief
            </span>
            <span className="text-zinc-500">·</span>
            <span className="text-amber-400 font-semibold tracking-widest uppercase text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Executive Summary & 10-Dispatch Findings
            </span>
            <span className="text-zinc-500 hidden sm:inline">·</span>
            <span className="text-zinc-400 font-mono text-[11px] hidden sm:inline">
              10 Groundbreaking Monographs Analyzed
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl text-zinc-100 tracking-tight leading-tight">
            The Underground Rap Blueprint: Findings & Synthesis
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-3xl leading-relaxed">
            A comprehensive overview analyzing how 10 autonomous movements and renegade collectives dismantled major-label monopolies to invent modern hip-hop.
          </p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="self-start md:self-auto px-3.5 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 text-xs font-mono flex items-center gap-2 transition-colors shrink-0 shadow-sm"
          title={isExpanded ? 'Collapse executive summary' : 'Expand full executive summary'}
        >
          <span>{isExpanded ? 'Collapse Brief' : 'Read Full Synthesis'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Expandable Findings Body */}
      {isExpanded && (
        <div className="p-5 sm:p-7 space-y-7 animate-fadeIn">
          {/* Executive Overview Box */}
          <div className="p-4 sm:p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2 font-bold">
              <FileText className="w-3.5 h-3.5" />
              <span>Core Thesis & Publication Purpose</span>
            </div>
            <p className="text-sm text-zinc-200 leading-relaxed font-sans">
              For over a decade, commercial streaming algorithms and radio gatekeepers promoted sterilized, risk-averse formulas. In response, an uncoordinated worldwide counter-insurgency erupted from South London basements, Detroit living rooms, Atlanta home studios, and encrypted Discord channels. This website investigates <span className="text-amber-300 font-semibold">10 historical dispatches</span> that prove true artistic innovation, community devotion, and financial sovereignty always stem from the underground.
            </p>
          </div>

          {/* 3 Core Curatorial Findings Columns */}
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>3 Primary Research Findings Across the 10 Dispatches</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Finding 1 */}
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/70 hover:border-amber-400/40 transition-colors">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                  <span className="text-amber-400 font-bold">Finding 01</span>
                  <span className="text-[10px] text-zinc-500">Cadence & Voice</span>
                </div>
                <h2 className="font-display font-bold text-base text-zinc-100 mb-2">
                  Vocal Elasticity & Rhythmic Reconstruction
                </h2>
                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  Underground innovators dismantled traditional diction and rigid meter. Between Young Thug’s improvisational vocal punch-ins, SahBabii’s whisper-soft ambient plugg, and Migos’ omnipresent 3/4-in-4/4 triplet grid, the voice became an elastic jazz horn.
                </p>
                <div className="text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-800/60">
                  <span className="text-zinc-500">Case Studies:</span> Dispatches #03, #04, #06
                </div>
              </div>

              {/* Finding 2 */}
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/70 hover:border-amber-400/40 transition-colors">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                  <span className="text-amber-400 font-bold">Finding 02</span>
                  <span className="text-[10px] text-zinc-500">Geography & Clubs</span>
                </div>
                <h2 className="font-display font-bold text-base text-zinc-100 mb-2">
                  Transatlantic Rave Collisions & Dragged Cadences
                </h2>
                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  British underground disruptors rejected 140 BPM drill orthodoxy to weld high-speed Jersey club kicks and rave breakbeats to localized road slang. Concurrently, Detroit and Chicago engineered an inverse, slow-motion conversational flow that redefined cult fandom.
                </p>
                <div className="text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-800/60">
                  <span className="text-zinc-500">Case Studies:</span> Dispatches #01, #02, #05
                </div>
              </div>

              {/* Finding 3 */}
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/70 hover:border-amber-400/40 transition-colors">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
                  <span className="text-amber-400 font-bold">Finding 03</span>
                  <span className="text-[10px] text-zinc-500">Economics & Sound</span>
                </div>
                <h2 className="font-display font-bold text-base text-zinc-100 mb-2">
                  Radical Scarcity, SP-404 Noise & Lyrical Virtuosity
                </h2>
                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  Rather than surrendering masters for fractions of a cent on Spotify, Mach-Hommy pioneered $1,000 fine-art vinyl scarcity. Meanwhile, JPEGMAFIA, Danny Brown, Sinn6r, and JID proved that abrasive tape distortion and Olympic polyrhythms triumph over sanitized pop rap.
                </p>
                <div className="text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-800/60">
                  <span className="text-zinc-500">Case Studies:</span> Dispatches #07, #08, #09, #10
                </div>
              </div>

            </div>
          </div>

          {/* Quick-Jump Index for all 10 Curated Dispatches */}
          <div className="pt-2">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Jump Directly to Any of the 10 Investigated Dispatches</span>
              </div>
              <span className="text-[11px] font-mono text-amber-400/90 font-medium">
                Click any dispatch to read full monograph
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {ARTICLES.map((art, idx) => (
                <button
                  key={art.id}
                  onClick={() => handleOpen(art.slug)}
                  className="p-3 rounded-lg bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-amber-400/50 text-left transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-zinc-500 mb-1">
                      <span className="text-amber-400 font-bold">#{String(idx + 1).padStart(2, '0')}</span>
                      <span className="truncate">{art.category}</span>
                    </div>
                    <div className="text-xs font-display font-bold text-zinc-200 group-hover:text-amber-300 line-clamp-2 transition-colors">
                      {art.title.replace(' | Subculture', '')}
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-zinc-800/50 flex items-center justify-between text-[10px] font-mono text-zinc-400 group-hover:text-amber-400">
                    <span className="truncate max-w-[120px] text-zinc-400 font-semibold">{art.mainKeyword.split(' ')[0]} {art.mainKeyword.split(' ')[1] || ''}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Key Publication Metrics Bar */}
          <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
              <div className="font-display font-black text-xl text-amber-400">10</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Exhaustive Monographs</div>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
              <div className="font-display font-black text-xl text-emerald-400">100%</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Artist Sovereignty</div>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
              <div className="font-display font-black text-xl text-cyan-400">3/4 in 4/4</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Rhythm Disruption</div>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
              <div className="font-display font-black text-xl text-purple-400">$1,000</div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Fine Art Scarcity</div>
            </div>
          </div>

        </div>
      )}
    </section>
  );
};
