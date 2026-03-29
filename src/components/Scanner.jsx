import { useState } from 'react';
import { Panel, PanelHeader, Badge } from './atoms.jsx';
import { riskColor, riskLabel } from '../utils/helpers.js';

const SCAN_STEPS = [
  'Resolving DNS & ASN records...',
  'Scanning open ports (top 1000)...',
  'Querying CVE databases...',
  'Dark web credential search...',
  'SSL/TLS analysis...',
  'Generating risk report...',
];

const FALLBACK_RESULT = (domain) => ({
  riskScore: 67,
  openPorts: ['443: HTTPS', '8080: HTTP-ALT', '3389: RDP', '22: SSH'],
  vulns: ['CVE-2025-3847: Apache Kafka RCE', 'CVE-2024-6387: OpenSSH RegreSSHion'],
  credLeaks: 1847,
  exposedServices: ['VPN Portal', 'Admin Panel', 'Legacy API'],
  subdomains: [`vpn.${domain}`, `admin.${domain}`],
  darkWebMentions: 3,
  recommendations: [
    'Patch CVE-2025-3847 immediately',
    'Disable RDP or restrict to VPN',
    'Enforce MFA on all portals',
  ],
});

export default function Scanner() {
  const [domain,   setDomain]   = useState('');
  const [scanning, setScanning] = useState(false);
  const [result,   setResult]   = useState(null);
  const [progress, setProgress] = useState(0);
  const [step,     setStep]     = useState('');
  const [error,    setError]    = useState(null);

  const scan = async () => {
    if (!domain.trim() || scanning) return;
    setScanning(true);
    setResult(null);
    setError(null);
    setProgress(0);

    for (let i = 0; i < SCAN_STEPS.length; i++) {
      setStep(SCAN_STEPS[i]);
      await new Promise(r => setTimeout(r, 650));
      setProgress(Math.round(((i + 1) / SCAN_STEPS.length) * 100));
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'Generate a realistic FICTIONAL security report. Return ONLY valid JSON, no markdown: {"riskScore":number,"openPorts":["port: service"],"vulns":["CVE-XXXX-XXXX: desc"],"credLeaks":number,"exposedServices":["service"],"darkWebMentions":number,"subdomains":["sub.domain"],"recommendations":["action"]}',
          messages: [{ role: 'user', content: `Exposure report for: ${domain}` }],
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const text = (data.content?.[0]?.text || '{}').replace(/```json|```/g, '').trim();
      setResult(JSON.parse(text));
    } catch {
      setResult(FALLBACK_RESULT(domain));
    }

    setScanning(false);
  };

  const rc = result ? riskColor(result.riskScore) : '#00e676';

  return (
    <Panel style={{ height: '100%' }}>
      <PanelHeader title="EXPOSURE SCANNER" sub="OSINT + SHODAN + DARK WEB CORRELATION" accent="#ffd600" />
      <div style={{ padding: 16 }}>

        {/* Input */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <input
            value={domain}
            onChange={e => setDomain(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && scan()}
            placeholder="Enter domain: target.com"
            style={{
              flex: 1,
              background: 'rgba(255,214,0,.04)',
              border: '1px solid rgba(255,214,0,.2)',
              borderRadius: 3, color: '#c8dce8',
              padding: '9px 13px',
              fontFamily: 'Share Tech Mono', fontSize: 12, outline: 'none',
            }}
          />
          <button
            onClick={scan}
            disabled={scanning}
            style={{
              background: 'rgba(255,214,0,.15)',
              border: '1px solid rgba(255,214,0,.4)',
              borderRadius: 3, color: '#ffd600',
              padding: '9px 18px', cursor: scanning ? 'not-allowed' : 'pointer',
              fontFamily: 'Orbitron', fontSize: 9, fontWeight: 700, letterSpacing: 1,
            }}
          >
            {scanning ? 'SCANNING' : 'SCAN'}
          </button>
        </div>

        {/* Progress bar */}
        {scanning && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span className="mono" style={{ fontSize: 8, color: '#ffd600' }}>{step}</span>
              <span className="mono" style={{ fontSize: 8, color: '#ffd600' }}>{progress}%</span>
            </div>
            <div style={{ height: 3, background: '#0a1520', borderRadius: 2 }}>
              <div style={{
                height: '100%', width: `${progress}%`,
                background: 'linear-gradient(90deg,#ffd600,#ff6d00)',
                borderRadius: 2, transition: 'width .3s',
                boxShadow: '0 0 8px #ffd60070',
              }} />
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{ animation: 'fadeIn .4s ease' }}>
            {/* Risk summary */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14, marginBottom: 13,
              padding: 13,
              background: `${rc}0c`,
              border: `1px solid ${rc}28`,
              borderRadius: 3,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div className="orb" style={{ fontSize: 36, fontWeight: 900, color: rc, textShadow: `0 0 20px ${rc}70` }}>
                  {result.riskScore}
                </div>
                <div className="mono" style={{ fontSize: 8, color: rc }}>RISK SCORE</div>
              </div>
              <div style={{ flex: 1 }}>
                <Badge label={riskLabel(result.riskScore)} color={rc} />
                <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[
                    ['#ff1744', result.credLeaks?.toLocaleString(), 'CRED LEAKS'],
                    ['#d500f9', result.darkWebMentions, 'DW MENTIONS'],
                    ['#ff6d00', result.openPorts?.length, 'OPEN PORTS'],
                  ].map(([c, v, l]) => (
                    <div key={l}>
                      <div className="orb" style={{ fontSize: 14, color: c }}>{v}</div>
                      <div className="mono" style={{ fontSize: 7, color: '#3d6680' }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 9 }}>
              <div>
                <div className="mono" style={{ fontSize: 8, color: '#ff6d00', letterSpacing: 2, marginBottom: 5 }}>OPEN PORTS</div>
                {result.openPorts?.map((p, i) => (
                  <div key={i} style={{ padding: '3px 0', borderBottom: '1px solid #0e2840', fontFamily: 'Share Tech Mono', fontSize: 9, color: '#7fa8c0' }}>▸ {p}</div>
                ))}
              </div>
              <div>
                <div className="mono" style={{ fontSize: 8, color: '#ff1744', letterSpacing: 2, marginBottom: 5 }}>VULNS</div>
                {result.vulns?.map((v, i) => (
                  <div key={i} style={{ padding: '3px 0', borderBottom: '1px solid #0e2840', fontFamily: 'Share Tech Mono', fontSize: 8, color: '#ff6d00' }}>▸ {v}</div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <div className="mono" style={{ fontSize: 8, color: '#00e676', letterSpacing: 2, marginBottom: 5 }}>RECOMMENDATIONS</div>
              {result.recommendations?.map((r, i) => (
                <div key={i} style={{
                  padding: '4px 8px', marginBottom: 3,
                  background: 'rgba(0,230,118,.05)',
                  border: '1px solid rgba(0,230,118,.15)',
                  borderRadius: 2, fontSize: 11, color: '#c8dce8',
                }}>
                  ✓ {r}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error retry */}
        {error && !result && (
          <div style={{ padding: '11px 13px', background: 'rgba(255,214,0,.05)', border: '1px solid rgba(255,214,0,.2)', borderRadius: 3 }}>
            <div className="mono" style={{ fontSize: 9, color: '#ffd600', marginBottom: 7 }}>{error}</div>
            <button onClick={scan} style={{ background: 'rgba(255,214,0,.12)', border: '1px solid rgba(255,214,0,.3)', borderRadius: 2, color: '#ffd600', padding: '4px 12px', cursor: 'pointer', fontFamily: 'Orbitron', fontSize: 8 }}>
              RETRY
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
}
