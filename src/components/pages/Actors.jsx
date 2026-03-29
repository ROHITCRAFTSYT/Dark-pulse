import { memo } from 'react';
import { Panel, PanelHeader, Badge, Bar, LiveNum } from '../atoms.jsx';

const Actors = memo(({ sortedActors, selectedActor, onSelectActor, riskColor }) => (
  <div style={{ display: 'grid', gridTemplateColumns: selectedActor ? '295px 1fr' : 'repeat(3,1fr)', gap: 9 }} className={selectedActor ? '' : 'grid-3col'}>

    {selectedActor ? (
      <>
        {/* Actor list sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {sortedActors.map(a => (
            <div
              key={a.id}
              onClick={() => onSelectActor(a)}
              style={{
                padding: '10px 12px',
                background: selectedActor?.id === a.id ? 'rgba(0,229,255,.07)' : 'transparent',
                border: selectedActor?.id === a.id ? '1px solid rgba(0,229,255,.22)' : '1px solid #0e2840',
                borderRadius: 4, cursor: 'pointer',
                display: 'flex', gap: 8, alignItems: 'center',
              }}
            >
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.color, flexShrink: 0 }} className={a.active ? 'pulse' : ''} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#c8dce8' }}>{a.name}</div>
                <div className="mono" style={{ fontSize: 7, color: '#3d6680' }}>{a.type}</div>
              </div>
              <LiveNum v={a.risk} color={a.color} size={12} />
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <Panel>
          <PanelHeader
            title={selectedActor.name}
            sub={`${selectedActor.type} · ${selectedActor.origin}`}
            accent={selectedActor.color}
            right={
              <button
                onClick={() => onSelectActor(null)}
                style={{ background: 'none', border: '1px solid #0e2840', color: '#3d6680', padding: '3px 9px', cursor: 'pointer', borderRadius: 2, fontFamily: 'Share Tech Mono', fontSize: 8 }}
              >
                ✕ CLOSE
              </button>
            }
          />
          <div style={{ padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 9, marginBottom: 16 }}>
              {[
                { label: 'RISK SCORE', v: selectedActor.risk,       c: riskColor(selectedActor.risk) },
                { label: 'CAMPAIGNS',  v: selectedActor.campaigns,  c: '#00e5ff' },
                { label: 'STATUS',     v: selectedActor.active ? 'ACTIVE' : 'DORMANT', c: selectedActor.active ? '#ff1744' : '#00e676' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center', padding: 11, background: `${s.c}08`, border: `1px solid ${s.c}20`, borderRadius: 3 }}>
                  <div className="orb" style={{ fontSize: 22, fontWeight: 700, color: s.c }}>
                    {typeof s.v === 'number' ? s.v.toLocaleString() : s.v}
                  </div>
                  <div className="mono" style={{ fontSize: 7, color: '#3d6680', letterSpacing: 1, marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {[
              { label: 'ALIASES',           items: selectedActor.aliases,  c: selectedActor.color },
              { label: 'TARGET INDUSTRIES', items: selectedActor.targets,  c: '#00e5ff' },
              { label: 'MITRE ATT&CK TTPs', items: selectedActor.ttps,    c: '#d500f9' },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: 12 }}>
                <div className="mono" style={{ fontSize: 8, color: s.c, letterSpacing: 2, marginBottom: 5 }}>{s.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {s.items.map(x => <Badge key={x} label={x} color={s.c} />)}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </>
    ) : (
      sortedActors.map(a => (
        <Panel key={a.id} onClick={() => onSelectActor(a)}>
          <div style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, boxShadow: `0 0 6px ${a.color}` }} className={a.active ? 'pulse' : ''} />
                <Badge label={a.active ? 'ACTIVE' : 'DORMANT'} color={a.active ? '#ff1744' : '#3d6680'} />
              </div>
              <LiveNum v={a.risk} color={a.color} size={22} />
            </div>
            <div className="orb" style={{ fontSize: 14, fontWeight: 700, color: '#c8dce8', marginBottom: 2 }}>{a.name}</div>
            <div className="mono" style={{ fontSize: 8, color: '#3d6680', marginBottom: 9 }}>
              {a.origin} · {a.type} · {a.campaigns.toLocaleString()} campaigns
            </div>
            <Bar score={a.risk} color={a.color} />
            <div style={{ marginTop: 9, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {a.targets.map(t => <Badge key={t} label={t} color="#3d6680" />)}
            </div>
          </div>
        </Panel>
      ))
    )}
  </div>
));

export default Actors;
