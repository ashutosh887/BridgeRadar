# BridgeRadar

**Cross-Chain Transaction Risk Simulator** — See what could go wrong before you bridge.

---

## The Problem

Every bridge transaction is a leap of faith. Users have no visibility into security, liquidity depth, or failure modes before committing funds.

## The Solution

BridgeRadar simulates your cross-chain transaction across all available routes **before** you execute—showing risk scores, historical failure rates, expected vs. worst-case outcomes, and real-time comparison.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Tech Stack

- **Framework:** Next.js 16
- **Web3:** viem, wagmi, Reown AppKit
- **Data:** LI.FI SDK (routes), ENS (identity), custom risk & stress simulation
- **UI:** Tailwind, shadcn/ui, Framer Motion

---

## Project Structure

- `app/simulate/` — Main simulation interface
- `app/api/` — Routes, risk-score, simulate, wallet-history
- `components/simulation/` — Transaction input, route cards, stress test
- `lib/lifi/` — LI.FI integration
- `lib/risk/` — Risk scoring algorithm
- `lib/ens/` — ENS resolution

---

## Environment

Copy `.env.example` to `.env.local` and add:

- `NEXT_PUBLIC_PROJECT_ID` (from [Reown Dashboard](https://dashboard.reown.com)). Use your own project ID to avoid shared-demo config that may auto-open the modal.
- `OPENAI_API_KEY` (optional, for AI route explanation)
- `LIFI_API_KEY` (optional, for higher rate limits)
- RPC URLs (optional, public RPCs used as fallback)

## Deploy

```bash
npm run build
npm run start
```

Or deploy to Vercel: connect repo, add env vars, deploy. No build config needed.

---

## API Security

- `/api/ens` and `/api/wallet-history` require valid Ethereum addresses. Rate limited (30 req/min per IP).
- `/api/routes` validated for chain IDs and amount. Rate limited.
- No PII logged or stored. ENS resolution uses public blockchain data only.
