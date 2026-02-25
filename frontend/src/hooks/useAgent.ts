'use client'
import { useState, useCallback, useEffect } from 'react'
import { useWebSocket } from './useWebSocket'
import { api, type StealthWallet, type Trade, type Vault, type Signal, type PrivacyStatus, type Stats } from '@/lib/api'

interface LogEntry {
  text:  string
  level: 'info' | 'success' | 'warn'
  ts:    number
}

export function useAgent(enabled: boolean) {
  const [wallets,      setWallets]      = useState<StealthWallet[]>([])
  const [walletCounts, setWalletCounts] = useState<Record<string, number>>({})
  const [trades,       setTrades]       = useState<Trade[]>([])
  const [vault,        setVault]        = useState<Vault | null>(null)
  const [signals,      setSignals]      = useState<Signal[]>([])
  const [privacy,      setPrivacy]      = useState<PrivacyStatus | null>(null)
  const [stats,        setStats]        = useState<Stats | null>(null)
  const [logs,         setLogs]         = useState<LogEntry[]>([])
  const [loading,      setLoading]      = useState(true)
  const [isDemoMode,   setIsDemoMode]   = useState(false)

  // Add log entry
  const addLog = useCallback((text: string, level: LogEntry['level'] = 'info') => {
    setLogs(prev => [...prev.slice(-99), { text, level, ts: Date.now() }])
  }, [])

  // Handle incoming WS messages
  const handleMessage = useCallback((msg: any) => {
    switch (msg.type) {

      case 'snapshot':
        setWallets(msg.data.wallets || [])
        setWalletCounts(msg.data.walletCounts || {})
        setTrades(msg.data.trades || [])
        setVault(msg.data.vault ? {
          totalEth:   msg.data.vault.total_eth,
          execPool:   String(msg.data.vault.exec_pool),
          gasReserve: String(msg.data.vault.gas_reserve),
          infraUsdc:  String(msg.data.vault.infra_usdc),
          updatedAt:  msg.data.vault.updated_at,
        } : null)
        setSignals(msg.data.signals || [])
        setPrivacy(msg.data.privacy || null)
        setStats(msg.data.stats || null)
        setLoading(false)
        setIsDemoMode(false)
        addLog('Agent connected · Base mainnet · L1 active', 'success')
        break

      case 'wallet_added':
        setWallets(prev => [msg.data, ...prev])
        break

      case 'wallet_counts':
        setWalletCounts(msg.data)
        break

      case 'trade_added':
        setTrades(prev => [msg.data, ...prev])
        break

      case 'trade_confirmed':
        setTrades(prev => prev.map(t => t.id === msg.data.id ? msg.data : t))
        break

      case 'vault_updated':
        setVault(msg.data)
        break

      case 'signal_added':
        setSignals(prev => [msg.data, ...prev.slice(0, 19)])
        break

      case 'stats':
        setStats(msg.data)
        break

      case 'log':
        addLog(msg.data.text, msg.data.level || 'info')
        break
    }
  }, [addLog])

  const { connected: wsConnected, send } = useWebSocket({
    onMessage: handleMessage,
    enabled,
  })

  // Fallback: load from REST API if WS not available after 4s
  useEffect(() => {
    if (!enabled) return

    const timer = setTimeout(async () => {
      if (loading) {
        try {
          const [w, t, v, s, p, st] = await Promise.all([
            api.wallets.list(),
            api.trades.list(),
            api.vault.get(),
            api.signals.list(),
            api.privacy.status(),
            api.stats(),
          ])
          setWallets(w)
          setTrades(t)
          setVault(v)
          setSignals(s)
          setPrivacy(p)
          setStats(st)
          setLoading(false)
          addLog('REST fallback · WebSocket offline · demo data loaded', 'warn')
        } catch {
          // Both WS and REST failed — go full demo mode
          setIsDemoMode(true)
          setLoading(false)
          addLog('Demo mode · backend offline · showing mock data', 'warn')
        }
      }
    }, 4000)

    return () => clearTimeout(timer)
  }, [enabled, loading, addLog])

  // Generate wallet via WS (instant broadcast) or REST (fallback)
  const generateWallet = useCallback(async () => {
    if (wsConnected) {
      send({ type: 'generate_wallet' })
    } else {
      try {
        const res = await api.wallets.pool(1)
        setWallets(prev => [...res.wallets, ...prev])
        addLog(`Stealth wallet generated · ${res.wallets[0]?.address} · ready`, 'success')
      } catch (e) {
        addLog('Wallet generation failed · backend offline', 'warn')
      }
    }
  }, [wsConnected, send, addLog])

  return {
    wallets,
    walletCounts,
    trades,
    vault,
    signals,
    privacy,
    stats,
    logs,
    loading,
    wsConnected,
    isDemoMode,
    generateWallet,
  }
}
