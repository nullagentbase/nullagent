'use client'
import { useState, useCallback } from 'react'
import { api, setAuthHeaders, clearAuthHeaders } from '@/lib/api'
import { BASE_CHAIN, CHAIN_ID_HEX } from '@/lib/config'

export type AuthState = 'idle' | 'connecting' | 'signing' | 'verifying' | 'authenticated' | 'error'

interface AuthData {
  address: string
  signature: string
  shortAddress: string
}

export function useAuth() {
  const [state, setState] = useState<AuthState>('idle')
  const [auth, setAuth] = useState<AuthData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async () => {
    const eth = (window as any).ethereum
    if (!eth) { setError('MetaMask not detected'); return }

    try {
      setState('connecting')
      setError(null)

      // 1. Request accounts
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' })
      const address = accounts[0]

      // 2. Switch to Base
      try {
        await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CHAIN_ID_HEX }] })
      } catch (sw: any) {
        if (sw.code === 4902) {
          await eth.request({ method: 'wallet_addEthereumChain', params: [BASE_CHAIN] })
        }
      }

      // 3. Get nonce from backend
      setState('signing')
      let message: string
      try {
        const nonceRes = await api.auth.nonce(address)
        message = nonceRes.message
      } catch {
        // Demo mode — backend not reachable
        const nonce = `nullagent-auth-${address.toLowerCase()}-${Date.now()}-demo`
        message = `Sign this message to authenticate with NullAgent:\n\n${nonce}`
      }

      // 4. Sign with MetaMask
      const signature: string = await eth.request({ method: 'personal_sign', params: [message, address] })

      // 5. Verify with backend
      setState('verifying')
      try {
        await api.auth.verify(address, signature)
      } catch {
        // Demo mode — proceed anyway
      }

      // 6. Store auth
      setAuthHeaders(address, signature)
      setAuth({ address, signature, shortAddress: address.slice(0, 6) + '...' + address.slice(-4) })
      setState('authenticated')

    } catch (e: any) {
      if (e.code !== 4001) {
        setError(e.message || 'Connection failed')
        setState('error')
      } else {
        setState('idle')
      }
    }
  }, [])

  const disconnect = useCallback(() => {
    clearAuthHeaders()
    setAuth(null)
    setState('idle')
    setError(null)
  }, [])

  return { state, auth, error, connect, disconnect, isAuthenticated: state === 'authenticated' }
}
