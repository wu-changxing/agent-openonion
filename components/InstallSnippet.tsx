import CopyButton from './CopyButton'

export default function InstallSnippet({
  command,
  caption,
  figure,
}: {
  command: string
  caption?: string
  figure?: string
}) {
  return (
    <figure className="rounded-lg border border-gray-700 bg-gray-800/30 overflow-hidden transition-colors hover:border-purple-400/50 hover:bg-gray-800/50">
      {(caption || figure) ? (
        <figcaption className="flex items-center gap-3 px-4 py-2 border-b border-gray-700">
          {caption ? (
            <span className="font-mono text-xs uppercase text-slate-200 tracking-normal">
              {caption}
            </span>
          ) : null}
          <span className="dot-leader" aria-hidden>
            {'·'.repeat(80)}
          </span>
          {figure ? (
            <span className="font-serif italic text-xs text-slate-200 shrink-0">
              {figure}
            </span>
          ) : null}
        </figcaption>
      ) : null}
      <div className="flex items-start justify-between gap-3 px-4 py-3 font-mono text-sm">
        <code className="text-white leading-relaxed break-all py-3">
          <span className="text-green-400 select-none">$ </span>
          {command}
        </code>
        <CopyButton value={command} />
      </div>
    </figure>
  )
}
