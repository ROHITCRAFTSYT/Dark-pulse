import { memo } from 'react';
import { Panel, PanelHeader, Bar, LiveNum } from '../atoms.jsx';

const AttackRadar = memo(({ sortedCompanies, lastUpd, riskColor, riskLabel }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }} className="grid-2col">
    <Panel style={{ gridColumn: '1/-1', padding: 16 }}>
      <div className="orb" style={{ fontSize: 18, fontWeight: 700, color: '#00e5ff', marginBottom: 3 }}>◎ COMPANY ATTACK RADAR</div>
      <div className="mono" style={{ fontSize: 9, color: '#3d6680' }}>AI-predicted attack probability · Live updates every 5s · {lastUpd}</div>
    </Panel>

    {sortedCompanies.map((c, i) => (
      <Panel key={c.company} style={{ padding: 15 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 11 }}>
          <div>
            <div className="mono" style={{ fontSize: 7, color: '#3d6680', letterSpacing: 2, marginBottom: 3 }}>#{i + 1} HIGHEST RISK</div>
            <div className="orb" style={{ fontSize: 14, fontWeight: 700, color: '#c8dce8' }}>{c.company}</div>
            <div className="mono" style={{ fontSize: 8, color: '#3d6680', marginTop: 2 }}>{c.sector}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <LiveNum v={c.risk} color={riskColor(c.risk)} size={30} suffix="%" />
            <div className="mono" style={{ fontSize: 7, color: '#3d6680' }}>ATTACK PROB.</div>
          </div>
        </div>
        <div style={{ padding: '6px 8px', background: 'rgba(255,23,68,.04)', border: '1px solid rgba(255,23,68,.1)', borderRadius: 3, marginBottom: 8 }}>
          <span className="mono" style={{ fontSize: 8, color: '#7fa8c0' }}>⚡ {c.reason}</span>
        </div>
        <Bar score={c.risk} color={riskColor(c.risk)} />
      </Panel>
    ))}
  </div>
));

export default AttackRadar;
