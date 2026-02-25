'use client'
import type { VaultState } from '@/lib/api'

interface Props {
  vault: VaultState | null
  depositAmount?: string
}

export function VaultSplit({ vault, depositAmount }: Props) {
  const total = parseFloat(depositAmount || vault?.totalDeposited || '0')
  const exec  = total * 0.6
  const gas   = total * 0.3
  const infra = total * 0.1

  return (
    <div className="border border-white/[0.06] p-6 space-y-5">
      <div className="flex items-center justify-between">
        <span className="font-display text-[11px] tracking-[2px] uppercase text-white">ETH Split</span>
        {total > 0 && (
          <span className="font-mono text-[10px] text-dim">{total.toFixed(3)} ETH total</span>
        )}
      </div>

      {/* Bar */}
      {total > 0 && (
        <div className="flex h-2 rounded-none overflow-hidden gap-px">
          <div className="bg-neon transition-all" style={{ width: '60%' }} />
          <div className="bg-violet transition-all" style={{ width: '30%' }} />
          <div className="bg-electric transition-all" style={{ width: '10%' }} />
        </div>
      )}

      <div className="space-y-3">
        <SplitRow
          label="Execution Pool"
          pct="60%"
          value={total > 0 ? `${exec.toFixed(3)} ETH` : vault?.execPool ? `${parseFloat(vault.execPool).toFixed(3)} ETH` : '—'}
          color="text-neon"
          dot="bg-neon"
        />
        <SplitRow
          label="Gas Reserve"
          pct="30%"
          value={total > 0 ? `${gas.toFixed(3)} ETH` : vault?.gasReserve ? `${parseFloat(vault.gasReserve).toFixed(3)} ETH` : '—'}
          color="text-violet-2"
          dot="bg-violet"
        />
        <SplitRow
          label="Conway Infra"
          pct="10%"
          value={total > 0 ? `${infra.toFixed(3)} ETH → USDC` : '—'}
          color="text-electric"
          dot="bg-electric"
        />
      </div>
    </div>
  )
}

function SplitRow({ label, pct, value, color, dot }: { label: string; pct: string; value: string; color: string; dot: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span className="font-mono text-[11px] text-ink">{label}</span>
        <span className="font-mono text-[10px] text-dim">{pct}</span>
      </div>
      <span className={`font-mono text-[11px] ${color}`}>{value}</span>
    </div>
  )
}
