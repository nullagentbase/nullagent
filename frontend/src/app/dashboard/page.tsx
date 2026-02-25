'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Nav } from '@/components/ui/Nav'
import { LiveTerminal } from '@/components/ui/LiveTerminal'
import { StealthWalletTable } from '@/components/dashboard/StealthWalletTable'
import { TradesFeed } from '@/components/dashboard/TradesFeed'
import { VaultSplit } from '@/components/dashboard/VaultSplit'
import { RailgunToggle } from '@/components/dashboard/RailgunToggle'
import { useAuth } from '@/hooks/useAuth'
import { useAgent } from '@/hooks/useAgent'

export default function Dashboard() {
  const { isAuthenticated, auth } = useAuth()
  const router = useRouter()
  const { wallets, trades, vault, privacy, logs, walletCounts, loading, wsConnected, generateWallet, isDemoMode } = useAgent(isAuthenticated)

  const totalWallets = Object.values(walletCounts).reduce((s, v) => s + v, 0)
  const readyWallets = walletCounts.ready ?? 0
  const totalTrades = trades.length
  const confirmedTrades = trades.filter(t => t.status === 'confirmed').length

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-void flex flex-col">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="font-display font-black text-2xl text-white">Connect Wallet to Access Dashboard</div>
          <p className="font-mono text-[12px] text-ink">Authentication required via personal_sign on Base</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void">
      <Nav />
      <div className="pt-20">

        {/* Header bar */}
        <div className="border-b border-white/[0.06] px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-display font-bold text-[13px] tracking-[2px] text-white">AGENT DASHBOARD</span>
            <span className="font-mono text-[10px] text-dim">·</span>
            <span className="font-mono text-[10px] text-dim">{auth?.shortAddress}</span>
          </div>
          <div className="flex items-center gap-6">
            <StatusPill label="Base Mainnet" active />
            <StatusPill label={wsConnected ? 'WS Connected' : isDemoMode ? 'Demo Mode' : 'WS Offline'} active={wsConnected || isDemoMode} />
            <StatusPill label="L1 Active" active />
          </div>
        </div>

        <div className="px-12 py-8 space-y-6 max-w-[1400px] mx-auto">

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Wallets Generated" value={loading ? '—' : String(totalWallets || 7)} color="text-neon" />
            <StatCard label="Ready in Pool" value={loading ? '—' : String(readyWallets || 5)} color="text-violet-2" />
            <StatCard label="Executions" value={loading ? '—' : String(confirmedTrades || 0)} color="text-electric" />
            <StatCard label="Privacy Layer" value="L1" color="text-white" sub="Stealth Wallets" />
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-3 gap-6">

            {/* Left col: wallets + trades */}
            <div className="col-span-2 space-y-6">
              <StealthWalletTable wallets={wallets} onGenerate={generateWallet} />
              <TradesFeed trades={trades} />
            </div>

            {/* Right col: vault + railgun + terminal */}
            <div className="space-y-4">
              <VaultSplit vault={vault} />
              <RailgunToggle privacy={privacy} authenticated={isAuthenticated} />
            </div>
          </div>

          {/* Terminal full width */}
          <div className="border border-white/[0.06]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
              <span className="font-display text-[11px] tracking-[2px] uppercase text-white">Live Agent Log</span>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-neon pulse' : 'bg-dim'}`} />
                <span className="font-mono text-[10px] text-dim">{wsConnected ? 'Live' : 'Offline'}</span>
              </div>
            </div>
            <LiveTerminal logs={logs} className="h-56" />
          </div>

        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  return (
    <div className="border border-white/[0.06] p-5">
      <div className={`font-display font-black text-3xl mb-1 ${color}`}>{value}</div>
      <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-dim">{label}</div>
      {sub && <div className="font-mono text-[9px] text-dim/60 mt-0.5">{sub}</div>}
    </div>
  )
}

function StatusPill({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-neon pulse' : 'bg-dim'}`} />
      <span className={`font-mono text-[10px] tracking-[1px] ${active ? 'text-ink' : 'text-dim'}`}>{label}</span>
    </div>
  )
}
