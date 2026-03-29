import { memo } from 'react';
import { Panel, PanelHeader, Badge } from '../atoms.jsx';

const Timeline = memo(({ timeline, topPrediction, lastUpd }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
    <Panel style={{ padding: 16 }}>
      <div className="orb" style={{ fontSize: 18, fontWeight: 700, color: '#ffd600', marginBottom: 3 }}>≋ ATTACK TIMELINE SIMULATOR</div>
      <div className="mono" style={{ fontSize: 9, color: '#3d6680' }}>
        {topPrediction?.actor} → {topPrediction?.industry} · {topPrediction?.type} · Live progression · {lastUpd}
      </div>
    </Panel>

    <div style={{ position: 'relative' }}>
      {/* Vertical line */}
      <div style={{
        position: 'absolute', left: 23, top: 0, bottom: 0, width: 2,
        background: 'linear-gradient(180deg,#ff1744,#ffd600,rgba(255,214,0,.12))',
      }} />

      {timeline.map((s, i) => (
        <div key={`${s.stage}-${i}`} style={{
          display: 'flex', gap: 13, marginBottom: 13,
          paddingLeft: 7,
          animation: `fadeIn .4s ${i * .07}s ease both`,
        }}>
          {/* Timeline dot */}
          <div style={{ width: 31, height: 31, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: 12, height: 12, borderRadius: '50%',
              background: s.status === 'detected' ? '#ff1744' : 'rgba(255,214,0,.3)',
              border: `2px solid ${s.status === 'detected' ? '#ff1744' : '#ffd600'}`,
              boxShadow: s.status === 'detected' ? '0 0 10px rgba(255,23,68,.6)' : '0 0 10px rgba(255,214,0,.3)',
            }} className={s.status === 'detected' ? 'pulse' : ''} />
          </div>

          {/* Stage card */}
          <Panel style={{
            flex: 1, padding: 13,
            borderColor: s.status === 'detected' ? 'rgba(255,23,68,.3)' : 'rgba(255,214,0,.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 4 }}>
                  <span className="orb" style={{ fontSize: 12, fontWeight: 700, color: s.status === 'detected' ? '#ff1744' : '#ffd600' }}>
                    {s.stage}
                  </span>
                  <Badge label={s.status.toUpperCase()} color={s.status === 'detected' ? '#ff1744' : '#ffd600'} />
                </div>
                <div style={{ fontSize: 12, color: '#c8dce8' }}>{s.signal}</div>
              </div>
              <div className="mono" style={{ fontSize: 9, color: '#3d6680', flexShrink: 0, marginLeft: 12 }}>{s.time}</div>
            </div>
          </Panel>
        </div>
      ))}
    </div>
  </div>
));

export default Timeline;
