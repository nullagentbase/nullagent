'use client'
import type { StealthWallet } from '@/lib/api'

interface Props {
  wallets: StealthWallet[]
  onGenerate: () => void
}

const statusColor = { ready: 'text-neon border-neon', active: 'text-violet-2 border-violet-2', used: 'text-dim border-dim', retired: 'text-dim border-dim' } as const
const statusLabel = { ready: 'READY', active: 'LIVE', used: 'USED', retired: 'RETIRED' } as const

function timeAgo(unix: number) {
  const d = Math.floor(Date.now() / 1000) - unix
  if (d < 60) return `${d}s ago`
  if (d < 3600) return `${Math.floor(d / 60)}m ago`
  return `${Math.floor(d / 3600)}h ago`
}

export function StealthWalletTable({ wallets, onGenerate }: Props) {
  const demo = wallets.length === 0

  const rows = demo ? [
    { id: 1, address: '0x4f3a...9b2c', status: 'used' as const, created_at: Math.floor(Date.now()/1000) - 120, used_for: 'ETH/BRETT buy' },
    { id: 2, address: '0x8c1d...3e7f', status: 'used' as const, created_at: Math.floor(Date.now()/1000) - 480, used_for: 'ETH/BRETT sell' },
    { id: 3, address: '0x2a9b...7d4e', status: 'ready' as const, created_at: Math.floor(Date.now()/1000) - 900, used_for: undefined },
    { id: 4, address: '0x6e3f...1a8c', status: 'used' as const, created_at: Math.floor(Date.now()/1000) - 1380, used_for: 'ETH/DEGEN buy' },
    { id: 5, address: '0x1b7c...5d2a', status: 'ready' as const, created_at: Math.floor(Date.now()/1000) - 1860, used_for: undefined },
    { id: 6, address: '0x9a4e...8f3b', status: 'active' as const, created_at: Math.floor(Date.now()/1000) - 2640, used_for: undefined },
  ] : wallets.slice(0, 10)

  return (
    <div className="border border-white/[0.06]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <span className="font-display text-[11px] tracking-[2px] uppercase text-white">Stealth Wallet Pool</span>
        <button
          onClick={onGenerate}
          className="clip-btn font-mono text-[10px] tracking-[1.5px] uppercase bg-violet/20 hover:bg-violet/40 text-violet-2 border border-violet/30 px-4 py-2 transition-colors"
        >
          + Generate
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.04]">
            {['Address', 'Created', 'Used For', 'Status'].map(h => (
              <th key={h} className="text-left px-5 py-3 text-[10px] tracking-[1.5px] uppercase text-dim font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((w) => (
            <tr key={w.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
              <td className="px-5 py-3 font-mono text-[11px] text-violet-2">{w.address}</td>
              <td className="px-5 py-3 font-mono text-[11px] text-dim">{timeAgo(w.created_at)}</td>
              <td className="px-5 py-3 font-mono text-[11px] text-white">{w.used_for || '—'}</td>
              <td className="px-5 py-3">
                <span className={`font-mono text-[9px] tracking-[1.5px] px-2 py-1 border ${statusColor[w.status]}`}>
                  {statusLabel[w.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
