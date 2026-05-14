import Link from 'next/link'
import type { Item } from '@/lib/agents'
import { itemTypeLabel } from '@/lib/agents'

const typeColor: Record<Item['type'], string> = {
  skill:   'text-green-700 border-green-200 bg-green-50',
  command: 'text-blue-700 border-blue-200 bg-blue-50',
  agent:   'text-violet-700 border-violet-200 bg-violet-50',
  post:    'text-orange-700 border-orange-200 bg-orange-50',
}

export default function ItemCard({
  user,
  item,
  showType = false,
}: {
  user: string
  item: Item
  showType?: boolean
}) {
  return (
    <Link
      href={`/${user}/${item.slug}`}
      className="group block min-h-[48px] rounded-lg border border-line bg-paper p-6 transition-colors hover:border-accent-glow hover:bg-paper-soft"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="truncate font-mono text-sm text-ink transition-colors group-hover:text-accent-glow">
          {item.type === 'command' ? '/' : ''}
          {item.name}
        </div>
        {showType ? (
          <span
            className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-mono ${typeColor[item.type]}`}
          >
            {itemTypeLabel(item.type)}
          </span>
        ) : null}
      </div>

      {item.description ? (
        <p className="line-clamp-3 text-sm leading-relaxed text-ink-muted">{item.description}</p>
      ) : null}

      {item.argumentHint ? (
        <div className="mt-4 truncate font-mono text-xs text-ink-dim">
          <span className="text-ink-muted">args: </span>
          {item.argumentHint}
        </div>
      ) : null}
    </Link>
  )
}
