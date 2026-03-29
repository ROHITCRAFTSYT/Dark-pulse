import { useState, useEffect, memo } from 'react';

// ── Panel ────────────────────────────────────────────────────────────────────
export const Panel = memo(({ children, style, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: 'linear-gradient(135deg,#0d1e2e,#0a1520)',
      border: '1px solid #0e2840',
      borderRadius: 4,
      position: 'relative',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}
  >
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 1,
      background: 'linear-gradient(90deg,transparent,rgba(0,229,255,.32),transparent)',
    }} />
    {children}
  </div>
));

// ── PanelHeader ──────────────────────────────────────────────────────────────
export const PanelHeader = memo(({ title, sub, right, accent = '#00e5ff' }) => (
  <div style={{
    padding: '11px 15px',
    borderBottom: '1px solid #0e2840',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <div style={{
        width: 3, height: 15,
        background: accent,
        boxShadow: `0 0 8px ${accent}`,
        borderRadius: 2,
      }} />
      <div>
        <div className="orb" style={{ fontSize: 10, fontWeight: 600, color: accent, letterSpacing: 2 }}>{title}</div>
        {sub && <div className="mono" style={{ fontSize: 8, color: '#3d6680', marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
    {right && <div>{right}</div>}
  </div>
));

// ── Badge ────────────────────────────────────────────────────────────────────
export const Badge = memo(({ label, color }) => (
  <span className="mono" style={{
    fontSize: 8, fontWeight: 700, letterSpacing: 1.5,
    color,
    border: `1px solid ${color}40`,
    background: `${color}12`,
    padding: '2px 6px',
    borderRadius: 2,
    whiteSpace: 'nowrap',
  }}>
    {label}
  </span>
));

// ── Dot ──────────────────────────────────────────────────────────────────────
export const Dot = memo(({ color = '#00e676' }) => (
  <span style={{ position: 'relative', display: 'inline-flex', width: 7, height: 7, alignItems: 'center' }}>
    <span style={{
      width: 7, height: 7, borderRadius: '50%',
      background: color, display: 'block',
      boxShadow: `0 0 6px ${color}`,
    }} className="pulse" />
    <span style={{
      position: 'absolute', width: 7, height: 7, borderRadius: '50%',
      background: color, opacity: .5,
      animation: 'ripple 2s infinite',
    }} />
  </span>
));

// ── Bar ──────────────────────────────────────────────────────────────────────
export const Bar = memo(({ score, color }) => (
  <div style={{ height: 4, background: '#0a1520', borderRadius: 2, overflow: 'hidden' }}>
    <div style={{
      height: '100%',
      width: `${score}%`,
      background: `linear-gradient(90deg,${color}60,${color})`,
      borderRadius: 2,
      boxShadow: `0 0 5px ${color}50`,
      transition: 'width .9s ease',
    }} />
  </div>
));

// ── LiveNum ──────────────────────────────────────────────────────────────────
export const LiveNum = ({ v, color, size = 24, suffix = '' }) => {
  const [prev, setPrev] = useState(v);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (v !== prev) {
      setFlash(v > prev ? 'up' : 'down');
      const timer = setTimeout(() => setFlash(null), 700);
      setPrev(v);
      return () => clearTimeout(timer);
    }
  }, [v]);

  const displayColor = flash === 'up' ? '#ff6d00' : flash === 'down' ? '#00e676' : color;

  return (
    <span className="orb" style={{
      fontSize: size, fontWeight: 700,
      color: displayColor,
      textShadow: `0 0 10px ${displayColor}60`,
      transition: 'color .5s',
    }}>
      {typeof v === 'number' ? v.toLocaleString() : v}{suffix}
    </span>
  );
};

// ── Delta ────────────────────────────────────────────────────────────────────
export const Delta = memo(({ cur, prev }) => {
  const d = cur - prev;
  return (
    <span className="mono" style={{
      fontSize: 8,
      color: d > 0 ? '#ff6d00' : d < 0 ? '#00e676' : '#3d6680',
    }}>
      {d > 0 ? `↑+${d}` : d < 0 ? `↓${d}` : '→'}
    </span>
  );
});
