import { useState, useEffect, useRef, memo } from 'react';
import { MAP_NODES, ARC_COLORS } from '../data/threatData.js';
import { randomInt } from '../utils/helpers.js';

const WorldMap = memo(({ density }) => {
  const [arcs, setArcs] = useState([]);
  const arcRef = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const src = MAP_NODES[randomInt(0, MAP_NODES.length - 1)];
      const dst = MAP_NODES[randomInt(0, MAP_NODES.length - 1)];
      if (src === dst) return;

      const id = Date.now() + Math.random();
      const color = ARC_COLORS[randomInt(0, ARC_COLORS.length - 1)];

      arcRef.current = [...arcRef.current.slice(-24), { id, src, dst, color }];
      setArcs([...arcRef.current]);

      setTimeout(() => {
        arcRef.current = arcRef.current.filter(a => a.id !== id);
        setArcs([...arcRef.current]);
      }, randomInt(2200, 3800));
    }, Math.max(250, 1100 - density * 6));

    return () => clearInterval(interval);
  }, [density]);

  return (
    <svg viewBox="0 0 1000 500" style={{ width: '100%', height: '100%' }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Grid lines */}
      {[...Array(10)].map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} stroke="rgba(0,229,255,.025)" strokeWidth=".5" />
      ))}
      {[...Array(20)].map((_, i) => (
        <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" stroke="rgba(0,229,255,.025)" strokeWidth=".5" />
      ))}

      {/* Continent outlines */}
      <path d="M 375 95 L 545 95 L 555 205 L 505 245 L 448 235 L 385 202 Z"             fill="rgba(0,229,255,.05)" stroke="rgba(0,229,255,.13)" strokeWidth=".8" />
      <path d="M 428 258 L 512 258 L 542 385 L 480 422 L 428 382 Z"                     fill="rgba(0,229,255,.05)" stroke="rgba(0,229,255,.13)" strokeWidth=".8" />
      <path d="M 578 98 L 705 98 L 715 182 L 642 192 L 578 162 Z"                       fill="rgba(0,229,255,.05)" stroke="rgba(0,229,255,.13)" strokeWidth=".8" />
      <path d="M 568 202 L 672 202 L 682 372 L 612 392 L 558 342 Z"                     fill="rgba(0,229,255,.05)" stroke="rgba(0,229,255,.13)" strokeWidth=".8" />
      <path d="M 698 88 L 902 88 L 902 282 L 792 292 L 698 252 L 688 148 Z"             fill="rgba(0,229,255,.05)" stroke="rgba(0,229,255,.13)" strokeWidth=".8" />
      <path d="M 818 308 L 922 308 L 932 402 L 828 412 Z"                               fill="rgba(0,229,255,.05)" stroke="rgba(0,229,255,.13)" strokeWidth=".8" />

      {/* Attack arcs */}
      {arcs.map(a => {
        const mx = (a.src.x + a.dst.x) / 2;
        const my = Math.min(a.src.y, a.dst.y) - randomInt(40, 85);
        return (
          <g key={a.id} filter="url(#glow)">
            <path
              d={`M ${a.src.x} ${a.src.y} Q ${mx} ${my} ${a.dst.x} ${a.dst.y}`}
              fill="none" stroke={a.color} strokeWidth="1.2" opacity=".72" strokeDasharray="8 5"
            >
              <animate attributeName="stroke-dashoffset" from="120" to="0" dur="1.6s" fill="freeze" />
            </path>
            <circle cx={a.dst.x} cy={a.dst.y} r="5" fill="none" stroke={a.color} strokeWidth="1.2" opacity=".9">
              <animate attributeName="r" from="2" to="16" dur=".85s" repeatCount="indefinite" />
              <animate attributeName="opacity" from=".9" to="0" dur=".85s" repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}

      {/* Nodes */}
      {MAP_NODES.map((n, i) => (
        <g key={i} filter="url(#glow)">
          <circle cx={n.x} cy={n.y} r="2.8" fill="#00e5ff" stroke="#00e5ff" strokeWidth=".8" />
          <circle cx={n.x} cy={n.y} r="8" fill="none" stroke="#00e5ff" strokeWidth=".4" opacity=".25">
            <animate attributeName="r"       from="3"   to="14"  dur={`${1.4 + i * .09}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" from=".55" to="0"   dur={`${1.4 + i * .09}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </svg>
  );
});

export default WorldMap;
