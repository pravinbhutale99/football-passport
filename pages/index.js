import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';

// ── SVG World Map (simplified) ──────────────────────────────────────────────
const WorldMap = () => (
  <svg viewBox="0 0 1000 500" className="w-full h-full opacity-20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Europe */}
    <path d="M480 120 L520 110 L540 125 L535 145 L510 155 L490 150 L475 140 Z" fill="#00e87a" opacity="0.5"/>
    <path d="M500 130 L510 125 L515 135 L505 140 Z" fill="#00e87a" opacity="0.8"/>
    {/* UK */}
    <path d="M455 115 L465 108 L470 118 L462 125 Z" fill="#00e87a" opacity="0.6"/>
    {/* Africa */}
    <path d="M490 180 L530 175 L545 210 L540 255 L520 280 L500 282 L480 260 L475 230 L480 200 Z" fill="#00e87a" opacity="0.3"/>
    {/* South America */}
    <path d="M280 200 L310 195 L325 215 L320 260 L310 295 L290 305 L275 285 L265 250 L268 220 Z" fill="#00e87a" opacity="0.35"/>
    {/* North America */}
    <path d="M150 110 L230 105 L255 130 L250 175 L220 185 L195 175 L175 155 L155 140 Z" fill="#00e87a" opacity="0.3"/>
    {/* Asia */}
    <path d="M560 100 L700 95 L720 120 L710 160 L680 175 L640 170 L600 165 L565 150 L550 130 Z" fill="#00e87a" opacity="0.25"/>
    {/* Japan */}
    <path d="M720 130 L730 125 L735 135 L725 140 Z" fill="#00e87a" opacity="0.6"/>
    {/* Australia */}
    <path d="M680 280 L730 275 L745 305 L735 330 L710 335 L685 320 L675 300 Z" fill="#00e87a" opacity="0.3"/>
    {/* Middle East */}
    <path d="M560 160 L600 155 L610 175 L595 195 L570 192 L555 178 Z" fill="#d4a843" opacity="0.5"/>

    {/* Connection lines - stadium dots */}
    <circle cx="465" cy="116" r="3" fill="#00e87a" opacity="0.9"/>
    <circle cx="505" cy="132" r="4" fill="#00e87a" opacity="1"/>
    <circle cx="523" cy="128" r="2.5" fill="#00e87a" opacity="0.8"/>
    <circle cx="293" cy="250" r="3" fill="#00e87a" opacity="0.9"/>
    <circle cx="195" cy="150" r="3" fill="#d4a843" opacity="0.9"/>
    <circle cx="670" cy="140" r="3" fill="#00e87a" opacity="0.8"/>
    <circle cx="725" cy="132" r="2.5" fill="#d4a843" opacity="0.9"/>
    <circle cx="580" cy="170" r="2.5" fill="#d4a843" opacity="0.8"/>

    {/* Flight paths */}
    <path d="M465 116 Q485 90 505 132" stroke="#00e87a" strokeWidth="0.8" opacity="0.4" fill="none" strokeDasharray="4 4"/>
    <path d="M505 132 Q390 80 195 150" stroke="#00e87a" strokeWidth="0.8" opacity="0.3" fill="none" strokeDasharray="4 4"/>
    <path d="M195 150 Q240 200 293 250" stroke="#d4a843" strokeWidth="0.8" opacity="0.35" fill="none" strokeDasharray="4 4"/>
    <path d="M505 132 Q590 110 670 140" stroke="#00e87a" strokeWidth="0.8" opacity="0.4" fill="none" strokeDasharray="4 4"/>
    <path d="M670 140 Q698 136 725 132" stroke="#00e87a" strokeWidth="0.8" opacity="0.4" fill="none" strokeDasharray="4 4"/>

    {/* Grid lines */}
    {[0,1,2,3,4].map(i => (
      <line key={`h${i}`} x1="0" y1={i*125} x2="1000" y2={i*125} stroke="#00e87a" strokeWidth="0.3" opacity="0.15"/>
    ))}
    {[0,1,2,3,4,5,6,7].map(i => (
      <line key={`v${i}`} x1={i*143} y1="0" x2={i*143} y2="500" stroke="#00e87a" strokeWidth="0.3" opacity="0.15"/>
    ))}

    {/* Equator + meridians */}
    <line x1="0" y1="250" x2="1000" y2="250" stroke="#00e87a" strokeWidth="0.5" opacity="0.25"/>
    <line x1="500" y1="0" x2="500" y2="500" stroke="#00e87a" strokeWidth="0.5" opacity="0.25"/>
  </svg>
);

// ── Stadium silhouette ───────────────────────────────────────────────────────
const StadiumSilhouette = ({ className = '' }) => (
  <svg viewBox="0 0 800 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="400" cy="150" rx="380" ry="80" fill="none" stroke="rgba(0,232,122,0.15)" strokeWidth="1.5"/>
    <ellipse cx="400" cy="150" rx="300" ry="55" fill="none" stroke="rgba(0,232,122,0.1)" strokeWidth="1"/>
    <path d="M20 150 L20 100 Q400 20 780 100 L780 150" fill="rgba(0,10,5,0.6)" stroke="rgba(0,232,122,0.2)" strokeWidth="1.5"/>
    <path d="M80 148 L80 115 Q400 50 720 115 L720 148" fill="rgba(0,232,122,0.03)" stroke="rgba(0,232,122,0.12)" strokeWidth="1"/>
    {/* Floodlights */}
    {[120,280,520,680].map((x, i) => (
      <g key={i}>
        <line x1={x} y1="50" x2={x} y2="120" stroke="rgba(212,168,67,0.4)" strokeWidth="2"/>
        <rect x={x-8} y="44" width="16" height="6" fill="rgba(212,168,67,0.6)" rx="1"/>
        <ellipse cx={x} cy="44" rx="20" ry="8" fill="none" stroke="rgba(212,168,67,0.15)" strokeWidth="1"/>
      </g>
    ))}
    {/* Pitch markings */}
    <ellipse cx="400" cy="160" rx="80" ry="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
    <line x1="400" y1="140" x2="400" y2="180" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
  </svg>
);

// ── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, delay = 0 }) => (
  <div
    className="group relative p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#00e87a]/20 transition-all duration-500 cursor-default"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="font-display text-lg text-chalk mb-2 font-bold">{title}</h3>
    <p className="text-fog text-sm leading-relaxed font-body">{desc}</p>
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00e87a]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
  </div>
);

// ── Stat Badge ───────────────────────────────────────────────────────────────
const StatBadge = ({ number, label }) => (
  <div className="text-center">
    <div className="font-display text-3xl md:text-4xl font-black text-gradient-green">{number}</div>
    <div className="font-body text-xs text-fog uppercase tracking-widest mt-1">{label}</div>
  </div>
);

// ── Timeline Step ────────────────────────────────────────────────────────────
const TimelineStep = ({ phase, title, items, active = false }) => (
  <div className={`relative pl-8 pb-10 border-l ${active ? 'border-[#00e87a]/50' : 'border-white/10'}`}>
    <div className={`absolute -left-2 top-0 w-4 h-4 rounded-full border-2 ${active ? 'bg-[#00e87a] border-[#00e87a]' : 'bg-pitch border-white/20'}`}/>
    <div className={`font-mono text-xs mb-1 ${active ? 'text-[#00e87a]' : 'text-fog'}`}>{phase}</div>
    <div className="font-display text-white font-bold mb-2">{title}</div>
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="text-fog text-sm flex items-start gap-2">
          <span className={`mt-1 w-1 h-1 rounded-full flex-shrink-0 ${active ? 'bg-[#00e87a]' : 'bg-white/20'}`}/>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <>
      <Head>
        <title>Football Passport — The Complete Football Travel Companion</title>
        <meta name="description" content="Everything a football fan needs—from buying a ticket to reaching the stadium. Built for the modern football traveller." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Football Passport" />
        <meta property="og:description" content="The Complete Football Travel Companion" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-pitch relative overflow-hidden">

        {/* ── NAV ─────────────────────────────────────────────────────────── */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5"
          style={{ background: scrollY > 40 ? 'rgba(10,26,15,0.95)' : 'transparent', backdropFilter: scrollY > 40 ? 'blur(12px)' : 'none', transition: 'background 0.4s, backdrop-filter 0.4s', borderBottom: scrollY > 40 ? '1px solid rgba(0,232,122,0.08)' : 'none' }}>
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="relative w-8 h-8">
              <div className="w-8 h-8 rounded-full border-2 border-[#00e87a] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                  <path d="M12 2L13.5 7H19L14.5 10L16 15L12 12L8 15L9.5 10L5 7H10.5Z" fill="#00e87a"/>
                </svg>
              </div>
            </div>
            <span className="font-mono text-sm font-bold tracking-wider text-chalk">FOOTBALL<span className="text-[#00e87a]">PASSPORT</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-body text-sm text-fog">
            <a href="#features" className="hover:text-chalk transition-colors">Features</a>
            <a href="#roadmap" className="hover:text-chalk transition-colors">Roadmap</a>
            <a href="#waitlist" className="hover:text-chalk transition-colors">Waitlist</a>
          </div>
          <a href="#waitlist"
            className="font-mono text-xs px-4 py-2 rounded border border-[#00e87a]/50 text-[#00e87a] hover:bg-[#00e87a] hover:text-pitch transition-all duration-300 tracking-wider">
            EARLY ACCESS
          </a>
        </nav>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">

          {/* Background world map */}
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
            <div className="w-full max-w-5xl h-[500px]">
              <WorldMap />
            </div>
          </div>

          {/* Ambient glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#00e87a]/5 rounded-full blur-[100px] pointer-events-none"/>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-[#00e87a]/3 rounded-full blur-[80px] pointer-events-none"/>

          {/* Stadium silhouette at bottom of hero */}
          <div className="absolute bottom-0 left-0 right-0">
            <StadiumSilhouette className="w-full h-48 md:h-64"/>
          </div>

          {/* Pitch line grid */}
          <div className="absolute inset-0 pitch-lines opacity-30"/>

          {/* Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00e87a]/30 bg-[#00e87a]/5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e87a] animate-pulse"/>
              <span className="font-mono text-xs text-[#00e87a] tracking-widest">LAUNCHING 2025 · WORLD CUP READY</span>
            </div>

            <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-chalk leading-[0.95] mb-6 tracking-tight">
              The Complete<br/>
              <span className="text-gradient-green">Football Travel</span><br/>
              Companion
            </h1>

            <p className="font-body text-fog text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Everything a football fan needs—from buying a ticket to reaching the stadium. Built for fans who follow their club across continents.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#waitlist"
                className="font-mono text-sm px-8 py-4 rounded-lg bg-[#00e87a] text-pitch font-bold hover:bg-[#00ff88] transition-all duration-300 glow-green tracking-wider w-full sm:w-auto text-center">
                JOIN THE WAITLIST
              </a>
              <a href="#features"
                className="font-mono text-sm px-8 py-4 rounded-lg border border-white/15 text-chalk hover:border-white/30 transition-all duration-300 tracking-wider w-full sm:w-auto text-center">
                SEE FEATURES →
              </a>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 z-10">
            <div className="w-px h-12 bg-gradient-to-b from-[#00e87a] to-transparent animate-pulse"/>
          </div>
        </section>

        {/* ── STATS ───────────────────────────────────────────────────────── */}
        <section className="relative py-16 border-y border-white/5">
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatBadge number="48" label="Host Nations"/>
            <StatBadge number="100+" label="Stadiums Mapped"/>
            <StatBadge number="1000s" label="Routes Planned"/>
            <StatBadge number="1" label="App You Need"/>
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────────────────────── */}
        <section id="features" className="py-24 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="font-mono text-xs text-[#00e87a] tracking-widest mb-4">WHAT'S INSIDE</div>
              <h2 className="font-display font-black text-4xl md:text-5xl text-chalk">
                Every tool for the<br/>
                <span className="text-gradient-green">away-day fan</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard
                icon="🎟️"
                title="Smart Ticket Hub"
                desc="Verified resale, official club portals, and membership allocation—all compared in one place. Never overpay or get scammed again."
                delay={0}
              />
              <FeatureCard
                icon="🗺️"
                title="Stadium Navigator"
                desc="Turn-by-turn from your hotel to your seat. Local transit options, walking routes, and pre-match zones rated by real fans."
                delay={80}
              />
              <FeatureCard
                icon="✈️"
                title="Travel Planner"
                desc="Flights, trains, buses—stacked against kick-off time. We flag the routes fans actually use, not the ones that look good on paper."
                delay={160}
              />
              <FeatureCard
                icon="🏨"
                title="Fan Zone Accommodation"
                desc="Hotels within safe walking distance of supporter pubs and the stadium, with match-night pricing alerts."
                delay={240}
              />
              <FeatureCard
                icon="🌍"
                title="Tournament Mode"
                desc="Group stage to final—manage multi-city World Cup trips with a single passport-style itinerary. 2026 ready."
                delay={320}
              />
              <FeatureCard
                icon="📋"
                title="Matchday Briefing"
                desc="Local laws, stadium rules, weather, and fan culture notes delivered the morning of each match. Know before you go."
                delay={400}
              />
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
        <section className="py-24 px-6 bg-turf/50 relative overflow-hidden">
          <div className="absolute inset-0 pitch-lines opacity-20"/>
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="font-mono text-xs text-[#00e87a] tracking-widest mb-4">HOW IT WORKS</div>
                <h2 className="font-display font-black text-4xl text-chalk mb-6">
                  From fixture list<br/>to final whistle
                </h2>
                <p className="font-body text-fog text-base leading-relaxed">
                  Football travel is fragmented—tickets on one site, transport on another, accommodation somewhere else. Football Passport brings it all into one journey so you spend less time planning and more time watching.
                </p>
              </div>

              <div className="space-y-0">
                {[
                  { step: '01', title: 'Pick your match', desc: 'Search by club, league, or tournament. We surface every relevant fixture—home, away, neutral.' },
                  { step: '02', title: 'Build your trip', desc: 'Tickets, flights, trains, and hotel—compared and added to your trip in minutes, not hours.' },
                  { step: '03', title: 'Travel with confidence', desc: 'Your Football Passport holds everything: tickets, reservations, local tips, and real-time alerts.' },
                ].map(({ step, title, desc }, i) => (
                  <div key={i} className="flex gap-5 pb-8">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border border-[#00e87a]/40 flex items-center justify-center">
                      <span className="font-mono text-xs text-[#00e87a]">{step}</span>
                    </div>
                    <div>
                      <div className="font-display text-white font-bold mb-1">{title}</div>
                      <div className="text-fog text-sm leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── ROADMAP ─────────────────────────────────────────────────────── */}
        <section id="roadmap" className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="font-mono text-xs text-[#00e87a] tracking-widest mb-4">ROADMAP</div>
              <h2 className="font-display font-black text-4xl md:text-5xl text-chalk">
                Building toward<br/>
                <span className="text-gradient-green">2026</span>
              </h2>
            </div>

            <div className="max-w-md mx-auto">
              <TimelineStep
                phase="Q2 2025 — NOW"
                title="Beta Launch"
                items={['Ticket aggregator (UK & Europe)', 'Stadium-to-city transport planner', 'Founding member access']}
                active={true}
              />
              <TimelineStep
                phase="Q3 2025"
                title="Fan Community Layer"
                items={['Supporter club integrations', 'Match-by-match trip sharing', 'Fan reviews of stadium districts']}
              />
              <TimelineStep
                phase="Q4 2025"
                title="Global Expansion"
                items={['South America, Asia, Middle East coverage', 'Multi-currency pricing', 'Group trip coordination']}
              />
              <TimelineStep
                phase="2026"
                title="World Cup Mode"
                items={['48-team tournament planner', 'USA / Canada / Mexico city guides', 'Real-time match schedule updates']}
              />
            </div>
          </div>
        </section>

        {/* ── COMING SOON / WAITLIST ───────────────────────────────────────── */}
        <section id="waitlist" className="py-24 px-6 relative overflow-hidden">
          {/* Background stadium art */}
          <div className="absolute inset-0 flex items-end justify-center opacity-10">
            <StadiumSilhouette className="w-full h-96"/>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00e87a]/4 rounded-full blur-[120px] pointer-events-none"/>

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4a843]/40 bg-[#d4a843]/5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843] animate-pulse"/>
              <span className="font-mono text-xs text-[#d4a843] tracking-widest">COMING SOON · BETA OPENING SHORTLY</span>
            </div>

            <h2 className="font-display font-black text-5xl md:text-6xl text-chalk mb-4 leading-tight">
              Be first<br/>
              <span className="text-gradient-green">through the gate</span>
            </h2>
            <p className="font-body text-fog text-base mb-10 leading-relaxed">
              Founding members get early access, lifetime discounts, and a direct line to shape what Football Passport becomes. Leave your email—we'll handle the rest.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-3.5 rounded-lg bg-white/5 border border-white/10 text-chalk placeholder-fog font-body text-sm focus:outline-none focus:border-[#00e87a]/50 focus:bg-white/8 transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-lg bg-[#00e87a] text-pitch font-mono text-sm font-bold hover:bg-[#00ff88] transition-all duration-300 glow-green tracking-wider whitespace-nowrap"
                >
                  CLAIM SPOT
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-lg border border-[#00e87a]/30 bg-[#00e87a]/5 max-w-md mx-auto">
                <span className="text-[#00e87a] text-xl">✓</span>
                <span className="font-body text-chalk text-sm">You're on the list. We'll be in touch before kickoff.</span>
              </div>
            )}

            <p className="font-body text-fog/50 text-xs mt-4">No spam. Unsubscribe any time. Your data never leaves our hands.</p>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <footer className="border-t border-white/5 py-10 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border border-[#00e87a]/50 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none">
                  <path d="M12 2L13.5 7H19L14.5 10L16 15L12 12L8 15L9.5 10L5 7H10.5Z" fill="#00e87a"/>
                </svg>
              </div>
              <span className="font-mono text-xs text-fog tracking-wider">FOOTBALLPASSPORT</span>
            </div>
            <p className="font-body text-fog/40 text-xs">© 2025 Football Passport. Built for fans, by fans.</p>
            <div className="flex gap-6 font-body text-xs text-fog/50">
              <a href="#" className="hover:text-fog transition-colors">Privacy</a>
              <a href="#" className="hover:text-fog transition-colors">Terms</a>
              <a href="mailto:hello@footballpassport.app" className="hover:text-fog transition-colors">Contact</a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
