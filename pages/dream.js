import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { FEATURED_MATCHES } from '../data/matches';

const AtmosphereStars = ({ count }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <span key={i} className={`text-xs ${i <= count ? 'text-[#00e87a]' : 'text-white/10'}`}>★</span>
    ))}
  </div>
);

const DifficultyBadge = ({ level }) => {
  const colors = {
    'Hard': 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
    'Very Hard': 'text-orange-400 border-orange-400/30 bg-orange-400/5',
    'Extreme': 'text-red-400 border-red-400/30 bg-red-400/5',
  };
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded border ${colors[level] || 'text-fog border-white/10'}`}>
      {level}
    </span>
  );
};

const MatchCard = ({ match, onDream }) => (
  <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#00e87a]/20 transition-all duration-500 overflow-hidden cursor-pointer">
    {/* Top gradient bar */}
    <div className={`h-1 w-full bg-gradient-to-r ${match.coverBg}`}/>

    <div className="p-6">
      {/* Competition + Flag */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-xs text-fog tracking-widest">{match.competition}</span>
        <span className="text-xl">{match.flag}</span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between mb-2">
        <div className="text-center flex-1">
          <div className="text-3xl mb-1">{match.homeBadge}</div>
          <div className="font-display text-sm text-chalk font-bold leading-tight">{match.home}</div>
        </div>
        <div className="flex flex-col items-center px-4">
          <div className="font-mono text-xs text-fog mb-1">{match.date}</div>
          <div className="font-display text-xl text-[#00e87a] font-black">VS</div>
          <div className="font-mono text-xs text-fog mt-1">{match.time}</div>
        </div>
        <div className="text-center flex-1">
          <div className="text-3xl mb-1">{match.awayBadge}</div>
          <div className="font-display text-sm text-chalk font-bold leading-tight">{match.away}</div>
        </div>
      </div>

      {/* Stadium */}
      <div className="text-center mb-4">
        <div className="font-mono text-xs text-fog">🏟 {match.stadium} · {match.city}</div>
      </div>

      {/* Description */}
      <p className="text-fog text-xs leading-relaxed mb-4 text-center">{match.description}</p>

      {/* Stats row */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
        <div>
          <div className="font-mono text-xs text-fog mb-1">ATMOSPHERE</div>
          <AtmosphereStars count={match.atmosphere}/>
        </div>
        <div className="text-right">
          <div className="font-mono text-xs text-fog mb-1">TICKETS FROM</div>
          <div className="font-display text-sm text-chalk font-bold">{match.ticketPrice}</div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {match.tags.map(t => (
          <span key={t} className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-fog">{t}</span>
        ))}
        <DifficultyBadge level={match.difficulty}/>
      </div>

      {/* CTA */}
      <Link href={`/trip/${match.slug}`}
        onClick={() => onDream(match.id)}
        className="block w-full text-center py-3 rounded-lg bg-[#00e87a] text-pitch font-mono text-xs font-bold hover:bg-[#00ff88] transition-all duration-300 tracking-widest">
        PLAN THIS TRIP →
      </Link>
    </div>
  </div>
);

export default function DreamPage() {
  const [dreamList, setDreamList] = useState([]);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Premier League', 'La Liga', 'UEFA', 'Rivalry'];
  const filtered = filter === 'All' ? FEATURED_MATCHES : FEATURED_MATCHES.filter(m => m.tags.includes(filter) || m.competition === filter);

  const onDream = (id) => {
    setDreamList(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  return (
    <>
      <Head>
        <title>Dream — Football Passport</title>
        <meta name="description" content="Find your dream match and start planning your football travel adventure."/>
      </Head>

      <div className="min-h-screen bg-pitch">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-pitch/95 backdrop-blur-sm border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#00e87a] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <path d="M12 2L13.5 7H19L14.5 10L16 15L12 12L8 15L9.5 10L5 7H10.5Z" fill="#00e87a"/>
              </svg>
            </div>
            <span className="font-mono text-sm font-bold tracking-wider text-chalk">FOOTBALL<span className="text-[#00e87a]">PASSPORT</span></span>
          </Link>
          <div className="flex items-center gap-3">
            {dreamList.length > 0 && (
              <span className="font-mono text-xs text-[#00e87a]">{dreamList.length} dream{dreamList.length > 1 ? 's' : ''} saved</span>
            )}
            <Link href="/passport" className="font-mono text-xs px-4 py-2 rounded border border-[#00e87a]/50 text-[#00e87a] hover:bg-[#00e87a] hover:text-pitch transition-all duration-300 tracking-wider">
              MY PASSPORT
            </Link>
          </div>
        </nav>

        <div className="pt-28 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00e87a]/30 bg-[#00e87a]/5 mb-6">
                <span className="text-lg">🌟</span>
                <span className="font-mono text-xs text-[#00e87a] tracking-widest">STAGE 1 OF 6 · DREAM</span>
              </div>
              <h1 className="font-display font-black text-5xl md:text-6xl text-chalk mb-4">
                What's your<br/><span className="text-gradient-green">dream match?</span>
              </h1>
              <p className="font-body text-fog text-lg max-w-xl mx-auto">
                Pick the match. We'll handle everything else — tickets, flights, hotels, stadium, memories.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 justify-center mb-10">
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)}
                  className={`font-mono text-xs px-4 py-2 rounded-full border transition-all duration-300 ${filter === cat ? 'bg-[#00e87a] text-pitch border-[#00e87a]' : 'border-white/10 text-fog hover:border-white/30 hover:text-chalk'}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Match Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filtered.map(match => (
                <MatchCard key={match.id} match={match} onDream={onDream}/>
              ))}
            </div>

            {/* Don't see your match */}
            <div className="text-center mt-16 p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="text-3xl mb-3">⚽</div>
              <h3 className="font-display text-xl text-chalk font-bold mb-2">Don't see your dream match?</h3>
              <p className="text-fog text-sm mb-4">More fixtures coming weekly. Drop us the match and we'll build the guide.</p>
              <a href="mailto:hello@footballpassport.app?subject=Add my dream match"
                className="inline-block font-mono text-xs px-6 py-3 rounded-lg border border-[#00e87a]/40 text-[#00e87a] hover:bg-[#00e87a] hover:text-pitch transition-all duration-300 tracking-wider">
                REQUEST A MATCH
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
