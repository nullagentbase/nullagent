'use client'
import { useEffect, useState } from 'react'

const NODES = [
  { id: 'fund',    label: 'Funding Wallet', sub: 'Only public identity', color: '#7c5cfc' },
  { id: 'railgun', label: 'Railgun Shield', sub: 'L2 · Q2', color: '#a98bff', pending: true },
  { id: 'stealth', label: 'Stealth Pool',   sub: 'L1 · Active', color: '#b4ff57' },
  { id: 'exec',    label: 'Execution',      sub: 'Base mainnet', color: '#00e5ff' },
  { id: 'zk',      label: 'ZK Proof',       sub: 'L3 · Q3', color: '#404058', pending: true },
]

export function PrivacyFlow() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive(v => (v + 1) % NODES.length), 1800)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative flex flex-col items-center gap-0 py-8">
      {NODES.map((node, i) => (
        <div key={node.id} className="flex flex-col items-center">
          {/* Node */}
          <div
            className={`relative flex flex-col items-center justify-center w-48 h-16 border transition-all duration-500 ${
              active === i
                ? 'border-opacity-100 bg-opacity-10'
                : 'border-white/[0.06] bg-transparent'
            }`}
            style={{
              borderColor: active === i ? node.color : undefined,
              background: active === i ? `${node.color}10` : undefined,
              boxShadow: active === i ? `0 0 20px ${node.color}20` : undefined,
            }}
          >
            {node.pending && (
              <span className="absolute top-1.5 right-2 font-mono text-[8px] tracking-widest text-dim uppercase">pending</span>
            )}
            <span
              className="font-display text-[11px] tracking-[1.5px] uppercase transition-colors duration-500"
              style={{ color: active === i ? node.color : '#a0a0b8' }}
            >
              {node.label}
            </span>
            <span className="font-mono text-[9px] text-dim mt-0.5">{node.sub}</span>
          </div>

          {/* Connector */}
          {i < NODES.length - 1 && (
            <div className="flex flex-col items-center h-8">
              <div
                className="w-px flex-1 transition-all duration-500"
                style={{ background: active === i ? `linear-gradient(${node.color}, ${NODES[i+1].color})` : 'rgba(255,255,255,0.06)' }}
              />
              <div
                className="w-1.5 h-1.5 rotate-45 border-r border-b transition-colors duration-500"
                style={{ borderColor: active === i ? NODES[i+1].color : 'rgba(255,255,255,0.1)' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
