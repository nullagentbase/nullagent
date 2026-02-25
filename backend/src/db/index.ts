import Database from 'better-sqlite3'
import path from 'path'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../nullagent.db')

let db: Database.Database

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initSchema()
  }
  return db
}

function initSchema() {
  const d = getDb()

  d.exec(`
    CREATE TABLE IF NOT EXISTS wallets (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      address     TEXT NOT NULL UNIQUE,
      status      TEXT NOT NULL DEFAULT 'ready',
      created_at  INTEGER NOT NULL,
      used_for    TEXT,
      retired_at  INTEGER
    );

    CREATE TABLE IF NOT EXISTS trades (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet      TEXT NOT NULL,
      pair        TEXT NOT NULL,
      direction   TEXT NOT NULL,
      amount_eth  REAL NOT NULL,
      status      TEXT NOT NULL DEFAULT 'pending',
      tx_hash     TEXT,
      created_at  INTEGER NOT NULL,
      confirmed_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS signals (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      pair          TEXT NOT NULL,
      direction     TEXT NOT NULL,
      conviction    INTEGER NOT NULL,
      price_usdc    REAL NOT NULL DEFAULT 0.001,
      sold          INTEGER NOT NULL DEFAULT 0,
      created_at    INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS vault (
      id          INTEGER PRIMARY KEY DEFAULT 1,
      total_eth   REAL NOT NULL DEFAULT 0,
      exec_pool   REAL NOT NULL DEFAULT 0,
      gas_reserve REAL NOT NULL DEFAULT 0,
      infra_usdc  REAL NOT NULL DEFAULT 0,
      updated_at  INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS agents (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id    TEXT NOT NULL UNIQUE,
      address     TEXT NOT NULL,
      pair        TEXT NOT NULL DEFAULT 'ETH/BRETT',
      status      TEXT NOT NULL DEFAULT 'active',
      created_at  INTEGER NOT NULL
    );

    INSERT OR IGNORE INTO vault (id, total_eth, exec_pool, gas_reserve, infra_usdc, updated_at)
    VALUES (1, 5.23, 3.138, 1.569, 0.523, unixepoch());
  `)

  // Seed demo wallets if empty
  const count = (d.prepare('SELECT COUNT(*) as c FROM wallets').get() as any).c
  if (count === 0) seedDemoData()
}

function seedDemoData() {
  const d = getDb()
  const now = Math.floor(Date.now() / 1000)

  const demoWallets = [
    { address: '0x4f3a…9b2c', status: 'used',   used_for: 'ETH/BRETT buy',  created_at: now - 120 },
    { address: '0x8c1d…3e7f', status: 'used',   used_for: 'ETH/BRETT sell', created_at: now - 480 },
    { address: '0x2a9b…7d4e', status: 'ready',  used_for: null,             created_at: now - 900 },
    { address: '0x6e3f…1a8c', status: 'used',   used_for: 'ETH/DEGEN buy',  created_at: now - 1380 },
    { address: '0x1b7c…5d2a', status: 'ready',  used_for: null,             created_at: now - 1860 },
    { address: '0x9a4e…8f3b', status: 'active', used_for: null,             created_at: now - 2640 },
    { address: '0x3c7d…2a1f', status: 'retired',used_for: 'ETH/BRETT buy',  created_at: now - 3600 },
  ]

  const insertWallet = d.prepare(
    'INSERT OR IGNORE INTO wallets (address, status, used_for, created_at) VALUES (?, ?, ?, ?)'
  )
  for (const w of demoWallets) {
    insertWallet.run(w.address, w.status, w.used_for, w.created_at)
  }

  const demoTrades = [
    { wallet: '0x4f3a…9b2c', pair: 'ETH/BRETT', direction: 'BUY',  amount_eth: 0.42, status: 'confirmed', created_at: now - 120 },
    { wallet: '0x8c1d…3e7f', pair: 'ETH/BRETT', direction: 'SELL', amount_eth: 0.38, status: 'confirmed', created_at: now - 480 },
    { wallet: '0x6e3f…1a8c', pair: 'ETH/DEGEN', direction: 'BUY',  amount_eth: 0.18, status: 'confirmed', created_at: now - 1380 },
    { wallet: '0x9a4e…8f3b', pair: 'ETH/BRETT', direction: 'BUY',  amount_eth: 0.31, status: 'pending',   created_at: now - 60 },
  ]

  const insertTrade = d.prepare(
    `INSERT INTO trades (wallet, pair, direction, amount_eth, status, created_at, confirmed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
  for (const t of demoTrades) {
    insertTrade.run(t.wallet, t.pair, t.direction, t.amount_eth, t.status, t.created_at,
      t.status === 'confirmed' ? t.created_at + 12 : null)
  }

  const demoSignals = [
    { pair: 'ETH/BRETT', direction: 'BUY',  conviction: 82, created_at: now - 30 },
    { pair: 'ETH/DEGEN', direction: 'SELL', conviction: 71, created_at: now - 90 },
    { pair: 'ETH/BRETT', direction: 'BUY',  conviction: 91, created_at: now - 180 },
  ]

  const insertSignal = d.prepare(
    'INSERT INTO signals (pair, direction, conviction, created_at) VALUES (?, ?, ?, ?)'
  )
  for (const s of demoSignals) {
    insertSignal.run(s.pair, s.direction, s.conviction, s.created_at)
  }

  const demoAgents = [
    { agent_id: 'null-0047', address: '0x4f3a…9b2c', pair: 'ETH/BRETT', created_at: now - 86400 },
    { agent_id: 'null-0019', address: '0x8c1d…3e7f', pair: 'ETH/BRETT', created_at: now - 172800 },
    { agent_id: 'null-0033', address: '0x2a9b…7d4e', pair: 'ETH/DEGEN', created_at: now - 259200 },
  ]

  const insertAgent = d.prepare(
    'INSERT OR IGNORE INTO agents (agent_id, address, pair, created_at) VALUES (?, ?, ?, ?)'
  )
  for (const a of demoAgents) {
    insertAgent.run(a.agent_id, a.address, a.pair, a.created_at)
  }
}

// ── Query helpers ──────────────────────────────────────────────────────────

export function getWallets(limit = 20) {
  return getDb().prepare(
    'SELECT * FROM wallets ORDER BY created_at DESC LIMIT ?'
  ).all(limit)
}

export function getWalletCounts() {
  const rows = getDb().prepare(
    `SELECT status, COUNT(*) as count FROM wallets GROUP BY status`
  ).all() as { status: string; count: number }[]
  return Object.fromEntries(rows.map(r => [r.status, r.count]))
}

export function generateAndSaveWallet() {
  const privateKey = generatePrivateKey()
  const account   = privateKeyToAccount(privateKey)
  const short     = account.address.slice(0, 6) + '…' + account.address.slice(-4)
  const now       = Math.floor(Date.now() / 1000)

  getDb().prepare(
    'INSERT INTO wallets (address, status, created_at) VALUES (?, ?, ?)'
  ).run(short, 'ready', now)

  return { address: short, status: 'ready', created_at: now }
}

export function getTrades(limit = 30) {
  return getDb().prepare(
    'SELECT * FROM trades ORDER BY created_at DESC LIMIT ?'
  ).all(limit)
}

export function getVault() {
  return getDb().prepare('SELECT * FROM vault WHERE id = 1').get() as any
}

export function updateVault(totalEth: number) {
  const now = Math.floor(Date.now() / 1000)
  getDb().prepare(
    `UPDATE vault SET
       total_eth   = ?,
       exec_pool   = round(? * 0.60, 6),
       gas_reserve = round(? * 0.30, 6),
       infra_usdc  = round(? * 0.10, 6),
       updated_at  = ?
     WHERE id = 1`
  ).run(totalEth, totalEth, totalEth, totalEth, now)
  return getVault()
}

export function getSignals(limit = 20) {
  return getDb().prepare(
    'SELECT * FROM signals ORDER BY created_at DESC LIMIT ?'
  ).all(limit)
}

export function buySignal(id: number) {
  getDb().prepare('UPDATE signals SET sold = sold + 1 WHERE id = ?').run(id)
  return getDb().prepare('SELECT * FROM signals WHERE id = ?').get(id)
}

export function addTrade(wallet: string, pair: string, direction: string, amountEth: number) {
  const now = Math.floor(Date.now() / 1000)
  const result = getDb().prepare(
    `INSERT INTO trades (wallet, pair, direction, amount_eth, status, created_at)
     VALUES (?, ?, ?, ?, 'pending', ?)`
  ).run(wallet, pair, direction, amountEth, now)

  return getDb().prepare('SELECT * FROM trades WHERE id = ?').get(result.lastInsertRowid)
}

export function confirmTrade(id: number, txHash: string) {
  const now = Math.floor(Date.now() / 1000)
  getDb().prepare(
    `UPDATE trades SET status = 'confirmed', tx_hash = ?, confirmed_at = ? WHERE id = ?`
  ).run(txHash, now, id)
  return getDb().prepare('SELECT * FROM trades WHERE id = ?').get(id)
}

export function addSignal(pair: string, direction: string, conviction: number) {
  const now = Math.floor(Date.now() / 1000)
  const result = getDb().prepare(
    'INSERT INTO signals (pair, direction, conviction, created_at) VALUES (?, ?, ?, ?)'
  ).run(pair, direction, conviction, now)
  return getDb().prepare('SELECT * FROM signals WHERE id = ?').get(result.lastInsertRowid)
}

export function getStats() {
  const d = getDb()
  const wallets   = (d.prepare('SELECT COUNT(*) as c FROM wallets').get() as any).c
  const executions = (d.prepare(`SELECT COUNT(*) as c FROM trades WHERE status = 'confirmed'`).get() as any).c
  const signals   = (d.prepare('SELECT SUM(sold) as c FROM signals').get() as any).c || 0
  const vault     = getVault()
  return { wallets, executions, signals, ethProtected: vault?.total_eth || 0 }
}
