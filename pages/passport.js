import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FEATURED_MATCHES } from '../data/matches';

const StampSVG = ({ match, collected, size = 140 }) => (
  <svg viewBox="0 0 200 200" width={size} height={size}>
    <circle cx="100" cy="100" r="90" fill="none" stroke={collected ? '#00e87a' : '#ffffff'} strokeWidth="3" strokeDasharray="8 4" opacity={collected ? 1 : 0.15}/>
    <circle cx="100" cy="100" r="80" fill="none" stroke={collected ? '#00e87a' : '#ffffff'} strokeWidth="1" opacity={collected ? 0.5 : 0.1}/>
    <circle cx="100" cy="100" r="76" fill={collected ? 'rgba(0,232,122,0.08)' : 'rgba(255,255,255,0.02)'}/>
    <ellipse cx="100" cy="110" rx="45" ry="20" fill="none" stroke={collected ? '#00e87a' : '#ffffff'} strokeWidth="1.5" opacity={collected ? 0.8 : 0.15}/>
    <path d="M55 110 L55 90 Q100 70 145 90 L145 110" fill={collected ? 'rgba(0,232,122,0.1)' : 'rgba(255,255,255,0.02)'} stroke={collected ? '#00e87a' : '#ffffff'} strokeWidth="1.5" opacity={collected ? 0.8 : 0.15}/>
    <text x="100" y="88" textAnchor="middle" fontSize="14" fill={collected ? '#d4a843' : '#ffffff'} opacity={collected ? 1 : 0.15}>★</text>
    <path id={`topArc-${match.slug}`} d="M 18 100 A 82 82 0 0 1 182 100" fill="none"/>
    <text fontSize="8" fill={collected ? '#00e87a' : '#ffffff'} opacity={collected ? 1 : 0.2} letterSpacing="1.5">
      <textPath href={`#topArc-${match.slug}`} startOffset="50%" textAnchor="middle">{match.stadium.toUpperCase()}</textPath>
    </text>
    <path id={`botArc-${match.slug}`} d="M 18 100 A 82 82 0 0 0 182 100" fill="none"/>
    <text fontSize="8" fill={collected ? '#00e87a' : '#ffffff'} opacity={collected ? 1 : 0.2} letterSpacing="1.5">
      <textPath href={`#botArc-${match.slug}`} startOffset="50%" textAnchor="middle">{match.city.toUpperCase()} · {match.country.toUpperCase()}</textPath>
    </text>
    <text x="100" y="130" textAnchor="middle" fontSize="16" fontFamily="monospace" fill={collected ? '#00e87a' : '#ffffff'} opacity={collected ? 1 : 0.15} fontWeight="bold">2026</text>
    {collected && (
      <text x="100" y="152" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#00e87a" letterSpacing="3" fontWeight="bold">VISITED</text>
    )}
    {!collected && (
      <text x="100" y="152" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#ffffff" opacity="0.15" letterSpacing="2">LOCKED</text>
    )}
  </svg>
);

export default function PassportPage() {
  const [collected, setCollected] = useState({});
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('fp_stamps') || '{}');
      setCollected(saved);
      const mem = JSON.parse(localStorage.getItem('fp_memories') || '[]');
      setMemories(mem);
    }
  }, []);

  const totalStamps = Object.values(collected).filter(Boolean).length;
  const totalMatches = FEATURED_MATCHES.length;

  return (
    <>
      <Head>
        <title>My Football Passport — Football Passport</title>
        <meta name="description" content="Your personal football travel passport. Stamps, memories, and your next dream match."/>
      </Head>

      <div className="min-h-screen bg-pitch">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 bg-pitch/95 backdrop-blur-sm border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#00e87a] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <path d="M12 2L13.5 7H19L14.5 10L16 15L12 12L8 15L9.5 10L5 7H10.5Z" fill="#00e87a"/>
              </svg>
            </div>
            <span className="font-mono text-sm font-bold tracking-wider text-chalk">FOOTBALL<span className="text-[#00e87a]">PASSPORT</span></span>
          </Link>
          <Link href="/dream" className="font-mono text-xs px-4 py-2 rounded border border-[#00e87a]/50 text-[#00e87a] hover:bg-[#00e87a] hover:text-pitch transition-all duration-300 tracking-wider">
            + ADD MATCH
          </Link>
        </nav>

        <div className="pt-28 pb-20 px-6">
          <div className="max-w-4xl mx-auto">

            {/* Passport Cover */}
            <div className="relative rounded-2xl overflow-hidden border border-[#00e87a]/20 bg-gradient-to-br from-[#0a1a0f] via-[#0f2318] to-[#0a1a0f] p-8 mb-10">
              <div className="absolute inset-0 pitch-lines opacity-20"/>
              <div className="absolute top-4 right-4 opacity-10">
                <svg viewBox="0 0 200 200" className="w-40 h-40">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#00e87a" strokeWidth="2"/>
                  <circle cx="100" cy="100" r="60" fill="none" stroke="#00e87a" strokeWidth="1"/>
                </svg>
              </div>
              <div className="relative z-10">
                <div className="font-mono text-xs text-fog tracking-widest mb-2">FOOTBALL PASSPORT</div>
                <h1 className="font-display font-black text-4xl text-chalk mb-1">My Passport</h1>
                <div className="flex items-center gap-6 mt-4">
                  <div>
                    <div className="font-display text-4xl text-[#00e87a] font-black">{totalStamps}</div>
                    <div className="font-mono text-xs text-fog">Stamps Collected</div>
                  </div>
                  <div className="w-px h-10 bg-white/10"/>
                  <div>
                    <div className="font-display text-4xl text-fog font-black">{totalMatches}</div>
                    <div className="font-mono text-xs text-fog">Total Available</div>
                  </div>
                  <div className="w-px h-10 bg-white/10"/>
                  <div>
                    <div className="font-display text-4xl text-[#d4a843] font-black">{memories.length}</div>
                    <div className="font-mono text-xs text-fog">Memories Saved</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-6 max-w-sm">
                  <div className="flex justify-between font-mono text-xs text-fog mb-1">
                    <span>PASSPORT PROGRESS</span>
                    <span>{Math.round((totalStamps / totalMatches) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00e87a] rounded-full transition-all duration-700"
                      style={{ width: `${(totalStamps / totalMatches) * 100}%` }}/>
                  </div>
                </div>
              </div>
            </div>

            {/* Stamps Grid */}
            <div className="mb-10">
              <div className="font-mono text-xs text-[#00e87a] tracking-widest mb-6">STAMP COLLECTION</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {FEATURED_MATCHES.map(match => {
                  const isCollected = collected[match.slug];
                  return (
                    <div key={match.slug} className={`relative p-4 rounded-xl border text-center transition-all duration-300 ${isCollected ? 'border-[#00e87a]/30 bg-[#00e87a]/5' : 'border-white/5 bg-white/[0.02]'}`}>
                      <div className="flex justify-center mb-2">
                        <StampSVG match={match} collected={isCollected} size={120}/>
                      </div>
                      <div className="font-display text-xs text-chalk font-bold mb-1">{match.title}</div>
                      <div className="font-mono text-xs text-fog mb-3">{match.flag} {match.city}</div>
                      {isCollected ? (
                        <span className="font-mono text-xs text-[#00e87a]">✓ Collected</span>
                      ) : (
                        <Link href={`/trip/${match.slug}`}
                          className="inline-block font-mono text-xs px-3 py-1.5 rounded border border-white/15 text-fog hover:border-[#00e87a]/40 hover:text-[#00e87a] transition-all">
                          PLAN TRIP
                        </Link>
                      )}
                    </div>
                  );
                })}

                {/* Coming soon slot */}
                {[1,2].map(i => (
                  <div key={i} className="p-4 rounded-xl border border-white/5 border-dashed text-center flex flex-col items-center justify-center min-h-[200px]">
                    <div className="text-3xl mb-2 opacity-20">🔒</div>
                    <div className="font-mono text-xs text-fog/40">More coming soon</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Memories */}
            {memories.length > 0 && (
              <div className="mb-10">
                <div className="font-mono text-xs text-[#00e87a] tracking-widest mb-6">MY MEMORIES</div>
                <div className="space-y-3">
                  {memories.map((mem, i) => {
                    const match = FEATURED_MATCHES.find(m => m.slug === mem.match);
                    return (
                      <div key={i} className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-display text-sm text-chalk font-bold mb-1">{match?.title || mem.match}</div>
                            <div className="font-mono text-xs text-fog mb-2">{new Date(mem.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                            {mem.rating > 0 && (
                              <div className="flex gap-0.5 mb-2">
                                {[1,2,3,4,5].map(s => (
                                  <span key={s} className={`text-sm ${s <= mem.rating ? 'text-yellow-400' : 'text-white/10'}`}>★</span>
                                ))}
                              </div>
                            )}
                            {mem.journal && <p className="text-fog text-sm italic leading-relaxed">"{mem.journal}"</p>}
                          </div>
                          {mem.stamp && <span className="text-[#00e87a] text-xl flex-shrink-0">🏟</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="text-center p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="text-3xl mb-3">🌟</div>
              <h3 className="font-display text-xl text-chalk font-black mb-2">Ready for your next dream?</h3>
              <p className="text-fog text-sm mb-4">Every great journey starts with a dream match. What's next?</p>
              <Link href="/dream" className="inline-block font-mono text-sm px-8 py-4 rounded-lg bg-[#00e87a] text-pitch font-bold hover:bg-[#00ff88] transition-all duration-300 tracking-wider">
                FIND MY NEXT MATCH →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
