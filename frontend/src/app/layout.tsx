import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NullAgent — Autonomous Agents. Zero Trace.',
  description: 'Autonomous trading agents on Base with zero-trace execution. Stealth wallets · Railgun · ZK proofs.',
  keywords: ['DeFi', 'Base', 'MEV', 'stealth', 'autonomous agent', 'zero trace'],
  openGraph: {
    title: 'NullAgent',
    description: 'Autonomous Agents. Zero Trace.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
