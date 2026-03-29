import { useState, useEffect, useRef } from 'react';
import { Panel, PanelHeader, Dot } from './atoms.jsx';
import MsgText from './MsgText.jsx';
import { AI_SYSTEM_PROMPT, AI_SUGGESTIONS } from '../data/threatData.js';

const INITIAL_MESSAGE = {
  role: 'assistant',
  text: '**DarkPulse AI — Threat Intelligence Engine v3.2 ONLINE**\n\nLive threat context loaded. I can help with:\n\n- CVE analysis and exploitation details\n- Threat actor profiling and TTPs\n- MITRE ATT&CK technique explanations\n- Incident response guidance\n- Malware behavior and indicators\n\nSelect a query or ask anything.',
};

export default function AIAdvisor() {
  const [history, setHistory]   = useState([]);
  const [msgs, setMsgs]         = useState([INITIAL_MESSAGE]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [stream, setStream]     = useState('');
  const [error, setError]       = useState(null);
  const endRef   = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, stream]);

  const send = async (queryOverride) => {
    const query = (queryOverride || input).trim();
    if (!query || loading) return;

    setInput('');
    setError(null);
    const newHistory = [...history, { role: 'user', content: query }];
    setHistory(newHistory);
    setMsgs(m => [...m, { role: 'user', text: query }]);
    setLoading(true);
    setStream('');

    // Try streaming first
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: AI_SYSTEM_PROMPT,
          stream: true,
          messages: newHistory,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value).split('\n').filter(l => l.startsWith('data: '))) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              full += parsed.delta.text;
              setStream(full);
            }
          } catch { /* partial chunk */ }
        }
      }

      setHistory(h => [...h, { role: 'assistant', content: full }]);
      setMsgs(m => [...m, { role: 'assistant', text: full }]);
      setStream('');
    } catch {
      // Fallback: non-streaming
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            system: AI_SYSTEM_PROMPT,
            messages: newHistory,
          }),
        });
        const data = await res.json();
        const text = data.content?.[0]?.text || 'Analysis unavailable.';
        setHistory(h => [...h, { role: 'assistant', content: text }]);
        setMsgs(m => [...m, { role: 'assistant', text }]);
      } catch (err) {
        const errMsg = err?.message?.includes('ANTHROPIC_API_KEY')
          ? '⚠ **API key not configured.** Set ANTHROPIC_API_KEY in your Vercel environment variables.'
          : '⚠ **AI subsystem offline.** Check your network connection and API key.';
        setError(errMsg);
        setMsgs(m => [...m, { role: 'assistant', text: errMsg }]);
      }
      setStream('');
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  const clearSession = () => {
    setHistory([]);
    setMsgs([INITIAL_MESSAGE]);
    setError(null);
  };

  return (
    <Panel style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PanelHeader
        title="AI SECURITY ADVISOR"
        sub="DARKPULSE INTELLIGENCE ENGINE v3.2 · CLAUDE-POWERED"
        accent="#d500f9"
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="mono" style={{ fontSize: 8, color: '#3d6680' }}>
              {history.length > 0 ? `${Math.ceil(history.length / 2)} EXCHANGES` : 'NEW SESSION'}
            </span>
            <Dot color="#d500f9" />
            <span className="mono" style={{ fontSize: 8, color: '#d500f9' }}>ONLINE</span>
            {history.length > 0 && (
              <button
                onClick={clearSession}
                style={{ background: 'none', border: '1px solid #0e2840', color: '#3d6680', padding: '2px 7px', cursor: 'pointer', borderRadius: 2, fontFamily: 'Share Tech Mono', fontSize: 8 }}
              >
                CLR
              </button>
            )}
          </div>
        }
      />

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 13, minHeight: 0 }}>
        {history.length === 0 && (
          <div>
            <div className="mono" style={{ fontSize: 8, color: '#3d6680', letterSpacing: 2, marginBottom: 7 }}>SUGGESTED QUERIES</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {AI_SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{ background: 'rgba(213,0,249,.06)', border: '1px solid rgba(213,0,249,.2)', borderRadius: 3, color: '#7fa8c0', padding: '5px 9px', fontFamily: 'Rajdhani', fontSize: 11, cursor: 'pointer' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 9, animation: 'fadeIn .3s ease' }}>
            <div style={{
              width: 29, height: 29, borderRadius: 3, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: m.role === 'assistant' ? 'rgba(213,0,249,.15)' : 'rgba(0,229,255,.08)',
              border: `1px solid ${m.role === 'assistant' ? 'rgba(213,0,249,.35)' : 'rgba(0,229,255,.2)'}`,
              fontSize: 13, marginTop: 2,
            }}>
              {m.role === 'assistant' ? '⬡' : '◈'}
            </div>
            <div style={{
              flex: 1, padding: '9px 13px', borderRadius: 3,
              background: m.role === 'assistant' ? 'rgba(213,0,249,.04)' : 'rgba(0,229,255,.03)',
              border: `1px solid ${m.role === 'assistant' ? 'rgba(213,0,249,.12)' : 'rgba(0,229,255,.08)'}`,
            }}>
              {m.role === 'user'
                ? <div className="mono" style={{ fontSize: 12, color: '#7fa8c0' }}>{m.text}</div>
                : <MsgText text={m.text} />
              }
            </div>
          </div>
        ))}

        {/* Streaming response */}
        {stream && (
          <div style={{ display: 'flex', gap: 9 }}>
            <div style={{ width: 29, height: 29, borderRadius: 3, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(213,0,249,.15)', border: '1px solid rgba(213,0,249,.35)', fontSize: 13, marginTop: 2 }}>⬡</div>
            <div style={{ flex: 1, padding: '9px 13px', borderRadius: 3, background: 'rgba(213,0,249,.04)', border: '1px solid rgba(213,0,249,.12)' }}>
              <MsgText text={stream} />
              <span style={{ display: 'inline-block', width: 7, height: 14, background: '#d500f9', marginLeft: 2, animation: 'blink 1s step-end infinite', verticalAlign: 'text-bottom' }} />
            </div>
          </div>
        )}

        {/* Loading dots */}
        {loading && !stream && (
          <div style={{ display: 'flex', gap: 9 }}>
            <div style={{ width: 29, height: 29, borderRadius: 3, background: 'rgba(213,0,249,.15)', border: '1px solid rgba(213,0,249,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>⬡</div>
            <div style={{ padding: '11px 15px', borderRadius: 3, background: 'rgba(213,0,249,.04)', border: '1px solid rgba(213,0,249,.12)', display: 'flex', gap: 5, alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 8, color: '#3d6680', marginRight: 5 }}>ANALYZING</span>
              {[0, .15, .3].map((d, i) => (
                <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#d500f9', animation: `pulse 1s ${d}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input bar */}
      <div style={{ padding: '9px 13px', borderTop: '1px solid #0e2840' }}>
        <div style={{ display: 'flex', gap: 7 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            disabled={loading}
            placeholder="Ask about CVEs, threat actors, attack techniques, incidents..."
            style={{
              flex: 1,
              background: 'rgba(213,0,249,.04)',
              border: `1px solid ${loading ? '#0e2840' : 'rgba(213,0,249,.25)'}`,
              borderRadius: 3, color: '#c8dce8',
              padding: '9px 13px', fontSize: 12,
              fontFamily: 'Rajdhani,sans-serif', outline: 'none',
            }}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            style={{
              background: loading || !input.trim() ? 'rgba(213,0,249,.06)' : 'rgba(213,0,249,.18)',
              border: `1px solid ${loading || !input.trim() ? 'rgba(213,0,249,.15)' : 'rgba(213,0,249,.5)'}`,
              borderRadius: 3,
              color: loading || !input.trim() ? '#3d6680' : '#d500f9',
              padding: '9px 18px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              fontFamily: 'Orbitron', fontSize: 9, fontWeight: 700, letterSpacing: 1, whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'ANALYZING' : 'TRANSMIT →'}
          </button>
        </div>
        <div className="mono" style={{ marginTop: 5, fontSize: 8, color: '#1a3d5c' }}>
          ENTER to send · Conversation context retained · Powered by Claude Sonnet
        </div>
      </div>
    </Panel>
  );
}
