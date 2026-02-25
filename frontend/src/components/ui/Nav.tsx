'use client'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export function Nav() {
  const { auth, state, connect, isAuthenticated } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-12 border-b border-white/[0.06] bg-void/90 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3.5">
        <HexMark />
        <span className="font-display font-bold text-[15px] tracking-[2px] text-white">NULLAGENT</span>
      </Link>

      <ul className="flex gap-9 list-none">
        {[
          { label: 'How It Works', href: '#how' },
          { label: 'Docs', href: '#docs' },
          { label: 'GitHub', href: '#github' },
          { label: 'Deploy', href: '/deploy' },
        ].map(item => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-[11px] tracking-[1.5px] text-dim uppercase hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[10px] tracking-[1.5px] text-dim border border-white/[0.06] px-3 py-1.5 uppercase">
          <span className="w-[5px] h-[5px] rounded-full bg-neon pulse" />
          Base
        </div>

        <div className="flex flex-col items-end">
          <button
            onClick={connect}
            disabled={state === 'connecting' || state === 'signing' || state === 'verifying'}
            className="clip-btn font-mono text-[11px] tracking-[1.5px] uppercase bg-violet hover:bg-violet-2 text-white px-5 py-2.5 transition-colors disabled:opacity-60"
          >
            {state === 'connecting' ? 'connecting...'
              : state === 'signing'    ? 'sign...'
              : state === 'verifying'  ? 'verifying...'
              : isAuthenticated        ? auth!.shortAddress
              : 'Connect'}
          </button>
          {isAuthenticated && (
            <span className="text-[10px] text-neon tracking-[1px] mt-0.5">● MetaMask · Base</span>
          )}
        </div>
      </div>
    </nav>
  )
}

function HexMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <polygon points="14,2 25,8 25,20 14,26 3,20 3,8" fill="none" stroke="#7c5cfc" strokeWidth="1.5" />
      <polygon points="14,7 20,10.5 20,17.5 14,21 8,17.5 8,10.5" fill="rgba(124,92,252,0.2)" stroke="#a98bff" strokeWidth="1" />
      <circle cx="14" cy="14" r="2.5" fill="#b4ff57" />
    </svg>
  )
}
