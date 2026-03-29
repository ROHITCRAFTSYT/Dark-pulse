import { memo } from 'react';

const RISK_WORDS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'WARNING', 'ALERT'];
const RISK_COLORS = {
  CRITICAL: '#ff1744', HIGH: '#ff6d00', MEDIUM: '#ffd600',
  LOW: '#00e676', WARNING: '#ff6d00', ALERT: '#ff6d00',
};

const MsgText = memo(({ text }) => (
  <div style={{ fontSize: 13, lineHeight: 1.78, color: '#c8dce8', fontFamily: 'Rajdhani,sans-serif' }}>
    {text.split('\n').map((line, li) => {
      if (!line.trim()) return <div key={li} style={{ height: 4 }} />;

      const isBullet = /^[-•*]\s/.test(line.trim());
      const content  = isBullet ? line.trim().replace(/^[-•*]\s/, '') : line;

      const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((p, pi) => {
        if (p.startsWith('**') && p.endsWith('**'))
          return <strong key={pi} style={{ color: '#00e5ff', fontWeight: 700 }}>{p.slice(2, -2)}</strong>;
        if (p.startsWith('`') && p.endsWith('`'))
          return (
            <code key={pi} style={{
              fontFamily: 'Share Tech Mono', fontSize: 11,
              color: '#d500f9', background: 'rgba(213,0,249,.1)',
              padding: '1px 5px', borderRadius: 2,
            }}>
              {p.slice(1, -1)}
            </code>
          );
        return (
          <span key={pi}>
            {p.split(new RegExp(`(${RISK_WORDS.join('|')})`)).map((s, si) =>
              RISK_WORDS.includes(s)
                ? <span key={si} style={{ color: RISK_COLORS[s], fontWeight: 700 }}>{s}</span>
                : s
            )}
          </span>
        );
      });

      return (
        <div key={li} style={{ display: 'flex', gap: isBullet ? 8 : 0, marginBottom: 3, alignItems: 'flex-start' }}>
          {isBullet && <span style={{ color: '#d500f9', flexShrink: 0, marginTop: 2 }}>▸</span>}
          <span>{parts}</span>
        </div>
      );
    })}
  </div>
));

export default MsgText;
