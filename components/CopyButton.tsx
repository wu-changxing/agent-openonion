'use client'

import { useState } from 'react'
import { LuCheck, LuCopy } from 'react-icons/lu'

export default function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)
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
      className="inline-flex min-h-[48px] items-center gap-2 rounded-md border border-gray-700 px-3 text-sm text-slate-100 hover:text-white hover:border-purple-400 hover:bg-gray-800 transition-colors"
      aria-label={copied ? 'Copied' : label}
    >
      {copied ? <LuCheck className="h-4 w-4 text-green-400" /> : <LuCopy className="h-4 w-4" />}
      <span>{copied ? 'Copied' : label}</span>
    </button>
  )
}
