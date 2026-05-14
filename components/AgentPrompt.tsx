import { LuSparkle } from 'react-icons/lu'
import CopyButton from './CopyButton'

/**
 * A snippet meant to be pasted into a coding agent's chat (Claude Code,
 * Codex, Cursor, …) — visually distinct from InstallSnippet (which is a
 * shell command). The body shows the slash-command prompt with a
 * sparkle glyph instead of a `$` shell prompt, and the command is
 * rendered as natural-language-shaped text (no break-all on hex).
 */
export default function AgentPrompt({
  prompt,
  caption,
  figure,
}: {
  prompt: string
  caption?: string
  figure?: string
}) {
  return (
    <figure className="overflow-hidden rounded-lg border border-line bg-paper transition-colors hover:border-accent-glow hover:bg-paper-soft">
      {(caption || figure) ? (
        <figcaption className="flex items-center gap-3 border-b border-line px-4 py-2">
          {caption ? (
            <span className="shrink-0 whitespace-nowrap font-mono text-xs uppercase text-ink-dim">
              {caption}
            </span>
          ) : null}
          <span className="dot-leader" aria-hidden>
            {'·'.repeat(80)}
          </span>
          {figure ? (
            <span className="shrink-0 font-serif italic text-xs text-ink-dim">
              {figure}
            </span>
          ) : null}
        </figcaption>
      ) : null}
      <div className="flex items-start justify-between gap-3 px-4 py-3 font-mono text-sm">
        <p className="break-all py-3 leading-relaxed text-ink">
          <LuSparkle
            aria-hidden
            className="mr-2 inline-block h-3.5 w-3.5 -translate-y-px text-accent-glow"
          />
          {prompt}
        </p>
        <CopyButton value={prompt} />
      </div>
    </figure>
  )
}
