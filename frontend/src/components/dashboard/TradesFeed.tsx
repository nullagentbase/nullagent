'use client'
import type { Trade } from '@/lib/api'

interface Props { trades: Trade[] }

function PrivacyBlocks({ layer }: { layer: string }) {
  const count = layer === 'L3' ? 3 : layer === 'L2' ? 2 : 1
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map(i => (
        <div key={i} className={`priv-block ${i <= count ? 'on' : ''}`} />
      ))}
    </div>
  )
}

function fmtEth(weiStr: string, direction: string) {
  try {
    const eth = (parseInt(weiStr) / 1e18).toFixed(3)
    return (direction === 'BUY' ? '+' : '-') + eth
  } catch { return '?.???' }
}

function timeAgo(unix: number) {
  const d = Math.floor(Date.now() / 1000) - unix
  if (d < 60) return `${d}s`
  return `${Math.floor(d / 60)}m`
}

const DEMO_TRADES: Partial<Trade>[] = [
  { id: 1, stealth_address: '0x4f3a...9b2c', pair: 'ETH/BRETT', direction: 'BUY', amount_eth: '420000000000000000', privacy_layer: 'L1', status: 'confirmed', created_at: Math.floor(Date.now()/1000) - 138 },
  { id: 2, stealth_address: '0x8c1d...3e7f', pair: 'ETH/BRETT', direction: 'SELL', amount_eth: '380000000000000000', privacy_layer: 'L1', status: 'confirmed', created_at: Math.floor(Date.now()/1000) - 524 },
  { id: 3, stealth_address: '0x2a9b...7d4e', pair: 'ETH/DEGEN', direction: 'BUY', amount_eth: '180000000000000000', privacy_layer: 'L1', status: 'confirmed', created_at: Math.floor(Date.now()/1000) - 662 },
]

export function TradesFeed({ trades }: Props) {
  const rows = trades.length > 0 ? trades : DEMO_TRADES as Trade[]

  return (
    <div className="border border-white/[0.06]">
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <span className="font-display text-[11px] tracking-[2px] uppercase text-white">Live Feed</span>
      </div>
      <div className="overflow-y-auto max-h-72">
        {rows.map((t) => {
          const isBuy = t.direction === 'BUY'
          return (
            <div key={t.id} className="flex items-center justify-between px-5 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
              <span className="font-mono text-[11px] text-violet-2 w-28 truncate">{t.stealth_address}</span>
              <span className="font-mono text-[11px] text-ink">{t.pair}</span>
              <span className={`font-mono text-[11px] font-bold ${isBuy ? 'text-neon' : 'text-warn'}`}>{t.direction}</span>
              <span className="font-display text-[11px] text-white">{fmtEth(t.amount_eth, t.direction)} ETH</span>
              <PrivacyBlocks layer={t.privacy_layer} />
              <span className="font-mono text-[10px] text-dim">{timeAgo(t.created_at)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
