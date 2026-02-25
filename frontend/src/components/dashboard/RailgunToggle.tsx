'use client'
import { useState } from 'react'
import { api, type PrivacyStatus } from '@/lib/api'

interface Props {
  privacy: PrivacyStatus | null
  authenticated: boolean
}

export function RailgunToggle({ privacy, authenticated }: Props) {
  const [syncing, setSyncing] = useState(false)
  const [localActive, setLocalActive] = useState(false)

  const isActive = privacy?.railgunFlag || localActive

  async function toggle() {
    if (!authenticated) return
    setSyncing(true)
    setLocalActive(v => !v)

    try {
      const status = await api.privacy.status()
      setLocalActive(status.railgunFlag)
    } catch {}

    setTimeout(() => setSyncing(false), 3200)
  }

  return (
    <div className="border border-white/[0.06] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-display text-[11px] tracking-[2px] uppercase text-white mb-1">Railgun Shield</div>
          <div className="font-mono text-[10px] text-dim">L2 Privacy · Breaks funding→execution link</div>
        </div>
        <button
          onClick={toggle}
          disabled={!authenticated || syncing}
          className={`relative w-12 h-6 rounded-none transition-colors border ${
            isActive ? 'bg-violet/30 border-violet' : 'bg-transparent border-white/[0.1]'
          } disabled:opacity-40`}
        >
          <span className={`absolute top-1 w-4 h-4 transition-all ${
            isActive ? 'left-7 bg-neon' : 'left-1 bg-dim'
          }`} />
        </button>
      </div>

      {/* Layer status */}
      <div className="space-y-2">
        <LayerRow layer="L1" name="Stealth Wallets" active={true} note="Active now" />
        <LayerRow
          layer="L2"
          name="Railgun Shield"
          active={isActive}
          note={syncing ? 'Syncing Merkle Tree...' : isActive ? 'Zero Link On' : 'Disabled · Q2'}
          syncing={syncing}
        />
        <LayerRow layer="L3" name="ZK Proof" active={false} note="Q3" />
      </div>
    </div>
  )
}

function LayerRow({ layer, name, active, note, syncing }: {
  layer: string; name: string; active: boolean; note: string; syncing?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-2 border-t border-white/[0.04]">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] text-dim w-6">{layer}</span>
        <span className="font-mono text-[11px] text-ink">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-neon pulse' : 'bg-dim'}`} />
        <span className={`font-mono text-[10px] ${syncing ? 'text-violet-2' : active ? 'text-neon' : 'text-dim'}`}>
          {note}
        </span>
      </div>
    </div>
  )
}
