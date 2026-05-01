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
    <figure className="rounded-lg border border-line bg-paper-soft overflow-hidden transition-colors hover:border-ink-faint/50">
      {(caption || figure) ? (
        <figcaption className="flex items-center gap-3 px-4 py-2 border-b border-line">
          {caption ? (
            <span className="font-mono text-eyebrow uppercase text-ink-faint tracking-[0.18em]">
              {caption}
            </span>
          ) : null}
          <span className="dot-leader" aria-hidden>
            {'·'.repeat(80)}
          </span>
          {figure ? (
            <span className="font-serif italic text-xs text-ink-faint shrink-0">
              {figure}
            </span>
          ) : null}
        </figcaption>
      ) : null}
      <div className="flex items-start justify-between gap-3 px-4 py-3 font-mono text-sm">
        <code className="text-ink leading-relaxed break-all">
          <span className="text-accent-glow select-none">$ </span>
          {command}
        </code>
        <CopyButton value={command} />
      </div>
    </figure>
  )
}
