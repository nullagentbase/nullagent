'use client'
import { useEffect, useRef, useCallback, useState } from 'react'
import { WS_URL } from '@/lib/api'

export interface WsMessage {
  type: string
  data?: any
  ts?:  number
}

interface UseWebSocketOptions {
  onMessage?: (msg: WsMessage) => void
  enabled?:   boolean
}

export function useWebSocket({ onMessage, enabled = true }: UseWebSocketOptions = {}) {
  const ws            = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<NodeJS.Timeout>()
  const [connected, setConnected]   = useState(false)
  const [attempts, setAttempts]     = useState(0)

  const connect = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return
    if (ws.current?.readyState === WebSocket.OPEN) return

    try {
      const socket = new WebSocket(WS_URL)

      socket.onopen = () => {
        console.log('[WS] Connected')
        setConnected(true)
        setAttempts(0)
      }

      socket.onmessage = (event) => {
        try {
          const msg: WsMessage = JSON.parse(event.data)
          onMessage?.(msg)
        } catch (e) {
          console.error('[WS] Parse error:', e)
        }
      }

      socket.onclose = () => {
        setConnected(false)
        console.log('[WS] Disconnected — reconnecting in 3s')
        // Exponential backoff: 3s, 6s, 12s, max 30s
        const delay = Math.min(3000 * Math.pow(2, attempts), 30000)
        reconnectTimer.current = setTimeout(() => {
          setAttempts(a => a + 1)
          connect()
        }, delay)
      }

      socket.onerror = () => {
        socket.close()
      }

      ws.current = socket
    } catch (e) {
      console.error('[WS] Connection failed:', e)
    }
  }, [enabled, onMessage, attempts])

  useEffect(() => {
    connect()
    return () => {
      clearTimeout(reconnectTimer.current)
      ws.current?.close()
    }
  }, [connect])

  const send = useCallback((msg: object) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg))
    }
  }, [])

  return { connected, send }
}
