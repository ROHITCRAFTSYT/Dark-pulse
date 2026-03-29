import { memo } from 'react';
import { Panel, PanelHeader, Badge, Dot, Bar, LiveNum, Delta } from '../atoms.jsx';
import Radar from '../Radar.jsx';

const Dashboard = memo(({ stats, sortedActors, sortedIndustries, sortedPredictions, feed, ticks, lastUpd, riskColor, onActorClick }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr) 230px', gap: 9 }} className="grid-dash">

    {/* Stats row */}
    <Panel style={{ gridColumn: '1/-1', padding: '12px 18px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6 }} className="grid-5col">
        {[
          { label: 'IOCs TODAY',       v: stats.iocsToday,       c: '#00e5ff' },
          { label: 'DW SIGNALS',       v: stats.dwSignals,       c: '#d500f9' },
          { label: 'PREDICTIONS',      v: stats.predictions,     c: '#ff6d00' },
          { label: 'ACTIVE ACTORS',    v: sortedActors.filter(a => a.active).length, c: '#ff1744' },
          { label: 'TOTAL INDICATORS', v: stats.totalIndicators, c: '#00e676' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center', padding: '7px 0', borderRight: '1px solid #0e2840' }}>
            <LiveNum v={s.v} color={s.c} size={24} />
            <div className="mono" style={{ fontSize: 7, color: '#3d6680', letterSpacing: 1.5, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </Panel>

    {/* Industry threat pulse */}
    <Panel style={{ gridColumn: 'span 2' }}>
      <PanelHeader title="INDUSTRY THREAT PULSE" sub={`LIVE · UPD ${lastUpd}`} accent="#ff6d00" />
      <div style={{ padding: 11 }}>
        {sortedIndustries.map(ind => (
          <div key={ind.name} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span className="mono" style={{ fontSize: 9, color: '#7fa8c0' }}>{ind.name.toUpperCase()}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Delta cur={ind.score} prev={ind.prev} />
                <LiveNum v={ind.score} color={ind.color} size={13} />
              </div>
            </div>
            <Bar score={ind.score} color={ind.color} />
          </div>
        ))}
      </div>
    </Panel>

    {/* Active predictions */}
    <Panel style={{ gridColumn: 'span 2' }}>
      <PanelHeader
        title="ACTIVE PREDICTIONS"
        sub="AI-CORRELATED FORECASTS"
        accent="#ff1744"
        right={<Badge label={`${sortedPredictions.filter(p => p.confidence >= 85).length} CRITICAL`} color="#ff1744" />}
      />
      <div style={{ padding: 9, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {sortedPredictions.slice(0, 4).map(p => {
          const c = riskColor(p.confidence);
          return (
            <div key={p.id} style={{ padding: '8px 10px', background: `${c}06`, border: `1px solid ${c}25`, borderRadius: 3 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#c8dce8' }}>{p.actor}</div>
                  <div className="mono" style={{ fontSize: 8, color: '#7fa8c0', marginTop: 1 }}>{p.type} → {p.industry}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Badge label={p.status} color={c} />
                  <div><LiveNum v={p.confidence} color={c} size={17} suffix="%" /></div>
                </div>
              </div>
              <div style={{ marginTop: 4, display: 'flex', gap: 9 }}>
                <span className="mono" style={{ fontSize: 8, color: '#3d6680' }}>WIN: {p.window}</span>
                <span className="mono" style={{ fontSize: 8, color: '#3d6680' }}>SIG: {p.signals}</span>
              </div>
              <Bar score={p.confidence} color={c} />
            </div>
          );
        })}
      </div>
    </Panel>

    {/* Radar — spans 2 rows */}
    <Panel style={{ gridRow: 'span 2', display: 'flex', flexDirection: 'column' }}>
      <PanelHeader title="ATTACK RADAR" sub="LIVE 48H" accent="#00e5ff" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 7 }}>
        <Radar data={sortedIndustries.map(i => ({ name: i.name, score: i.score }))} />
      </div>
      <div style={{ padding: '6px 11px', borderTop: '1px solid #0e2840' }} className="mono">
        <span style={{ fontSize: 7, color: '#3d6680' }}>⟳ 5s tick · {ticks} updates</span>
      </div>
    </Panel>

    {/* Live threat feed */}
    <Panel style={{ gridColumn: 'span 3' }}>
      <PanelHeader
        title="LIVE THREAT FEED"
        sub="OSINT + DARK WEB + CVE CORRELATION"
        accent="#00e5ff"
        right={<div style={{ display: 'flex', gap: 5, alignItems: 'center' }}><Dot /><span className="mono" style={{ fontSize: 8, color: '#00e676' }}>LIVE · {feed.length} EVENTS</span></div>}
      />
      <div style={{ maxHeight: 248, overflowY: 'auto' }}>
        {feed.slice(0, 9).map((item, i) => (
          <div key={item.id} style={{
            padding: '7px 12px', borderBottom: '1px solid #060d14',
            display: 'flex', gap: 8, alignItems: 'flex-start',
            background: item.isNew ? 'rgba(0,229,255,.04)' : 'transparent',
            animation: item.isNew ? 'fadeIn .4s ease' : 'none',
            transition: 'background 1.5s',
          }}>
            <span className="mono" style={{ fontSize: 8, color: '#3d6680', flexShrink: 0, marginTop: 2, width: 36 }}>{item.time}</span>
            <Badge label={item.type} color={item.typeColor} />
            <Badge label={item.sev}  color={item.sevColor} />
            <span style={{ fontSize: 11, color: '#c8dce8', flex: 1 }}>{item.text}</span>
            <span className="mono" style={{ fontSize: 7, color: '#3d6680', flexShrink: 0 }}>{item.source}</span>
          </div>
        ))}
      </div>
    </Panel>

    {/* Top threat actors */}
    <Panel style={{ gridColumn: 'span 2' }}>
      <PanelHeader title="TOP THREAT ACTORS" sub="BY LIVE RISK SCORE" accent="#d500f9" />
      <div style={{ padding: 9 }}>
        {sortedActors.slice(0, 6).map(a => (
          <div
            key={a.id}
            onClick={() => onActorClick(a)}
            style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 0', borderBottom: '1px solid #060d14', cursor: 'pointer' }}
          >
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.color, boxShadow: `0 0 5px ${a.color}`, flexShrink: 0 }} className={a.active ? 'pulse' : ''} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#c8dce8' }}>{a.name}</div>
              <div className="mono" style={{ fontSize: 8, color: '#3d6680' }}>{a.origin} · {a.type}</div>
            </div>
            <LiveNum v={a.risk} color={riskColor(a.risk)} size={14} />
          </div>
        ))}
      </div>
    </Panel>

  </div>
));

export default Dashboard;
