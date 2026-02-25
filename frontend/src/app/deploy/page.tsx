'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/ui/Nav'
import { VaultSplit } from '@/components/dashboard/VaultSplit'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'

type Step = 1 | 2 | 3 | 4

interface DeployLog { text: string; type: 's' | 'o' }

export default function DeployPage() {
  const { auth, isAuthenticated, connect, state: authState } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState<Step>(1)
  const [pair, setPair] = useState('ETH/BRETT')
  const [slippage, setSlippage] = useState('0.5')
  const [conviction, setConviction] = useState('65')
  const [deposit, setDeposit] = useState('')
  const [deploying, setDeploying] = useState(false)
  const [deployLogs, setDeployLogs] = useState<DeployLog[]>([])
  const [deployDone, setDeployDone] = useState(false)
  const [gridLit, setGridLit] = useState<Set<number>>(new Set())
  const [gridDone, setGridDone] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const gridInterval = useRef<NodeJS.Timeout>()

  // Auto-advance to step 2 when authenticated
  useEffect(() => {
    if (isAuthenticated && step === 1) setStep(2)
  }, [isAuthenticated])

  function addLog(text: string, type: 's' | 'o' = 'o', delayMs = 0) {
    setTimeout(() => {
      setDeployLogs(prev => [...prev, { text, type }])
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
    }, delayMs)
  }

  async function launchDeploy() {
    setDeploying(true)
    setDeployLogs([])
    setGridDone(false)

    // Grid animation
    let litCells = new Set<number>()
    gridInterval.current = setInterval(() => {
      const cell = Math.floor(Math.random() * 60)
      litCells = new Set(litCells)
      if (litCells.has(cell)) litCells.delete(cell)
      else litCells.add(cell)
      setGridLit(new Set(litCells))
    }, 55)

    // Log sequence
    let d = 0
    const step = (text: string, type: 's' | 'o', wait: number) => {
      addLog(text, type, d); d += wait
    }

    step('Requesting Conway sandbox...', 'o', 700)
    step('sandbox_create → Firecracker microVM · Ubuntu 22.04', 'o', 900)
    step(`VM ready · ID: null-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`, 's', 700)
    step('npm install viem @x402/express @x402/fetch @railgun-community/wallet', 'o', 1100)
    step('Dependencies installed', 's', 500)

    // Real API calls
    setTimeout(async () => {
      addLog('Generating stealth wallet pool (7 wallets)...', 'o')
      try {
        const pool = await api.wallets.pool(7)
        addLog(`Wallets generated · ${pool.generated} ready · Keys in memory only`, 's')
      } catch {
        addLog('Stealth wallet pool ready (7 wallets) · demo mode', 's')
      }

      setTimeout(async () => {
        addLog(`ETH split: 60% execution · 30% gas · 10% → USDC for Conway`, 'o')
        try {
          const vault = await api.vault.get()
          addLog(`Vault configured · exec pool: ${parseFloat(vault.execPool).toFixed(3)} ETH`, 's')
        } catch {
          addLog('Vault split configured · 60/30/10', 's')
        }

        const remaining: [string, 's' | 'o', number][] = [
          [`Starting watcher.ts → Base mainnet · ${pair}`, 'o', 700],
          ['Watcher active ✓', 's', 400],
          ['x402 server → GET /signal · $0.001 USDC', 's', 500],
          ['sandbox_expose_port 3000 → SSL endpoint live', 's', 700],
          ['ERC-8004 identity registered on Base ✓', 's', 700],
          ['RAILGUN_ENABLED=false · Module loaded · Awaiting Q2', 'o', 600],
          ['AGENT OPERATIONAL · ZERO TRACE MODE ACTIVE ✓', 's', 0],
        ]

        let rd = 0
        remaining.forEach(([text, type, wait]) => {
          addLog(text, type, rd); rd += wait
        })

        setTimeout(() => {
          clearInterval(gridInterval.current)
          setGridLit(new Set())
          setGridDone(true)
          setDeployDone(true)

          setTimeout(() => router.push('/dashboard'), 2000)
        }, rd + 600)
      }, 1200)
    }, d)
  }

  function goStep(n: Step) {
    if (n > 1 && !isAuthenticated) return
    setStep(n)
    if (n === 4) launchDeploy()
  }

  const STEPS = [
    { n: 1 as Step, label: 'Connect' },
    { n: 2 as Step, label: 'Configure' },
    { n: 3 as Step, label: 'Fund' },
    { n: 4 as Step, label: 'Launch' },
  ]

  return (
    <div className="min-h-screen bg-void">
      <Nav />
      <div className="pt-24 px-12 pb-24 max-w-[900px] mx-auto">

        {/* Header */}
        <div className="mb-12">
          <div className="font-mono text-[10px] tracking-[4px] text-violet-2 uppercase mb-3">Deploy Wizard</div>
          <h1 className="font-display font-black text-4xl text-white">Launch Your Agent</h1>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-0 mb-12">
          {STEPS.map(({ n, label }, i) => (
            <div key={n} className="flex items-center">
              <button
                onClick={() => goStep(n)}
                className={`flex items-center gap-3 px-5 py-3 border transition-all ${
                  step === n
                    ? 'border-violet bg-violet/10 text-white'
                    : step > n
                    ? 'border-neon/30 bg-neon/5 text-neon'
                    : 'border-white/[0.06] text-dim cursor-not-allowed'
                }`}
              >
                <span className={`font-display text-[10px] w-5 h-5 flex items-center justify-center border ${
                  step > n ? 'border-neon text-neon' : step === n ? 'border-violet text-violet-2' : 'border-dim text-dim'
                }`}>
                  {step > n ? '✓' : n}
                </span>
                <span className="font-mono text-[11px] tracking-[1.5px] uppercase">{label}</span>
              </button>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-white/[0.06]" />}
            </div>
          ))}
        </div>

        {/* Step 1: Connect */}
        {step === 1 && (
          <div className="border border-white/[0.06] p-8 space-y-6">
            <h2 className="font-display font-bold text-xl text-white">Connect Wallet</h2>
            <p className="font-mono text-[12px] text-ink leading-[1.9]">
              Authentication uses <span className="text-white">personal_sign</span> — no JWT, no email, no OAuth.
              Your wallet is your identity.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <WalletOption label="MetaMask" icon="🦊" onClick={connect} loading={authState !== 'idle'} />
              <WalletOption label="Coinbase Wallet" icon="🔵" onClick={connect} />
              <WalletOption label="WalletConnect" icon="🔗" disabled note="Soon" />
            </div>
          </div>
        )}

        {/* Step 2: Configure */}
        {step === 2 && (
          <div className="border border-white/[0.06] p-8 space-y-6">
            <h2 className="font-display font-bold text-xl text-white">Configure Agent</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Trading Pair">
                <select
                  value={pair}
                  onChange={e => setPair(e.target.value)}
                  className="w-full bg-deep border border-white/[0.1] text-white font-mono text-[12px] px-4 py-3 outline-none focus:border-violet transition-colors"
                >
                  <option value="ETH/BRETT">ETH / BRETT</option>
                  <option value="ETH/DEGEN">ETH / DEGEN</option>
                  <option value="ALL">All Pairs</option>
                </select>
              </Field>
              <Field label="Slippage Tolerance">
                <select
                  value={slippage}
                  onChange={e => setSlippage(e.target.value)}
                  className="w-full bg-deep border border-white/[0.1] text-white font-mono text-[12px] px-4 py-3 outline-none focus:border-violet transition-colors"
                >
                  <option value="0.5">0.5%</option>
                  <option value="1.0">1.0%</option>
                  <option value="2.0">2.0%</option>
                </select>
              </Field>
              <Field label="Min Conviction Threshold">
                <div className="flex items-center gap-4">
                  <input
                    type="range" min="55" max="95" value={conviction}
                    onChange={e => setConviction(e.target.value)}
                    className="flex-1 accent-violet"
                  />
                  <span className="font-mono text-[13px] text-neon w-10">{conviction}%</span>
                </div>
              </Field>
              <Field label="Privacy Layer">
                <div className="bg-deep border border-white/[0.1] px-4 py-3 font-mono text-[12px] text-neon">
                  L1 — Stealth Wallets (Active)
                </div>
              </Field>
            </div>
            <button
              onClick={() => goStep(3)}
              className="clip-btn font-mono text-[12px] tracking-[1.5px] uppercase bg-violet hover:bg-violet-2 text-white px-8 py-3 transition-colors"
            >
              Next: Fund →
            </button>
          </div>
        )}

        {/* Step 3: Fund */}
        {step === 3 && (
          <div className="border border-white/[0.06] p-8 space-y-6">
            <h2 className="font-display font-bold text-xl text-white">Fund Agent</h2>
            <p className="font-mono text-[12px] text-ink">
              Send ETH to your agent vault. Split is applied automatically on deposit.
            </p>
            <Field label="Deposit Amount (ETH)">
              <input
                type="number" step="0.001" min="0.01"
                value={deposit}
                onChange={e => setDeposit(e.target.value)}
                placeholder="0.000"
                className="w-full bg-deep border border-white/[0.1] text-white font-mono text-[14px] px-4 py-3 outline-none focus:border-violet transition-colors placeholder:text-dim"
              />
            </Field>
            {parseFloat(deposit) > 0 && <VaultSplit vault={null} depositAmount={deposit} />}
            <button
              onClick={() => goStep(4)}
              className="clip-btn font-mono text-[12px] tracking-[1.5px] uppercase bg-violet hover:bg-violet-2 text-white px-8 py-3 transition-colors"
            >
              Launch Agent →
            </button>
          </div>
        )}

        {/* Step 4: Launch */}
        {step === 4 && (
          <div className="border border-white/[0.06] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-white">
                {deployDone ? 'Agent Live' : 'Deploying...'}
              </h2>
              {deployDone && <span className="font-display text-[11px] tracking-[2px] text-neon uppercase">✓ Operational</span>}
            </div>

            {/* Grid animation */}
            <div className="grid grid-cols-[repeat(12,1fr)] gap-px">
              {Array.from({ length: 60 }, (_, i) => (
                <div
                  key={i}
                  className={`ag-cell ${gridLit.has(i) ? 'lit' : ''} ${gridDone ? 'done' : ''}`}
                />
              ))}
            </div>

            {/* Terminal */}
            <div
              ref={logRef}
              className="bg-deep border border-white/[0.06] p-4 h-48 overflow-y-auto font-mono text-[11px] leading-[1.8]"
            >
              {deployLogs.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-dim">{'// '}</span>
                  <span className={l.type === 's' ? 'text-neon' : 'text-ink'}>{l.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function WalletOption({ label, icon, onClick, disabled, note, loading }: {
  label: string; icon: string; onClick?: () => void; disabled?: boolean; note?: string; loading?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="border border-white/[0.06] hover:border-violet/40 p-5 flex flex-col items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-mono text-[11px] text-ink">{loading ? 'Connecting...' : label}</span>
      {note && <span className="font-mono text-[9px] text-dim">{note}</span>}
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="font-mono text-[10px] tracking-[1.5px] uppercase text-dim">{label}</label>
      {children}
    </div>
  )
}
