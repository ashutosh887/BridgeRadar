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
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Tech Stack

- **Framework:** Next.js 16
- **Web3:** viem, wagmi, RainbowKit
- **Data:** LI.FI SDK (routes), Yellow (simulation), ENS (identity)
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

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- RPC URLs for mainnet, Arbitrum, Optimism, etc.

---

## Tasks

See [TODO.md](./TODO.md) for the full task breakdown and hackathon build plan.
