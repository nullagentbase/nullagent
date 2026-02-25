import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { initWebSocket } from './ws'
import routes from './routes'
import { getDb } from './db'

const app  = express()
const PORT = parseInt(process.env.PORT || '3001')

// ── Init DB early ─────────────────────────────────────────────────────────
getDb()
console.log('[DB] SQLite ready')

// ── Middleware ────────────────────────────────────────────────────────────

const allowedOrigins = [
  'http://localhost:3000',
  'https://nullagent.xyz',
  'https://www.nullagent.xyz',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logger
app.use((req, _res, next) => {
  console.log(`[HTTP] ${req.method} ${req.path}`)
  next()
})

// ── Routes ────────────────────────────────────────────────────────────────

app.use('/api', routes)

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// ── HTTP + WebSocket server ───────────────────────────────────────────────

const server = http.createServer(app)
initWebSocket(server)

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║   NullAgent Backend · v0.1.0             ║
║   HTTP  → http://localhost:${PORT}          ║
║   WS    → ws://localhost:${PORT}/ws         ║
║   Base mainnet · L1 active               ║
╚══════════════════════════════════════════╝
  `)
})

export default app
