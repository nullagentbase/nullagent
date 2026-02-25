'use client'
import { useEffect, useRef } from 'react'
import type { LogLine } from '@/hooks/useAgent'

interface Props {
  logs: LogLine[]
  className?: string
}

const levelClass: Record<string, string> = {
  success: 'text-neon',
  error:   'text-warn',
  warn:    'text-gold',
  info:    'text-ink',
}

export function LiveTerminal({ logs, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [logs])

  return (
    <div
      ref={ref}
      className={`font-mono text-[11px] leading-[1.8] overflow-y-auto bg-deep border border-white/[0.06] p-4 ${className}`}
    >
      {logs.map((line, i) => (
        <div key={i} className="flex gap-2">
          <span className="text-dim select-none">{'// '}</span>
          <span className={levelClass[line.level] ?? 'text-ink'}>{line.message}</span>
        </div>
      ))}
      {logs.length === 0 && (
        <div className="text-dim">Waiting for agent...</div>
      )}
      <div className="flex gap-2">
        <span className="text-dim">{'// '}</span>
        <span className="text-violet-2 animate-pulse">▋</span>
      </div>
    </div>
  )
}
