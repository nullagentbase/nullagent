import { WebSocketServer, WebSocket } from 'ws'
import { Server } from 'http'
import {
  getWallets, getWalletCounts, getTrades, getVault,
  getSignals, getStats, addTrade, confirmTrade,
  generateAndSaveWallet, addSignal
} from '../db'

const PAIRS = ['ETH/BRETT', 'ETH/DEGEN']
const DIRECTIONS = ['BUY', 'SELL']

let wss: WebSocketServer

export function initWebSocket(server: Server) {
  wss = new WebSocketServer({ server, path: '/ws' })

  wss.on('connection', (ws: WebSocket) => {
    console.log('[WS] Client connected — total:', wss.clients.size)

    // Send full state snapshot on connect
    sendToClient(ws, {
      type: 'snapshot',
      data: {
        wallets:      getWallets(),
        walletCounts: getWalletCounts(),
        trades:       getTrades(),
        vault:        getVault(),
        signals:      getSignals(),
        stats:        getStats(),
        privacy: {
          railgunFlag:  false,
          stealthLayer: 'L1',
          zkProofs:     false,
        }
      }
    })

    ws.on('message', (raw: Buffer) => {
      try {
        const msg = JSON.parse(raw.toString())
        handleClientMessage(ws, msg)
      } catch (e) {
        console.error('[WS] Bad message:', e)
      }
    })

    ws.on('close', () => {
      console.log('[WS] Client disconnected — total:', wss.clients.size)
    })

    ws.on('error', (err) => {
      console.error('[WS] Error:', err.message)
    })
  })

  // ── Auto-simulation loop ──────────────────────────────────────────────
  startSimulation()

  console.log('[WS] WebSocket server ready')
  return wss
}

function handleClientMessage(ws: WebSocket, msg: any) {
  switch (msg.type) {

    case 'generate_wallet': {
      const w = generateAndSaveWallet()
      broadcast({ type: 'wallet_added', data: w })
      broadcast({ type: 'wallet_counts', data: getWalletCounts() })
      broadcast({ type: 'log', data: { text: `Stealth wallet generated · ${w.address} · ready`, level: 'success' } })
      break
    }

    case 'ping':
      sendToClient(ws, { type: 'pong', ts: Date.now() })
      break

    case 'get_stats':
      sendToClient(ws, { type: 'stats', data: getStats() })
      break
  }
}

// ── Simulation: fires realistic events every few seconds ─────────────────

function startSimulation() {
  // Trade simulation — every 25-55 seconds
  setInterval(() => {
    simulateTrade()
  }, randomBetween(25000, 55000))

  // Signal simulation — every 40-90 seconds
  setInterval(() => {
    simulateSignal()
  }, randomBetween(40000, 90000))

  // Heartbeat log — every 12 seconds
  setInterval(() => {
    const pair = PAIRS[Math.floor(Math.random() * PAIRS.length)]
    const msgs = [
      `Watcher scanning · ${pair} · Base mainnet`,
      `Price feed updated · ${pair} · conviction check`,
      `Mempool scan · no sandwich detected · clear`,
      `Stealth pool · ${getWalletCounts().ready || 0} wallets ready`,
      `x402 server alive · GET /signal · $0.001 USDC`,
      `Gas oracle · ${(Math.random() * 0.5 + 0.8).toFixed(3)} gwei · favorable`,
    ]
    broadcast({
      type: 'log',
      data: { text: msgs[Math.floor(Math.random() * msgs.length)], level: 'info' }
    })
  }, 12000)
}

function simulateTrade() {
  const pair      = PAIRS[Math.floor(Math.random() * PAIRS.length)]
  const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]
  const amount    = parseFloat((Math.random() * 0.5 + 0.05).toFixed(3))
  const wallets   = getWallets(10)
  const readyWallets = wallets.filter((w: any) => w.status === 'ready')

  if (readyWallets.length === 0) {
    // Auto-generate a wallet if pool is empty
    const w = generateAndSaveWallet()
    broadcast({ type: 'wallet_added', data: w })
    broadcast({ type: 'wallet_counts', data: getWalletCounts() })
    return
  }

  const wallet = readyWallets[0] as any
  const trade  = addTrade(wallet.address, pair, direction, amount) as any

  broadcast({ type: 'log', data: { text: `Executing ${direction} ${pair} · ${amount} ETH · stealth ${wallet.address}`, level: 'info' } })
  broadcast({ type: 'trade_added', data: trade })

  // Confirm after 8-15 seconds
  setTimeout(() => {
    const txHash = '0x' + Math.random().toString(16).slice(2).padEnd(64, '0')
    const confirmed = confirmTrade(trade.id, txHash)
    broadcast({ type: 'trade_confirmed', data: confirmed })
    broadcast({ type: 'log', data: { text: `Confirmed ${direction} ${pair} · +${direction === 'BUY' ? amount : '-' + amount} ETH · tx ${txHash.slice(0, 10)}…`, level: 'success' } })
    broadcast({ type: 'stats', data: getStats() })
  }, randomBetween(8000, 15000))
}

function simulateSignal() {
  const pair       = PAIRS[Math.floor(Math.random() * PAIRS.length)]
  const direction  = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]
  const conviction = Math.floor(Math.random() * 30 + 65) // 65-95
  const signal     = addSignal(pair, direction, conviction) as any

  broadcast({ type: 'signal_added', data: signal })
  broadcast({
    type: 'log',
    data: { text: `Signal generated · ${pair} ${direction} · conviction ${conviction}% · x402 market open`, level: 'success' }
  })
}

// ── Broadcast helpers ─────────────────────────────────────────────────────

export function broadcast(msg: object) {
  if (!wss) return
  const json = JSON.stringify(msg)
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(json)
    }
  })
}

function sendToClient(ws: WebSocket, msg: object) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg))
  }
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}
