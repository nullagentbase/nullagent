# NullAgent

Autonomous trading agents on Base · Zero Trace Execution · x402 Native

```
nullagent/
├── frontend/   Next.js 14 — deploy to Vercel
└── backend/    Express + WebSocket + SQLite — deploy to Railway
```

## Local Development

```bash
# Install all dependencies
cd frontend && npm install
cd ../backend && npm install

# Run frontend
cd frontend && npm run dev        # http://localhost:3000

# Run backend (separate terminal)
cd backend && npm run dev         # http://localhost:3001
```

## Environment Setup

```bash
# Frontend
cp frontend/.env.local.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
```

## Deploy

- **Frontend** → Vercel (root directory: `frontend`)
- **Backend** → Railway (root directory: `backend`)

Set in Vercel:
```
NEXT_PUBLIC_API_URL=https://api.nullagent.xyz
NEXT_PUBLIC_WS_URL=wss://api.nullagent.xyz/ws
```

Set in Railway:
```
PORT=3001
FRONTEND_URL=https://nullagent.xyz
PAYMENT_ADDRESS=0xYOUR_WALLET
```

## Stack

- **Chain**: Base mainnet
- **Compute**: Conway.tech (Firecracker microVMs)
- **Payments**: x402 protocol (USDC on Base)
- **Privacy L1**: Stealth wallets — viem generatePrivateKey()
- **Privacy L2**: Railgun — Q2 activation
- **Privacy L3**: Semaphore ZK proofs — Q3 activation
- **Identity**: ERC-8004 on-chain agent registry

Built on open protocols · MIT License
