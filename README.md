# DarkPulse — AI Threat Intelligence Platform

> Real-time SOC dashboard powered by Claude AI. Live threat feeds, dark web monitoring, predictive attack forecasting, and autonomous threat hunting in a single interface.

---

## What is DarkPulse?

DarkPulse is a cybersecurity threat intelligence platform built for security operations teams. It simulates a live SOC (Security Operations Center) environment with real-time data feeds, AI-driven analysis, and predictive threat modeling — all accessible from a browser.

The platform integrates Claude AI as its intelligence engine, enabling natural language threat analysis, CVE deep-dives, incident response guidance, and domain exposure scanning.

---

## Features

| Module | Description |
|---|---|
| **Live Threat Feed** | Streaming intel from OSINT, dark web monitors, CVE databases, and IOC sources |
| **AI Security Advisor** | Chat with Claude for CVE analysis, threat actor profiling, MITRE ATT&CK breakdowns, and IR guidance |
| **Threat Actor Profiles** | Live risk scores for LockBit 3.0, APT29, Volt Typhoon, Lazarus Group, and more |
| **Predictive Engine** | AI-correlated campaign forecasts with confidence scores and launch windows |
| **Global Attack Map** | Real-time animated attack vector visualization across world regions |
| **Industry Threat Pulse** | Live risk scores across Healthcare, Finance, Government, Energy, and more |
| **Company Attack Radar** | Per-company attack probability based on live signals |
| **Attack Timeline** | Kill chain simulation from Recon → Ransomware deployment |
| **Exposure Scanner** | Domain OSINT scan — open ports, CVEs, credential leaks, dark web mentions |
| **Browser Extension** | Chrome extension for real-time threat analysis as you browse |

---

## Tech Stack

- **Frontend** — React 18 + Vite
- **AI** — Anthropic Claude (claude-sonnet-4-20250514, claude-haiku-4-5)
- **API Proxy** — Vercel Edge Functions (API key never exposed to browser)
- **Deployment** — Vercel
- **Fonts** — Orbitron, Rajdhani, Share Tech Mono (Google Fonts)

---

## Project Structure

```
darkpulse-web/
├── api/
│   └── chat.js                  # Vercel Edge proxy — keeps API key server-side
├── src/
│   ├── styles/
│   │   └── index.css            # Global styles + responsive breakpoints
│   ├── utils/
│   │   └── helpers.js           # Shared utility functions
│   ├── data/
│   │   └── threatData.js        # Static threat data, init functions, extension files
│   ├── components/
│   │   ├── atoms.jsx            # Panel, Badge, Dot, Bar, LiveNum, Delta
│   │   ├── WorldMap.jsx         # Animated SVG global attack map
│   │   ├── Radar.jsx            # Industry risk radar chart
│   │   ├── MsgText.jsx          # Markdown-like message renderer
│   │   ├── AIAdvisor.jsx        # Claude AI chat interface
│   │   ├── Scanner.jsx          # Domain exposure scanner
│   │   ├── ExtensionPage.jsx    # Chrome extension download page
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── Predictions.jsx
│   │       ├── Feed.jsx
│   │       ├── Actors.jsx
│   │       ├── GlobalMap.jsx
│   │       ├── AttackRadar.jsx
│   │       └── Timeline.jsx
│   ├── App.jsx                  # Main app — routing, state, data ticks
│   └── main.jsx                 # Entry point
├── public/
│   └── favicon.svg
├── .env.example                 # API key template
├── vercel.json
├── vite.config.js
└── package.json
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/ROHITCRAFTSYT/Dark-pulse.git
cd Dark-pulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get a key at [console.anthropic.com](https://console.anthropic.com)

### 4. Run locally

```bash
npm run dev
```

Open `http://localhost:5173`

---

## Deploying to Vercel

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add `ANTHROPIC_API_KEY` in **Project Settings → Environment Variables**
4. Deploy

The `api/chat.js` Edge Function will proxy all Claude API requests server-side so your key is never exposed.

---

## Chrome Extension

DarkPulse includes a browser extension that analyzes every domain you visit in real time.

1. Go to the **Extension** page in the dashboard
2. Click **Download**
3. Open the downloaded HTML file in your browser
4. Copy each file into a folder named `darkpulse-extension`
5. Go to `chrome://extensions` → Enable Developer Mode → Load Unpacked

**Features:** Phishing detection · Threat actor pattern matching · Credential leak checker · In-page risk banners · Scan history

---

## Screenshots

> Dashboard with live threat feed, industry pulse, predictions, and attack radar

The UI uses a dark cyberpunk aesthetic with Orbitron/Rajdhani typefaces, neon accent colors, and animated SVG components to simulate a real SOC environment.

---

## License

MIT — free to use, modify, and deploy.

---

*Built with React + Vite*
