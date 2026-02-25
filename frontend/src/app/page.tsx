'use client'
import Link from 'next/link'
import { Nav } from '@/components/ui/Nav'
import { PrivacyFlow } from '@/components/landing/PrivacyFlow'

const MARQUEE_ITEMS = [
  '0x4f3a…9b2c · BUY · ETH/BRETT · +0.42 ETH · L1',
  '0x8c1d…3e7f · SELL · ETH/BRETT · -0.38 ETH · L1',
  '0x2a9b…7d4e · BUY · ETH/DEGEN · +0.18 ETH · L1',
  '0x6e3f…1a8c · x402 · signal sold · +$0.001 USDC',
  '0x1b7c…5d2a · BUY · ETH/BRETT · +0.31 ETH · L1',
  '0x9a4e…8f3b · SELL · ETH/DEGEN · -0.22 ETH · L1',
  '0x3c7d…2a1f · BUY · ETH/BRETT · +0.55 ETH · L1',
  '0x7f2e…4c9a · x402 · signal sold · +$0.001 USDC',
]

const AGENTS = [
  { id: 'null-0047', layer: 'L1', eth: '2.41', executions: 847, wallet: '0x4f3a...9b2c' },
  { id: 'null-0019', layer: 'L1', eth: '1.88', executions: 623, wallet: '0x8c1d...3e7f' },
  { id: 'null-0033', layer: 'L1', eth: '0.94', executions: 312, wallet: '0x2a9b...7d4e' },
]

const DOCS_SECTIONS = [
  {
    tag: 'QUICKSTART',
    title: 'Deploy in 3 steps',
    color: 'neon' as const,
    items: [
      { step: '01', label: 'Run Conway Terminal', code: 'npx conway-terminal' },
      { step: '02', label: 'Configure environment', code: 'cp .env.example .env' },
      { step: '03', label: 'Deploy your agent', code: './deploy-conway.sh' },
    ],
  },
  {
    tag: 'ARCHITECTURE',
    title: 'How privacy works',
    color: 'violet' as const,
    items: [
      { step: 'L1', label: 'Stealth Wallet', code: 'viem generatePrivateKey()' },
      { step: 'L2', label: 'Railgun Shield', code: 'shieldFunds(amount, recipient)' },
      { step: 'L3', label: 'ZK Proof', code: 'semaphore.generateProof(signal)' },
    ],
  },
  {
    tag: 'PAYMENTS',
    title: 'x402 protocol',
    color: 'electric' as const,
    items: [
      { step: '01', label: 'Agent makes request', code: 'GET /signal' },
      { step: '02', label: 'Server responds 402', code: 'HTTP 402 · price: $0.001' },
      { step: '03', label: 'Agent pays + retries', code: 'PAYMENT-SIGNATURE header' },
    ],
  },
]

const GITHUB_REPOS = [
  {
    name: 'nullagent',
    desc: 'Core agent runtime — stealth wallets, watcher, executor, x402 server. The main process that runs inside a Conway Firecracker microVM.',
    lang: 'TypeScript',
    tags: ['viem', 'x402', 'Base', 'Conway', 'SQLite'],
    href: 'https://github.com',
  },
  {
    name: 'nullagent-contracts',
    desc: 'AgentRegistry ERC-8004 on-chain identity. Registers agent addresses on Base mainnet so they can prove execution without revealing the operator.',
    lang: 'Solidity',
    tags: ['Base', 'ERC-8004', 'Hardhat', 'viem'],
    href: 'https://github.com',
  },
  {
    name: 'nullagent-frontend',
    desc: 'Next.js 14 web interface — 4-step deploy wizard, live dashboard, stealth wallet pool, MetaMask authentication via personal_sign.',
    lang: 'TypeScript',
    tags: ['Next.js 14', 'Tailwind', 'wagmi', 'WebSocket'],
    href: 'https://github.com',
  },
]

const ECOSYSTEM = [
  {
    name: 'Conway.tech',
    role: 'Compute Runtime',
    desc: 'Firecracker microVMs host the agent process. Pays itself via x402 autopay when credits run low — the agent funds its own compute.',
    color: '#7c5cfc',
    href: 'https://docs.conway.tech',
    badge: 'Infrastructure',
  },
  {
    name: 'x402 Protocol',
    role: 'Agent Payments',
    desc: 'HTTP 402 native micropayment layer. NullAgent sells signals at $0.001 USDC per call — no API key, no account, pure on-chain micropayment.',
    color: '#00e5ff',
    href: 'https://docs.cdp.coinbase.com/x402',
    badge: 'Payments',
  },
  {
    name: 'Railgun',
    role: 'L2 Privacy (Q2)',
    desc: 'Shielded UTXO pool on Base. Breaks the on-chain link between your funding wallet and stealth execution wallets completely.',
    color: '#a98bff',
    href: 'https://railgun.org',
    badge: 'Privacy',
  },
  {
    name: 'Base (L2)',
    role: 'Execution Chain',
    desc: 'Coinbase L2 — low fees, fast finality, active DeFi. Uniswap V3 pools for ETH/BRETT and ETH/DEGEN are the primary trading targets.',
    color: '#b4ff57',
    href: 'https://base.org',
    badge: 'Chain',
  },
]

const FAQ = [
  {
    q: 'How is NullAgent different from a regular trading bot?',
    a: 'Regular bots run from a fixed wallet — every trade is permanently linked to your identity on-chain. Anyone can copy your strategy in days. NullAgent generates a fresh ephemeral wallet per trade and destroys the key after use. There is no wallet to watch.',
  },
  {
    q: 'What is a stealth wallet exactly?',
    a: "A throwaway EVM address generated with viem's generatePrivateKey() at runtime. The private key exists only in memory — never written to disk, never logged. After a single trade, the wallet is retired forever. The next trade uses a completely different address.",
  },
  {
    q: 'What does RAILGUN_ENABLED=false mean right now?',
    a: 'Railgun is fully integrated in the codebase as a real module — not a placeholder. The flag is false until Q2 activation. Right now, L1 stealth wallets alone break wallet linkability. Railgun adds a second layer by shielding ETH before it reaches the stealth pool.',
  },
  {
    q: 'How does the x402 signal market work?',
    a: 'When NullAgent detects a high-conviction signal, it makes it available at GET /signal. Any agent can request it and automatically pays $0.001 USDC via HTTP 402 — no API key, no account, settled on-chain in ~2 seconds via the x402 protocol.',
  },
  {
    q: 'Do I need ETH to run an agent?',
    a: 'Yes. Your deposit auto-splits: 60% execution pool (trades), 30% gas reserve (funds stealth wallets), 10% swaps to USDC to pay Conway compute credits. USDC is never the trading asset — only ETH is traded.',
  },
  {
    q: 'What is Conway.tech and why is it used?',
    a: 'Conway runs the agent in an isolated Firecracker microVM — the same hypervisor used by AWS Lambda. The agent gets its own Linux process, private SQLite DB, and a public SSL endpoint. It pays its own compute using x402 when credits run low.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-void">
      <Nav />

      {/* ── HERO ── */}
      <section className="min-h-screen flex items-center pt-24 px-12 relative overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[80px] pointer-events-none top-[-100px] right-[-100px] bg-violet/[0.08] animate-drift1" />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] pointer-events-none bottom-0 left-[-80px] bg-electric/[0.05] animate-drift2" />
        <div className="absolute w-[300px] h-[300px] rounded-full blur-[80px] pointer-events-none top-[40%] right-[30%] bg-neon/[0.04] animate-drift3" />

        <div className="grid grid-cols-2 gap-20 items-center w-full max-w-[1280px] mx-auto relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-6 rise rise-1">
              <div className="w-8 h-px bg-violet" />
              <span className="font-mono text-[10px] tracking-[4px] text-violet-2 uppercase">Anti-MEV · Anti-Sandwich · Zero Trace</span>
            </div>
            <h1 className="font-display font-black leading-[1.05] tracking-[-1px] mb-7 rise rise-2" style={{ fontSize: 'clamp(48px,5.5vw,80px)' }}>
              <span className="text-white block">Autonomous</span>
              <span className="block" style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>Agents.</span>
              <span className="text-violet-2">Zero Trace.</span>
            </h1>
            <p className="font-mono text-[13px] leading-[1.9] text-ink max-w-[440px] mb-10 rise rise-3">
              On Base today, every agent is{' '}
              <b className="text-white font-normal">100% visible</b> — wallet, timestamp, pair, strategy.
              Copiable in days. Sandwich attacks trivial.{' '}
              <b className="text-white font-normal">NullAgent makes that impossible.</b>
            </p>
            <div className="flex gap-3 rise rise-4">
              <Link href="/deploy" className="clip-btn font-mono text-[12px] tracking-[1.5px] uppercase bg-violet hover:bg-violet-2 text-white px-7 py-3.5 transition-colors">
                Deploy Agent
              </Link>
              <a href="#how" className="clip-btn font-mono text-[12px] tracking-[1.5px] uppercase border border-white/[0.1] text-ink hover:text-white px-7 py-3.5 transition-colors">
                How It Works
              </a>
            </div>
            <div className="flex items-center gap-4 mt-8 rise rise-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon pulse" />
                <span className="font-mono text-[10px] text-dim tracking-[1px]">Base mainnet · live</span>
              </div>
              <div className="w-px h-3 bg-white/[0.1]" />
              <span className="font-mono text-[10px] text-dim">RAILGUN_ENABLED=false · L1 active</span>
            </div>
          </div>
          <div className="flex justify-center">
            <PrivacyFlow />
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-y border-white/[0.06] py-3 overflow-hidden">
        <div className="marquee-inner">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="font-mono text-[10px] tracking-[1px] text-dim px-8 whitespace-nowrap">
              <span className="text-violet mr-3">◆</span>{item}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="py-20 px-12">
        <div className="max-w-[1280px] mx-auto grid grid-cols-4 gap-8">
          {[
            { label: 'Wallets Generated', value: '12,847', color: 'text-neon' },
            { label: 'Executions', value: '3,291', color: 'text-violet-2' },
            { label: 'Signals Sold', value: '891', color: 'text-electric' },
            { label: 'ETH Protected', value: '847.3', color: 'text-white' },
          ].map(stat => (
            <div key={stat.label} className="border border-white/[0.06] p-6 hover:border-white/[0.1] transition-colors">
              <div className={`font-display font-black text-4xl mb-2 ${stat.color}`}>{stat.value}</div>
              <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-dim">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-20 px-12 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-16 text-center">
            <div className="font-mono text-[10px] tracking-[4px] text-violet-2 uppercase mb-4">Privacy Architecture</div>
            <h2 className="font-display font-black text-4xl text-white">Three Layers. Zero Trace.</h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { layer: 'L1', name: 'Stealth Wallets', status: 'ACTIVE', color: 'neon', desc: 'New ephemeral wallet per operation. Private keys held in memory only — never persisted. Wallet retired after single use.', tech: 'viem generatePrivateKey' },
              { layer: 'L2', name: 'Railgun Shield', status: 'Q2', color: 'violet', desc: 'Breaks the on-chain link between your funding wallet and stealth execution wallets via shielded UTXO pool.', tech: '@railgun-community/wallet' },
              { layer: 'L3', name: 'ZK Decision Proof', status: 'Q3', color: 'electric', desc: 'Semaphore zero-knowledge proof that the agent acted — without revealing the wallet, timestamp, or decision logic.', tech: '@semaphore-protocol/core' },
            ].map(({ layer, name, status, color, desc, tech }) => (
              <div key={layer} className="border border-white/[0.06] p-6 hover:border-white/[0.12] transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] tracking-[2px] text-dim uppercase">{layer}</span>
                  <span className={`font-mono text-[9px] tracking-[1.5px] px-2 py-1 border ${status === 'ACTIVE' ? 'text-neon border-neon' : 'text-dim border-dim'}`}>{status}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-3">{name}</h3>
                <p className="font-mono text-[11px] leading-[1.8] text-ink mb-4">{desc}</p>
                <div className="font-mono text-[10px] text-dim border-t border-white/[0.06] pt-3">{tech}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ETH SPLIT EXPLAINER ── */}
      <section className="py-20 px-12 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 gap-20 items-center">
          <div>
            <div className="font-mono text-[10px] tracking-[4px] text-violet-2 uppercase mb-4">Vault Architecture</div>
            <h2 className="font-display font-black text-4xl text-white mb-6">Every deposit,<br />automatically split.</h2>
            <p className="font-mono text-[13px] leading-[1.9] text-ink mb-8">
              When you fund your agent, ETH splits on-chain into three pools.
              The agent operates fully autonomously — trading, paying its own gas,
              and keeping itself alive in Conway compute.
            </p>
            <div className="space-y-5">
              {[
                { pct: '60%', label: 'Execution Pool', sub: 'ETH used for actual trades via stealth wallets', color: 'bg-neon', text: 'text-neon' },
                { pct: '30%', label: 'Gas Reserve', sub: 'Funds each stealth wallet before every trade', color: 'bg-violet', text: 'text-violet-2' },
                { pct: '10%', label: 'Conway Infra', sub: 'Swapped to USDC → compute credits via x402', color: 'bg-electric', text: 'text-electric' },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-4">
                  <div className={`font-display font-black text-xl w-12 shrink-0 ${row.text}`}>{row.pct}</div>
                  <div className={`w-px h-8 ${row.color} opacity-40`} />
                  <div>
                    <div className="font-mono text-[12px] text-white">{row.label}</div>
                    <div className="font-mono text-[10px] text-dim mt-0.5">{row.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="font-mono text-[10px] tracking-[2px] text-dim uppercase mb-6">Example: 1 ETH deposit</div>
            {[
              { pct: 60, label: 'Execution Pool', value: '0.600 ETH', color: 'bg-neon' },
              { pct: 30, label: 'Gas Reserve', value: '0.300 ETH', color: 'bg-violet' },
              { pct: 10, label: 'Conway Infra', value: '0.100 ETH → USDC', color: 'bg-electric' },
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-mono text-[11px] text-ink">{row.label}</span>
                  <span className="font-mono text-[11px] text-white">{row.value}</span>
                </div>
                <div className="h-2 bg-white/[0.04] w-full">
                  <div className={`h-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
            <div className="border border-white/[0.06] p-4 mt-4 bg-deep/50">
              <div className="font-mono text-[10px] text-dim mb-2">{'// auto-split on deposit'}</div>
              <div className="font-mono text-[11px] text-neon">{'vault.split(deposit, [0.60, 0.30, 0.10])'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACTIVE AGENTS ── */}
      <section className="py-20 px-12 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-10">
            <div className="font-mono text-[10px] tracking-[4px] text-violet-2 uppercase mb-2">Live Network</div>
            <h2 className="font-display font-bold text-2xl text-white">Active Agents</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {AGENTS.map(agent => (
              <div key={agent.id} className="border border-white/[0.06] p-5 hover:border-violet/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display text-[12px] tracking-[1.5px] text-white">{agent.id}</span>
                  <span className="font-mono text-[9px] tracking-[1.5px] text-neon border border-neon/30 px-2 py-0.5">{agent.layer}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="font-mono text-[10px] text-dim">ETH in vault</span><span className="font-mono text-[11px] text-white">{agent.eth} ETH</span></div>
                  <div className="flex justify-between"><span className="font-mono text-[10px] text-dim">Executions</span><span className="font-mono text-[11px] text-violet-2">{agent.executions}</span></div>
                  <div className="flex justify-between"><span className="font-mono text-[10px] text-dim">Last wallet</span><span className="font-mono text-[10px] text-dim">{agent.wallet}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOCS ── */}
      <section id="docs" className="py-20 px-12 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-16">
            <div className="font-mono text-[10px] tracking-[4px] text-violet-2 uppercase mb-4">Documentation</div>
            <h2 className="font-display font-black text-4xl text-white mb-4">Start building.</h2>
            <p className="font-mono text-[13px] text-ink max-w-[520px] leading-[1.9]">
              Everything you need to deploy, configure, and extend NullAgent.
              Open source, MIT licensed, built entirely on open protocols.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-10">
            {DOCS_SECTIONS.map(section => (
              <div key={section.tag} className="border border-white/[0.06] p-6 hover:border-white/[0.12] transition-colors">
                <div className="flex items-center gap-2 mb-5">
                  <div className={`w-1.5 h-1.5 rounded-full ${section.color === 'neon' ? 'bg-neon' : section.color === 'violet' ? 'bg-violet' : 'bg-electric'}`} />
                  <span className="font-mono text-[9px] tracking-[2px] text-dim uppercase">{section.tag}</span>
                </div>
                <h3 className="font-display font-bold text-[15px] text-white mb-5">{section.title}</h3>
                <div className="space-y-4">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <span className={`font-mono text-[10px] shrink-0 w-6 mt-0.5 ${section.color === 'neon' ? 'text-neon' : section.color === 'violet' ? 'text-violet-2' : 'text-electric'}`}>{item.step}</span>
                      <div>
                        <div className="font-mono text-[11px] text-ink mb-1">{item.label}</div>
                        <div className="font-mono text-[10px] text-dim bg-white/[0.03] border border-white/[0.05] px-2 py-1.5">{item.code}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Setup Guide', desc: 'Conway + Alchemy + wallet config', href: '#' },
              { label: 'API Reference', desc: 'All endpoints, auth, WebSocket events', href: '#' },
              { label: 'Privacy Deep Dive', desc: 'Stealth → Railgun → ZK explained', href: '#' },
              { label: 'x402 Integration', desc: 'Sell signals, buy signals, autopay', href: '#' },
            ].map(doc => (
              <a key={doc.label} href={doc.href} className="border border-white/[0.06] p-5 hover:border-violet/30 hover:bg-violet/[0.03] transition-all group">
                <div className="font-display text-[12px] tracking-[1px] text-white mb-2 group-hover:text-violet-2 transition-colors">{doc.label} →</div>
                <div className="font-mono text-[10px] text-dim leading-[1.6]">{doc.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── GITHUB ── */}
      <section id="github" className="py-20 px-12 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="font-mono text-[10px] tracking-[4px] text-violet-2 uppercase mb-4">Open Source</div>
              <h2 className="font-display font-black text-4xl text-white mb-3">Built in public.</h2>
              <p className="font-mono text-[13px] text-ink max-w-[480px] leading-[1.9]">
                NullAgent is fully open source. Inspect the stealth wallet logic, Railgun integration,
                x402 server — everything. MIT licensed.
              </p>
            </div>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="clip-btn font-mono text-[11px] tracking-[1.5px] uppercase border border-white/[0.1] text-ink hover:text-white hover:border-white/[0.2] px-6 py-3 transition-all shrink-0">
              github.com/nullagent →
            </a>
          </div>

          <div className="grid grid-cols-3 gap-5 mb-8">
            {GITHUB_REPOS.map(repo => (
              <a key={repo.name} href={repo.href} target="_blank" rel="noopener noreferrer"
                className="border border-white/[0.06] p-6 hover:border-violet/30 hover:bg-violet/[0.02] transition-all group block">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-dim shrink-0">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span className="font-display text-[13px] text-white group-hover:text-violet-2 transition-colors">{repo.name}</span>
                    </div>
                    <span className="font-mono text-[9px] text-dim">{repo.lang}</span>
                  </div>
                  <span className="font-mono text-[10px] text-dim">★ —</span>
                </div>
                <p className="font-mono text-[11px] text-ink leading-[1.7] mb-4">{repo.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {repo.tags.map(tag => (
                    <span key={tag} className="font-mono text-[9px] text-dim border border-white/[0.08] px-2 py-0.5">{tag}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>

          {/* Code snippet */}
          <div className="border border-white/[0.06] p-6 bg-deep/40">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-warn/60" />
              <span className="w-2 h-2 rounded-full bg-gold/60" />
              <span className="w-2 h-2 rounded-full bg-neon/60" />
              <span className="font-mono text-[10px] text-dim ml-2">src/privacy/stealth.ts</span>
            </div>
            <pre className="font-mono text-[11px] leading-[2] overflow-x-auto">
              <span className="text-dim">{'// New stealth wallet per operation — key never persisted to disk\n'}</span>
              <span className="text-violet-2">{'export function '}</span>
              <span className="text-neon">{'generateStealthWallet'}</span>
              <span className="text-white">{'() {'}</span>{'\n'}
              <span className="text-violet-2">{'  const '}</span>
              <span className="text-white">{'privateKey '}</span>
              <span className="text-dim">{'= '}</span>
              <span className="text-neon">{'generatePrivateKey'}</span>
              <span className="text-dim">{'()         '}</span>
              <span className="text-dim">{'// viem — random 32 bytes\n'}</span>
              <span className="text-violet-2">{'  const '}</span>
              <span className="text-white">{'account   '}</span>
              <span className="text-dim">{'= '}</span>
              <span className="text-neon">{'privateKeyToAccount'}</span>
              <span className="text-dim">{'(privateKey)\n'}</span>
              <span className="text-dim">{'  // key lives only in this closure — retired after single execution\n'}</span>
              <span className="text-violet-2">{'  return '}</span>
              <span className="text-white">{'{ address: account.address, sign: account.signTransaction }\n'}</span>
              <span className="text-white">{'}'}</span>
            </pre>
          </div>
        </div>
      </section>

      {/* ── ECOSYSTEM ── */}
      <section className="py-20 px-12 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-12 text-center">
            <div className="font-mono text-[10px] tracking-[4px] text-violet-2 uppercase mb-4">Ecosystem</div>
            <h2 className="font-display font-black text-4xl text-white mb-3">Built on open protocols.</h2>
            <p className="font-mono text-[13px] text-ink max-w-[480px] mx-auto leading-[1.9]">
              NullAgent integrates with the best infrastructure on Base.
              No vendor lock-in. Every component is replaceable.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {ECOSYSTEM.map(item => (
              <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer"
                className="border border-white/[0.06] p-6 hover:border-white/[0.12] transition-all group block">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[9px] tracking-[1.5px] px-2 py-1 border border-white/[0.08] text-dim uppercase">{item.badge}</span>
                  <span className="font-mono text-[12px] group-hover:translate-x-0.5 transition-transform" style={{ color: item.color }}>→</span>
                </div>
                <h3 className="font-display font-bold text-[15px] mb-1" style={{ color: item.color }}>{item.name}</h3>
                <div className="font-mono text-[10px] text-dim mb-3 uppercase tracking-[1px]">{item.role}</div>
                <p className="font-mono text-[11px] text-ink leading-[1.7]">{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-12 border-t border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 gap-20">
          <div>
            <div className="font-mono text-[10px] tracking-[4px] text-violet-2 uppercase mb-4">FAQ</div>
            <h2 className="font-display font-black text-4xl text-white mb-6">Common questions.</h2>
            <p className="font-mono text-[13px] text-ink leading-[1.9] mb-8">
              The questions that come up most when builders first encounter NullAgent.
            </p>
            <a href="https://github.com" className="clip-btn inline-block font-mono text-[11px] tracking-[1.5px] uppercase border border-white/[0.1] text-ink hover:text-white px-6 py-3 transition-all">
              Open an issue on GitHub →
            </a>
          </div>
          <div className="space-y-0">
            {FAQ.map((item, i) => (
              <div key={i} className="border-t border-white/[0.06] py-6">
                <div className="flex gap-4 items-start">
                  <span className="font-mono text-[10px] text-dim shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="font-display text-[13px] text-white mb-2 leading-[1.5]">{item.q}</div>
                    <div className="font-mono text-[11px] text-ink leading-[1.8]">{item.a}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-12 border-t border-white/[0.06] text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[800px] h-[400px] rounded-full blur-[120px] top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet/[0.06]" />
        </div>
        <div className="max-w-[600px] mx-auto relative z-10">
          <div className="font-mono text-[10px] tracking-[4px] text-violet-2 uppercase mb-6">Ready?</div>
          <h2 className="font-display font-black text-white mb-6" style={{ fontSize: 'clamp(36px,4vw,56px)' }}>Ready to disappear?</h2>
          <p className="font-mono text-[13px] text-ink mb-10 leading-[1.9]">
            Deploy your agent in minutes. Trade without a trail.
            No one will know you were there.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/deploy" className="clip-btn inline-block font-mono text-[13px] tracking-[2px] uppercase bg-violet hover:bg-violet-2 text-white px-10 py-4 transition-colors">
              Launch NullAgent →
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="clip-btn inline-block font-mono text-[13px] tracking-[2px] uppercase border border-white/[0.1] text-ink hover:text-white px-10 py-4 transition-all">
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] px-12 py-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-4 gap-12 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <polygon points="14,2 25,8 25,20 14,26 3,20 3,8" fill="none" stroke="#7c5cfc" strokeWidth="1.5"/>
                  <polygon points="14,7 20,10.5 20,17.5 14,21 8,17.5 8,10.5" fill="rgba(124,92,252,0.2)" stroke="#a98bff" strokeWidth="1"/>
                  <circle cx="14" cy="14" r="2.5" fill="#b4ff57"/>
                </svg>
                <span className="font-display font-bold text-[13px] tracking-[2px] text-white">NULLAGENT</span>
              </div>
              <p className="font-mono text-[10px] text-dim leading-[1.8]">Autonomous trading agents on Base with zero-trace execution.</p>
              <div className="flex items-center gap-2 mt-4">
                <span className="w-1.5 h-1.5 rounded-full bg-neon pulse" />
                <span className="font-mono text-[10px] text-dim">v0.1.0 · Base mainnet</span>
              </div>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[2px] text-dim uppercase mb-4">Product</div>
              <ul className="space-y-2.5">
                {['Deploy Agent', 'Dashboard', 'Privacy Layers', 'Signal Market'].map(l => (
                  <li key={l}><a href="#" className="font-mono text-[11px] text-dim hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[2px] text-dim uppercase mb-4">Developers</div>
              <ul className="space-y-2.5">
                {[
                  { label: 'GitHub', href: 'https://github.com' },
                  { label: 'Docs', href: '#docs' },
                  { label: 'Conway.tech', href: 'https://docs.conway.tech' },
                  { label: 'x402 Protocol', href: 'https://docs.cdp.coinbase.com/x402' },
                ].map(l => (
                  <li key={l.label}><a href={l.href} className="font-mono text-[11px] text-dim hover:text-white transition-colors">{l.label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-[2px] text-dim uppercase mb-4">On-Chain</div>
              <ul className="space-y-2.5">
                {[
                  { label: 'Basescan', href: 'https://basescan.org' },
                  { label: 'x402.org Ecosystem', href: 'https://x402.org/ecosystem' },
                  { label: 'Base Builder Rewards', href: 'https://base.org/builders' },
                  { label: 'Railgun', href: 'https://railgun.org' },
                ].map(l => (
                  <li key={l.label}><a href={l.href} className="font-mono text-[11px] text-dim hover:text-white transition-colors">{l.label}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-6 flex items-center justify-between">
            <span className="font-mono text-[10px] text-dim">© 2025 NullAgent · MIT License · Built in public.</span>
            <div className="flex gap-6">
              {['Conway.tech', 'x402.org', 'Basescan', 'GitHub'].map(l => (
                <a key={l} href="#" className="font-mono text-[10px] tracking-[1.5px] text-dim hover:text-white transition-colors uppercase">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
