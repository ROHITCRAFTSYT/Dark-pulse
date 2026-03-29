import { useState } from 'react';
import { Panel, PanelHeader } from './atoms.jsx';
import { EXT_FILES, INSTALL_STEPS, EXTENSION_FEATURES, buildInstallerHTML } from '../data/threatData.js';

export default function ExtensionPage() {
  const [copied,      setCopied]      = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded,  setDownloaded]  = useState(false);

  const downloadExtension = async () => {
    setDownloading(true);
    try {
      const html = buildInstallerHTML();
      const blob = new Blob([html], { type: 'text/html' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = 'darkpulse-installer.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 5000);
    } catch (e) {
      console.error(e);
    }
    setDownloading(false);
  };

  const copyFile = (name, content) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(name);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const dlColor  = downloaded ? '#00e676' : downloading ? '#ffd600' : '#ff1744';
  const dlLabel  = downloaded ? 'DOWNLOADED!' : downloading ? 'BUILDING...' : 'DOWNLOAD';
  const dlSub    = downloaded ? 'Open installer.html' : 'darkpulse-installer.html';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* Hero */}
      <Panel style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg,rgba(255,23,68,.08),rgba(0,229,255,.04))', padding: '28px 28px 24px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 28 }}>🛡️</span>
                <div>
                  <div className="orb" style={{ fontSize: 20, fontWeight: 900, color: '#ff1744', letterSpacing: 2, textShadow: '0 0 12px rgba(255,23,68,.5)' }}>DARKPULSE</div>
                  <div className="orb" style={{ fontSize: 20, fontWeight: 900, color: '#00e5ff', letterSpacing: 2, marginTop: -4, textShadow: '0 0 12px rgba(0,229,255,.5)' }}>THREAT SHIELD</div>
                </div>
              </div>
              <div className="mono" style={{ fontSize: 9, color: '#d500f9', letterSpacing: 2, marginBottom: 10 }}>CHROME EXTENSION · v1.0.0 · AI-POWERED</div>
              <div style={{ fontSize: 14, color: '#c8dce8', lineHeight: 1.7, maxWidth: 500 }}>
                Real-time cybersecurity protection as you browse. Every domain you visit is instantly analyzed by Claude AI for phishing, malware, threat actor infrastructure, and credential risks.
              </div>
            </div>

            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
              <button
                onClick={downloadExtension}
                disabled={downloading}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '14px 24px',
                  background: downloaded ? 'rgba(0,230,118,.18)' : 'linear-gradient(135deg,rgba(255,23,68,.25),rgba(0,229,255,.1))',
                  border: downloaded ? '1px solid rgba(0,230,118,.5)' : '1px solid rgba(255,23,68,.5)',
                  borderRadius: 4, cursor: downloading ? 'not-allowed' : 'pointer',
                  boxShadow: downloaded ? '0 0 20px rgba(0,230,118,.3)' : '0 0 20px rgba(255,23,68,.25)',
                  transition: 'all .3s',
                }}
              >
                <span style={{ fontSize: 20 }}>{downloaded ? '✅' : downloading ? '⏳' : '⬇️'}</span>
                <div style={{ textAlign: 'left' }}>
                  <div className="orb" style={{ fontSize: 12, fontWeight: 700, color: dlColor, letterSpacing: 2 }}>{dlLabel}</div>
                  <div className="mono" style={{ fontSize: 8, color: '#3d6680', marginTop: 2 }}>{dlSub}</div>
                </div>
              </button>
              <div className="mono" style={{ fontSize: 8, color: '#3d6680', textAlign: 'right', lineHeight: 1.6 }}>
                Chrome · Edge · Brave<br />Manifest v3 · Free forever
              </div>
            </div>
          </div>

          {/* Demo bar */}
          <div style={{ marginTop: 18, padding: '11px 14px', background: 'rgba(255,23,68,.06)', border: '1px solid rgba(255,23,68,.2)', borderRadius: 3, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13 }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <div className="mono" style={{ fontSize: 9, color: '#ff1744', letterSpacing: 1, marginBottom: 2 }}>LIVE DEMO — example-login.com</div>
              <div style={{ fontSize: 11, color: '#c8dce8' }}>Suspicious Domain · Credential Harvesting · Risk Score: <strong style={{ color: '#ff1744' }}>78</strong></div>
            </div>
            <div className="orb" style={{ fontSize: 28, fontWeight: 900, color: '#ff1744', textShadow: '0 0 15px rgba(255,23,68,.6)' }}>78</div>
          </div>
        </div>
      </Panel>

      {/* Features grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }} className="grid-3col">
        {EXTENSION_FEATURES.map(f => (
          <Panel key={f.title} style={{ padding: 14 }}>
            <div style={{ fontSize: 20, marginBottom: 7 }}>{f.icon}</div>
            <div className="orb" style={{ fontSize: 11, fontWeight: 700, color: f.color, marginBottom: 5, letterSpacing: 1 }}>{f.title}</div>
            <div style={{ fontSize: 11, color: '#7fa8c0', lineHeight: 1.6 }}>{f.desc}</div>
          </Panel>
        ))}
      </div>

      {/* Install steps */}
      <Panel>
        <PanelHeader title="INSTALLATION GUIDE" sub="6 STEPS · TAKES UNDER 2 MINUTES" accent="#00e5ff" />
        <div style={{ padding: '12px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }} className="grid-3col">
            {INSTALL_STEPS.map((s, i) => (
              <div key={s.n} style={{
                padding: '11px 12px',
                background: i === 0 ? 'rgba(255,23,68,.06)' : 'rgba(0,229,255,.03)',
                border: `1px solid ${i === 0 ? 'rgba(255,23,68,.2)' : '#0e2840'}`,
                borderRadius: 3,
                animation: `fadeIn .3s ${i * .05}s ease both`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                  <div className="orb" style={{ fontSize: 16, fontWeight: 900, color: i === 0 ? '#ff1744' : '#00e5ff' }}>{s.n}</div>
                  <div className="orb" style={{ fontSize: 9, fontWeight: 700, color: '#c8dce8', letterSpacing: 1 }}>{s.title}</div>
                </div>
                <div className="mono" style={{ fontSize: 9, color: '#7fa8c0', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(255,214,0,.04)', border: '1px solid rgba(255,214,0,.15)', borderRadius: 3, display: 'flex', gap: 8 }}>
            <span>⚡</span>
            <div className="mono" style={{ fontSize: 9, color: '#7fa8c0', lineHeight: 1.6 }}>
              <strong style={{ color: '#ffd600' }}>Important:</strong> After downloading, open the HTML file in your browser. It contains all extension files with copy buttons. Create a folder called <code style={{ color: '#d500f9', background: 'rgba(213,0,249,.1)', padding: '1px 4px', borderRadius: 2 }}>darkpulse-extension</code>, paste each file, then load it as an unpacked extension in Chrome.
            </div>
          </div>
        </div>
      </Panel>

      {/* Source files preview */}
      <Panel>
        <PanelHeader title="EXTENSION SOURCE FILES" sub="CLICK ANY FILE TO COPY · OPEN SOURCE · AUDIT FRIENDLY" accent="#d500f9" />
        <div style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }} className="grid-2col">
          {Object.entries(EXT_FILES).slice(0, 4).map(([name, code]) => (
            <div
              key={name}
              onClick={() => copyFile(name, code)}
              style={{ padding: '10px 12px', background: 'rgba(213,0,249,.04)', border: '1px solid rgba(213,0,249,.15)', borderRadius: 3, cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(213,0,249,.35)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(213,0,249,.15)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span className="mono" style={{ fontSize: 10, color: '#d500f9' }}>{name}</span>
                <span className="mono" style={{ fontSize: 8, color: copied === name ? '#00e676' : '#3d6680' }}>
                  {copied === name ? '✓ COPIED' : 'CLICK TO COPY'}
                </span>
              </div>
              <div className="mono" style={{ fontSize: 8, color: '#3d6680', lineHeight: 1.5, overflow: 'hidden', maxHeight: 36 }}>
                {code.slice(0, 120).replace(/\n/g, ' ')}...
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <button
          onClick={downloadExtension}
          disabled={downloading}
          style={{
            padding: '16px 40px',
            background: 'linear-gradient(135deg,rgba(255,23,68,.22),rgba(0,229,255,.08))',
            border: '1px solid rgba(255,23,68,.45)', borderRadius: 4, cursor: 'pointer',
            boxShadow: '0 0 30px rgba(255,23,68,.2)', transition: 'all .3s',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(255,23,68,.35)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(255,23,68,.2)'}
        >
          <div className="orb" style={{ fontSize: 14, fontWeight: 700, color: '#ff1744', letterSpacing: 3 }}>
            {downloading ? 'BUILDING EXTENSION...' : '⬇ DOWNLOAD FREE EXTENSION'}
          </div>
          <div className="mono" style={{ fontSize: 8, color: '#3d6680', marginTop: 4 }}>Chrome · Edge · Brave · Vivaldi · Arc</div>
        </button>
        <div className="mono" style={{ fontSize: 8, color: '#1a3d5c' }}>
          No account required · No data collected · AI runs via your own Claude API
        </div>
      </div>

    </div>
  );
}
