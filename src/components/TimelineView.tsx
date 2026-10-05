import React from 'react';
import { TIMELINE_MILESTONES } from '../data/timeline';
import { Radio, Calendar, Flame, Compass } from 'lucide-react';

export const TimelineView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-3">
          <Compass className="w-4 h-4" />
          <span>Historical Archive</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-zinc-100 tracking-tight mb-4">
          Chronology of the Underground Insurgency
        </h2>
        <p className="text-zinc-400 text-base max-w-2xl mx-auto leading-relaxed">
          How a fringe movement of teenagers on dial-up internet and cracked DAWs completely dismantled forty years of corporate record label dominance.
        </p>
      </div>

      {/* Timeline Rail */}
      <div className="relative border-l border-zinc-800 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
        {TIMELINE_MILESTONES.map((milestone, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Node marker */}
            <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-4 h-4 rounded-full bg-zinc-950 border-2 border-amber-400 group-hover:scale-125 transition-transform" />

            {/* Era Badge and Title */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="font-mono text-xs font-bold text-amber-400 tabular-nums">
                {milestone.year}
              </span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span className="font-mono text-xs text-zinc-400">
                {milestone.artistOrMovement}
              </span>
            </div>

            <h3 className="font-display font-bold text-xl sm:text-2xl text-zinc-100 mb-3 group-hover:text-amber-400 transition-colors">
              {milestone.title}
            </h3>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-4 font-sans">
              {milestone.description}
            </p>

            {/* Cultural Paradigm Shift Box */}
            <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs">
              <span className="font-mono text-amber-400 uppercase tracking-wider font-semibold mr-2">
                Paradigm Shift:
              </span>
              <span className="text-zinc-400 leading-relaxed">
                {milestone.culturalShift}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
