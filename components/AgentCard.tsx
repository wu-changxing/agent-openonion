import Link from 'next/link'
import Image from 'next/image'
import { LuArrowUpRight } from 'react-icons/lu'
import type { DirectoryEntry } from '@/lib/agents'
import { shortAddress } from '@/lib/agents'

export default function AgentCard({
  entry,
  itemCount,
  avatar,
}: {
  entry: DirectoryEntry
  itemCount?: number
  avatar?: string
}) {
  return (
    <Link
      href={`/${entry.alias || entry.address}`}
      className="group relative block rounded-xl border border-line bg-paper p-6 transition-all duration-200 hover:border-ink/30 hover:-translate-y-0.5 hover:shadow-[0_2px_0_0_rgba(10,10,10,0.04),0_8px_24px_-12px_rgba(10,10,10,0.18)]"
    >
      <LuArrowUpRight
        className="absolute top-5 right-5 h-4 w-4 text-ink-faint opacity-0 -translate-x-0.5 translate-y-0.5 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-accent-glow"
        aria-hidden
      />
      <div className="flex items-start gap-4">
        {avatar ? (
          <Image
            src={avatar}
            alt={`${entry.name} avatar`}
            width={48}
            height={48}
            className="rounded-full border border-line"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-paper-soft border border-line flex items-center justify-center text-xl text-ink font-serif italic">
            {entry.name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-ink font-medium">{entry.name}</span>
            {entry.alias ? (
              <span className="font-mono text-xs text-ink-dim">@{entry.alias}</span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-ink-muted line-clamp-2 leading-relaxed">{entry.tagline}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3 text-xs text-ink-faint font-mono">
        <span>{shortAddress(entry.address)}</span>
        <span className="dot-leader text-[10px]" aria-hidden>{'·'.repeat(80)}</span>
        {typeof itemCount === 'number' ? (
          <span className="shrink-0">
            {itemCount} item{itemCount === 1 ? '' : 's'}
          </span>
        ) : null}
      </div>

      {entry.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {entry.tags.slice(0, 4).map(tag => (
            <span
              key={tag}
              className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-dim group-hover:border-ink-faint/50 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  )
}
