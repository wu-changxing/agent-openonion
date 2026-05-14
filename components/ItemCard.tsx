import Link from 'next/link'
import type { Item } from '@/lib/agents'
import { itemTypeLabel } from '@/lib/agents'

const typeColor: Record<Item['type'], string> = {
  skill:   'text-green-400 border-green-400/40 bg-green-400/10',
  command: 'text-blue-400 border-blue-400/40 bg-blue-400/10',
  agent:   'text-purple-400 border-purple-400/40 bg-purple-400/10',
  post:    'text-orange-400 border-orange-400/40 bg-orange-400/10',
}

export default function ItemCard({ user, item }: { user: string; item: Item }) {
  return (
    <Link
      href={`/${user}/${item.slug}`}
      className="group block min-h-[48px] rounded-lg border border-gray-700 bg-gray-800/30 hover:bg-gray-800/50 hover:border-purple-400/50 transition-colors p-6"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="font-mono text-sm text-white group-hover:text-purple-400 transition-colors truncate">
          {item.type === 'command' ? '/' : ''}
          {item.name}
        </div>
        <span
          className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-mono ${typeColor[item.type]}`}
        >
          {itemTypeLabel(item.type)}
        </span>
      </div>

      {item.description ? (
        <p className="text-sm text-slate-100 line-clamp-3">{item.description}</p>
      ) : null}

      {item.argumentHint ? (
        <div className="mt-4 font-mono text-xs text-slate-200 truncate">
          <span className="text-slate-200">args: </span>
          {item.argumentHint}
        </div>
      ) : null}
    </Link>
  )
}
