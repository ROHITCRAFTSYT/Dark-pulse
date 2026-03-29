import { memo } from 'react';
import { Panel, PanelHeader, Badge, Bar, LiveNum } from '../atoms.jsx';

const Predictions = memo(({ sortedPredictions, lastUpd, riskColor }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }} className="grid-2col">
    <Panel style={{ gridColumn: '1/-1', padding: 16 }}>
      <div className="orb" style={{ fontSize: 18, fontWeight: 700, color: '#ff1744', marginBottom: 3 }}>🔮 AI CAMPAIGN PREDICTION ENGINE</div>
      <div className="mono" style={{ fontSize: 9, color: '#3d6680' }}>
        Correlating OSINT · CVE releases · dark web chatter · credential leaks · threat actor patterns · Live {lastUpd}
      </div>
    </Panel>

    {sortedPredictions.map(p => {
      const c = riskColor(p.confidence);
      return (
        <Panel key={p.id} style={{ padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div className="orb" style={{ fontSize: 16, fontWeight: 700, color: c }}>{p.actor}</div>
              <div className="mono" style={{ fontSize: 8, color: '#3d6680', marginTop: 2 }}>PREDICTED CAMPAIGN</div>
            </div>
            <Badge label={p.status} color={c} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 12 }}>
            {[
              { label: 'TARGET INDUSTRY', v: p.industry,              c: '#00e5ff' },
              { label: 'ATTACK TYPE',     v: p.type,                  c: '#d500f9' },
              { label: 'LAUNCH WINDOW',   v: p.window,                c: '#ffd600' },
              { label: 'SIGNAL COUNT',    v: `${p.signals} indicators`, c: '#ff6d00' },
            ].map(f => (
              <div key={f.label} style={{ padding: '6px 8px', background: `${f.c}08`, border: `1px solid ${f.c}20`, borderRadius: 3 }}>
                <div className="mono" style={{ fontSize: 7, color: f.c, letterSpacing: 1, marginBottom: 3 }}>{f.label}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#c8dce8' }}>{f.v}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span className="mono" style={{ fontSize: 8, color: '#3d6680' }}>CONFIDENCE</span>
            <LiveNum v={p.confidence} color={c} size={17} suffix="%" />
          </div>
          <Bar score={p.confidence} color={c} />
        </Panel>
      );
    })}
  </div>
));

export default Predictions;
