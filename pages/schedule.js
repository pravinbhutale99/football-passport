import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

const LEAGUES = [
  { code: 'PL',  name: 'Premier League',     flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#3d195b' },
  { code: 'PD',  name: 'La Liga',            flag: '🇪🇸', color: '#ee8707' },
  { code: 'BL1', name: 'Bundesliga',         flag: '🇩🇪', color: '#d20515' },
  { code: 'SA',  name: 'Serie A',            flag: '🇮🇹', color: '#024494' },
  { code: 'FL1', name: 'Ligue 1',            flag: '🇫🇷', color: '#dba111' },
  { code: 'CL',  name: 'Champions League',   flag: '⭐', color: '#1b3f7a' },
  { code: 'EL',  name: 'Europa League',      flag: '🟠', color: '#e84d0e' },
  { code: 'EC',  name: 'Euro Championship',  flag: '🇪🇺', color: '#003399' },
];

const STATUS_CONFIG = {
  SCHEDULED:  { label: 'Upcoming',  color: 'text-fog',          bg: 'bg-white/5',           dot: 'bg-fog' },
  TIMED:      { label: 'Upcoming',  color: 'text-fog',          bg: 'bg-white/5',           dot: 'bg-fog' },
  IN_PLAY:    { label: 'LIVE',      color: 'text-red-400',      bg: 'bg-red-400/10',        dot: 'bg-red-400 animate-pulse' },
  PAUSED:     { label: 'HT',        color: 'text-yellow-400',   bg: 'bg-yellow-400/10',     dot: 'bg-yellow-400' },
  FINISHED:   { label: 'FT',        color: 'text-[#00e87a]',    bg: 'bg-[#00e87a]/5',       dot: 'bg-[#00e87a]' },
  POSTPONED:  { label: 'PPD',       color: 'text-orange-400',   bg: 'bg-orange-400/10',     dot: 'bg-orange-400' },
  CANCELLED:  { label: 'CANC',      color: 'text-red-600',      bg: 'bg-red-600/10',        dot: 'bg-red-600' },
  SUSPENDED:  { label: 'SUSP',      color: 'text-orange-400',   bg: 'bg-orange-400/10',     dot: 'bg-orange-400' },
};

const API_KEY = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY || 'f68179f31eb44e6c8df523f3535e32ac';

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
};

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const formatIST = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }) + ' IST';
};

// ── Match Card ─────────────────────────────────────────────────────────────
const MatchCard = ({ match }) => {
  const status = STATUS_CONFIG[match.status] || STATUS_CONFIG.SCHEDULED;
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';
  const hasScore = isLive || isFinished;

  const homeScore = match.score?.fullTime?.home ?? match.score?.halfTime?.home ?? null;
  const awayScore = match.score?.fullTime?.away ?? match.score?.halfTime?.away ?? null;

  return (
    <div className={`group relative p-4 rounded-xl border transition-all duration-300 hover:border-[#00e87a]/20 hover:bg-white/[0.04] ${isLive ? 'border-red-400/20 bg-red-400/5' : 'border-white/5 bg-white/[0.02]'}`}>
      <div className="flex items-center gap-3">

        {/* Status */}
        <div className={`flex-shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-md ${status.bg} min-w-[52px] justify-center`}>
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${status.dot}`}/>
          <span className={`font-mono text-xs font-bold ${status.color}`}>{status.label}</span>
        </div>

        {/* Teams + Score */}
        <div className="flex-1 min-w-0">
          {/* Home */}
          <div className="flex items-center justify-between mb-1">
            <span className={`font-body text-sm truncate ${hasScore && homeScore > awayScore ? 'text-chalk font-semibold' : 'text-chalk'}`}>
              {match.homeTeam.shortName || match.homeTeam.name}
            </span>
            {hasScore && (
              <span className={`font-mono text-lg font-black ml-3 flex-shrink-0 ${homeScore > awayScore ? 'text-[#00e87a]' : 'text-chalk'}`}>
                {homeScore}
              </span>
            )}
          </div>
          {/* Away */}
          <div className="flex items-center justify-between">
            <span className={`font-body text-sm truncate ${hasScore && awayScore > homeScore ? 'text-chalk font-semibold' : 'text-chalk'}`}>
              {match.awayTeam.shortName || match.awayTeam.name}
            </span>
            {hasScore && (
              <span className={`font-mono text-lg font-black ml-3 flex-shrink-0 ${awayScore > homeScore ? 'text-[#00e87a]' : 'text-chalk'}`}>
                {awayScore}
              </span>
            )}
          </div>
        </div>

        {/* Time / Info */}
        <div className="flex-shrink-0 text-right ml-2">
          {!hasScore ? (
            <>
              <div className="font-mono text-xs text-chalk">{formatTime(match.utcDate)}</div>
              <div className="font-mono text-xs text-fog mt-0.5">{formatIST(match.utcDate)}</div>
            </>
          ) : isLive ? (
            <div className="font-mono text-xs text-red-400 font-bold">
              {match.minute ? `${match.minute}'` : 'LIVE'}
            </div>
          ) : (
            <div className="font-mono text-xs text-fog">Full Time</div>
          )}
          <div className="font-mono text-xs text-fog/50 mt-1">MD{match.matchday}</div>
        </div>

        {/* Plan Trip arrow */}
        <Link href="/dream"
          className="flex-shrink-0 w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center text-fog hover:border-[#00e87a]/40 hover:text-[#00e87a] transition-all opacity-0 group-hover:opacity-100"
          title="Plan this trip">
          <span className="text-xs">→</span>
        </Link>
      </div>

      {/* Match date row */}
      <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between">
        <span className="font-mono text-xs text-fog/50">{formatDate(match.utcDate)}</span>
        {match.venue && <span className="font-mono text-xs text-fog/40 truncate ml-2 max-w-[160px]">{match.venue}</span>}
      </div>
    </div>
  );
};

// ── Matchday Group ─────────────────────────────────────────────────────────
const MatchdayGroup = ({ matchday, matches }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3 mb-3">
      <div className="font-mono text-xs text-[#00e87a] tracking-widest">MATCHDAY {matchday}</div>
      <div className="flex-1 h-px bg-white/5"/>
      <div className="font-mono text-xs text-fog">{matches.length} matches</div>
    </div>
    <div className="space-y-2">
      {matches.map(m => <MatchCard key={m.id} match={m}/>)}
    </div>
  </div>
);

// ── Skeleton loader ────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-14 h-8 rounded-md bg-white/5"/>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/5 rounded w-3/4"/>
        <div className="h-4 bg-white/5 rounded w-2/3"/>
      </div>
      <div className="w-12 space-y-1">
        <div className="h-3 bg-white/5 rounded"/>
        <div className="h-3 bg-white/5 rounded w-2/3"/>
      </div>
    </div>
  </div>
);

// ── Main Schedule Page ─────────────────────────────────────────────────────
export default function SchedulePage() {
  const [activeLeague, setActiveLeague] = useState('PL');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filter, setFilter] = useState('all'); // all | upcoming | live | finished
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMatches = useCallback(async (leagueCode) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.football-data.org/v4/competitions/${leagueCode}/matches?status=SCHEDULED,TIMED,IN_PLAY,PAUSED,FINISHED&limit=100`,
        { headers: { 'X-Auth-Token': API_KEY } }
      );
      if (!res.ok) {
        if (res.status === 429) throw new Error('Rate limit reached. Please wait a moment.');
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const data = await res.json();
      setMatches(data.matches || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches(activeLeague);
  }, [activeLeague, fetchMatches]);

  // Auto-refresh every 60s if there are live matches
  useEffect(() => {
    const hasLive = matches.some(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
    if (!hasLive) return;
    const interval = setInterval(() => fetchMatches(activeLeague), 60000);
    return () => clearInterval(interval);
  }, [matches, activeLeague, fetchMatches]);

  // Filter + search
  const filteredMatches = matches.filter(m => {
    const statusMatch =
      filter === 'all' ? true :
      filter === 'live' ? (m.status === 'IN_PLAY' || m.status === 'PAUSED') :
      filter === 'upcoming' ? (m.status === 'SCHEDULED' || m.status === 'TIMED') :
      filter === 'finished' ? m.status === 'FINISHED' : true;

    const searchMatch = searchQuery === '' ? true :
      m.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  // Group by matchday
  const grouped = filteredMatches.reduce((acc, m) => {
    const key = m.matchday || 0;
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  const sortedMatchdays = Object.keys(grouped).map(Number).sort((a, b) => {
    // Put matchdays with upcoming/live matches first, finished at the bottom
    const aHasUpcoming = grouped[a].some(m => m.status === 'SCHEDULED' || m.status === 'TIMED' || m.status === 'IN_PLAY');
    const bHasUpcoming = grouped[b].some(m => m.status === 'SCHEDULED' || m.status === 'TIMED' || m.status === 'IN_PLAY');
    if (aHasUpcoming && !bHasUpcoming) return -1;
    if (!aHasUpcoming && bHasUpcoming) return 1;
    return b - a;
  });

  const liveCount = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED').length;
  const currentLeague = LEAGUES.find(l => l.code === activeLeague);

  return (
    <>
      <Head>
        <title>Schedule — Football Passport</title>
        <meta name="description" content="Live scores and fixtures for Premier League, La Liga, Bundesliga, Serie A, Ligue 1 and Champions League."/>
      </Head>

      <div className="min-h-screen bg-pitch">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-pitch/95 backdrop-blur-sm border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full border-2 border-[#00e87a] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
                <path d="M12 2L13.5 7H19L14.5 10L16 15L12 12L8 15L9.5 10L5 7H10.5Z" fill="#00e87a"/>
              </svg>
            </div>
            <span className="font-mono text-sm font-bold tracking-wider text-chalk">FOOTBALL<span className="text-[#00e87a]">PASSPORT</span></span>
          </Link>
          <div className="flex items-center gap-3">
            {liveCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-400/10 border border-red-400/20">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"/>
                <span className="font-mono text-xs text-red-400 font-bold">{liveCount} LIVE</span>
              </div>
            )}
            <Link href="/dream" className="font-mono text-xs px-3 py-1.5 rounded border border-white/10 text-fog hover:text-chalk transition-all">DREAM</Link>
            <Link href="/passport" className="font-mono text-xs px-3 py-1.5 rounded border border-[#00e87a]/40 text-[#00e87a] hover:bg-[#00e87a] hover:text-pitch transition-all">PASSPORT</Link>
          </div>
        </nav>

        <div className="pt-20 pb-20">
          {/* Header */}
          <div className="px-6 py-8 border-b border-white/5">
            <div className="max-w-4xl mx-auto">
              <div className="font-mono text-xs text-[#00e87a] tracking-widest mb-2">LIVE FIXTURES & RESULTS</div>
              <div className="flex items-end justify-between gap-4">
                <h1 className="font-display font-black text-4xl text-chalk">Schedule</h1>
                <div className="flex items-center gap-3">
                  {lastUpdated && (
                    <span className="font-mono text-xs text-fog/50 hidden sm:block">
                      Updated {lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                  <button onClick={() => fetchMatches(activeLeague)}
                    className="font-mono text-xs px-3 py-1.5 rounded border border-white/10 text-fog hover:border-[#00e87a]/40 hover:text-[#00e87a] transition-all">
                    ↻ REFRESH
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* League tabs */}
          <div className="border-b border-white/5 overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max px-6 max-w-4xl mx-auto">
              {LEAGUES.map(league => (
                <button key={league.code} onClick={() => { setActiveLeague(league.code); setFilter('all'); setSearchQuery(''); }}
                  className={`flex items-center gap-2 px-4 py-4 font-mono text-xs tracking-wider whitespace-nowrap border-b-2 transition-all ${activeLeague === league.code ? 'border-[#00e87a] text-[#00e87a]' : 'border-transparent text-fog hover:text-chalk'}`}>
                  <span>{league.flag}</span>
                  <span className="hidden sm:block">{league.name}</span>
                  <span className="sm:hidden">{league.code}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-6 py-6">
            {/* Filter + Search bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* Status filters */}
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'live', label: '🔴 Live' },
                  { key: 'upcoming', label: 'Upcoming' },
                  { key: 'finished', label: 'Results' },
                ].map(f => (
                  <button key={f.key} onClick={() => setFilter(f.key)}
                    className={`font-mono text-xs px-3 py-2 rounded-lg border transition-all ${filter === f.key ? 'bg-[#00e87a] text-pitch border-[#00e87a] font-bold' : 'border-white/10 text-fog hover:border-white/20 hover:text-chalk'}`}>
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search team..."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-chalk text-sm placeholder-fog/50 focus:outline-none focus:border-[#00e87a]/40 font-body"
                />
              </div>
            </div>

            {/* League badge */}
            {currentLeague && (
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">{currentLeague.flag}</span>
                <div>
                  <div className="font-display text-lg text-chalk font-bold">{currentLeague.name}</div>
                  <div className="font-mono text-xs text-fog">{filteredMatches.length} matches shown</div>
                </div>
              </div>
            )}

            {/* Content */}
            {loading ? (
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i}/>)}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">⚠️</div>
                <div className="font-display text-xl text-chalk font-bold mb-2">Couldn't load fixtures</div>
                <div className="text-fog text-sm mb-4">{error}</div>
                <button onClick={() => fetchMatches(activeLeague)}
                  className="font-mono text-xs px-4 py-2 rounded border border-[#00e87a]/40 text-[#00e87a] hover:bg-[#00e87a] hover:text-pitch transition-all tracking-wider">
                  TRY AGAIN
                </button>
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🔍</div>
                <div className="font-display text-xl text-chalk font-bold mb-2">No matches found</div>
                <div className="text-fog text-sm">Try a different filter or search term</div>
              </div>
            ) : (
              sortedMatchdays.map(matchday => (
                <MatchdayGroup
                  key={matchday}
                  matchday={matchday}
                  matches={grouped[matchday]}
                />
              ))
            )}

            {/* Plan Trip CTA */}
            {!loading && !error && filteredMatches.length > 0 && (
              <div className="mt-10 p-6 rounded-2xl border border-[#00e87a]/20 bg-[#00e87a]/5 text-center">
                <div className="font-display text-lg text-chalk font-black mb-1">See a match you want to attend?</div>
                <p className="text-fog text-sm mb-4">Build your complete trip — tickets, flights, hotels, stadium guide.</p>
                <Link href="/dream"
                  className="inline-block font-mono text-xs px-6 py-3 rounded-lg bg-[#00e87a] text-pitch font-bold hover:bg-[#00ff88] transition-all tracking-wider">
                  PLAN MY TRIP →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
