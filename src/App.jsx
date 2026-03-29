import { useState, useEffect, useMemo, useCallback } from 'react';

// Data & utils
import {
  initActors, initIndustries, initPredictions, initCompanies, initStats, initFeed,
  FEED_POOL,
} from './data/threatData.js';
import {
  randomInt, randomFloat, pick, clamp, drift, formatTime, randomIoc,
  typeColor, severityColor, riskColor, riskLabel,
} from './utils/helpers.js';

// Atoms
import { Panel, Dot, LiveNum } from './components/atoms.jsx';

// Page components
import Dashboard     from './components/pages/Dashboard.jsx';
import Predictions   from './components/pages/Predictions.jsx';
import Feed          from './components/pages/Feed.jsx';
import Actors        from './components/pages/Actors.jsx';
import GlobalMap     from './components/pages/GlobalMap.jsx';
import AttackRadar   from './components/pages/AttackRadar.jsx';
import Timeline      from './components/pages/Timeline.jsx';
import Scanner       from './components/Scanner.jsx';
import AIAdvisor     from './components/AIAdvisor.jsx';
import ExtensionPage from './components/ExtensionPage.jsx';

const NAV = [
  { id: 'dashboard',   icon: '⬡', label: 'OVERVIEW' },
  { id: 'predictions', icon: '◈', label: 'PREDICTIONS' },
  { id: 'feed',        icon: '⊟', label: 'THREAT FEED' },
  { id: 'actors',      icon: '◉', label: 'THREAT ACTORS' },
  { id: 'map',         icon: '⊕', label: 'GLOBAL MAP' },
  { id: 'radar',       icon: '◎', label: 'ATTACK RADAR' },
  { id: 'timeline',    icon: '≋', label: 'TIMELINE' },
  { id: 'scanner',     icon: '⊛', label: 'SCANNER' },
  { id: 'advisor',     icon: '✦', label: 'AI ADVISOR' },
];

const THREAT_LEVEL_COLORS = {
  CRITICAL: '#ff1744', HIGH: '#ff6d00', ELEVATED: '#ffd600', MODERATE: '#00e676',
};

export default function DarkPulse() {
  const [page,         setPage]         = useState('dashboard');
  const [sidebarOpen,  setSidebarOpen]  = useState(true);
  const [selectedActor, setSelectedActor] = useState(null);
  const [clock,        setClock]        = useState(formatTime);
  const [ticks,        setTicks]        = useState(0);
  const [lastUpd,      setLastUpd]      = useState(formatTime);

  // Live data state
  const [stats,       setStats]       = useState(initStats);
  const [actors,      setActors]      = useState(initActors);
  const [industries,  setIndustries]  = useState(initIndustries);
  const [predictions, setPredictions] = useState(initPredictions);
  const [companies,   setCompanies]   = useState(initCompanies);
  const [feed,        setFeed]        = useState(initFeed);
  const [density,     setDensity]     = useState(40);
  const [threatLevel, setThreatLevel] = useState('CRITICAL');
  const [mapCountries, setMapCountries] = useState([
    { country: 'Russia',  attacks: randomInt(700,950), trend: '↑', color: '#ff1744' },
    { country: 'China',   attacks: randomInt(500,700), trend: '↑', color: '#d500f9' },
    { country: 'N.Korea', attacks: randomInt(200,350), trend: '→', color: '#ff6d00' },
    { country: 'Iran',    attacks: randomInt(150,260), trend: '↓', color: '#ffd600' },
  ]);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Clock — 1s
  useEffect(() => {
    const t = setInterval(() => setClock(formatTime()), 1000);
    return () => clearInterval(t);
  }, []);

  // Master data tick — 5s
  useEffect(() => {
    const tick = () => {
      setTicks(n => n + 1);
      setLastUpd(formatTime());

      setStats(s => ({
        iocsToday:       s.iocsToday + randomInt(3, 22),
        dwSignals:       clamp(s.dwSignals + randomInt(-2, 5), 260, 640),
        predictions:     clamp(s.predictions + randomInt(-1, 2), 60, 150),
        predAcc:         clamp(+(s.predAcc + randomFloat(-.25, .25)).toFixed(1), 87, 99),
        activeCampaigns: clamp(s.activeCampaigns + randomInt(-1, 1), 1, 8),
        alerts:          clamp(s.alerts + randomInt(0, 2), 5, 65),
        totalIndicators: s.totalIndicators + randomInt(8, 75),
      }));

      setActors(prev => prev.map(a => ({
        ...a,
        risk:      clamp(a.risk + randomInt(-2, 3), 50, 99),
        campaigns: clamp(a.campaigns + randomInt(0, 2), 10, 2000),
        active:    Math.random() > 0.05 ? a.active : !a.active,
      })));

      setIndustries(prev => {
        const updated = prev.map(ind => ({
          ...ind,
          prev:  ind.score,
          score: clamp(drift(ind.score, ind.lo, ind.hi, 3), ind.lo, ind.hi),
        }));
        const avg = updated.reduce((s, i) => s + i.score, 0) / updated.length;
        setThreatLevel(avg >= 80 ? 'CRITICAL' : avg >= 65 ? 'HIGH' : avg >= 50 ? 'ELEVATED' : 'MODERATE');
        return updated;
      });

      setPredictions(prev => prev.map(p => ({
        ...p,
        confidence: clamp(p.confidence + randomInt(-2, 3), 42, 99),
        signals:    clamp(p.signals + randomInt(-1, 2), 1, 18),
        window:     Math.random() < .12 ? `${p.winBase + randomInt(-6, 10)}–${p.winBase + randomInt(12, 36)}h` : p.window,
      })));

      setCompanies(prev => prev.map(c => ({
        ...c, risk: clamp(c.risk + randomInt(-2, 3), 28, 99),
      })));

      setDensity(randomInt(15, 90));

      setMapCountries(prev => prev.map(c => {
        const delta  = randomInt(-15, 25);
        const newAtk = clamp(c.attacks + delta, 50, 1200);
        return { ...c, attacks: newAtk, trend: delta > 5 ? '↑' : delta < -5 ? '↓' : '→' };
      }));
    };
    const t = setInterval(tick, 5000);
    return () => clearInterval(t);
  }, []);

  // Feed new event — 7s
  useEffect(() => {
    const t = setInterval(() => {
      const base = pick(FEED_POOL);
      const item = {
        ...base,
        id:        Date.now() + Math.random(),
        time:      formatTime(),
        ioc:       randomIoc(),
        isNew:     true,
        typeColor: typeColor(base.type),
        sevColor:  severityColor(base.sev),
      };
      setFeed(f => {
        const updated = [item, ...f.slice(0, 30)];
        setTimeout(() => setFeed(ff => ff.map(x => x.id === item.id ? { ...x, isNew: false } : x)), 4000);
        return updated;
      });
      if (base.sev === 'CRITICAL') setStats(s => ({ ...s, alerts: s.alerts + 1 }));
      setStats(s => ({ ...s, iocsToday: s.iocsToday + 1 }));
    }, 7000);
    return () => clearInterval(t);
  }, []);

  // Memoised sorted arrays — avoids re-sorting every render
  const sortedActors      = useMemo(() => [...actors].sort((a, b) => b.risk - a.risk),            [actors]);
  const sortedIndustries  = useMemo(() => [...industries].sort((a, b) => b.score - a.score),      [industries]);
  const sortedPredictions = useMemo(() => [...predictions].sort((a, b) => b.confidence - a.confidence), [predictions]);
  const sortedCompanies   = useMemo(() => [...companies].sort((a, b) => b.risk - a.risk),         [companies]);
  const topPrediction     = sortedPredictions[0];

  // Memoised feed with colour props pre-computed
  const enrichedFeed = useMemo(() => feed.map(item => ({
    ...item,
    typeColor: item.typeColor || typeColor(item.type),
    sevColor:  item.sevColor  || severityColor(item.sev),
  })), [feed]);

  // Timeline
  const timeline = useMemo(() => [
    { stage: 'RECON',         status: 'detected',  signal: `Shodan scans targeting ${topPrediction?.industry || 'target'} — ${randomInt(8,28)} source IPs identified`,        time: `${randomInt(60,110)}h ago` },
    { stage: 'WEAPONIZATION', status: 'detected',  signal: `CVE PoC modified for ${topPrediction?.type || 'attack'} — custom payload obfuscation added`,                      time: `${randomInt(38,58)}h ago` },
    { stage: 'DELIVERY',      status: 'detected',  signal: `Spearphishing: ${randomInt(20,85)} emails targeting IT staff — ${topPrediction?.industry || 'target'} org`,       time: `${randomInt(18,36)}h ago` },
    { stage: 'EXPLOITATION',  status: 'predicted', signal: `Initial access sale posted — VPN credentials, ${topPrediction?.industry || 'target'} target`,                     time: topPrediction?.window || '12–24h' },
    { stage: 'C2 SETUP',      status: 'predicted', signal: `Cobalt Strike beacon deployment — custom profile, EDR evasion techniques`,                                         time: `${randomInt(24,48)}–${randomInt(48,72)}h` },
    { stage: 'RANSOMWARE',    status: 'predicted', signal: `${topPrediction?.actor || 'Threat Actor'} encryptor deployment — ESXi + Windows targets`,                         time: `${randomInt(48,72)}–${randomInt(72,96)}h` },
  ], [topPrediction]);

  const threatLevelColor = THREAT_LEVEL_COLORS[threatLevel];

  const handleActorClick = useCallback((actor) => {
    setSelectedActor(actor);
    setPage('actors');
  }, []);

  const sidebarWidth = sidebarOpen ? 198 : 54;

  return (
    <div className="app-shell">
      <div className="scanline" />

      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <div
        className="sidebar"
        style={{ width: sidebarWidth }}
      >
        {/* Logo */}
        <div
          style={{ padding: '14px 11px', borderBottom: '1px solid #0e2840', cursor: 'pointer' }}
          onClick={() => setSidebarOpen(o => !o)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 31, height: 31, flexShrink: 0, position: 'relative' }}>
              <svg viewBox="0 0 32 32" style={{ width: 31, height: 31 }}>
                <polygon points="16,2 30,24 2,24" fill="none" stroke="#ff1744" strokeWidth="1.5" />
                <polygon points="16,8 26,22 6,22" fill="rgba(255,23,68,.1)" stroke="#ff174450" strokeWidth=".8" />
                <circle cx="16" cy="16" r="3" fill="#ff1744" />
                <line x1="16" y1="2" x2="16" y2="22" stroke="#ff174450" strokeWidth=".8" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', animation: 'ripple 3s infinite', border: '1px solid rgba(255,23,68,.3)' }} />
            </div>
            {sidebarOpen && (
              <div className="sidebar-label">
                <div className="orb" style={{ fontSize: 14, fontWeight: 900, color: '#ff1744', textShadow: '0 0 10px rgba(255,23,68,.6)', letterSpacing: 2 }}>DARK</div>
                <div className="orb" style={{ fontSize: 14, fontWeight: 900, color: '#00e5ff', textShadow: '0 0 10px rgba(0,229,255,.6)', letterSpacing: 2, marginTop: -4 }}>PULSE</div>
              </div>
            )}
          </div>
        </div>

        {/* Threat level indicator */}
        {sidebarOpen && (
          <div style={{ padding: '6px 11px', borderBottom: '1px solid #0e2840' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Dot color={threatLevelColor} />
              <span className="mono" style={{ fontSize: 8, color: threatLevelColor, letterSpacing: .5 }}>LEVEL: {threatLevel}</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '7px 0', overflowY: 'auto' }}>
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => { setPage(n.id); if (n.id !== 'actors') setSelectedActor(null); }}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 9,
                padding: sidebarOpen ? '9px 13px' : '9px 0',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                background: page === n.id ? 'rgba(0,229,255,.08)' : 'transparent',
                border: 'none',
                borderLeft: page === n.id ? '2px solid #00e5ff' : '2px solid transparent',
                cursor: 'pointer',
                color: page === n.id ? '#00e5ff' : '#3d6680',
                transition: 'all .2s',
              }}
            >
              <span style={{ fontSize: 13, flexShrink: 0 }}>{n.icon}</span>
              {sidebarOpen && (
                <span className="orb sidebar-label" style={{ fontSize: 8, fontWeight: 600, letterSpacing: 1.5, color: 'inherit' }}>{n.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Meta + extension button */}
        {sidebarOpen ? (
          <div style={{ padding: '9px 11px', borderTop: '1px solid #0e2840' }} className="sidebar-meta">
            <div className="mono" style={{ fontSize: 8, color: '#3d6680' }}>v3.2.0 · LIVE ENGINE</div>
            <div className="mono" style={{ fontSize: 8, color: '#1a3d5c', marginTop: 2, marginBottom: 8 }}>UPD: {lastUpd} · {ticks} TICKS</div>
            <button
              onClick={() => setPage('extension')}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px',
                background: 'linear-gradient(135deg,rgba(255,23,68,.12),rgba(0,229,255,.06))',
                border: '1px solid rgba(255,23,68,.35)', borderRadius: 3, cursor: 'pointer',
                boxShadow: '0 0 12px rgba(255,23,68,.15)', transition: 'all .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(255,23,68,.3)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 12px rgba(255,23,68,.15)'}
            >
              <span style={{ fontSize: 14 }}>🛡️</span>
              <div style={{ textAlign: 'left' }}>
                <div className="orb" style={{ fontSize: 8, fontWeight: 700, color: '#ff1744', letterSpacing: 1 }}>GET EXTENSION</div>
                <div className="mono" style={{ fontSize: 7, color: '#3d6680', marginTop: 1 }}>Browser Shield ↓</div>
              </div>
            </button>
          </div>
        ) : (
          <div style={{ padding: '7px 0', borderTop: '1px solid #0e2840', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => setPage('extension')}
              title="Get Browser Extension"
              style={{ background: 'rgba(255,23,68,.1)', border: '1px solid rgba(255,23,68,.3)', borderRadius: 3, padding: 6, cursor: 'pointer', fontSize: 14 }}
            >
              🛡️
            </button>
          </div>
        )}
      </div>

      {/* ── MAIN AREA ───────────────────────────────────────────────────────── */}
      <div className="main-area">

        {/* TOP BAR */}
        <div className="topbar">
          <div style={{ flex: 1, display: 'flex', gap: 18, alignItems: 'center' }} className="topbar-stats">
            {[
              { label: 'CAMPAIGNS',  v: stats.activeCampaigns,          c: '#ff1744' },
              { label: 'IOCs TODAY', v: stats.iocsToday.toLocaleString(), c: '#00e5ff' },
              { label: 'DW SIGNALS', v: stats.dwSignals,                  c: '#d500f9' },
              { label: 'PRED ACC',   v: `${stats.predAcc}%`,             c: '#00e676' },
              { label: 'TOTAL IOC',  v: stats.totalIndicators.toLocaleString(), c: '#2979ff' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span className="orb" style={{ fontSize: 13, fontWeight: 700, color: s.c, textShadow: `0 0 7px ${s.c}60` }}>{s.v}</span>
                <span className="mono" style={{ fontSize: 7, color: '#3d6680', letterSpacing: .5 }}>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: 'rgba(255,23,68,.1)', border: '1px solid rgba(255,23,68,.3)', borderRadius: 3 }}>
              <Dot color="#ff1744" />
              <span className="orb" style={{ fontSize: 8, color: '#ff1744' }}>{stats.alerts} ALERTS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: 'rgba(0,229,255,.04)', border: '1px solid rgba(0,229,255,.12)', borderRadius: 3 }}>
              <Dot color="#00e5ff" />
              <span className="mono" style={{ fontSize: 8, color: '#3d6680' }}>LIVE</span>
            </div>
            <span className="mono" style={{ fontSize: 10, color: '#3d6680' }}>{clock} UTC</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="content-area gridbg">
          {page === 'dashboard' && (
            <Dashboard
              stats={stats}
              sortedActors={sortedActors}
              sortedIndustries={sortedIndustries}
              sortedPredictions={sortedPredictions}
              feed={enrichedFeed}
              ticks={ticks}
              lastUpd={lastUpd}
              riskColor={riskColor}
              onActorClick={handleActorClick}
            />
          )}

          {page === 'predictions' && (
            <Predictions
              sortedPredictions={sortedPredictions}
              lastUpd={lastUpd}
              riskColor={riskColor}
            />
          )}

          {page === 'feed' && (
            <Feed feed={enrichedFeed} lastUpd={lastUpd} />
          )}

          {page === 'actors' && (
            <Actors
              sortedActors={sortedActors}
              selectedActor={selectedActor}
              onSelectActor={setSelectedActor}
              riskColor={riskColor}
            />
          )}

          {page === 'map' && (
            <GlobalMap
              density={density}
              mapCountries={mapCountries}
              lastUpd={lastUpd}
            />
          )}

          {page === 'radar' && (
            <AttackRadar
              sortedCompanies={sortedCompanies}
              lastUpd={lastUpd}
              riskColor={riskColor}
              riskLabel={riskLabel}
            />
          )}

          {page === 'timeline' && (
            <Timeline
              timeline={timeline}
              topPrediction={topPrediction}
              lastUpd={lastUpd}
            />
          )}

          {page === 'scanner' && (
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <Scanner />
            </div>
          )}

          {page === 'advisor' && (
            <div style={{ height: 'calc(100vh - 116px)' }}>
              <AIAdvisor />
            </div>
          )}

          {page === 'extension' && <ExtensionPage />}
        </div>
      </div>
    </div>
  );
}
