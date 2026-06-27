import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getMatch } from '../../data/matches';

// ── Stage Nav ──────────────────────────────────────────────────────────────
const STAGES = [
  { id: 'plan',       emoji: '🎟',  label: 'Plan' },
  { id: 'travel',     emoji: '✈',   label: 'Travel' },
  { id: 'experience', emoji: '🏟',  label: 'Experience' },
  { id: 'memories',   emoji: '📸',  label: 'Memories' },
  { id: 'next',       emoji: '❤️',  label: 'Next Dream' },
];

// ── Affiliate Link Card ────────────────────────────────────────────────────
const AffCard = ({ emoji, title, desc, cta, href, tag }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="group flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#00e87a]/20 transition-all duration-300">
    <div className="text-2xl flex-shrink-0">{emoji}</div>
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="font-display text-sm text-chalk font-bold">{title}</div>
        {tag && <span className="flex-shrink-0 text-xs font-mono px-2 py-0.5 rounded bg-[#00e87a]/10 text-[#00e87a] border border-[#00e87a]/20">{tag}</span>}
      </div>
      <div className="text-fog text-xs leading-relaxed mb-2">{desc}</div>
      <div className="font-mono text-xs text-[#00e87a] group-hover:underline">{cta} →</div>
    </div>
  </a>
);

// ── Info Block ─────────────────────────────────────────────────────────────
const InfoBlock = ({ icon, title, children }) => (
  <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xl">{icon}</span>
      <h3 className="font-display text-base text-chalk font-bold">{title}</h3>
    </div>
    {children}
  </div>
);

// ── Step Row ───────────────────────────────────────────────────────────────
const StepRow = ({ num, text, sub }) => (
  <div className="flex gap-3 py-2">
    <div className="w-6 h-6 rounded-full bg-[#00e87a]/10 border border-[#00e87a]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="font-mono text-xs text-[#00e87a]">{num}</span>
    </div>
    <div>
      <div className="text-chalk text-sm">{text}</div>
      {sub && <div className="text-fog text-xs mt-0.5">{sub}</div>}
    </div>
  </div>
);

// ── Budget Estimator ───────────────────────────────────────────────────────
const BudgetEstimator = ({ match }) => {
  const [from, setFrom] = useState('India');
  const [tier, setTier] = useState('mid');

  const budgets = {
    budget: { ticket: 80, flight: 450, hotel: 60, transport: 30, food: 25, extras: 50 },
    mid:    { ticket: 180, flight: 650, hotel: 110, transport: 50, food: 50, extras: 100 },
    luxury: { ticket: 350, flight: 1200, hotel: 250, transport: 100, food: 120, extras: 200 },
  };

  const b = budgets[tier];
  const nights = 4;
  const total = b.ticket + b.flight + (b.hotel * nights) + b.transport + (b.food * nights) + b.extras;

  return (
    <div className="p-5 rounded-xl border border-[#00e87a]/20 bg-[#00e87a]/5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">💰</span>
        <h3 className="font-display text-base text-chalk font-bold">Budget Estimator</h3>
      </div>

      <div className="flex gap-2 mb-4">
        {['budget','mid','luxury'].map(t => (
          <button key={t} onClick={() => setTier(t)}
            className={`flex-1 py-2 rounded-lg font-mono text-xs transition-all ${tier === t ? 'bg-[#00e87a] text-pitch font-bold' : 'border border-white/10 text-fog hover:border-white/20'}`}>
            {t === 'budget' ? '💼 Budget' : t === 'mid' ? '⭐ Mid' : '👑 Luxury'}
          </button>
        ))}
      </div>

      <div className="space-y-2 mb-4">
        {[
          ['🎟 Match Ticket', `£${b.ticket}`],
          ['✈ Return Flights', `£${b.flight}`],
          [`🏨 Hotel (${nights} nights)`, `£${b.hotel * nights}`],
          ['🚇 Local Transport', `£${b.transport}`],
          [`🍔 Food & Drink (${nights} days)`, `£${b.food * nights}`],
          ['🛍 Extras & Tours', `£${b.extras}`],
        ].map(([label, val]) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-fog">{label}</span>
            <span className="text-chalk font-mono">{val}</span>
          </div>
        ))}
        <div className="pt-2 border-t border-white/10 flex justify-between">
          <span className="text-chalk font-bold">Total (per person)</span>
          <span className="text-[#00e87a] font-display font-black text-lg">£{total}</span>
        </div>
      </div>
      <p className="text-fog text-xs">* Estimates based on travel from India (INR ~£{Math.round(total * 107).toLocaleString()})</p>
    </div>
  );
};

// ── Passport Stamp ─────────────────────────────────────────────────────────
const PassportStamp = ({ match, collected, onCollect }) => (
  <div className="text-center">
    <div
      onClick={onCollect}
      className={`relative inline-block cursor-pointer transition-all duration-500 ${collected ? 'scale-110' : 'scale-100 hover:scale-105'}`}
      style={{ filter: collected ? 'none' : 'grayscale(0.8) opacity(0.4)' }}
    >
      {/* Stamp SVG */}
      <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
        {/* Outer ring */}
        <circle cx="100" cy="100" r="90" fill="none" stroke={collected ? '#00e87a' : '#ffffff'} strokeWidth="3" strokeDasharray="8 4" opacity={collected ? 1 : 0.3}/>
        <circle cx="100" cy="100" r="80" fill="none" stroke={collected ? '#00e87a' : '#ffffff'} strokeWidth="1" opacity={collected ? 0.5 : 0.2}/>

        {/* Inner fill */}
        <circle cx="100" cy="100" r="76" fill={collected ? 'rgba(0,232,122,0.08)' : 'rgba(255,255,255,0.03)'}/>

        {/* Stadium icon */}
        <ellipse cx="100" cy="110" rx="45" ry="20" fill="none" stroke={collected ? '#00e87a' : '#ffffff'} strokeWidth="1.5" opacity={collected ? 0.8 : 0.3}/>
        <path d="M55 110 L55 90 Q100 70 145 90 L145 110" fill={collected ? 'rgba(0,232,122,0.1)' : 'rgba(255,255,255,0.05)'} stroke={collected ? '#00e87a' : '#ffffff'} strokeWidth="1.5" opacity={collected ? 0.8 : 0.3}/>

        {/* Star */}
        <text x="100" y="88" textAnchor="middle" fontSize="14" fill={collected ? '#d4a843' : '#ffffff'} opacity={collected ? 1 : 0.3}>★</text>

        {/* Top arc text */}
        <path id="topArc" d="M 18 100 A 82 82 0 0 1 182 100" fill="none"/>
        <text fontSize="9" fill={collected ? '#00e87a' : '#ffffff'} opacity={collected ? 1 : 0.4} letterSpacing="2">
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">{match.stadium.toUpperCase()}</textPath>
        </text>

        {/* Bottom arc text */}
        <path id="botArc" d="M 18 100 A 82 82 0 0 0 182 100" fill="none"/>
        <text fontSize="9" fill={collected ? '#00e87a' : '#ffffff'} opacity={collected ? 1 : 0.4} letterSpacing="2">
          <textPath href="#botArc" startOffset="50%" textAnchor="middle">{match.city.toUpperCase()} · {match.country.toUpperCase()}</textPath>
        </text>

        {/* Year */}
        <text x="100" y="130" textAnchor="middle" fontSize="16" fontFamily="monospace" fill={collected ? '#00e87a' : '#ffffff'} opacity={collected ? 1 : 0.4} fontWeight="bold">2026</text>

        {/* VISITED stamp */}
        {collected && (
          <text x="100" y="155" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#00e87a" letterSpacing="3" fontWeight="bold">VISITED</text>
        )}
      </svg>
    </div>

    {collected ? (
      <div className="mt-4">
        <div className="font-display text-[#00e87a] font-black text-xl mb-1">Stamp Collected! 🎉</div>
        <p className="text-fog text-sm">Added to your Football Passport</p>
        <Link href="/passport" className="inline-block mt-3 font-mono text-xs px-4 py-2 rounded border border-[#00e87a]/40 text-[#00e87a] hover:bg-[#00e87a] hover:text-pitch transition-all tracking-wider">
          VIEW MY PASSPORT →
        </Link>
      </div>
    ) : (
      <div className="mt-4">
        <p className="text-fog text-sm mb-3">Tap the stamp after attending the match</p>
        <button onClick={onCollect}
          className="font-mono text-xs px-6 py-2 rounded border border-white/20 text-fog hover:border-[#00e87a]/40 hover:text-[#00e87a] transition-all tracking-wider">
          COLLECT STAMP
        </button>
      </div>
    )}
  </div>
);

// ── PLAN Stage ─────────────────────────────────────────────────────────────
const PlanStage = ({ match }) => (
  <div className="space-y-4">
    <BudgetEstimator match={match}/>

    <InfoBlock icon="🎟" title="Match Tickets">
      <div className="space-y-2">
        <AffCard
          emoji="🔴"
          title="Official Club Ticket Office"
          desc="Members and season ticket holders get priority. Check official site first — most legitimate source."
          cta="Check official tickets"
          href="https://www.manutd.com/en/tickets"
          tag="OFFICIAL"
        />
        <AffCard
          emoji="🎫"
          title="Viagogo"
          desc="Verified resale tickets with buyer guarantee. Prices vary with demand — book early for best rates."
          cta="Search on Viagogo"
          href="https://www.viagogo.com"
          tag="RESALE · AFFILIATE"
        />
        <AffCard
          emoji="🎟"
          title="StubHub"
          desc="One of the largest ticket marketplaces. Fan-to-fan sales with FanProtect guarantee."
          cta="Check StubHub"
          href="https://www.stubhub.com"
          tag="RESALE · AFFILIATE"
        />
      </div>
      <div className="mt-3 p-3 rounded-lg bg-yellow-400/5 border border-yellow-400/20">
        <p className="text-yellow-400 text-xs">⚠ Ticket difficulty: <strong>Hard</strong>. Derby matches sell out in minutes. Set alerts 6–8 weeks before.</p>
      </div>
    </InfoBlock>

    <InfoBlock icon="🛂" title="Visa & Entry">
      <div className="space-y-2">
        <StepRow num="1" text="Indian passport holders need a UK Standard Visitor Visa" sub="Processing time: 3–8 weeks. Apply early."/>
        <StepRow num="2" text="Apply at VFS Global (UK Visa Application Centre)" sub="Available in Mumbai, Delhi, Chennai, Bangalore, Kolkata, Hyderabad"/>
        <StepRow num="3" text="Required docs: Passport, bank statements (3 months), ITR, hotel booking, match tickets, cover letter"/>
        <StepRow num="4" text="Visa fee: ₹10,900 (~£100) + VFS service charge"/>
      </div>
      <div className="mt-3 space-y-2">
        <AffCard emoji="🛂" title="iVisa — Visa Assistance" desc="Document checklist, application review, and express processing support." cta="Get visa help" href="https://www.ivisa.com" tag="AFFILIATE"/>
      </div>
    </InfoBlock>

    <InfoBlock icon="✈" title="Flights — India → Manchester">
      <div className="space-y-2">
        <AffCard emoji="✈" title="Skyscanner" desc="Best aggregator for India → Manchester (MAN) or London Heathrow (LHR) + train. Set price alerts 3 months out." cta="Search flights" href="https://www.skyscanner.net" tag="AFFILIATE"/>
        <AffCard emoji="🏷" title="Google Flights" desc="Use price calendar view to find cheapest travel dates around the match." cta="Open Google Flights" href="https://flights.google.com" tag="FREE"/>
      </div>
      <div className="mt-3 p-3 rounded-lg bg-white/[0.03] border border-white/5">
        <p className="text-fog text-xs mb-2 font-mono">RECOMMENDED ROUTES</p>
        {[
          ['Mumbai / Delhi → London Heathrow', 'Air India, British Airways, Virgin Atlantic', '~9–10 hrs'],
          ['London → Manchester', 'Avanti West Coast train from Euston', '~2 hrs 10 min'],
          ['Or fly direct to Manchester (MAN)', 'Via Dubai (Emirates) or Doha (Qatar Airways)', '~11–13 hrs'],
        ].map(([route, airline, time]) => (
          <div key={route} className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-white/5 last:border-0">
            <div>
              <div className="text-chalk text-xs font-medium">{route}</div>
              <div className="text-fog text-xs">{airline}</div>
            </div>
            <div className="font-mono text-xs text-[#00e87a] mt-1 sm:mt-0 sm:text-right">{time}</div>
          </div>
        ))}
      </div>
    </InfoBlock>

    <InfoBlock icon="🏨" title="Hotels near Old Trafford">
      <div className="space-y-2">
        <AffCard emoji="🏨" title="Booking.com" desc="Filter by 'Old Trafford' or 'Salford Quays'. Book refundable rates — match dates sometimes change." cta="Search hotels" href="https://www.booking.com" tag="AFFILIATE"/>
        <AffCard emoji="🛎" title="Marriott Bonvoy Manchester" desc="Manchester city centre, 15 min tram to Old Trafford. Points-friendly for Indian travellers." cta="View hotel" href="https://www.marriott.com" tag="AFFILIATE"/>
      </div>
      <div className="mt-3 p-3 rounded-lg bg-white/[0.03] border border-white/5">
        <p className="text-fog text-xs mb-2 font-mono">BEST AREAS TO STAY</p>
        {[
          ['Salford Quays', 'Walking distance to Old Trafford', '★★★★'],
          ['Manchester City Centre', '15 min on Metrolink tram', '★★★★★'],
          ['Deansgate', 'Best for restaurants & nightlife', '★★★★'],
        ].map(([area, desc, stars]) => (
          <div key={area} className="flex justify-between py-1.5 border-b border-white/5 last:border-0">
            <div>
              <div className="text-chalk text-xs">{area}</div>
              <div className="text-fog text-xs">{desc}</div>
            </div>
            <div className="text-yellow-400 text-xs">{stars}</div>
          </div>
        ))}
      </div>
    </InfoBlock>
  </div>
);

// ── TRAVEL Stage ───────────────────────────────────────────────────────────
const TravelStage = ({ match }) => (
  <div className="space-y-4">
    <InfoBlock icon="🛬" title="Arriving at the Airport">
      <div className="space-y-2">
        <AffCard emoji="🚌" title="Manchester Airport → City Centre" desc="Metrolink tram direct to Manchester Piccadilly. Runs every 12 minutes. £3.80 single." cta="Plan with TfGM" href="https://tfgm.com" tag="LOCAL TRANSIT"/>
        <AffCard emoji="🚕" title="Airport Taxi / Private Transfer" desc="Pre-book for peace of mind, especially with luggage. Fixed price ~£25–35 to city centre." cta="Book on Get Transfer" href="https://gettransfer.com" tag="AFFILIATE"/>
        <AffCard emoji="📱" title="Get a UK SIM on arrival" desc="Three or Vodafone UK SIM from airport. India roaming is expensive — a local SIM pays for itself in hours." cta="Compare SIM deals" href="https://www.uswitch.com/mobiles/sim-only-deals/" tag="RECOMMENDED"/>
      </div>
    </InfoBlock>

    <InfoBlock icon="🚇" title="Getting Around Manchester">
      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 mb-3">
        <p className="text-fog text-xs mb-2 font-mono">METROLINK TRAM — YOUR BEST FRIEND</p>
        {[
          ['City Centre → Old Trafford', 'Altrincham Line from St Peter\'s Square', '~15 min · £2.60'],
          ['Piccadilly → Deansgate', 'City Centre loop', '~5 min · £1.60'],
          ['Airport → City Centre', 'Direct Metrolink', '~55 min · £3.80'],
        ].map(([from, route, info]) => (
          <div key={from} className="py-2 border-b border-white/5 last:border-0">
            <div className="flex justify-between">
              <div className="text-chalk text-xs font-medium">{from}</div>
              <div className="font-mono text-xs text-[#00e87a]">{info.split('·')[1].trim()}</div>
            </div>
            <div className="text-fog text-xs">{route} · {info.split('·')[0].trim()}</div>
          </div>
        ))}
      </div>
      <AffCard emoji="🚖" title="Uber / Bolt" desc="Available in Manchester. Surge pricing on matchday — leave early or pre-book." cta="Download Uber" href="https://www.uber.com/gb/en/" tag="RECOMMENDED"/>
    </InfoBlock>

    <InfoBlock icon="🏨" title="Hotel Check-in Tips">
      <div className="space-y-2 text-sm">
        <StepRow num="1" text="Check-in usually from 3PM — drop luggage early and explore" sub="Most hotels offer early luggage storage for free"/>
        <StepRow num="2" text="Ask hotel for matchday tram advice — they know the local routes" sub="Salford Quays hotels are match-day veterans"/>
        <StepRow num="3" text="Book your return taxi/transfer in advance for post-match" sub="Uber surge is real after a 3PM kickoff ending at 5PM"/>
        <StepRow num="4" text="Indian-friendly restaurants? Rusholme 'Curry Mile' is 20 min from city centre" sub="Over 70 restaurants — best Indian food outside India in the UK"/>
      </div>
    </InfoBlock>

    <InfoBlock icon="🗺" title="2-Day Manchester Itinerary">
      <div className="space-y-3">
        {[
          {
            day: 'Day 1 — Pre-Match',
            items: [
              { time: '09:00', activity: 'Breakfast at Elnecot (Ancoats) or Federal Café (city centre)' },
              { time: '10:30', activity: 'Northern Quarter — street art, vintage shops, coffee culture' },
              { time: '13:00', activity: 'Lunch at Bundobust (Indian street food meets craft beer 🍺)' },
              { time: '14:30', activity: 'Manchester Museum or the Science & Industry Museum' },
              { time: '16:30', activity: 'Head to Old Trafford — stadium tour (book ahead)' },
              { time: '19:00', activity: 'Pre-match pint at Trafford Bar or Sam Platts pub' },
              { time: '20:00', activity: '🔴 MATCH NIGHT — Old Trafford' },
            ]
          },
          {
            day: 'Day 2 — Explore',
            items: [
              { time: '09:30', activity: 'Breakfast + recovery at Elnecot, Ancoats' },
              { time: '11:00', activity: 'MediaCityUK — BBC studios, waterfront walk, ITV' },
              { time: '13:00', activity: 'Lunch at Salford Quays (The Lowry restaurant)' },
              { time: '14:30', activity: 'The Lowry gallery — free entry, great art' },
              { time: '16:00', activity: 'Deansgate Locks — afternoon drinks' },
              { time: '18:00', activity: 'Manchester Cathedral area — free walking tour' },
              { time: '20:00', activity: 'Dinner at Rosso (Roberto Carlos\' restaurant!) or The French' },
            ]
          }
        ].map(({ day, items }) => (
          <div key={day}>
            <div className="font-mono text-xs text-[#00e87a] mb-2 tracking-wider">{day}</div>
            <div className="space-y-1">
              {items.map(({ time, activity }) => (
                <div key={time} className="flex gap-3 text-sm py-1 border-b border-white/5 last:border-0">
                  <span className="font-mono text-xs text-fog w-12 flex-shrink-0 mt-0.5">{time}</span>
                  <span className="text-chalk text-xs">{activity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </InfoBlock>
  </div>
);

// ── EXPERIENCE Stage ───────────────────────────────────────────────────────
const ExperienceStage = ({ match }) => (
  <div className="space-y-4">
    <InfoBlock icon="🏟" title="Stadium Guide — Old Trafford">
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          ['Capacity', '74,310'],
          ['Away End', 'South Stand Lower'],
          ['Gates Open', '90 min before KO'],
          ['Food', 'Pies, hot dogs, alcohol (some areas)'],
        ].map(([k, v]) => (
          <div key={k} className="p-2 rounded bg-white/[0.03] border border-white/5">
            <div className="font-mono text-xs text-fog mb-0.5">{k}</div>
            <div className="text-chalk text-sm font-medium">{v}</div>
          </div>
        ))}
      </div>
      <div className="space-y-1">
        <StepRow num="1" text="Gates open 90 min before kickoff — arrive early for atmosphere" sub="Pre-match: Munich tunnel, team warm-ups, Stretford End building noise"/>
        <StepRow num="2" text="Away fans enter via Sir Matt Busby Way, Gate E or F" sub="If you have home tickets — enter via your designated gate on ticket"/>
        <StepRow num="3" text="No re-entry once inside. Bring water — drinks queues are long" sub="Toilets busiest 5 min before half time and at the whistle"/>
        <StepRow num="4" text="No large bags, umbrellas, or glass" sub="Security checks at turnstile — arrive 30 min before gates for smooth entry"/>
      </div>
    </InfoBlock>

    <InfoBlock icon="🍔" title="Food & Drink near Old Trafford">
      <div className="space-y-2">
        {[
          { name: 'Sam Platts', type: 'Traditional pub', note: 'Right outside the stadium. Gets loud pre-match. Cash and card.', tag: 'Pre-match' },
          { name: 'Trafford Bar area', type: 'Strip of pubs', note: 'Mix of home and away fans before the match. Good atmosphere.', tag: 'Pre-match' },
          { name: 'Bundobust Manchester', type: 'Indian street food + craft beer', note: 'City centre. Perfect post-match dinner. Okra fries are legendary.', tag: 'Post-match · Indian' },
          { name: 'Elnecot', type: 'Modern British', note: 'Ancoats. Upscale post-match meal. Book in advance on matchdays.', tag: 'Post-match' },
          { name: 'Rusholme Curry Mile', type: 'South Asian restaurant strip', note: 'Didsbury Road. 70+ restaurants. Budget-friendly, open late.', tag: 'Indian food' },
        ].map(r => (
          <div key={r.name} className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="font-display text-sm text-chalk font-bold">{r.name}</div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#00e87a]/10 text-[#00e87a] border border-[#00e87a]/20 flex-shrink-0">{r.tag}</span>
            </div>
            <div className="text-fog text-xs mb-1">{r.type}</div>
            <div className="text-fog text-xs">{r.note}</div>
          </div>
        ))}
      </div>
    </InfoBlock>

    <InfoBlock icon="🛍" title="Shopping — Official & Local">
      <div className="space-y-2">
        <AffCard emoji="👕" title="Manchester United Megastore" desc="Inside Old Trafford. Open matchdays and daily. Largest Man Utd retail store in the world. Personalisation service on site." cta="Shop online" href="https://store.manutd.com" tag="OFFICIAL"/>
        <AffCard emoji="🏪" title="Trafford Centre" desc="15 min from Old Trafford. Massive mall — Nike, Adidas, JD Sports, all major brands. Good for kit shopping at UK prices." cta="Get directions" href="https://www.traffordcentre.co.uk" tag="SHOPPING"/>
        <AffCard emoji="📦" title="Shipping home with ParcelHero" desc="Bought too much? Ship your kit and souvenirs back to India. Cheaper than airline excess baggage." cta="Get quote" href="https://www.parcelhero.com" tag="AFFILIATE"/>
      </div>
    </InfoBlock>

    <InfoBlock icon="🎭" title="Stadium Tour — Old Trafford">
      <div className="space-y-2 mb-3">
        <StepRow num="1" text="Book in advance — tours sell out on popular dates" sub="Especially the day before and after a match"/>
        <StepRow num="2" text="Tour includes: dressing rooms, tunnel, dugout, museum, trophy room" sub="~75 minutes. Family-friendly."/>
        <StepRow num="3" text="Museum entry included. Sir Alex Ferguson suite and Class of '92 exhibits" sub="Separate Ultimate Tour includes pitch-side access"/>
        <StepRow num="4" text="Cost: Adult £26 / Child £17 (2025 prices)" sub="Combined museum + tour tickets available"/>
      </div>
      <AffCard emoji="🎭" title="Book Official Stadium Tour" desc="Book directly on ManUtd.com. Pick your date and time. Morning slots on matchday available." cta="Book stadium tour" href="https://www.manutd.com/en/visit-old-trafford/stadium-tours" tag="OFFICIAL"/>
    </InfoBlock>
  </div>
);

// ── MEMORIES Stage ─────────────────────────────────────────────────────────
const MemoriesStage = ({ match }) => {
  const [stampCollected, setStampCollected] = useState(false);
  const [journal, setJournal] = useState('');
  const [rating, setRating] = useState(0);
  const [saved, setSaved] = useState(false);

  const saveMemory = () => {
    if (typeof window !== 'undefined') {
      const memories = JSON.parse(localStorage.getItem('fp_memories') || '[]');
      memories.push({ match: match.slug, rating, journal, date: new Date().toISOString(), stamp: stampCollected });
      localStorage.setItem('fp_memories', JSON.stringify(memories));
      setSaved(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Passport Stamp */}
      <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] text-center">
        <div className="font-mono text-xs text-[#00e87a] tracking-widest mb-4">YOUR FOOTBALL PASSPORT STAMP</div>
        <PassportStamp match={match} collected={stampCollected} onCollect={() => setStampCollected(true)}/>
      </div>

      {/* Match Journal */}
      <InfoBlock icon="📓" title="Matchday Journal">
        <div className="space-y-3">
          <div>
            <div className="font-mono text-xs text-fog mb-2">RATE YOUR EXPERIENCE</div>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setRating(i)}
                  className={`text-2xl transition-all ${i <= rating ? 'opacity-100' : 'opacity-20'}`}>
                  ⭐
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="font-mono text-xs text-fog mb-2">YOUR NOTES</div>
            <textarea
              value={journal}
              onChange={e => setJournal(e.target.value)}
              placeholder="What was the atmosphere like? Best moment? Worst beer queue? Write it all..."
              className="w-full h-28 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-chalk text-sm placeholder-fog/50 focus:outline-none focus:border-[#00e87a]/40 resize-none font-body"
            />
          </div>
          {saved ? (
            <div className="text-center py-2 text-[#00e87a] font-mono text-sm">✓ Memory saved to your Passport</div>
          ) : (
            <button onClick={saveMemory}
              className="w-full py-3 rounded-lg bg-[#00e87a] text-pitch font-mono text-xs font-bold hover:bg-[#00ff88] transition-all tracking-wider">
              SAVE TO PASSPORT
            </button>
          )}
        </div>
      </InfoBlock>

      {/* Share card */}
      <InfoBlock icon="📲" title="Share Your Trip">
        <div className="space-y-2">
          <AffCard emoji="📸" title="Create a Match Card" desc="Share a beautiful visual match card with your score prediction and verdict. Perfect for Instagram Stories." cta="Coming soon" href="#" tag="SOON"/>
          <AffCard emoji="🐦" title="Post to X (Twitter)" desc={`"Just watched ${match.title} at ${match.stadium}! ⚽ via @FootballPassport #FootballPassport"`} cta="Share on X" href={`https://twitter.com/intent/tweet?text=Just watched ${encodeURIComponent(match.title)} at ${encodeURIComponent(match.stadium)}! ⚽ via @FootballPassport %23FootballPassport`} tag="SHARE"/>
        </div>
      </InfoBlock>
    </div>
  );
};

// ── NEXT DREAM Stage ───────────────────────────────────────────────────────
const NextDreamStage = ({ match }) => (
  <div className="space-y-4">
    <div className="text-center p-6 rounded-2xl border border-[#00e87a]/20 bg-[#00e87a]/5">
      <div className="text-4xl mb-3">❤️</div>
      <h3 className="font-display text-2xl text-chalk font-black mb-2">The dream doesn't end here.</h3>
      <p className="text-fog text-sm leading-relaxed max-w-sm mx-auto">
        Every match is a stamp. Every stadium a memory. Where does your Football Passport take you next?
      </p>
    </div>

    <InfoBlock icon="🌟" title="Recommended Next Matches">
      <div className="space-y-3">
        {[
          { match: 'El Clásico', stadium: 'Bernabéu, Madrid', date: 'Apr 2026', difficulty: 'Very Hard', emoji: '🇪🇸', slug: 'el-clasico' },
          { match: 'UCL Final', stadium: 'Wembley, London', date: 'May 2026', difficulty: 'Extreme', emoji: '🏆', slug: 'ucl-final' },
          { match: 'North London Derby', stadium: 'Emirates, London', date: 'Feb 2026', difficulty: 'Hard', emoji: '🔴', slug: 'north-london-derby' },
        ].map(r => (
          <Link key={r.match} href={`/trip/${r.slug}`}
            className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:border-[#00e87a]/20 hover:bg-white/[0.04] transition-all group">
            <span className="text-2xl">{r.emoji}</span>
            <div className="flex-1">
              <div className="font-display text-sm text-chalk font-bold">{r.match}</div>
              <div className="text-fog text-xs">{r.stadium} · {r.date}</div>
            </div>
            <div className="text-fog text-xs group-hover:text-[#00e87a] transition-colors">PLAN →</div>
          </Link>
        ))}
      </div>
    </InfoBlock>

    <InfoBlock icon="📬" title="Get Early Access & Alerts">
      <p className="text-fog text-sm mb-3">Be first to know when new match guides drop and when ticket alerts go live for your bucket list fixtures.</p>
      <div className="flex gap-2">
        <input placeholder="your@email.com" className="flex-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-chalk text-sm placeholder-fog/50 focus:outline-none focus:border-[#00e87a]/40 font-body"/>
        <button className="px-4 py-2.5 rounded-lg bg-[#00e87a] text-pitch font-mono text-xs font-bold hover:bg-[#00ff88] transition-all tracking-wider">
          ALERT ME
        </button>
      </div>
      <p className="text-fog/40 text-xs mt-2">Ticket drops, price alerts, and new match guides. Unsubscribe any time.</p>
    </InfoBlock>

    <div className="text-center pt-4">
      <Link href="/dream" className="inline-block font-mono text-sm px-8 py-4 rounded-lg bg-[#00e87a] text-pitch font-bold hover:bg-[#00ff88] transition-all duration-300 tracking-wider">
        FIND MY NEXT DREAM →
      </Link>
    </div>
  </div>
);

// ── MAIN TRIP PAGE ─────────────────────────────────────────────────────────
export default function TripPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [activeStage, setActiveStage] = useState('plan');

  const match = getMatch(slug) || {
    slug: 'manchester-derby',
    title: 'Manchester Derby',
    home: 'Manchester United',
    away: 'Manchester City',
    homeBadge: '🔴',
    awayBadge: '🔵',
    competition: 'Premier League',
    date: '2026-03-08',
    time: '16:30',
    stadium: 'Old Trafford',
    city: 'Manchester',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    coverBg: 'from-red-950 via-zinc-950 to-blue-950',
    ticketPrice: '£80–£400',
  };

  const stageContent = {
    plan: <PlanStage match={match}/>,
    travel: <TravelStage match={match}/>,
    experience: <ExperienceStage match={match}/>,
    memories: <MemoriesStage match={match}/>,
    next: <NextDreamStage match={match}/>,
  };

  return (
    <>
      <Head>
        <title>{match.title} Trip Planner — Football Passport</title>
        <meta name="description" content={`Complete trip guide for ${match.title} at ${match.stadium}. Tickets, flights, hotels, stadium guide and more.`}/>
      </Head>

      <div className="min-h-screen bg-pitch">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-pitch/95 backdrop-blur-sm border-b border-white/5">
          <Link href="/dream" className="flex items-center gap-2 text-fog hover:text-chalk transition-colors">
            <span className="font-mono text-xs">← BACK</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold tracking-wider text-chalk">FOOTBALL<span className="text-[#00e87a]">PASSPORT</span></span>
          </Link>
          <Link href="/passport" className="font-mono text-xs px-3 py-1.5 rounded border border-[#00e87a]/40 text-[#00e87a] hover:bg-[#00e87a] hover:text-pitch transition-all tracking-wider">
            MY PASSPORT
          </Link>
        </nav>

        {/* Match Hero */}
        <div className={`relative pt-16 pb-8 bg-gradient-to-b ${match.coverBg} to-pitch`}>
          <div className="absolute inset-0 pitch-lines opacity-10"/>
          <div className="relative z-10 max-w-3xl mx-auto px-6 pt-10 text-center">
            <div className="font-mono text-xs text-fog tracking-widest mb-3">{match.flag} {match.competition} · {match.date} · {match.time}</div>
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="text-center">
                <div className="text-5xl mb-2">{match.homeBadge}</div>
                <div className="font-display text-sm text-chalk font-bold">{match.home}</div>
              </div>
              <div className="font-display text-3xl text-white/40 font-black">VS</div>
              <div className="text-center">
                <div className="text-5xl mb-2">{match.awayBadge}</div>
                <div className="font-display text-sm text-chalk font-bold">{match.away}</div>
              </div>
            </div>
            <div className="font-mono text-xs text-fog">🏟 {match.stadium} · {match.city}, {match.country}</div>
          </div>
        </div>

        {/* Stage Navigation */}
        <div className="sticky top-14 z-40 bg-pitch/95 backdrop-blur-sm border-b border-white/5">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              {STAGES.map(s => (
                <button key={s.id} onClick={() => setActiveStage(s.id)}
                  className={`flex items-center gap-1.5 px-4 py-4 font-mono text-xs tracking-wider whitespace-nowrap border-b-2 transition-all ${activeStage === s.id ? 'border-[#00e87a] text-[#00e87a]' : 'border-transparent text-fog hover:text-chalk'}`}>
                  <span>{s.emoji}</span>
                  <span>{s.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stage Content */}
        <div className="max-w-3xl mx-auto px-6 py-8 pb-20">
          {/* Stage header */}
          <div className="mb-6">
            {activeStage === 'plan' && (
              <>
                <div className="font-mono text-xs text-[#00e87a] tracking-widest mb-1">STAGE 1 · 🎟 PLAN</div>
                <h2 className="font-display text-2xl text-chalk font-black">Everything before you leave</h2>
                <p className="text-fog text-sm mt-1">Budget, tickets, visa, flights and hotels — sorted.</p>
              </>
            )}
            {activeStage === 'travel' && (
              <>
                <div className="font-mono text-xs text-[#00e87a] tracking-widest mb-1">STAGE 2 · ✈ TRAVEL</div>
                <h2 className="font-display text-2xl text-chalk font-black">Everything during travel</h2>
                <p className="text-fog text-sm mt-1">Airport to hotel, local transport and your Manchester itinerary.</p>
              </>
            )}
            {activeStage === 'experience' && (
              <>
                <div className="font-mono text-xs text-[#00e87a] tracking-widest mb-1">STAGE 3 · 🏟 EXPERIENCE</div>
                <h2 className="font-display text-2xl text-chalk font-black">Everything around the match</h2>
                <p className="text-fog text-sm mt-1">Stadium, food, shopping, matchday tips and the official store.</p>
              </>
            )}
            {activeStage === 'memories' && (
              <>
                <div className="font-mono text-xs text-[#00e87a] tracking-widest mb-1">STAGE 4 · 📸 MEMORIES</div>
                <h2 className="font-display text-2xl text-chalk font-black">Collect your stamp</h2>
                <p className="text-fog text-sm mt-1">Your Football Passport. Your story. Keep it forever.</p>
              </>
            )}
            {activeStage === 'next' && (
              <>
                <div className="font-mono text-xs text-[#00e87a] tracking-widest mb-1">STAGE 5 · ❤️ NEXT DREAM</div>
                <h2 className="font-display text-2xl text-chalk font-black">Where to next?</h2>
                <p className="text-fog text-sm mt-1">Your Football Passport is never full. The next dream awaits.</p>
              </>
            )}
          </div>

          {stageContent[activeStage]}

          {/* Stage navigation arrows */}
          <div className="flex justify-between mt-10 pt-6 border-t border-white/5">
            {STAGES.findIndex(s => s.id === activeStage) > 0 ? (
              <button onClick={() => setActiveStage(STAGES[STAGES.findIndex(s => s.id === activeStage) - 1].id)}
                className="font-mono text-xs text-fog hover:text-chalk transition-colors">
                ← PREV
              </button>
            ) : <div/>}
            {STAGES.findIndex(s => s.id === activeStage) < STAGES.length - 1 ? (
              <button onClick={() => setActiveStage(STAGES[STAGES.findIndex(s => s.id === activeStage) + 1].id)}
                className="font-mono text-xs px-4 py-2 rounded bg-[#00e87a] text-pitch font-bold hover:bg-[#00ff88] transition-all tracking-wider">
                NEXT STAGE →
              </button>
            ) : <div/>}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { slug: 'manchester-derby' } },
      { params: { slug: 'el-clasico' } },
      { params: { slug: 'ucl-final' } },
      { params: { slug: 'north-london-derby' } },
    ],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  return { props: {} };
}
