'use client'

import { useState } from 'react'
import { LuCheck, LuCopy } from 'react-icons/lu'

export default function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const text = copied ? 'Copied' : label

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        } catch {
          /* ignore */
        }
      }}
      className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-2 rounded-md border border-line px-3 text-sm text-ink-muted hover:text-ink hover:border-accent-glow hover:bg-paper-muted transition-colors"
      aria-label={text || 'Copy'}
      title={text || 'Copy'}
    >
      {copied ? <LuCheck className="h-4 w-4 text-green-400" /> : <LuCopy className="h-4 w-4" />}
      {text ? <span>{text}</span> : null}
    </button>
  )
}
