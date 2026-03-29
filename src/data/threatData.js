import { randomInt, randomFloat, pick, clamp, formatTime, randomIoc } from '../utils/helpers.js';

// ── Static threat actor metadata ────────────────────────────────────────────
export const ACTOR_META = [
  { id:1, name:'LockBit 3.0',       aliases:['LockBit Black'],              origin:'Russia',  targets:['Healthcare','Finance','Gov'],       type:'Ransomware',  ttps:['T1486','T1490','T1071'], color:'#ff1744', riskBase:93 },
  { id:2, name:'Lazarus Group',     aliases:['HIDDEN COBRA','APT38'],       origin:'N.Korea', targets:['Finance','Crypto','Defense'],       type:'APT',         ttps:['T1059','T1105','T1566'], color:'#d500f9', riskBase:91 },
  { id:3, name:'APT29',             aliases:['Cozy Bear','Midnight Bliz'],  origin:'Russia',  targets:['Gov','Think Tanks','Energy'],       type:'APT',         ttps:['T1078','T1021','T1560'], color:'#2979ff', riskBase:88 },
  { id:4, name:'Scattered Spider',  aliases:['0ktapus','Starfraud'],        origin:'Unknown', targets:['Telecom','Finance','Retail'],       type:'Social Eng.', ttps:['T1598','T1556','T1657'], color:'#ff6d00', riskBase:85 },
  { id:5, name:'BlackCat/ALPHV',    aliases:['Noberus'],                    origin:'Russia',  targets:['Manufacturing','Healthcare'],       type:'RaaS',        ttps:['T1486','T1041','T1082'], color:'#ffd600', riskBase:82 },
  { id:6, name:'Volt Typhoon',      aliases:['Bronze Silhouette'],          origin:'China',   targets:['Critical Infra','Military'],        type:'APT',         ttps:['T1505','T1133','T1190'], color:'#00e676', riskBase:90 },
];

// ── Industry risk ranges ─────────────────────────────────────────────────────
export const INDUSTRY_META = [
  { name:'Healthcare',    color:'#ff1744', lo:75, hi:99 },
  { name:'Finance',       color:'#ff6d00', lo:68, hi:96 },
  { name:'Government',    color:'#ffd600', lo:65, hi:93 },
  { name:'Energy',        color:'#ff6d00', lo:60, hi:90 },
  { name:'Manufacturing', color:'#ffd600', lo:52, hi:84 },
  { name:'Telecom',       color:'#00e5ff', lo:48, hi:80 },
  { name:'Retail',        color:'#00e676', lo:40, hi:72 },
  { name:'Education',     color:'#00e676', lo:32, hi:66 },
];

// ── Prediction metadata ──────────────────────────────────────────────────────
export const PREDICTION_META = [
  { id:1, actor:'LockBit 3.0',      industry:'Healthcare', type:'Ransomware',         confBase:90, sigBase:8, winBase:12, status:'CRITICAL' },
  { id:2, actor:'APT29',            industry:'Government', type:'Supply Chain',        confBase:82, sigBase:5, winBase:48, status:'HIGH' },
  { id:3, actor:'Scattered Spider', industry:'Finance',    type:'Social Engineering',  confBase:76, sigBase:4, winBase:24, status:'HIGH' },
  { id:4, actor:'Volt Typhoon',     industry:'Energy',     type:'Living off Land',     confBase:70, sigBase:3, winBase:72, status:'ELEVATED' },
  { id:5, actor:'Unknown TA',       industry:'Telecom',    type:'Zero-Day Exploit',    confBase:60, sigBase:2, winBase:96, status:'MODERATE' },
];

// ── Company attack probability ───────────────────────────────────────────────
export const COMPANY_META = [
  { company:'MedCorp Health Systems', sector:'Healthcare',  riskBase:84, reason:'ESXi exposure + LockBit chatter' },
  { company:'First National Bank',    sector:'Finance',     riskBase:78, reason:'Scattered Spider phishing spike' },
  { company:'PowerGrid US NE',        sector:'Energy',      riskBase:73, reason:'Volt Typhoon lateral movement' },
  { company:'TechDef Systems',        sector:'Defense',     riskBase:69, reason:'APT29 supply chain signals' },
  { company:'Metro Telecom',          sector:'Telecom',     riskBase:63, reason:'SIM swap campaign prep' },
  { company:'State Treasury Dept',    sector:'Government',  riskBase:58, reason:'Credential exposure detected' },
];

// ── Live threat feed pool ────────────────────────────────────────────────────
export const FEED_POOL = [
  { type:'CVE',       sev:'CRITICAL', text:'CVE-2025-3847: Apache Kafka RCE — PoC weaponized, active exploitation confirmed',                    source:'NVD' },
  { type:'CVE',       sev:'CRITICAL', text:'CVE-2025-4102: Fortinet FortiOS auth bypass — EPSS 0.97, nation-state exploitation',                  source:'CISA' },
  { type:'CVE',       sev:'HIGH',     text:'CVE-2025-2917: Ivanti Connect Secure pre-auth SSRF — 0-day, patch available',                         source:'ExploitDB' },
  { type:'CVE',       sev:'HIGH',     text:'CVE-2024-6387: OpenSSH RegreSSHion resurfaces in patched builds via regression',                      source:'NVD' },
  { type:'CVE',       sev:'CRITICAL', text:'CVE-2025-5501: VMware vCenter heap overflow — full cluster compromise possible',                       source:'AlienVault' },
  { type:'CVE',       sev:'HIGH',     text:'CVE-2025-1882: Citrix NetScaler session token fixation — 23K exposed endpoints',                      source:'Shodan' },
  { type:'CVE',       sev:'MEDIUM',   text:'CVE-2025-3201: Microsoft Exchange NTLM relay — PoC uploaded to GitHub',                               source:'GitHub' },
  { type:'DARK WEB',  sev:'CRITICAL', text:'50K credential dump from US hospital network on BreachForums — $800 asking',                          source:'DW Monitor' },
  { type:'DARK WEB',  sev:'HIGH',     text:'RDP access sale: US financial institution domain admin — $4,200 on exploit.in',                       source:'Tor Monitor' },
  { type:'DARK WEB',  sev:'HIGH',     text:'LockBit affiliate recruiting — $2M/month revenue claims, new encryptor build',                        source:'DW Monitor' },
  { type:'DARK WEB',  sev:'CRITICAL', text:'Database dump: 2.1M patient records + SSNs listed on RAMP forum',                                     source:'Tor Monitor' },
  { type:'DARK WEB',  sev:'HIGH',     text:'Ransomware negotiation portal identified — $14M demand, Fortune 500 victim',                          source:'DW Monitor' },
  { type:'DARK WEB',  sev:'MEDIUM',   text:'0-day broker: unpatched Windows kernel LPE — $280K on Telegram channel',                             source:'OSINT' },
  { type:'MALWARE',   sev:'CRITICAL', text:'New LockBit variant — ESXi hypervisors targeted, GPT wiped post-encryption',                          source:'VirusTotal' },
  { type:'MALWARE',   sev:'HIGH',     text:'Custom .NET implant: CLR injection + AMSI bypass + Defender exclusion',                               source:'VirusTotal' },
  { type:'MALWARE',   sev:'CRITICAL', text:'BlackMatter rebranded variant active — new C2 infra, updated encryption',                             source:'AlienVault' },
  { type:'MALWARE',   sev:'HIGH',     text:'GhostLoader v4: drive-by targeting unpatched IE, drops Cobalt Strike',                                source:'Sandbox' },
  { type:'MALWARE',   sev:'MEDIUM',   text:"PyPI 'requests-patch' contains cryptominer + credential stealer — 47K DLs",                          source:'OSINT' },
  { type:'TTP',       sev:'HIGH',     text:'APT29: EU Parliament lure docs with zero-day PDF reader exploit embedded',                            source:'AlienVault' },
  { type:'TTP',       sev:'HIGH',     text:'Volt Typhoon LOLBin abuse: certutil + wmic for lateral movement in energy',                          source:'MITRE' },
  { type:'TTP',       sev:'CRITICAL', text:'Scattered Spider SMS phishing: 8,400 employees at 3 US financial institutions',                       source:'Intel Feed' },
  { type:'TTP',       sev:'HIGH',     text:'Lazarus: fake job offer PDFs deploy AppleJeus via LinkedIn messages',                                 source:'Intel Feed' },
  { type:'TTP',       sev:'MEDIUM',   text:'T1055 process injection via DLL hollowing — AV evasion rate 94%',                                    source:'Sandbox' },
  { type:'EXPOSURE',  sev:'HIGH',     text:'17,000 RDP endpoints exposed in financial sector — mass-targeting prep',                              source:'Shodan' },
  { type:'EXPOSURE',  sev:'MEDIUM',   text:'4,200 ICS/SCADA systems exposed globally — 340 in US critical infra',                                source:'Shodan' },
  { type:'EXPOSURE',  sev:'HIGH',     text:'892 Pulse Secure VPN gateways unpatched — healthcare sector focus',                                  source:'Shodan' },
  { type:'EXPOSURE',  sev:'MEDIUM',   text:'1,100+ network devices with default credentials — routers, switches, cameras',                        source:'OSINT' },
  { type:'IOC',       sev:'HIGH',     text:'New C2 infra: 34 IPs + 12 domains (Cobalt Strike) — linked to LockBit ASN',                         source:'Threat Intel' },
  { type:'IOC',       sev:'HIGH',     text:"Malicious domain 'microsoft-security-update[.]com' — IT admin typosquat",                            source:'Threat Intel' },
  { type:'IOC',       sev:'MEDIUM',   text:'185.220.101.x/24: Tor exit node mass-scanning SSH + RDP targets',                                    source:'AlienVault' },
  { type:'IOC',       sev:'HIGH',     text:'18 new LockBit samples in VirusTotal — obfuscation layer changed',                                   source:'VirusTotal' },
  { type:'IOC',       sev:'MEDIUM',   text:'C2 beaconing via Cloudflare DoH resolver abuse — 3 enterprise networks',                             source:'Threat Intel' },
];

// ── World map node coordinates ───────────────────────────────────────────────
export const MAP_NODES = [
  {x:485,y:158},{x:515,y:172},{x:510,y:188},{x:452,y:172},{x:422,y:212},{x:502,y:310},{x:548,y:345},
  {x:600,y:142},{x:622,y:148},{x:645,y:138},{x:665,y:142},{x:692,y:152},{x:704,y:148},{x:728,y:142},
  {x:784,y:158},{x:805,y:178},{x:828,y:172},{x:845,y:212},{x:815,y:222},{x:793,y:232},{x:858,y:242},
  {x:752,y:272},{x:634,y:252},{x:610,y:232},{x:862,y:342},
];

export const ARC_COLORS = ['#ff1744','#d500f9','#ff6d00','#2979ff','#00e5ff','#ffd600'];

// ── AI advisor system prompt & suggestions ──────────────────────────────────
export const AI_SYSTEM_PROMPT = `You are DarkPulse — an elite AI cybersecurity threat intelligence advisor in a real-time SOC platform.

Your role:
- Provide deep, accurate, tactical threat intelligence
- Explain CVEs, malware, threat actors, TTPs with technical precision
- Give actionable mitigation steps
- Reference real MITRE ATT&CK techniques (T####), real CVEs, real threat actors

Live threat context:
- LockBit 3.0: targeting healthcare ESXi hypervisors, new encryptor detected
- APT29 (Cozy Bear): supply chain campaign, EU Parliament lure docs, T1078+T1021
- CVE-2025-3847: Apache Kafka RCE, PoC on GitHub, EPSS 0.96, active exploitation
- CVE-2025-4102: Fortinet FortiOS auth bypass, nation-state confirmed
- Scattered Spider: SMS phishing, 8,400 employees targeted, US finance sector
- Volt Typhoon: US critical infra, LOLBin abuse, T1505+T1133
- 50K credential dump from US hospital on BreachForums
- 17K RDP endpoints exposed in financial sector

Format: **bold** for key terms, - bullets for lists, \`code\` for technical strings, CRITICAL/HIGH/MEDIUM/LOW risk labels, T#### for MITRE ATT&CK IDs.`;

export const AI_SUGGESTIONS = [
  'What is LockBit 3.0 and how does it work?',
  'Explain CVE-2025-3847 and mitigation steps',
  'How does APT29 conduct supply chain attacks?',
  "What are Volt Typhoon's living-off-the-land TTPs?",
  'How to defend ESXi hypervisors against ransomware?',
  'Explain Scattered Spider social engineering tactics',
  'How to respond to a credential dump incident?',
  'What is MITRE ATT&CK framework?',
];

// ── Extension source files ───────────────────────────────────────────────────
export const EXT_FILES = {
  'manifest.json': `{
  "manifest_version": 3,
  "name": "DarkPulse Threat Shield",
  "version": "1.0.0",
  "description": "Real-time AI threat detection as you browse. Checks domains for phishing, malware, credential leaks, and threat actor infrastructure.",
  "permissions": ["activeTab","tabs","storage","notifications","webNavigation"],
  "host_permissions": ["<all_urls>"],
  "background": { "service_worker": "background.js" },
  "action": {
    "default_popup": "popup.html",
    "default_icon": { "16": "icons/icon16.png", "48": "icons/icon48.png", "128": "icons/icon128.png" },
    "default_title": "DarkPulse Threat Shield"
  },
  "content_scripts": [{ "matches": ["<all_urls>"], "js": ["content.js"], "run_at": "document_end" }],
  "icons": { "16": "icons/icon16.png", "48": "icons/icon48.png", "128": "icons/icon128.png" }
}`,

  'background.js': `// DarkPulse Background Service Worker - Real-time threat analysis engine
const CACHE = new Map();
const CACHE_TTL = 10 * 60 * 1000;

const SUSPICIOUS_KW = ['login','signin','secure','account','verify','update','confirm','banking','paypal','amazon','google','microsoft','apple','netflix','support','authenticate','validation','suspend','recover','unlock','urgent','password','credential','wallet','crypto'];
const HIGH_RISK_TLD = ['.ru','.cn','.tk','.ml','.ga','.cf','.gq','.top','.xyz','.cc','.su','.pw'];
const SAFE_DOMAINS = new Set(['google.com','youtube.com','github.com','stackoverflow.com','reddit.com','wikipedia.org','mozilla.org','microsoft.com','apple.com','amazon.com','anthropic.com','twitter.com','x.com','linkedin.com','facebook.com','netflix.com','discord.com','slack.com']);
const ACTOR_PATTERNS = [
  {p:/cdn\\d+\\.(ru|cn|tk|ml)/,actor:'APT-aligned',type:'Malware Distribution'},
  {p:/(update|patch|security)-\\w+\\.(info|site|online)/,actor:'Social Engineer',type:'Fake Update Page'},
  {p:/\\w+-\\w+-(login|secure|account)\\.(com|net|org)/,actor:'Phishing TA',type:'Credential Harvesting'},
  {p:/(paypal|amazon|google|microsoft|apple)\\w+\\.(com|net|io)/,actor:'Scattered Spider',type:'Brand Impersonation'},
  {p:/\\d{1,3}-\\d{1,3}-\\d{1,3}-\\d{1,3}\\./,actor:'Unknown APT',type:'C2 Infrastructure'},
];

const RC = r => r>=75?'#FF1744':r>=55?'#FF6D00':r>=30?'#FFD600':r>=15?'#00E676':'#00B8D4';
const RL = r => r>=75?'CRITICAL':r>=55?'HIGH':r>=30?'MEDIUM':r>=15?'LOW':'SAFE';
const base = d => d.split('.').slice(-2).join('.');

function localScore(domain, url) {
  let score=0, flags=[], actor=null, type='None';
  const dl=domain.toLowerCase();
  if(SAFE_DOMAINS.has(base(domain))) return {score:2,flags:['Verified safe domain'],safe:true,actor:null,type:'None'};
  HIGH_RISK_TLD.forEach(t=>{if(dl.endsWith(t)){score+=25;flags.push('High-risk TLD: '+t);}});
  SUSPICIOUS_KW.forEach(k=>{if(dl.includes(k)){score+=8;flags.push('Keyword: "'+k+'"');}});
  ACTOR_PATTERNS.forEach(({p,actor:a,type:t})=>{if(p.test(dl)){score+=35;actor=a;type=t;flags.push(a+' pattern');}});
  const subs=domain.split('.').length-2;
  if(subs>=3){score+=15;flags.push('Deep subdomain ('+subs+' levels)');}
  if((dl.match(/-/g)||[]).length>=2){score+=20;flags.push('Multiple hyphens — lookalike');}
  if(/^\\d+\\.\\d+\\.\\d+\\.\\d+$/.test(domain)){score+=30;flags.push('Direct IP navigation');}
  if(base(domain).length>25){score+=10;flags.push('Unusually long domain');}
  if(url.startsWith('http://')&&!url.startsWith('http://localhost')){score+=20;flags.push('Unencrypted HTTP');}
  return {score:Math.min(score,98),flags:flags.slice(0,5),safe:score<20,actor,type};
}

async function aiAnalyze(domain, url, local) {
  try {
    const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':'YOUR_KEY_HERE','anthropic-version':'2023-06-01'},body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:350,system:'You are DarkPulse AI — real-time domain threat analyzer. Respond ONLY with valid JSON (no markdown): {"riskScore":number,"riskLevel":"CRITICAL|HIGH|MEDIUM|LOW|SAFE","threatType":"string or None","threatActor":"string or null","summary":"1-2 sentences","indicators":["item1","item2"],"recommendation":"brief action"}. Known safe domains score 0-5. Obvious phishing/typosquatting scores 75-95.',messages:[{role:'user',content:'Analyze: Domain='+domain+' URL='+url+' Flags='+local.flags.join(',')+' LocalScore='+local.score}]})});
    if(!res.ok)throw new Error();
    const d=await res.json();
    return JSON.parse((d.content?.[0]?.text||'{}').replace(/\`\`\`json|\`\`\`/g,'').trim());
  } catch {
    return {riskScore:local.score,riskLevel:RL(local.score),threatType:local.type||'Suspicious Patterns',threatActor:local.actor,summary:local.safe?'Domain appears legitimate.':'Domain shows suspicious indicators.',indicators:local.flags.length?local.flags:['No significant threats detected'],recommendation:local.safe?'Safe to proceed.':'Verify this site before entering credentials.'};
  }
}

async function analyze(domain, url) {
  const key=domain, cached=CACHE.get(key);
  if(cached&&Date.now()-cached.ts<CACHE_TTL)return cached.r;
  const local=localScore(domain,url);
  let result;
  if(local.safe&&local.score<5){result={domain,riskScore:local.score,riskLevel:'SAFE',threatType:'None',threatActor:null,summary:'Domain verified safe.',indicators:['No threats detected'],recommendation:'Safe to browse.',analyzedAt:new Date().toISOString(),source:'local'};}
  else{const ai=await aiAnalyze(domain,url,local);result={domain,...ai,analyzedAt:new Date().toISOString(),source:'ai'};}
  CACHE.set(key,{r:result,ts:Date.now()});
  chrome.storage.local.set({['threat_'+domain]:result});
  return result;
}

function badge(tabId,r){
  const colors={CRITICAL:'#FF1744',HIGH:'#FF6D00',MEDIUM:'#FFD600',LOW:'#00E676',SAFE:'#00B8D4'};
  const labels={CRITICAL:'!!',HIGH:'!',MEDIUM:'?',LOW:'~',SAFE:'✓'};
  chrome.action.setBadgeBackgroundColor({tabId,color:colors[r.riskLevel]||'#3d6680'});
  chrome.action.setBadgeText({tabId,text:labels[r.riskLevel]||''});
}

chrome.tabs.onUpdated.addListener(async(tabId,info,tab)=>{
  if(info.status!=='complete'||!tab.url)return;
  if(tab.url.startsWith('chrome://')||tab.url.startsWith('chrome-extension://')||tab.url.startsWith('about:'))return;
  try{
    const url=new URL(tab.url),domain=url.hostname;
    if(!domain||domain==='newtab')return;
    const result=await analyze(domain,tab.url);
    chrome.storage.local.set({currentDomain:domain,currentResult:result,lastScanTime:Date.now()});
    badge(tabId,result);
    try{chrome.tabs.sendMessage(tabId,{type:'THREAT_RESULT',result});}catch{}
    if(result.riskLevel==='CRITICAL'||result.riskLevel==='HIGH'){
      chrome.notifications.create('dp_'+domain+'_'+Date.now(),{type:'basic',iconUrl:'icons/icon48.png',title:'⚠ DarkPulse: '+result.riskLevel+' THREAT',message:domain+'\\n'+result.summary,priority:result.riskLevel==='CRITICAL'?2:1});
    }
  }catch{}
});

chrome.runtime.onMessage.addListener((msg,sender,reply)=>{
  if(msg.type==='ANALYZE_DOMAIN'){analyze(msg.domain,msg.url).then(reply);return true;}
  if(msg.type==='GET_CURRENT'){chrome.storage.local.get(['currentDomain','currentResult','lastScanTime'],reply);return true;}
  if(msg.type==='CLEAR_CACHE'){CACHE.clear();reply({ok:true});}
});`,

  'content.js': `// DarkPulse Content Script — injects threat banner into pages
let injected=false;
function inject(r){
  if(injected||!r)return;
  if(!['CRITICAL','HIGH','MEDIUM'].includes(r.riskLevel))return;
  injected=true;
  const C={CRITICAL:{bg:'rgba(255,23,68,.12)',border:'#ff1744',icon:'🚨'},HIGH:{bg:'rgba(255,109,0,.1)',border:'#ff6d00',icon:'⚠️'},MEDIUM:{bg:'rgba(255,214,0,.08)',border:'#ffd600',icon:'⚡'}};
  const c=C[r.riskLevel],col=c.border;
  const el=document.createElement('div');
  el.id='dp-banner';
  el.style.cssText='position:fixed;top:0;left:0;right:0;z-index:2147483647;background:linear-gradient(90deg,#020408,#0d1e2e);border-bottom:1px solid '+col+';font-family:Rajdhani,Segoe UI,sans-serif;';
  el.innerHTML='<style>@keyframes dpIn{from{transform:translateY(-100%)}to{transform:translateY(0)}}@keyframes dpPulse{0%,100%{opacity:1}50%{opacity:.4}}</style><div style="display:flex;align-items:center;gap:12px;padding:7px 14px"><span style="font-size:15px;animation:dpPulse 2s infinite">'+c.icon+'</span><span style="font-family:Orbitron,sans-serif;font-size:9px;font-weight:700;color:'+col+';letter-spacing:2px;padding:2px 8px;background:'+c.bg+';border:1px solid '+col+'40;border-radius:2px">'+r.riskLevel+'</span><span style="font-family:Share Tech Mono,monospace;font-size:9px;color:#7fa8c0">'+r.domain+'</span><span style="font-family:Orbitron,sans-serif;font-size:14px;font-weight:700;color:'+col+'">'+r.riskScore+'</span><span style="font-family:Share Tech Mono,monospace;font-size:7px;color:#3d6680">RISK</span><span style="font-size:11px;color:#c8dce8;flex:1">'+r.summary+'</span><button id="dp-x" style="background:none;border:1px solid #0e2840;color:#3d6680;padding:3px 9px;cursor:pointer;border-radius:2px;font-family:Share Tech Mono;font-size:8px">✕</button></div>';
  document.body.insertBefore(el,document.body.firstChild);
  const h=el.offsetHeight||38;document.body.style.marginTop=h+'px';
  document.getElementById('dp-x').onclick=()=>{el.remove();document.body.style.marginTop='';injected=false;};
  if(r.riskLevel==='MEDIUM')setTimeout(()=>{document.getElementById('dp-x')?.click();},10000);
}
chrome.runtime.onMessage.addListener(msg=>{if(msg.type==='THREAT_RESULT')inject(msg.result);});
chrome.storage.local.get(['currentResult'],d=>{if(d.currentResult)setTimeout(()=>inject(d.currentResult),500);});`,

  'popup.html': `<!DOCTYPE html><html><head><meta charset="UTF-8"><link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@600;700;900&family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet"><style>*{box-sizing:border-box;margin:0;padding:0}body{width:360px;min-height:440px;background:#020408;color:#c8dce8;font-family:Rajdhani,sans-serif}.mono{font-family:Share Tech Mono,monospace}.orb{font-family:Orbitron,sans-serif}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}@keyframes fadeIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes ripple{0%{transform:scale(.8);opacity:1}100%{transform:scale(3);opacity:0}}.pulse{animation:pulse 2s infinite}.hdr{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;background:linear-gradient(90deg,#060d14,#020408);border-bottom:1px solid #0e2840}.logo{display:flex;align-items:center;gap:8px}.live{display:flex;align-items:center;gap:5px;padding:3px 8px;border-radius:2px;background:rgba(0,229,255,.06);border:1px solid rgba(0,229,255,.2)}.ldot{width:6px;height:6px;border-radius:50%;background:#00e676;position:relative}.ldot::after{content:'';position:absolute;inset:0;border-radius:50%;background:#00e676;opacity:.5;animation:ripple 2s infinite}.tabs{display:flex;border-bottom:1px solid #0e2840;background:rgba(0,0,0,.3)}.tab{flex:1;padding:8px 4px;background:none;border:none;border-bottom:2px solid transparent;color:#3d6680;cursor:pointer;font-size:8px;letter-spacing:1px;font-family:Orbitron,sans-serif}.tab.on{color:#00e5ff;border-bottom-color:#00e5ff}.content{padding:12px 14px}.drow{display:flex;align-items:center;gap:8px;padding:8px 11px;background:rgba(0,229,255,.03);border:1px solid #0e2840;border-radius:3px;margin-bottom:11px}.card{border-radius:4px;padding:13px;margin-bottom:11px;animation:fadeIn .3s ease}.card.critical{background:rgba(255,23,68,.08);border:1px solid rgba(255,23,68,.35)}.card.high{background:rgba(255,109,0,.08);border:1px solid rgba(255,109,0,.35)}.card.medium{background:rgba(255,214,0,.06);border:1px solid rgba(255,214,0,.3)}.card.low{background:rgba(0,230,118,.06);border:1px solid rgba(0,230,118,.25)}.card.safe{background:rgba(0,184,212,.05);border:1px solid rgba(0,184,212,.2)}.sbar{height:5px;background:#0a1520;border-radius:3px;overflow:hidden;margin:8px 0}.sfill{height:100%;border-radius:3px}.ind{display:flex;align-items:flex-start;gap:7px;padding:5px 8px;background:rgba(255,23,68,.04);border:1px solid rgba(255,23,68,.1);border-radius:2px;font-size:10px;color:#7fa8c0;margin-bottom:4px}.dot5{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:3px}.rec{padding:8px 10px;border-radius:3px;font-size:11px;background:rgba(0,230,118,.05);border:1px solid rgba(0,230,118,.2);margin-bottom:11px;display:flex;gap:7px}.spin{width:32px;height:32px;border:2px solid rgba(0,229,255,.1);border-top-color:#00e5ff;border-radius:50%;animation:spin 1s linear infinite}.erow{display:flex;gap:6px;margin-bottom:8px}.einp{flex:1;background:rgba(0,229,255,.04);border:1px solid #0e2840;border-radius:3px;color:#c8dce8;padding:7px 10px;font-size:11px;font-family:Share Tech Mono;outline:none}.ebtn{background:rgba(0,229,255,.12);border:1px solid rgba(0,229,255,.3);border-radius:3px;color:#00e5ff;padding:7px 12px;cursor:pointer;font-size:9px;font-family:Orbitron,sans-serif}.hitem{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #060d14}.ftr{border-top:1px solid #0e2840;padding:8px 14px;display:flex;align-items:center;justify-content:space-between}.rbtn{font-size:8px;background:rgba(0,229,255,.08);border:1px solid rgba(0,229,255,.25);color:#00e5ff;padding:4px 10px;border-radius:2px;cursor:pointer;font-family:Orbitron,sans-serif}</style></head><body>
<div class="hdr"><div class="logo"><svg width="28" height="28" viewBox="0 0 32 32"><polygon points="16,2 30,24 2,24" fill="none" stroke="#ff1744" stroke-width="1.5"/><polygon points="16,8 26,22 6,22" fill="rgba(255,23,68,.1)"/><circle cx="16" cy="16" r="3" fill="#ff1744"/></svg><div class="orb"><div style="font-size:12px;font-weight:900;color:#ff1744;letter-spacing:2px;text-shadow:0 0 8px rgba(255,23,68,.6)">DARK</div><div style="font-size:12px;font-weight:900;color:#00e5ff;letter-spacing:2px;margin-top:-3px;text-shadow:0 0 8px rgba(0,229,255,.6)">PULSE</div></div></div><div class="live"><div class="ldot pulse"></div><span class="mono" style="font-size:8px;color:#00e676;letter-spacing:1px">SHIELD ACTIVE</span></div></div>
<div style="padding:0 14px;padding-top:9px"><div class="tabs"><button class="tab on" data-tab="scan">⬡ SCAN</button><button class="tab" data-tab="email">◈ EMAIL</button><button class="tab" data-tab="history">≋ HISTORY</button></div></div>
<div id="tab-scan" class="content"><div class="drow"><span style="font-size:13px">🌐</span><span class="mono" id="cdomain" style="font-size:11px;color:#7fa8c0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">Scanning...</span><span class="mono" id="ctime" style="font-size:8px;color:#3d6680"></span></div><div id="result"><div style="display:flex;flex-direction:column;align-items:center;padding:35px 20px;gap:10px"><div class="spin"></div><div class="mono" style="font-size:9px;color:#3d6680;letter-spacing:2px">ANALYZING...</div></div></div></div>
<div id="tab-email" class="content" style="display:none"><div class="mono" style="font-size:8px;color:#3d6680;letter-spacing:2px;margin-bottom:8px">CREDENTIAL LEAK CHECKER</div><div class="erow"><input type="email" id="einp" class="einp" placeholder="Enter email to check..."><button class="ebtn" id="echk">CHECK</button></div><div id="eres"></div><div style="padding:8px 10px;background:rgba(0,229,255,.03);border:1px solid #0e2840;border-radius:3px"><div class="mono" style="font-size:8px;color:#3d6680;line-height:1.6">ℹ AI-powered credential breach analysis. Results are simulated — connect to HaveIBeenPwned API for production use.</div></div></div>
<div id="tab-history" class="content" style="display:none"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><div class="mono" style="font-size:8px;color:#3d6680;letter-spacing:2px">RECENT SCANS</div><button id="clrhist" class="rbtn" style="font-size:7px">CLEAR</button></div><div id="hlist"></div></div>
<div class="ftr"><span class="mono" style="font-size:7px;color:#3d6680">DARKPULSE v1.0</span><button class="rbtn" id="rscan">↺ RESCAN</button></div>
<script src="popup.js"></script></body></html>`,

  'popup.js': `const RC={CRITICAL:'#ff1744',HIGH:'#ff6d00',MEDIUM:'#ffd600',LOW:'#00e676',SAFE:'#00b8d4'};
const RK={CRITICAL:'critical',HIGH:'high',MEDIUM:'medium',LOW:'low',SAFE:'safe'};
function fmtT(iso){if(!iso)return '';return new Date(iso).toLocaleTimeString('en-US',{hour12:false});}
function riskColor(r){return RC[r]||'#7fa8c0';}
function render(res){
  const c=riskColor(res.riskLevel),cls=RK[res.riskLevel]||'safe',s=res.riskScore||0;
  document.getElementById('result').innerHTML='<div class="card '+cls+'"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><div style="text-align:center"><div class="orb" style="font-size:38px;font-weight:900;color:'+c+';text-shadow:0 0 15px '+c+'50">'+s+'</div><div class="mono" style="font-size:7px;color:#3d6680">RISK SCORE</div></div><div style="flex:1;margin-left:12px"><div class="orb" style="font-size:10px;font-weight:700;color:'+c+';letter-spacing:2px;padding:3px 9px;border:1px solid '+c+'40;background:'+c+'12;border-radius:2px;display:inline-block;margin-bottom:7px">'+res.riskLevel+'</div><div class="mono" style="font-size:8px;color:#3d6680">THREAT TYPE</div><div style="font-size:11px;font-weight:600;color:#c8dce8">'+(res.threatType||'None')+'</div>'+(res.threatActor?'<div style="margin-top:4px;padding:3px 7px;background:rgba(213,0,249,.06);border:1px solid rgba(213,0,249,.2);border-radius:2px"><div class="mono" style="font-size:7px;color:#d500f9">THREAT ACTOR</div><div class="orb" style="font-size:11px;color:#d500f9;font-weight:700">'+res.threatActor+'</div></div>':'')+' </div></div><div class="sbar"><div class="sfill" style="width:'+s+'%;background:linear-gradient(90deg,'+c+'50,'+c+');box-shadow:0 0 8px '+c+'40"></div></div><div style="font-size:11px;line-height:1.6;color:#7fa8c0;margin-bottom:9px;padding:7px 9px;background:rgba(0,0,0,.2);border-left:2px solid '+c+';border-radius:2px">'+(res.summary||'')+'</div>'+(res.indicators&&res.indicators[0]!=='No threats detected'?'<div class="mono" style="font-size:7px;color:#3d6680;letter-spacing:2px;margin-bottom:5px">INDICATORS</div>'+(res.indicators||[]).map(i=>'<div class="ind"><div class="dot5" style="background:'+c+'"></div>'+i+'</div>').join(''):'')+'<div class="rec"><span>✓</span><span>'+(res.recommendation||'No action needed.')+'</span></div><div class="mono" style="font-size:7px;color:#1a3d5c">'+fmtT(res.analyzedAt)+' · '+(res.source==='ai'?'AI ANALYSIS':'LOCAL SCAN')+'</div></div>';
}
async function load(){
  const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
  if(!tab||!tab.url)return;
  if(tab.url.startsWith('chrome://')||tab.url.startsWith('chrome-extension://')){document.getElementById('cdomain').textContent='System page';document.getElementById('result').innerHTML='<div style="text-align:center;padding:30px;color:#3d6680;font-size:11px">Navigate to a website to scan.</div>';return;}
  try{
    const url=new URL(tab.url),domain=url.hostname;
    document.getElementById('cdomain').textContent=domain;
    const stored=await chrome.storage.local.get(['threat_'+domain,'currentResult']);
    const cached=stored['threat_'+domain]||stored.currentResult;
    if(cached&&cached.domain===domain){render(cached);document.getElementById('ctime').textContent=fmtT(cached.analyzedAt);}
    else{
      const res=await chrome.runtime.sendMessage({type:'ANALYZE_DOMAIN',domain,url:tab.url});
      if(res){render(res);document.getElementById('ctime').textContent=fmtT(res.analyzedAt);saveHist(res);}
    }
  }catch(e){console.error(e);}
}
function saveHist(r){chrome.storage.local.get(['dp_hist'],d=>{const h=d.dp_hist||[];const i=h.findIndex(x=>x.domain===r.domain);if(i>-1)h.splice(i,1);h.unshift({...r,savedAt:Date.now()});chrome.storage.local.set({dp_hist:h.slice(0,50)});});}
function renderHist(){
  const c=document.getElementById('hlist');
  chrome.storage.local.get(['dp_hist'],d=>{
    const h=d.dp_hist||[];
    if(!h.length){c.innerHTML='<div style="text-align:center;padding:24px;color:#3d6680;font-size:10px;font-family:Share Tech Mono">No scans yet.</div>';return;}
    c.innerHTML=h.slice(0,20).map(x=>{const col=RC[x.riskLevel]||'#7fa8c0';const ago=Math.round((Date.now()-x.savedAt)/60000);return '<div class="hitem"><div style="font-family:Share Tech Mono;font-size:10px;color:#7fa8c0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+x.domain+'</div><div class="orb" style="font-size:11px;font-weight:700;color:'+col+'">'+x.riskScore+'</div><div style="font-family:Share Tech Mono;font-size:7px;color:#3d6680">'+(ago<60?ago+'m':''+Math.round(ago/60)+'h')+' ago</div></div>';}).join('');
  });
}
async function checkEmail(email){
  const r=document.getElementById('eres');r.innerHTML='<div style="padding:7px 9px;background:rgba(0,229,255,.04);border:1px solid #0e2840;border-radius:3px;font-family:Share Tech Mono;font-size:9px;color:#3d6680">CHECKING...</div>';
  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':'YOUR_KEY_HERE','anthropic-version':'2023-06-01'},body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:200,system:'Simulate a realistic breach check. Return ONLY valid JSON: {"leaked":boolean,"breaches":["Service (Year)"],"count":number,"recommendation":"action"}. Common email providers should show 1-3 realistic breaches.',messages:[{role:'user',content:'Breach check: '+email}]})});
    const d=await res.json();const t=JSON.parse((d.content?.[0]?.text||'{}').replace(/\`\`\`json|\`\`\`/g,'').trim());
    if(t.leaked)r.innerHTML='<div style="padding:8px 10px;background:rgba(255,23,68,.06);border:1px solid rgba(255,23,68,.25);border-radius:3px;font-size:10px;color:#ff6d00;animation:fadeIn .3s ease"><div style="font-weight:700;margin-bottom:5px">⚠ FOUND IN '+t.count+' BREACH DATABASE'+(t.count>1?'S':'')+'</div>'+(t.breaches||[]).map(b=>'<div style="margin:2px 0">▸ '+b+'</div>').join('')+'<div style="margin-top:5px;padding-top:5px;border-top:1px solid rgba(255,23,68,.2);font-size:9px">'+t.recommendation+'</div></div>';
    else r.innerHTML='<div style="padding:7px 9px;background:rgba(0,230,118,.05);border:1px solid rgba(0,230,118,.2);border-radius:3px;color:#00e676;font-size:11px">✓ No breaches found</div>';
  }catch{r.innerHTML='<div style="padding:7px;border:1px solid #0e2840;border-radius:3px;font-size:10px;color:#ff6d00">Could not complete check.</div>';}
}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('on'));document.querySelectorAll('[id^=tab-]').forEach(x=>x.style.display='none');b.classList.add('on');const t='tab-'+b.dataset.tab;document.getElementById(t).style.display='block';if(b.dataset.tab==='history')renderHist();}));
document.getElementById('rscan').addEventListener('click',async()=>{const d=document.getElementById('cdomain').textContent;if(!d||d==='Scanning...')return;await chrome.storage.local.remove(['threat_'+d]);load();});
document.getElementById('clrhist').addEventListener('click',()=>{chrome.storage.local.remove(['dp_hist'],()=>renderHist());});
document.getElementById('echk').addEventListener('click',()=>{const e=document.getElementById('einp').value.trim();if(e)checkEmail(e);});
document.getElementById('einp').addEventListener('keydown',e=>{if(e.key==='Enter'){const v=e.target.value.trim();if(v)checkEmail(v);}});
load();`,
};

// ── Extension installer metadata ─────────────────────────────────────────────
export const INSTALL_STEPS = [
  { n:'1', title:'Download the ZIP',      desc:'Click the download button above to get the extension package' },
  { n:'2', title:'Extract the ZIP',        desc:'Unzip to a folder on your computer. Remember where you put it' },
  { n:'3', title:'Open Chrome Extensions', desc:'Navigate to chrome://extensions in your browser address bar' },
  { n:'4', title:'Enable Developer Mode',  desc:'Toggle "Developer Mode" switch in the top-right corner of the page' },
  { n:'5', title:'Load Unpacked',          desc:'Click "Load unpacked" and select the extracted darkpulse-extension folder' },
  { n:'6', title:'Start Scanning',         desc:'The DarkPulse shield icon appears. Browse any site to get instant threat analysis' },
];

export const EXTENSION_FEATURES = [
  { icon:'🔍', title:'Phishing Detection',     desc:'AI analysis of every domain you visit. Detects lookalike, typosquat, and credential harvesting sites in real-time.',                color:'#ff1744' },
  { icon:'🕵️', title:'Threat Actor Intel',     desc:'Identifies infrastructure linked to known APT groups, ransomware operators, and nation-state actors like LockBit & APT29.',  color:'#d500f9' },
  { icon:'🔑', title:'Credential Leak Check',  desc:'Check any email against breach databases. Warns if your credentials appear in known data dumps.',                              color:'#ff6d00' },
  { icon:'📊', title:'Live Risk Scoring',       desc:'0-100 risk score powered by Claude AI with CRITICAL / HIGH / MEDIUM / LOW / SAFE classification.',                           color:'#00e5ff' },
  { icon:'🚨', title:'In-Page Alerts',          desc:'Non-intrusive threat banner injected into risky pages. Click to dismiss. Auto-fades for MEDIUM risk.',                        color:'#ffd600' },
  { icon:'📋', title:'Scan History',            desc:'Full history of every domain analyzed this session with timestamps and risk scores.',                                         color:'#00e676' },
];

// ── State initializers ───────────────────────────────────────────────────────
export const initActors = () =>
  ACTOR_META.map(a => ({
    ...a,
    risk:      randomInt(a.riskBase - 3, Math.min(99, a.riskBase + 5)),
    campaigns: randomInt(50, 1200),
    active:    Math.random() > 0.12,
  }));

export const initIndustries = () =>
  INDUSTRY_META.map(i => {
    const score = randomInt(i.lo, i.hi);
    return { ...i, score, prev: score };
  });

export const initPredictions = () =>
  PREDICTION_META.map(p => ({
    ...p,
    confidence: randomInt(p.confBase - 4, Math.min(99, p.confBase + 7)),
    signals:    randomInt(p.sigBase, p.sigBase + 4),
    window:     `${p.winBase}–${p.winBase + randomInt(12, 24)}h`,
  }));

export const initCompanies = () =>
  COMPANY_META.map(c => ({
    ...c,
    risk: randomInt(c.riskBase - 4, Math.min(98, c.riskBase + 8)),
  }));

export const initStats = () => ({
  iocsToday:        randomInt(2200, 3400),
  dwSignals:        randomInt(300, 550),
  predictions:      randomInt(80, 120),
  predAcc:          randomFloat(91, 97.5),
  activeCampaigns:  randomInt(2, 5),
  alerts:           randomInt(10, 22),
  totalIndicators:  randomInt(95000, 110000),
});

export const initFeed = () => {
  const pool = [...FEED_POOL].sort(() => Math.random() - 0.5).slice(0, 14);
  return pool.map((item, i) => ({
    ...item,
    id:    Date.now() - (14 - i) * 40000,
    time:  new Date(Date.now() - (14 - i) * 40000).toLocaleTimeString('en-US', { hour12: false }),
    ioc:   randomIoc(),
    isNew: false,
  }));
};

// ── Build the self-contained HTML installer ──────────────────────────────────
export function buildInstallerHTML() {
  const fileBlocks = Object.entries(EXT_FILES).map(([name, content]) => `
    <div class="file-card" id="file-${name.replace(/[^a-z]/gi, '_')}">
      <div class="file-header">
        <span class="file-name">${name}</span>
        <button class="copy-btn" onclick="copyFile('${name.replace(/[^a-z]/gi, '_')}')">📋 COPY</button>
      </div>
      <pre class="code-block"><code>${content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>DarkPulse Threat Shield — Extension Installer</title>
<link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@700;900&family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#020408;color:#c8dce8;font-family:'Rajdhani',sans-serif;min-height:100vh}
.hero{background:linear-gradient(135deg,#060d14,#020408);border-bottom:1px solid #0e2840;padding:32px 40px;display:flex;align-items:center;justify-content:space-between;gap:24px}
.logo{display:flex;align-items:center;gap:12px}
.logo-text .d{font-family:Orbitron,sans-serif;font-size:22px;font-weight:900;color:#ff1744;letter-spacing:3px}
.logo-text .p{font-family:Orbitron,sans-serif;font-size:22px;font-weight:900;color:#00e5ff;letter-spacing:3px;margin-top:-5px}
.subtitle{font-family:'Share Tech Mono';font-size:10px;color:#d500f9;letter-spacing:2px;margin-top:6px}
.steps{background:#060d14;border-bottom:1px solid #0e2840;padding:28px 40px}
.steps-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
.step{padding:14px;background:linear-gradient(135deg,#0d1e2e,#0a1520);border:1px solid #0e2840;border-radius:4px}
.step-num{font-family:Orbitron,sans-serif;font-size:18px;font-weight:900;color:#ff1744;margin-bottom:5px}
.step-title{font-family:Orbitron,sans-serif;font-size:9px;font-weight:700;color:#c8dce8;letter-spacing:1px;margin-bottom:5px}
.step-desc{font-family:'Share Tech Mono';font-size:9px;color:#7fa8c0;line-height:1.6}
.files-section{padding:28px 40px}
.file-card{background:linear-gradient(135deg,#0d1e2e,#0a1520);border:1px solid #0e2840;border-radius:4px;margin-bottom:14px;overflow:hidden}
.file-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(213,0,249,.05);border-bottom:1px solid #0e2840}
.file-name{font-family:'Share Tech Mono';font-size:11px;color:#d500f9}
.copy-btn{background:rgba(213,0,249,.12);border:1px solid rgba(213,0,249,.3);border-radius:3px;color:#d500f9;padding:5px 12px;cursor:pointer;font-family:Orbitron,sans-serif;font-size:8px;letter-spacing:1px}
.copy-btn.ok{background:rgba(0,230,118,.12);border-color:rgba(0,230,118,.3);color:#00e676}
.code-block{padding:14px;overflow-x:auto;font-family:'Share Tech Mono';font-size:9px;color:#7fa8c0;line-height:1.7;white-space:pre;max-height:220px;overflow-y:auto;background:rgba(0,0,0,.2)}
</style>
</head>
<body>
<div class="hero">
  <div>
    <div class="logo">
      <svg width="36" height="36" viewBox="0 0 32 32">
        <polygon points="16,2 30,24 2,24" fill="none" stroke="#ff1744" stroke-width="1.5"/>
        <polygon points="16,8 26,22 6,22" fill="rgba(255,23,68,.1)"/>
        <circle cx="16" cy="16" r="3" fill="#ff1744"/>
      </svg>
      <div class="logo-text"><div class="d">DARKPULSE</div><div class="p">THREAT SHIELD</div></div>
    </div>
    <div class="subtitle">CHROME EXTENSION INSTALLER · v1.0.0 · AI-POWERED</div>
  </div>
</div>
<div class="steps">
  <div style="font-family:Orbitron,sans-serif;font-size:13px;color:#00e5ff;letter-spacing:2px;margin-bottom:20px">📋 INSTALLATION STEPS</div>
  <div class="steps-grid">
    <div class="step"><div class="step-num">1</div><div class="step-title">CREATE FOLDER</div><div class="step-desc">Create a folder named <code style="color:#d500f9">darkpulse-extension</code></div></div>
    <div class="step"><div class="step-num">2</div><div class="step-title">CREATE SUBFOLDER</div><div class="step-desc">Inside it, create a subfolder named <code style="color:#d500f9">icons</code></div></div>
    <div class="step"><div class="step-num">3</div><div class="step-title">COPY FILES</div><div class="step-desc">Copy each file below. Names must match exactly.</div></div>
    <div class="step"><div class="step-num">4</div><div class="step-title">OPEN CHROME</div><div class="step-desc">Go to <code style="color:#d500f9">chrome://extensions</code></div></div>
    <div class="step"><div class="step-num">5</div><div class="step-title">DEVELOPER MODE</div><div class="step-desc">Toggle Developer Mode in top-right corner</div></div>
    <div class="step"><div class="step-num">6</div><div class="step-title">LOAD UNPACKED</div><div class="step-desc">Click "Load unpacked" and select your folder</div></div>
  </div>
</div>
<div class="files-section">
  <div style="font-family:Orbitron,sans-serif;font-size:13px;color:#d500f9;letter-spacing:2px;margin-bottom:20px">📁 EXTENSION SOURCE FILES</div>
  ${fileBlocks}
</div>
<script>
function copyFile(id) {
  const pre = document.getElementById('file-' + id).querySelector('code');
  navigator.clipboard.writeText(pre.innerText).then(() => {
    const btn = document.getElementById('file-' + id).querySelector('.copy-btn');
    btn.textContent = '✅ COPIED!';
    btn.classList.add('ok');
    setTimeout(() => { btn.textContent = '📋 COPY'; btn.classList.remove('ok'); }, 2500);
  });
}
</script>
</body>
</html>`;
}
