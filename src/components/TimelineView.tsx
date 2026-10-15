import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TIMELINE_MILESTONES } from '../data/timeline';
import { TimelineMilestone } from '../types/blog';
import { Calendar, Compass, Disc3, Sparkles, MapPin, Tag, Search, Filter, ArrowRight, BookOpen } from 'lucide-react';

function getDispatchForMilestone(m: TimelineMilestone): { slug: string; label: string } | null {
  const text = `${m.title} ${m.artistOrMovement} ${m.artists.join(' ')}`.toLowerCase();
  if (text.includes('len') || text.includes('lancey') || text.includes('drill') || text.includes('uk')) {
    return { slug: 'uk-underground-british-drill-renaissance', label: 'Read UK underground British drill renaissance dispatch' };
  }
  if (text.includes('lucki') || text.includes('veeze')) {
    return { slug: 'lucki-veeze-detroit-nonchalant-underground-rap', label: 'Explore Lucki and Veeze nonchalant underground rap dispatch' };
  }
  if (text.includes('young thug') || text.includes('gunna') || text.includes('keed')) {
    return { slug: 'young-thug-atlanta-melodic-trap-vocal-evolution', label: 'Study Young Thug Atlanta melodic trap evolution dispatch' };
  }
  if (text.includes('sahbabii')) {
    return { slug: 'sahbabii-ethereal-underwater-ambient-plugg-trap', label: 'Discover SahBabii ethereal underwater ambient plugg trap dispatch' };
  }
  if (text.includes('nemzzz') || text.includes('yt') || text.includes('club rap')) {
    return { slug: 'uk-club-rap-manchester-transatlantic-street-drill', label: 'Examine UK club rap transatlantic street drill dispatch' };
  }
  if (text.includes('migos') || text.includes('triplet')) {
    return { slug: 'migos-atlanta-triplet-flow-trap-rhythm-cadence', label: 'Analyze Migos Atlanta triplet flow rhythm cadence dispatch' };
  }
  if (text.includes('sinn6r') || text.includes('slayr') || text.includes('distorted') || text.includes('808')) {
    return { slug: 'soundcloud-underground-dark-ambient-distorted-808s', label: 'Investigate SoundCloud underground dark ambient distorted 808s dispatch' };
  }
  if (text.includes('danny brown') || text.includes('jpegmafia')) {
    return { slug: 'jpegmafia-danny-brown-industrial-experimental-hip-hop', label: 'Read JPEGMAFIA and Danny Brown industrial experimental hip-hop dispatch' };
  }
  if (text.includes('mach-hommy') || text.includes('fahim') || text.includes('preservation')) {
    return { slug: 'mach-hommy-underground-vinyl-drumless-boom-bap', label: 'Explore Mach-Hommy underground vinyl drumless boom-bap dispatch' };
  }
  if (text.includes('jid') || text.includes('earthgang') || text.includes('spillage')) {
    return { slug: 'jid-spillage-village-atlanta-polyrhythmic-rap', label: 'Study JID Spillage Village Atlanta polyrhythmic rap dispatch' };
  }
  return null;
}

export const TimelineView: React.FC = () => {
  const [selectedEra, setSelectedEra] = useState<string>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchArtist, setSearchArtist] = useState<string>('');

  const eras = [
    'All',
    '2008–2015: Foundations & DIY',
    '2016–2019: Soundcloud & Experimental Vanguard',
    '2020–2023: Opium, UK Insurgency & Abstract',
    '2024–Present: The Sovereign Auteurs',
  ];

  const regions = [
    'All',
    'Detroit / Midwest',
    'UK & London Underground',
    'Atlanta & South',
    'East Coast / Abstract',
    'West Coast / Digital',
  ];

  const spotlightArtists = [
    'All',
    'Danny Brown',
    'JID',
    'Mach-Hommy',
    'JPEGMAFIA',
    'Opium',
    'UK Underground',
  ];

  const filteredMilestones = useMemo(() => {
    return TIMELINE_MILESTONES.filter((m) => {
      if (selectedEra !== 'All' && m.era !== selectedEra) return false;
      if (selectedRegion !== 'All' && m.region !== selectedRegion) return false;

      if (searchArtist) {
        const query = searchArtist.toLowerCase();
        if (query === 'opium') {
          const isOpium = m.artistOrMovement.toLowerCase().includes('opium') ||
            m.artists.some((a) => ['playboi carti', 'ken carson', 'destroy lonely', 'homixide gang', 'f1lthy'].includes(a.toLowerCase()));
          if (!isOpium) return false;
        } else if (query === 'uk underground') {
          const isUk = m.region.includes('UK') || m.title.toLowerCase().includes('uk') || m.artists.some(a => ['skepta', '67', 'gigas', 'lancey foux', 'knucks', 'casisdead'].includes(a.toLowerCase()));
          if (!isUk) return false;
        } else {
          const matchesTitle = m.title.toLowerCase().includes(query);
          const matchesArtist = m.artists.some((a) => a.toLowerCase().includes(query));
          const matchesMovement = m.artistOrMovement.toLowerCase().includes(query);
          const matchesDesc = m.description.toLowerCase().includes(query);
          if (!matchesTitle && !matchesArtist && !matchesMovement && !matchesDesc) return false;
        }
      }

      return true;
    });
  }, [selectedEra, selectedRegion, searchArtist]);

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Editorial Header */}
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-widest mb-3">
          <Compass className="w-4 h-4" />
          <span>Curatorial Historical Archive</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-zinc-100 tracking-tight mb-4">
          Chronology of the Underground Insurgency
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed font-sans">
          A definitive timeline tracking how bedroom renegades, UK innovators, and uncompromising auteurs—from <strong className="text-zinc-200">Danny Brown</strong> and <strong className="text-zinc-200">Mach-Hommy</strong> to <strong className="text-zinc-200">JID</strong>, <strong className="text-zinc-200">JPEGMAFIA</strong>, <strong className="text-zinc-200">Opium</strong>, and the <strong className="text-zinc-200">UK road-rap vanguard</strong>—dismantled the traditional record industry.
        </p>
      </div>

      {/* Interactive Curatorial Filter Console */}
      <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 mb-10 space-y-4">
        
        {/* Spotlight Artist Quick Selectors */}
        <div>
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Spotlight Vanguard Quick Filter</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {spotlightArtists.map((artist) => {
              const active = (artist === 'All' && !searchArtist) || searchArtist.toLowerCase() === artist.toLowerCase();
              return (
                <button
                  key={artist}
                  onClick={() => setSearchArtist(artist === 'All' ? '' : artist)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    active
                      ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                      : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {artist}
                </button>
              );
            })}
          </div>
        </div>

        {/* Era Segmented Selector */}
        <div className="pt-3 border-t border-zinc-800/60">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Filter by Historical Era</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {eras.map((era) => {
              const active = selectedEra === era;
              return (
                <button
                  key={era}
                  onClick={() => setSelectedEra(era)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans transition-all whitespace-nowrap ${
                    active
                      ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                      : 'bg-zinc-950/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
                  }`}
                >
                  {era}
                </button>
              );
            })}
          </div>
        </div>

        {/* Region Selector & Reset */}
        <div className="pt-3 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-zinc-500 uppercase tracking-wider">Region:</span>
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  selectedRegion === reg
                    ? 'text-amber-400 border border-amber-500/40 bg-amber-500/10'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {(selectedEra !== 'All' || selectedRegion !== 'All' || searchArtist) && (
            <button
              onClick={() => {
                setSelectedEra('All');
                setSelectedRegion('All');
                setSearchArtist('');
              }}
              className="text-zinc-500 hover:text-amber-400 font-mono transition-colors"
            >
              Reset Filters ({filteredMilestones.length} shown)
            </button>
          )}
        </div>

      </div>

      {/* Timeline Stream */}
      {filteredMilestones.length > 0 ? (
        <div className="relative border-l-2 border-zinc-800/80 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          {filteredMilestones.map((m, idx) => (
            <article 
              key={idx} 
              className="relative group p-6 sm:p-7 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800/70 hover:border-zinc-700 transition-all duration-200"
            >
              {/* Timeline Node Marker */}
              <div className="absolute -left-[33px] sm:-left-[49px] top-6 w-4 h-4 rounded-full bg-zinc-950 border-2 border-amber-400 group-hover:scale-125 group-hover:bg-amber-400 transition-all" />

              {/* Header: Date, Region, Era */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 font-mono text-xs text-amber-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="font-bold tabular-nums">{m.date}</span>
                  <span aria-hidden="true" className="text-zinc-600">·</span>
                  <span className="text-zinc-400">{m.year}</span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
                  <MapPin className="w-3 h-3 text-zinc-500" />
                  <span>{m.region}</span>
                </div>
              </div>

              {/* Title & Artist Movement */}
              <h3 className="font-display font-bold text-xl sm:text-2xl text-zinc-100 group-hover:text-amber-400 transition-colors mb-2 text-balance">
                {m.title}
              </h3>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400 mb-4">
                <span className="text-zinc-300 font-semibold">Vanguard Figure:</span>
                <span>{m.artistOrMovement}</span>
              </div>

              {/* Narrative Prose */}
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans mb-5">
                {m.description}
              </p>

              {/* Paradigm Shift / Cultural Consequence Callout */}
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 mb-4 text-xs">
                <div className="font-mono text-amber-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>Cultural Paradigm Shift</span>
                </div>
                <div className="text-zinc-300 leading-relaxed">
                  {m.culturalShift}
                </div>
              </div>

              {/* Key Works / Discography Documents */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/60 text-xs">
                <span className="font-mono text-zinc-500">Key Sonic Documents:</span>
                {m.keyWorks.map((work, wIdx) => (
                  <span 
                    key={wIdx} 
                    className="font-mono text-[11px] text-zinc-300 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800"
                  >
                    {work}
                  </span>
                ))}
              </div>

              {/* Connected Curatorial Dispatch Link with Strong Keyword Anchor Text */}
              {(() => {
                const dispatch = getDispatchForMilestone(m);
                if (!dispatch) return null;
                return (
                  <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                    <Link
                      to={`/${dispatch.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 font-mono transition-colors"
                      title={dispatch.label}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{dispatch.label} →</span>
                    </Link>
                  </div>
                );
              })()}
            </article>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8">
          <Disc3 className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-zinc-200 mb-1">
            No Milestones Found For This Filter
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
            Try resetting your spotlight artist or era filter to view the complete underground chronology.
          </p>
          <button
            onClick={() => {
              setSelectedEra('All');
              setSelectedRegion('All');
              setSearchArtist('');
            }}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
          >
            Clear Timeline Filters
          </button>
        </div>
      )}

      {/* Bottom Historical Note & Internal Anchor CTA */}
      <div className="mt-16 p-8 rounded-2xl border border-zinc-800/80 bg-zinc-950/60 text-center">
        <h4 className="font-display font-bold text-lg text-zinc-100 mb-2">
          The Living Underground Archive
        </h4>
        <p className="text-xs text-zinc-400 max-w-xl mx-auto leading-relaxed mb-6">
          Historical entries are compiled through direct primary source audio documents, independent tape releases, and concert archives. Timeline updated continuously as new countercultural movements emerge.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md"
          title="Browse All 10 Underground Hip-Hop Dispatches"
        >
          <span>Browse All 10 Underground Hip-Hop Dispatches →</span>
        </Link>
      </div>
    </div>
  );
};
