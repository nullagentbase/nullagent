import { Router, Request, Response } from 'express'
import {
  getWallets, getWalletCounts, generateAndSaveWallet,
  getTrades, getVault, updateVault,
  getSignals, buySignal, getStats
} from '../db'
import { broadcast } from '../ws'

const router = Router()

// ── Health ────────────────────────────────────────────────────────────────

router.get('/health', (_req: Request, res: Response) => {
  res.json({ ok: true, ts: Date.now(), version: '0.1.0' })
})

// ── Stats ─────────────────────────────────────────────────────────────────

router.get('/stats', (_req: Request, res: Response) => {
  res.json(getStats())
})

// ── Wallets ───────────────────────────────────────────────────────────────

router.get('/wallets', (_req: Request, res: Response) => {
  res.json(getWallets())
})

router.get('/wallets/counts', (_req: Request, res: Response) => {
  res.json(getWalletCounts())
})

router.post('/wallets/pool', (req: Request, res: Response) => {
  const count = Math.min(parseInt(req.body.count || '1'), 20)
  const generated = []

  for (let i = 0; i < count; i++) {
    const w = generateAndSaveWallet()
    generated.push(w)
    broadcast({ type: 'wallet_added', data: w })
  }

  broadcast({ type: 'wallet_counts', data: getWalletCounts() })
  broadcast({
    type: 'log',
    data: { text: `${count} stealth wallet(s) generated · keys in memory only`, level: 'success' }
  })

  res.json({ generated: generated.length, wallets: generated })
})

// ── Trades ────────────────────────────────────────────────────────────────

router.get('/trades', (_req: Request, res: Response) => {
  res.json(getTrades())
})

// ── Vault ─────────────────────────────────────────────────────────────────

router.get('/vault', (_req: Request, res: Response) => {
  const vault = getVault()
  res.json({
    totalEth:   vault.total_eth,
    execPool:   vault.exec_pool.toString(),
    gasReserve: vault.gas_reserve.toString(),
    infraUsdc:  vault.infra_usdc.toString(),
    updatedAt:  vault.updated_at,
  })
})

router.post('/vault/deposit', (req: Request, res: Response) => {
  const { amount } = req.body
  const eth = parseFloat(amount)

  if (!eth || eth <= 0) {
    return res.status(400).json({ error: 'Invalid amount' })
  }

  const current = getVault()
  const newTotal = current.total_eth + eth
  const updated  = updateVault(newTotal)

  broadcast({
    type: 'vault_updated',
    data: {
      totalEth:   updated.total_eth,
      execPool:   updated.exec_pool.toString(),
      gasReserve: updated.gas_reserve.toString(),
      infraUsdc:  updated.infra_usdc.toString(),
    }
  })

  broadcast({
    type: 'log',
    data: { text: `Vault deposit · +${eth} ETH · split 60/30/10 applied`, level: 'success' }
  })

  res.json(updated)
})

// ── Signals (x402 market) ────────────────────────────────────────────────

router.get('/signal', (req: Request, res: Response) => {
  // Simulate x402 payment check
  const payment = req.headers['x-payment'] || req.headers['payment-signature']

  if (!payment) {
    // HTTP 402 — Payment Required
    return res.status(402).json({
      error:   'Payment Required',
      price:   '0.001',
      asset:   'USDC',
      network: 'base',
      address: process.env.PAYMENT_ADDRESS || '0x0000000000000000000000000000000000000000',
      message: 'Send 0.001 USDC on Base to access this signal',
    })
  }

  // Payment header present — return signal
  const signals = getSignals(1)
  if (signals.length === 0) {
    return res.status(404).json({ error: 'No signals available' })
  }

  const signal = signals[0] as any
  buySignal(signal.id)

  broadcast({
    type: 'log',
    data: { text: `Signal sold · ${signal.pair} ${signal.direction} · +$0.001 USDC`, level: 'success' }
  })

  res.json({
    pair:       signal.pair,
    direction:  signal.direction,
    conviction: signal.conviction,
    timestamp:  signal.created_at,
    price_paid: '0.001 USDC',
  })
})

router.get('/signals', (_req: Request, res: Response) => {
  res.json(getSignals())
})

// ── Privacy status ────────────────────────────────────────────────────────

router.get('/privacy/status', (_req: Request, res: Response) => {
  res.json({
    railgunFlag:   false,  // RAILGUN_ENABLED env flag
    stealthLayer:  'L1',
    zkProofs:      false,
    layers: [
      { id: 'L1', name: 'Stealth Wallets',  status: 'active',  note: 'Active now' },
      { id: 'L2', name: 'Railgun Shield',   status: 'pending', note: 'Q2 activation' },
      { id: 'L3', name: 'ZK Decision Proof',status: 'pending', note: 'Q3 activation' },
    ]
  })
})

// ── Auth (MetaMask personal_sign verify) ──────────────────────────────────

router.post('/auth/verify', (req: Request, res: Response) => {
  const { address, signature, message } = req.body

  if (!address || !signature || !message) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  // In production: verify signature with viem.verifyMessage
  // For now: accept any well-formed address as authenticated
  const valid = address.startsWith('0x') && address.length === 42

  if (!valid) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  res.json({
    authenticated: true,
    address,
    shortAddress: address.slice(0, 6) + '…' + address.slice(-4),
    token: Buffer.from(`${address}:${Date.now()}`).toString('base64'),
  })
})

// ── Deploy (Conway simulation) ────────────────────────────────────────────

router.post('/deploy', (req: Request, res: Response) => {
  const { pair, slippage, conviction, depositEth } = req.body

  const agentId = 'null-' + Math.floor(Math.random() * 9999).toString().padStart(4, '0')

  // In production: call Conway API here
  // POST https://api.conway.tech/sandbox/create

  res.json({
    agentId,
    status:    'deploying',
    vmId:      `firecracker-${agentId}`,
    endpoint:  `https://${agentId}.nullagent.io`,
    config:    { pair, slippage, conviction, depositEth },
    message:   'Conway VM provisioning — replace with real Conway API call',
  })
})

export default router
