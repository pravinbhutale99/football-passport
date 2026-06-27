import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

const LEAGUES = [
  { code: 'PL',  name: 'Premier League',   short: 'EPL',  flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', accent: '#3d195b', badge: '⚽' },
  { code: 'PD',  name: 'La Liga',          short: 'LAL',  flag: '🇪🇸', accent: '#ee8707', badge: '🟡' },
  { code: 'BL1', name: 'Bundesliga',       short: 'BUN',  flag: '🇩🇪', accent: '#d20515', badge: '🔴' },
  { code: 'SA',  name: 'Serie A',          short: 'SRA',  flag: '🇮🇹', accent: '#024494', badge: '🔵' },
  { code: 'FL1', name: 'Ligue 1',          short: 'LG1',  flag: '🇫🇷', accent: '#dba111', badge: '🟠' },
  { code: 'CL',  name: 'Champions League', short: 'UCL',  flag: '⭐',  accent: '#1b3f7a', badge: '⭐' },
  { code: 'EL',  name: 'Europa League',    short: 'UEL',  flag: '🟠',  accent: '#e84d0e', badge: '🟠' },
  { code: 'EC',  name: 'Euros',            short: 'EUR',  flag: '🇪🇺', accent: '#003399', badge: '🇪🇺' },
];

const formatTime  = d => new Date(d).toLocaleTimeString('en-GB',  { hour: '2-digit', minute: '2-digit' });
const formatIST   = d => new Date(d).toLocaleTimeString('en-IN',  { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
const formatDay   = d => new Date(d).toLocaleDateString('en-GB',  { weekday: 'long', day: 'numeric', month: 'long' });
const formatShort = d => new Date(d).toLocaleDateString('en-GB',  { day: 'numeric', month: 'short' });

const isToday = d => {
  const now = new Date(); const dd = new Date(d);
  return dd.getDate() === now.getDate() && dd.getMonth() === now.getMonth() && dd.getFullYear() === now.getFullYear();
};

// ── Team Crest placeholder ─────────────────────────────────────────────────
const Crest = ({ name, size = 36 }) => {
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : '??';
  const colors = ['#00e87a','#d4a843','#3b82f6','#ef4444','#8b5cf6','#f97316','#06b6d4','#84cc16'];
  const color = colors[name ? name.charCodeAt(0) % colors.length : 0];
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `${color}18`, border: `1.5px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontFamily: 'monospace', fontSize: size * 0.32, color, fontWeight: 700, lineHeight: 1 }}>{initials}</span>
    </div>
  );
};

// ── Live Pulse ─────────────────────────────────────────────────────────────
const LivePulse = () => (
  <span className="relative flex items-center justify-center w-4 h-4">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-40"/>
    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"/>
  </span>
);

// ── Match Card — full scoreboard style ─────────────────────────────────────
const MatchCard = ({ match, leagueAccent }) => {
  const isLive     = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';
  const isHT       = match.status === 'PAUSED';
  const isUpcoming = match.status === 'SCHEDULED' || match.status === 'TIMED';
  const hasScore   = isLive || isFinished;

  const homeScore = match.score?.fullTime?.home ?? match.score?.halfTime?.home ?? null;
  const awayScore = match.score?.fullTime?.away ?? match.score?.halfTime?.away ?? null;
  const homeWin   = hasScore && homeScore > awayScore;
  const awayWin   = hasScore && awayScore > homeScore;
  const today     = isToday(match.utcDate);

  return (
    <div className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl
      ${isLive ? 'bg-gradient-to-br from-red-950/60 via-[#0f1a10] to-[#0a1a0f] border border-red-500/20 shadow-red-900/20 shadow-lg'
      : isFinished ? 'bg-[#0d1f12] border border-white/5 hover:border-[#00e87a]/15'
      : 'bg-[#0d1f12] border border-white/5 hover:border-[#00e87a]/15'}`}>

      {/* Top accent line */}
      <div className={`h-0.5 w-full ${isLive ? 'bg-gradient-to-r from-red-500 via-red-400 to-red-500' : isFinished ? 'bg-gradient-to-r from-transparent via-[#00e87a]/30 to-transparent' : 'bg-gradient-to-r from-transparent via-white/5 to-transparent'}`}/>

      <div className="p-5">
        {/* Header row: date/time + status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {today && !isFinished && (
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-[#00e87a]/10 text-[#00e87a] border border-[#00e87a]/20 tracking-wider">TODAY</span>
            )}
            <span className="font-mono text-xs text-fog/60">{formatShort(match.utcDate)}</span>
            {match.venue && <span className="hidden sm:block font-mono text-xs text-fog/40">· {match.venue}</span>}
          </div>
          <div className="flex items-center gap-2">
            {isLive && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30">
                <LivePulse/>
                <span className="font-mono text-xs text-red-400 font-bold tracking-wider">
                  {isHT ? 'HALF TIME' : match.minute ? `${match.minute}'` : 'LIVE'}
                </span>
              </div>
            )}
            {isFinished && (
              <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/5 text-fog/60 tracking-wider">FULL TIME</span>
            )}
            {isUpcoming && (
              <div className="text-right">
                <div className="font-mono text-sm text-chalk font-bold">{formatTime(match.utcDate)}</div>
                <div className="font-mono text-xs text-fog/50">{formatIST(match.utcDate)} IST</div>
              </div>
            )}
          </div>
        </div>

        {/* Teams + Score — the centrepiece */}
        <div className="flex items-center gap-4">
          {/* Home team */}
          <div className="flex-1 flex items-center gap-3">
            <Crest name={match.homeTeam.name} size={40}/>
            <div className="min-w-0">
              <div className={`font-display font-bold text-base leading-tight truncate ${homeWin ? 'text-chalk' : isFinished ? 'text-fog' : 'text-chalk'}`}>
                {match.homeTeam.shortName || match.homeTeam.name}
              </div>
              <div className="font-mono text-xs text-fog/40 mt-0.5">HOME</div>
            </div>
          </div>

          {/* Score block */}
          <div className="flex-shrink-0 flex flex-col items-center">
            {hasScore ? (
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/30">
                <span className={`font-display text-3xl font-black tabular-nums ${homeWin ? 'text-[#00e87a]' : awayWin ? 'text-fog' : 'text-chalk'}`}>{homeScore}</span>
                <span className="font-mono text-lg text-fog/30 font-bold">:</span>
                <span className={`font-display text-3xl font-black tabular-nums ${awayWin ? 'text-[#00e87a]' : homeWin ? 'text-fog' : 'text-chalk'}`}>{awayScore}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-black/20">
                <span className="font-mono text-xs text-fog/40 tracking-widest">VS</span>
              </div>
            )}
            <div className="font-mono text-xs text-fog/30 mt-1">MD {match.matchday}</div>
          </div>

          {/* Away team */}
          <div className="flex-1 flex items-center justify-end gap-3">
            <div className="min-w-0 text-right">
              <div className={`font-display font-bold text-base leading-tight truncate ${awayWin ? 'text-chalk' : isFinished ? 'text-fog' : 'text-chalk'}`}>
                {match.awayTeam.shortName || match.awayTeam.name}
              </div>
              <div className="font-mono text-xs text-fog/40 mt-0.5">AWAY</div>
            </div>
            <Crest name={match.awayTeam.name} size={40}/>
          </div>
        </div>

        {/* Footer: Plan trip CTA on hover */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="font-mono text-xs text-fog/40">{formatDay(match.utcDate)}</span>
          <Link href="/dream"
            className="flex items-center gap-1.5 font-mono text-xs text-[#00e87a] hover:underline">
            <span>Plan this trip</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

// ── Date Group ─────────────────────────────────────────────────────────────
const DateGroup = ({ dateKey, matches, leagueAccent }) => {
  const d = new Date(dateKey);
  const today = isToday(dateKey);
  const label = today ? '🟢 TODAY' : d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className={`font-mono text-xs tracking-widest font-bold ${today ? 'text-[#00e87a]' : 'text-fog/60'}`}>{label}</div>
        <div className="flex-1 h-px bg-white/5"/>
        <div className="font-mono text-xs text-fog/40">{matches.length} {matches.length === 1 ? 'match' : 'matches'}</div>
      </div>
      <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
        {matches.map(m => <MatchCard key={m.id} match={m} leagueAccent={leagueAccent}/>)}
      </div>
    </div>
  );
};

// ── Skeleton ───────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-2xl border border-white/5 bg-[#0d1f12] overflow-hidden animate-pulse">
    <div className="h-0.5 w-full bg-white/5"/>
    <div className="p-5">
      <div className="flex justify-between mb-4">
        <div className="h-3 w-16 bg-white/5 rounded"/>
        <div className="h-3 w-20 bg-white/5 rounded"/>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-white/5"/>
          <div className="h-4 w-24 bg-white/5 rounded"/>
        </div>
        <div className="w-20 h-10 bg-white/5 rounded-xl"/>
        <div className="flex items-center justify-end gap-3 flex-1">
          <div className="h-4 w-24 bg-white/5 rounded"/>
          <div className="w-10 h-10 rounded-full bg-white/5"/>
        </div>
      </div>
    </div>
  </div>
);

// ── League Selector Card ───────────────────────────────────────────────────
const LeagueCard = ({ league, active, onClick }) => (
  <button onClick={onClick}
    className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border transition-all duration-300 whitespace-nowrap
      ${active
        ? 'bg-[#00e87a]/10 border-[#00e87a]/40 text-[#00e87a]'
        : 'bg-white/[0.02] border-white/5 text-fog hover:border-white/15 hover:text-chalk hover:bg-white/[0.04]'}`}>
    <span className="text-xl leading-none">{league.flag}</span>
    <span className="font-mono text-xs tracking-wider">{league.short}</span>
  </button>
);

// ── Main Page ──────────────────────────────────────────────────────────────
export default function SchedulePage() {
  const [activeLeague, setActiveLeague] = useState('PL');
  const [matches, setMatches]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [lastUpdated, setLastUpdated]   = useState(null);
  const [filter, setFilter]             = useState('all');
  const [searchQuery, setSearchQuery]   = useState('');

  const fetchMatches = useCallback(async (leagueCode) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/fixtures?league=${leagueCode}`);
      if (!res.ok) throw new Error(res.status === 429 ? 'Rate limit — wait a moment.' : `Error ${res.status}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMatches(data.matches || []);
      setLastUpdated(new Date());
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMatches(activeLeague); }, [activeLeague, fetchMatches]);

  // Auto-refresh when live
  useEffect(() => {
    const hasLive = matches.some(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
    if (!hasLive) return;
    const t = setInterval(() => fetchMatches(activeLeague), 60000);
    return () => clearInterval(t);
  }, [matches, activeLeague, fetchMatches]);

  const filtered = matches.filter(m => {
    const byStatus =
      filter === 'live'     ? (m.status === 'IN_PLAY' || m.status === 'PAUSED') :
      filter === 'upcoming' ? (m.status === 'SCHEDULED' || m.status === 'TIMED') :
      filter === 'results'  ? m.status === 'FINISHED' : true;
    const bySearch = !searchQuery ||
      m.homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase());
    return byStatus && bySearch;
  });

  // Group by date
  const grouped = filtered.reduce((acc, m) => {
    const key = m.utcDate.slice(0, 10);
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  // Sort: today first, then upcoming asc, then past desc
  const sortedDates = Object.keys(grouped).sort((a, b) => {
    const aToday = isToday(a), bToday = isToday(b);
    if (aToday && !bToday) return -1;
    if (!aToday && bToday) return 1;
    const aFuture = new Date(a) >= new Date();
    const bFuture = new Date(b) >= new Date();
    if (aFuture && bFuture) return new Date(a) - new Date(b);
    if (!aFuture && !bFuture) return new Date(b) - new Date(a);
    return aFuture ? -1 : 1;
  });

  const liveCount  = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED').length;
  const league     = LEAGUES.find(l => l.code === activeLeague);

  const stats = {
    live:     matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED').length,
    upcoming: matches.filter(m => m.status === 'SCHEDULED' || m.status === 'TIMED').length,
    finished: matches.filter(m => m.status === 'FINISHED').length,
  };

  return (
    <>
      <Head>
        <title>Schedule — Football Passport</title>
        <meta name="description" content="Live scores and fixtures for all major European leagues."/>
      </Head>

      <div className="min-h-screen bg-pitch">

        {/* ── NAV ──────────────────────────────────────────────────────── */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-pitch/95 backdrop-blur-md border-b border-white/5">
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
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/25">
                <LivePulse/>
                <span className="font-mono text-xs text-red-400 font-bold">{liveCount} LIVE</span>
              </div>
            )}
            <Link href="/dream"    className="font-mono text-xs px-3 py-1.5 rounded border border-white/10 text-fog hover:text-chalk transition-all hidden sm:block">DREAM</Link>
            <Link href="/passport" className="font-mono text-xs px-3 py-1.5 rounded border border-[#00e87a]/40 text-[#00e87a] hover:bg-[#00e87a] hover:text-pitch transition-all">PASSPORT</Link>
          </div>
        </nav>

        <div className="pt-16">

          {/* ── HERO HEADER ──────────────────────────────────────────────── */}
          <div className="relative overflow-hidden border-b border-white/5">
            <div className="absolute inset-0 pitch-lines opacity-10"/>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#00e87a]/4 rounded-full blur-[80px] pointer-events-none"/>
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="font-mono text-xs text-[#00e87a] tracking-widest mb-2">⚽ LIVE FIXTURES & RESULTS</div>
                  <h1 className="font-display font-black text-5xl md:text-6xl text-chalk mb-3">Schedule</h1>
                  <p className="font-body text-fog text-sm">Real-time scores across Europe's top leagues. Times shown in local & IST.</p>
                </div>
                {/* Quick stats */}
                <div className="flex gap-4">
                  {[
                    { label: 'LIVE',     val: stats.live,     color: 'text-red-400' },
                    { label: 'UPCOMING', val: stats.upcoming, color: 'text-[#00e87a]' },
                    { label: 'RESULTS',  val: stats.finished, color: 'text-fog' },
                  ].map(s => (
                    <div key={s.label} className="text-center px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <div className={`font-display text-2xl font-black ${s.color}`}>{loading ? '—' : s.val}</div>
                      <div className="font-mono text-xs text-fog/50 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── LEAGUE SELECTOR ──────────────────────────────────────────── */}
          <div className="border-b border-white/5 bg-[#0a1a0f]/80 backdrop-blur-sm sticky top-14 z-40">
            <div className="max-w-6xl mx-auto px-6 py-3">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {LEAGUES.map(l => (
                  <LeagueCard key={l.code} league={l} active={activeLeague === l.code}
                    onClick={() => { setActiveLeague(l.code); setFilter('all'); setSearchQuery(''); }}/>
                ))}
              </div>
            </div>
          </div>

          {/* ── FILTERS + SEARCH ──────────────────────────────────────────── */}
          <div className="max-w-6xl mx-auto px-6 py-5">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              {/* League title */}
              <div className="flex items-center gap-3">
                <span className="text-3xl">{league?.flag}</span>
                <div>
                  <div className="font-display text-xl text-chalk font-black">{league?.name}</div>
                  <div className="font-mono text-xs text-fog/50">{filtered.length} matches</div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {/* Status pills */}
                {[
                  { key: 'all',     label: 'All' },
                  { key: 'live',    label: '🔴 Live' },
                  { key: 'upcoming',label: 'Upcoming' },
                  { key: 'results', label: 'Results' },
                ].map(f => (
                  <button key={f.key} onClick={() => setFilter(f.key)}
                    className={`font-mono text-xs px-4 py-2 rounded-full border transition-all duration-200
                      ${filter === f.key ? 'bg-[#00e87a] text-pitch border-[#00e87a] font-bold' : 'border-white/10 text-fog hover:border-white/20 hover:text-chalk'}`}>
                    {f.label}
                  </button>
                ))}
                {/* Search */}
                <div className="relative">
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search team..."
                    className="pl-8 pr-3 py-2 rounded-full bg-white/5 border border-white/10 text-chalk text-xs placeholder-fog/40 focus:outline-none focus:border-[#00e87a]/40 font-mono w-36 focus:w-48 transition-all"/>
                  <svg className="absolute left-2.5 top-2.5 w-3 h-3 text-fog/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                {/* Refresh */}
                <button onClick={() => fetchMatches(activeLeague)}
                  className="font-mono text-xs px-3 py-2 rounded-full border border-white/10 text-fog hover:border-[#00e87a]/30 hover:text-[#00e87a] transition-all">
                  {lastUpdated ? `↻ ${lastUpdated.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}` : '↻'}
                </button>
              </div>
            </div>
          </div>

          {/* ── CONTENT ──────────────────────────────────────────────────── */}
          <div className="max-w-6xl mx-auto px-6 pb-24">
            {loading ? (
              <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i}/>)}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">⚠️</div>
                <div className="font-display text-2xl text-chalk font-black mb-2">Couldn't load fixtures</div>
                <div className="text-fog text-sm mb-6 max-w-sm mx-auto">{error}</div>
                <button onClick={() => fetchMatches(activeLeague)}
                  className="font-mono text-xs px-6 py-3 rounded-full border border-[#00e87a]/40 text-[#00e87a] hover:bg-[#00e87a] hover:text-pitch transition-all tracking-wider">
                  TRY AGAIN
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <div className="font-display text-2xl text-chalk font-black mb-2">No matches found</div>
                <div className="text-fog text-sm">Try clearing your search or changing the filter</div>
              </div>
            ) : (
              sortedDates.map(dateKey => (
                <DateGroup key={dateKey} dateKey={dateKey} matches={grouped[dateKey]} leagueAccent={league?.accent}/>
              ))
            )}

            {/* CTA */}
            {!loading && !error && filtered.length > 0 && (
              <div className="mt-12 relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00e87a]/10 via-[#00e87a]/5 to-transparent"/>
                <div className="absolute inset-0 pitch-lines opacity-20"/>
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-8">
                  <div>
                    <div className="font-display text-2xl text-chalk font-black mb-1">See a match you want to attend? 👀</div>
                    <p className="text-fog text-sm">Tickets · Flights · Hotels · Stadium guide — all in one trip.</p>
                  </div>
                  <Link href="/dream"
                    className="flex-shrink-0 font-mono text-sm px-6 py-3 rounded-xl bg-[#00e87a] text-pitch font-bold hover:bg-[#00ff88] transition-all tracking-wider whitespace-nowrap">
                    PLAN MY TRIP →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
