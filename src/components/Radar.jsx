import { memo } from 'react';

const Radar = memo(({ data }) => {
  const cx = 120, cy = 120, r = 86;
  const angles = data.map((_, i) => (i * 360 / data.length) - 90);
  const toXY = (angle, radius) => ({
    x: cx + radius * Math.cos(angle * Math.PI / 180),
    y: cy + radius * Math.sin(angle * Math.PI / 180),
  });
  const pts = data.map((d, i) => toXY(angles[i], (d.score / 100) * r));

  return (
    <svg viewBox="0 0 240 240" style={{ width: '100%', maxWidth: 230 }}>
      {/* Rings */}
      {[.25, .5, .75, 1].map((ring, ri) => {
        const ps = angles.map(a => toXY(a, ring * r));
        return (
          <polygon
            key={ri}
            points={ps.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="rgba(0,229,255,.09)"
            strokeWidth=".7"
          />
        );
      })}

      {/* Axis lines */}
      {angles.map((a, i) => {
        const p = toXY(a, r);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(0,229,255,.07)" strokeWidth=".7" />;
      })}

      {/* Data polygon */}
      <polygon
        points={pts.map(p => `${p.x},${p.y}`).join(' ')}
        fill="rgba(255,23,68,.13)"
        stroke="#ff1744"
        strokeWidth="1.5"
      />

      {/* Data points */}
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#ff1744" />)}

      {/* Labels */}
      {data.map((d, i) => {
        const lp = toXY(angles[i], r + 15);
        return (
          <text
            key={i}
            x={lp.x} y={lp.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#7fa8c0"
            fontSize="7.5"
            fontFamily="Share Tech Mono"
          >
            {d.name.slice(0, 6)}
          </text>
        );
      })}
    </svg>
  );
});

export default Radar;
