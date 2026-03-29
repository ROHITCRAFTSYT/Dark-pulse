import { memo } from 'react';
import { Panel, PanelHeader, LiveNum } from '../atoms.jsx';
import WorldMap from '../WorldMap.jsx';

const GlobalMap = memo(({ density, mapCountries, lastUpd }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
    <Panel>
      <PanelHeader
        title="GLOBAL THREAT MAP"
        sub={`REAL-TIME ATTACK VECTORS · ${density} ACTIVE · UPD ${lastUpd}`}
        accent="#00e5ff"
        right={
          <div style={{ display: 'flex', gap: 9 }}>
            {[['#ff1744','RANSOM'],['#d500f9','APT'],['#ff6d00','PHISH'],['#2979ff','ESPION'],['#ffd600','EXPLOIT']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: c }} />
                <span className="mono" style={{ fontSize: 7, color: '#3d6680' }}>{l}</span>
              </div>
            ))}
          </div>
        }
      />
      <div style={{ height: 390 }}>
        <WorldMap density={density} />
      </div>
    </Panel>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9 }} className="grid-4col">
      {mapCountries.map(c => (
        <Panel key={c.country} style={{ padding: 13, textAlign: 'center' }}>
          <LiveNum v={c.attacks} color={c.color} size={24} />
          <div className="mono" style={{ fontSize: 9, color: '#7fa8c0', marginTop: 2 }}>{c.country}</div>
          <div style={{ color: c.trend === '↑' ? '#ff6d00' : c.trend === '↓' ? '#00e676' : '#ffd600', fontSize: 16, marginTop: 1 }}>{c.trend}</div>
          <div className="mono" style={{ fontSize: 7, color: '#3d6680', marginTop: 1 }}>attacks today</div>
        </Panel>
      ))}
    </div>
  </div>
));

export default GlobalMap;
