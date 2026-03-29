import { memo } from 'react';
import { Panel, PanelHeader, Badge, Dot } from '../atoms.jsx';

const Feed = memo(({ feed, lastUpd }) => (
  <Panel>
    <PanelHeader
      title="LIVE THREAT INTELLIGENCE FEED"
      sub={`${feed.length} EVENTS · STREAMING · UPD ${lastUpd}`}
      accent="#00e5ff"
      right={<div style={{ display: 'flex', gap: 5, alignItems: 'center' }}><Dot /><span className="mono" style={{ fontSize: 8, color: '#00e676' }}>LIVE</span></div>}
    />
    {feed.map((item, i) => (
      <div
        key={item.id}
        style={{
          padding: '10px 14px',
          borderBottom: '1px solid #060d14',
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          background: item.isNew ? 'rgba(0,229,255,.03)' : i % 2 === 0 ? 'rgba(0,229,255,.006)' : 'transparent',
          animation: item.isNew ? 'fadeIn .3s ease' : 'none',
        }}
      >
        <span className="mono" style={{ fontSize: 8, color: '#3d6680', flexShrink: 0, width: 38, marginTop: 1 }}>{item.time}</span>
        <Badge label={item.type} color={item.typeColor} />
        <Badge label={item.sev}  color={item.sevColor} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: '#c8dce8', marginBottom: 3 }}>{item.text}</div>
          <div style={{ display: 'flex', gap: 9 }}>
            <span className="mono" style={{ fontSize: 7, color: '#3d6680' }}>SRC: {item.source}</span>
            <span className="mono" style={{ fontSize: 7, color: '#0e3a54' }}>IOC: {item.ioc}</span>
          </div>
        </div>
      </div>
    ))}
  </Panel>
));

export default Feed;
