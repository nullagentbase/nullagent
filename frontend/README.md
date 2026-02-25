# NullAgent — Next.js Frontend

Built with Next.js 14 App Router + TypeScript + Tailwind CSS.

## Stack

- **Next.js 14** App Router
- **Tailwind CSS** — exact NullAgent palette (void/violet/neon/electric)
- **Unbounded 900** + **Azeret Mono** — same fonts as original HTML
- **wagmi / viem** — wallet connection
- **framer-motion** — animations
- **WebSocket** — real-time events from backend

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing — hero, privacy flow diagram, stats, agent cards |
| `/deploy` | 4-step wizard — connect → configure → fund → launch |
| `/dashboard` | Live dashboard — wallets, trades, vault, terminal (auth required) |

## Setup

```bash
cp .env.local.example .env.local
# Set NEXT_PUBLIC_BACKEND_URL to your Conway sandbox URL

npm install
npm run dev
```

## Connect to backend

Set in `.env.local`:
```
NEXT_PUBLIC_BACKEND_URL=https://your-sandbox.conway.tech
```

The frontend connects to:
- `GET /api/auth/nonce` — get nonce to sign
- `POST /api/auth/verify` — verify wallet signature
- `POST /api/agent/wallet/new` — generate stealth wallet
- `POST /api/agent/wallet/pool` — generate wallet pool
- `GET /api/agent/wallet/list` — list pool
- `GET /api/agent/trades` — list trades
- `GET /api/vault` — vault state
- `GET /api/privacy/status` — L1/L2/L3 status
- `ws://host/ws` — real-time event stream

## Auth flow

```
1. GET /api/auth/nonce?address=0x...   → { nonce, message }
2. MetaMask personal_sign(message)      → signature
3. POST /api/auth/verify                → session created
4. All requests: X-Wallet-Address + X-Wallet-Signature headers
```

## Deploy (Vercel)

```bash
npm run build
# Deploy to Vercel or any static host
vercel --prod
```

Set env var in Vercel dashboard:
```
NEXT_PUBLIC_BACKEND_URL=https://your-sandbox.conway.tech
```
