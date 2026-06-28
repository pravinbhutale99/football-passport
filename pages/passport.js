import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const DEFAULT_STAMPS = [
  {
    id: 1, name: "Old Trafford", city: "Manchester", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    match: "Manchester Derby", home: "Man Utd", away: "Man City",
    score: "2 - 1", date: "08 Mar 2026", competition: "Premier League",
    color: "#dc2626", visited: true, slug: "manchester-derby",
    lat: 53.4631, lng: -2.2913,
    quote: "Theatre of Dreams. The noise was unreal.",
  },
  {
    id: 2, name: "Santiago Bernabéu", city: "Madrid", country: "Spain", flag: "🇪🇸",
    match: "El Clásico", home: "Real Madrid", away: "Barcelona",
    score: "3 - 2", date: "18 Apr 2026", competition: "La Liga",
    color: "#7c3aed", visited: true, slug: "el-clasico",
    lat: 40.4531, lng: -3.6883,
    quote: "Hala Madrid. Nothing prepares you for this.",
  },
  {
    id: 3, name: "Wembley Stadium", city: "London", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    match: "UCL Final", home: "Arsenal", away: "Bayern Munich",
    score: "1 - 0", date: "30 May 2026", competition: "Champions League",
    color: "#d4a843", visited: true, slug: "ucl-final",
    lat: 51.5560, lng: -0.2796,
    quote: "Champions of Europe. I was there.",
  },
  {
    id: 4, name: "Emirates Stadium", city: "London", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    match: "North London Derby", home: "Arsenal", away: "Tottenham",
    score: "2 - 0", date: "22 Feb 2026", competition: "Premier League",
    color: "#dc2626", visited: true, slug: "north-london-derby",
    lat: 51.5549, lng: -0.1084,
    quote: "Arsenal, Arsenal, Arsenal.",
  },
  {
    id: 5, name: "Camp Nou", city: "Barcelona", country: "Spain", flag: "🇪🇸",
    match: "Barcelona vs PSG", home: "Barcelona", away: "PSG",
    score: "?", date: "Coming 2027", competition: "Champions League",
    color: "#1d4ed8", visited: false, slug: null,
    lat: 41.3809, lng: 2.1228, quote: "",
  },
  {
    id: 6, name: "San Siro", city: "Milan", country: "Italy", flag: "🇮🇹",
    match: "Derby della Madonnina", home: "AC Milan", away: "Inter",
    score: "?", date: "Coming 2027", competition: "Serie A",
    color: "#dc2626", visited: false, slug: null,
    lat: 45.4654, lng: 9.1859, quote: "",
  },
  {
    id: 7, name: "Allianz Arena", city: "Munich", country: "Germany", flag: "🇩🇪",
    match: "Der Klassiker", home: "Bayern Munich", away: "Dortmund",
    score: "?", date: "Coming 2027", competition: "Bundesliga",
    color: "#e84d0e", visited: false, slug: null,
    lat: 48.2188, lng: 11.6247, quote: "",
  },
  {
    id: 8, name: "Parc des Princes", city: "Paris", country: "France", flag: "🇫🇷",
    match: "Le Classique", home: "PSG", away: "Marseille",
    score: "?", date: "Coming 2027", competition: "Ligue 1",
    color: "#1b3f7a", visited: false, slug: null,
    lat: 48.8414, lng: 2.2530, quote: "",
  },
];

// ── World Map ──────────────────────────────────────────────────────────────
const WorldMap = ({ stamps, activeId, onSelect }) => {
  const toXY = (lat, lng) => ({
    x: ((lng + 180) / 360) * 1000,
    y: ((90 - lat) / 180) * 500,
  });
  const visited = stamps.filter(s => s.visited);

  return (
    <svg viewBox="0 0 1000 500" style={{ width: '100%', height: '100%' }}>
      {/* Grid */}
      {[0,1,2,3,4].map(i => <line key={`h${i}`} x1="0" y1={i*125} x2="1000" y2={i*125} stroke="#00e87a" strokeWidth="0.3" opacity="0.08"/>)}
      {[0,1,2,3,4,5,6,7].map(i => <line key={`v${i}`} x1={i*143} y1="0" x2={i*143} y2="500" stroke="#00e87a" strokeWidth="0.3" opacity="0.08"/>)}
      <line x1="0" y1="250" x2="1000" y2="250" stroke="#00e87a" strokeWidth="0.5" opacity="0.15"/>
      <line x1="500" y1="0" x2="500" y2="500" stroke="#00e87a" strokeWidth="0.5" opacity="0.15"/>
      {/* Continents */}
      <path d="M470 110 L530 100 L555 120 L550 150 L520 165 L490 158 L468 145 Z" fill="#00e87a" opacity="0.06" stroke="#00e87a" strokeWidth="0.5"/>
      <path d="M448 108 L460 100 L465 115 L456 122 Z" fill="#00e87a" opacity="0.07"/>
      <path d="M488 182 L535 176 L548 215 L542 262 L520 285 L498 287 L478 263 L473 232 Z" fill="#00e87a" opacity="0.05"/>
      <path d="M278 198 L312 192 L328 218 L322 264 L310 298 L288 308 L273 287 L263 252 Z" fill="#00e87a" opacity="0.05"/>
      <path d="M148 108 L233 102 L258 132 L252 178 L222 188 L195 178 L173 156 L153 138 Z" fill="#00e87a" opacity="0.05"/>
      <path d="M558 96 L705 90 L722 118 L712 162 L682 178 L638 172 L598 167 L562 152 Z" fill="#00e87a" opacity="0.04"/>
      <path d="M678 278 L732 272 L748 308 L737 334 L710 338 L683 323 Z" fill="#00e87a" opacity="0.05"/>
      {/* Connection lines */}
      {visited.map((s, i, arr) => {
        if (i === 0) return null;
        const p1 = toXY(arr[i-1].lat, arr[i-1].lng);
        const p2 = toXY(s.lat, s.lng);
        return <line key={`l${s.id}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#00e87a" strokeWidth="0.8" opacity="0.25" strokeDasharray="4 4"/>;
      })}
      {/* Dots */}
      {stamps.map(s => {
        const p = toXY(s.lat, s.lng);
        const isActive = activeId === s.id;
        return (
          <g key={s.id} onClick={() => onSelect(s.id)} style={{ cursor: 'pointer' }}>
            {s.visited && <circle cx={p.x} cy={p.y} r={isActive ? 14 : 10} fill="none" stroke={s.color} strokeWidth="1" opacity={isActive ? 0.7 : 0.3}/>}
            <circle cx={p.x} cy={p.y} r={isActive ? 6 : s.visited ? 5 : 3} fill={s.visited ? s.color : '#333'} opacity={s.visited ? 1 : 0.3}/>
            {(isActive || s.visited) && (
              <text x={p.x} y={p.y - 16} textAnchor="middle" fontSize={isActive ? "10" : "8"} fill={s.visited ? s.color : '#555'} fontFamily="monospace" fontWeight="bold" opacity={isActive ? 1 : 0.5}>
                {s.name.split(' ')[0]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ── Stamp SVG ──────────────────────────────────────────────────────────────
const StampSVG = ({ stamp, size = 110, glow = false }) => {
  const c = stamp.visited ? stamp.color : '#333';
  const op = stamp.visited ? 1 : 0.2;
  return (
    <div style={{ width: size, height: size, filter: glow ? `drop-shadow(0 0 16px ${stamp.color}70)` : 'none', transition: 'filter 0.4s' }}>
      <svg viewBox="0 0 200 200" width={size} height={size}>
        <defs>
          <radialGradient id={`rg${stamp.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c} stopOpacity="0.12"/>
            <stop offset="100%" stopColor={c} stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="95" fill={stamp.visited ? `url(#rg${stamp.id})` : 'none'}/>
        <circle cx="100" cy="100" r="92" fill="none" stroke={c} strokeWidth="3" strokeDasharray="7 3.5" opacity={op}/>
        <circle cx="100" cy="100" r="80" fill="none" stroke={c} strokeWidth="1" opacity={op * 0.4}/>
        <circle cx="100" cy="100" r="76" fill={`${c}08`}/>
        <ellipse cx="100" cy="118" rx="44" ry="17" fill="none" stroke={c} strokeWidth="1.5" opacity={op * 0.8}/>
        <path d="M56 118 L56 98 Q100 76 144 98 L144 118" fill={`${c}12`} stroke={c} strokeWidth="1.5" opacity={op * 0.8}/>
        {stamp.visited && [74,126].map((x,i) => (
          <g key={i}>
            <line x1={x} y1="80" x2={x} y2="98" stroke={c} strokeWidth="2" opacity="0.6"/>
            <rect x={x-5} y="76" width="10" height="4" fill={c} opacity="0.8" rx="1"/>
          </g>
        ))}
        <path id={`ta${stamp.id}`} d="M 12 100 A 88 88 0 0 1 188 100" fill="none"/>
        <text fontSize="9" fill={c} letterSpacing="2.5" fontFamily="monospace" fontWeight="bold" opacity={op}>
          <textPath href={`#ta${stamp.id}`} startOffset="50%" textAnchor="middle">{stamp.name.toUpperCase()}</textPath>
        </text>
        <path id={`ba${stamp.id}`} d="M 12 100 A 88 88 0 0 0 188 100" fill="none"/>
        <text fontSize="8" fill={c} letterSpacing="2" fontFamily="monospace" opacity={op * 0.8}>
          <textPath href={`#ba${stamp.id}`} startOffset="50%" textAnchor="middle">{stamp.city.toUpperCase()} · {stamp.country.toUpperCase()}</textPath>
        </text>
        <text x="100" y="138" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={c} opacity={op * 0.9} letterSpacing="1">{stamp.date}</text>
        <text x="100" y="158" textAnchor="middle" fontSize="8.5" fontFamily="monospace" fill={c} letterSpacing="4" fontWeight="bold" opacity={op}>
          {stamp.visited ? 'VISITED ✓' : 'LOCKED'}
        </text>
      </svg>
    </div>
  );
};

// ── Unlock Screen ──────────────────────────────────────────────────────────
const UnlockScreen = ({ stamp, onClose }) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = [
      setTimeout(() => setStep(1), 200),
      setTimeout(() => setStep(2), 700),
      setTimeout(() => setStep(3), 1200),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{ background: `radial-gradient(ellipse at center, ${stamp.color}25 0%, #000 70%)` }}>
      <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm"
        style={{ background: 'rgba(255,255,255,0.08)' }}>✕</button>

      {/* Label */}
      <div className="text-center mb-6 transition-all duration-500"
        style={{ opacity: step >= 1 ? 1 : 0, transform: step >= 1 ? 'translateY(0)' : 'translateY(-20px)' }}>
        <div className="font-mono text-xs tracking-widest mb-2" style={{ color: stamp.color, letterSpacing: 6 }}>⚡ STAMP UNLOCKED</div>
        <div className="font-display font-black text-4xl text-chalk">{stamp.name}</div>
        <div className="font-mono text-sm text-fog mt-1">{stamp.flag} {stamp.city}, {stamp.country}</div>
      </div>

      {/* Stamp */}
      <div className="mb-6 transition-all duration-700"
        style={{ opacity: step >= 2 ? 1 : 0, transform: step >= 2 ? 'scale(1)' : 'scale(0.4)' }}>
        <StampSVG stamp={stamp} size={200} glow={step >= 2}/>
      </div>

      {/* Match card */}
      <div className="w-full max-w-sm transition-all duration-500" style={{ opacity: step >= 3 ? 1 : 0 }}>
        <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${stamp.color}30` }}>
          <div className="font-mono text-xs text-center text-fog/50 tracking-widest mb-3">{stamp.competition} · {stamp.date}</div>
          <div className="flex items-center justify-between mb-3">
            <div className="font-display text-base text-chalk font-bold">{stamp.home}</div>
            <div className="font-display text-2xl font-black px-4 py-1 rounded-xl" style={{ color: stamp.color, background: `${stamp.color}15` }}>{stamp.score}</div>
            <div className="font-display text-base text-chalk font-bold">{stamp.away}</div>
          </div>
          {stamp.quote && (
            <div className="pt-3 border-t border-white/5 font-body text-sm text-fog/60 italic text-center">"{stamp.quote}"</div>
          )}
        </div>
        <div className="flex gap-3">
          <button className="flex-1 py-3 rounded-xl font-mono text-xs font-bold tracking-widest text-black"
            style={{ background: stamp.color }}>📲 SHARE</button>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-mono text-xs tracking-widest text-chalk border border-white/10"
            style={{ background: 'rgba(255,255,255,0.04)' }}>MY PASSPORT →</button>
        </div>
      </div>
    </div>
  );
};

// ── Main Passport Page ─────────────────────────────────────────────────────
export default function PassportPage() {
  const [stamps, setStamps] = useState(DEFAULT_STAMPS);
  const [activeId, setActiveId] = useState(1);
  const [unlocking, setUnlocking] = useState(null);
  const [view, setView] = useState('map');

  // Load user collected stamps from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = JSON.parse(localStorage.getItem('fp_collected') || '{}');
    setStamps(prev => prev.map(s => ({ ...s, visited: saved[s.id] ?? s.visited })));
  }, []);

  const active = stamps.find(s => s.id === activeId) || stamps[0];
  const visited = stamps.filter(s => s.visited);
  const locked  = stamps.filter(s => !s.visited);
  const nextLocked = locked[0];

  const handleStampTap = (stamp) => {
    setActiveId(stamp.id);
    if (stamp.visited) setUnlocking(stamp);
  };

  return (
    <>
      <Head>
        <title>My Passport — Football Passport</title>
        <meta name="description" content="Your personal football travel passport. Collect stamps from every stadium you visit."/>
      </Head>

      <div className="min-h-screen bg-pitch">
        {unlocking && <UnlockScreen stamp={unlocking} onClose={() => setUnlocking(null)}/>}

        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4 bg-pitch/95 backdrop-blur-md border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border-2 border-[#00e87a] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
                <path d="M12 2L13.5 7H19L14.5 10L16 15L12 12L8 15L9.5 10L5 7H10.5Z" fill="#00e87a"/>
              </svg>
            </div>
            <span className="font-mono text-sm font-bold tracking-wider text-chalk">FOOTBALL<span className="text-[#00e87a]">PASSPORT</span></span>
          </Link>
          <div className="flex gap-2">
            {['map','grid'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-all ${view === v ? 'bg-[#00e87a] text-pitch border-[#00e87a] font-bold' : 'border-white/10 text-fog hover:text-chalk'}`}>
                {v === 'map' ? '🗺' : '🏟'} {v.toUpperCase()}
              </button>
            ))}
          </div>
        </nav>

        <div className="pt-20 pb-24">
          {/* Header */}
          <div className="px-5 py-5">
            <div className="font-mono text-xs text-[#00e87a] tracking-widest mb-1">MY FOOTBALL PASSPORT</div>
            <h1 className="font-display font-black text-4xl text-chalk">Stamp Collection</h1>
          </div>

          {/* Stats strip */}
          <div className="flex gap-3 px-5 mb-5 overflow-x-auto scrollbar-hide">
            {[
              { val: visited.length, label: 'STADIUMS',  color: '#00e87a' },
              { val: [...new Set(visited.map(s => s.country))].length, label: 'COUNTRIES', color: '#d4a843' },
              { val: visited.length, label: 'MATCHES',   color: '#7c3aed' },
              { val: locked.length,  label: 'TO UNLOCK', color: '#8a9a8f' },
            ].map(s => (
              <div key={s.label} className="flex-shrink-0 text-center px-4 py-3 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="font-display text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                <div className="font-mono text-xs text-fog/50 mt-0.5 tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>

          {view === 'map' ? (
            <>
              {/* World Map */}
              <div className="mx-5 rounded-2xl overflow-hidden border border-white/5 bg-white/[0.01]" style={{ height: 200 }}>
                <WorldMap stamps={stamps} activeId={activeId} onSelect={setActiveId}/>
              </div>

              {/* Active info card */}
              <div className="mx-5 mt-3 p-4 rounded-2xl border transition-all duration-300"
                style={{ background: `linear-gradient(135deg, ${active.color}10, rgba(0,0,0,0.3))`, borderColor: `${active.color}30` }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-display text-lg text-chalk font-black">{active.name}</div>
                    <div className="font-mono text-xs text-fog/50 mt-0.5">{active.flag} {active.city} · {active.competition}</div>
                  </div>
                  {active.visited ? (
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full" style={{ background: `${active.color}20`, color: active.color, border: `1px solid ${active.color}40` }}>
                      VISITED ✓
                    </span>
                  ) : (
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full border border-white/10 text-fog">LOCKED 🔒</span>
                  )}
                </div>
                {active.visited ? (
                  <div className="flex items-center justify-between">
                    <div className="font-body text-sm text-fog/70">
                      {active.home} <span className="font-bold" style={{ color: active.color }}>{active.score}</span> {active.away}
                    </div>
                    <button onClick={() => handleStampTap(active)}
                      className="font-mono text-xs px-3 py-1.5 rounded-full font-bold transition-all"
                      style={{ background: active.color, color: '#060e08' }}>
                      VIEW STAMP →
                    </button>
                  </div>
                ) : (
                  <Link href="/dream" className="font-mono text-xs text-[#00e87a] hover:underline">
                    Plan this trip to unlock →
                  </Link>
                )}
              </div>

              {/* Horizontal scroll stamps */}
              <div className="mt-5 px-5">
                <div className="font-mono text-xs text-fog/40 tracking-widest mb-3">TAP A STAMP TO RELIVE IT</div>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {stamps.map(s => (
                    <div key={s.id} onClick={() => handleStampTap(s)}
                      className="flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-105"
                      style={{ opacity: s.visited ? 1 : 0.25, filter: s.visited ? 'none' : 'grayscale(1)' }}>
                      <StampSVG stamp={s} size={95} glow={activeId === s.id && s.visited}/>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Grid View */
            <div className="px-5 grid grid-cols-2 gap-3">
              {stamps.map(s => (
                <div key={s.id} onClick={() => handleStampTap(s)}
                  className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: s.visited ? `linear-gradient(135deg, ${s.color}15, rgba(0,0,0,0.4))` : 'rgba(255,255,255,0.02)',
                    border: s.visited ? `1px solid ${s.color}35` : '1px solid rgba(255,255,255,0.05)',
                  }}>
                  <div style={{ height: 3, background: s.visited ? s.color : '#1a1a1a' }}/>
                  <div className="p-3 flex flex-col items-center">
                    <StampSVG stamp={s} size={95}/>
                    <div className="font-display text-xs font-bold text-center mt-2 leading-tight"
                      style={{ color: s.visited ? '#f0f0f0' : '#444' }}>{s.name}</div>
                    <div className="font-mono text-xs mt-1" style={{ color: s.visited ? 'rgba(255,255,255,0.35)' : '#333' }}>
                      {s.visited ? s.date : '?? 2027'}
                    </div>
                    {s.visited ? (
                      <div className="mt-2 px-3 py-1 rounded-full font-mono text-xs tracking-wider"
                        style={{ background: `${s.color}20`, color: s.color }}>VISITED</div>
                    ) : (
                      <div className="mt-2 px-3 py-1 rounded-full font-mono text-xs text-fog/30 border border-white/5">LOCKED 🔒</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Next unlock CTA */}
          {nextLocked && (
            <div className="mx-5 mt-6 p-5 rounded-2xl border border-[#00e87a]/15 bg-[#00e87a]/5 text-center">
              <div className="font-mono text-xs text-[#00e87a] tracking-widest mb-1">UNLOCK YOUR NEXT STAMP</div>
              <div className="font-display text-xl text-chalk font-black mb-3">
                {nextLocked.name} is waiting 🔒
              </div>
              <Link href="/dream"
                className="inline-block font-mono text-xs px-6 py-3 rounded-xl bg-[#00e87a] text-pitch font-bold hover:bg-[#00ff88] transition-all tracking-wider">
                PLAN THE TRIP →
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
