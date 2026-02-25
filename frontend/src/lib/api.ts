// NullAgent API client — connects to Express backend
// In development: http://localhost:3001
// In production:  https://api.nullagent.xyz (or Railway/Render URL)

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const WS_URL   = process.env.NEXT_PUBLIC_WS_URL  || 'ws://localhost:3001/ws'

export { WS_URL }

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json()
}

// ── Types ─────────────────────────────────────────────────────────────────

export interface StealthWallet {
  id:         number
  address:    string
  status:     'ready' | 'active' | 'used' | 'retired'
  created_at: number
  used_for?:  string
}

export interface Trade {
  id:           number
  wallet:       string
  pair:         string
  direction:    'BUY' | 'SELL'
  amount_eth:   number
  status:       'pending' | 'confirmed' | 'failed'
  tx_hash?:     string
  created_at:   number
  confirmed_at?: number
}

export interface Vault {
  totalEth:   number
  execPool:   string
  gasReserve: string
  infraUsdc:  string
  updatedAt:  number
}

export interface Signal {
  id:         number
  pair:       string
  direction:  'BUY' | 'SELL'
  conviction: number
  price_usdc: number
  sold:       number
  created_at: number
}

export interface PrivacyStatus {
  railgunFlag:  boolean
  stealthLayer: string
  zkProofs:     boolean
  layers:       { id: string; name: string; status: string; note: string }[]
}

export interface Stats {
  wallets:     number
  executions:  number
  signals:     number
  ethProtected: number
}

// ── API calls ─────────────────────────────────────────────────────────────

export const api = {

  health: () => apiFetch<{ ok: boolean; ts: number; version: string }>('/health'),

  stats: () => apiFetch<Stats>('/stats'),

  wallets: {
    list:   ()          => apiFetch<StealthWallet[]>('/wallets'),
    counts: ()          => apiFetch<Record<string, number>>('/wallets/counts'),
    pool:   (count = 1) => apiFetch<{ generated: number; wallets: StealthWallet[] }>(
      '/wallets/pool', { method: 'POST', body: JSON.stringify({ count }) }
    ),
  },

  trades: {
    list: () => apiFetch<Trade[]>('/trades'),
  },

  vault: {
    get:     ()           => apiFetch<Vault>('/vault'),
    deposit: (amount: number) => apiFetch<Vault>(
      '/vault/deposit', { method: 'POST', body: JSON.stringify({ amount }) }
    ),
  },

  signals: {
    list:  ()          => apiFetch<Signal[]>('/signals'),
    // x402 buy — caller must add payment header
    buy:   (id: number, paymentSig: string) => apiFetch<Signal>(
      '/signal', { headers: { 'x-payment': paymentSig, 'Content-Type': 'application/json' } }
    ),
  },

  privacy: {
    status: () => apiFetch<PrivacyStatus>('/privacy/status'),
  },

  auth: {
    verify: (address: string, signature: string, message: string) =>
      apiFetch<{ authenticated: boolean; address: string; shortAddress: string; token: string }>(
        '/auth/verify', { method: 'POST', body: JSON.stringify({ address, signature, message }) }
      ),
  },

  deploy: (config: {
    pair:       string
    slippage:   string
    conviction: string
    depositEth: string
  }) => apiFetch<{ agentId: string; status: string; vmId: string; endpoint: string }>(
    '/deploy', { method: 'POST', body: JSON.stringify(config) }
  ),
}
