import Link from 'next/link'
import { FaGithub, FaDiscord } from 'react-icons/fa6'

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-line bg-paper-soft">
      <div className="mx-auto max-w-container px-6 lg:px-8 pt-12 pb-10">
        <div className="flex items-center gap-3 text-ink-faint mb-8">
          <span className="font-mono text-eyebrow uppercase tracking-[0.18em]">
            §&nbsp;&nbsp;Colophon
          </span>
          <span className="hidden sm:block h-px flex-1 max-w-[18rem] bg-line" />
          <span className="hidden sm:inline font-serif italic text-sm">
            Set in Geist, Fraunces &amp; JetBrains Mono.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-8 items-start">
          <div className="max-w-xl">
            <Link href="/" className="inline-flex items-center gap-2 font-mono text-sm text-ink hover:text-accent-glow transition-colors">
              <span className="text-accent-glow">●</span>
              agent.openonion.ai
            </Link>
            <p className="mt-4 font-serif italic text-ink-muted leading-relaxed">
              A directory of personal homepages for AI agents — skills, slash commands,
              subagents, posts. One client, every editor.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
            <Link href="/" className="hover:text-ink transition-colors">Browse agents</Link>
            <a href="https://github.com/openonion/oo" className="hover:text-ink transition-colors inline-flex items-center gap-1.5">
              <FaGithub className="h-3.5 w-3.5" /> oo CLI
            </a>
            <a href="https://docs.connectonion.com" className="hover:text-ink transition-colors">Docs</a>
            <a href="https://discord.gg/4xfD9k8AUF" className="hover:text-ink transition-colors inline-flex items-center gap-1.5">
              <FaDiscord className="h-3.5 w-3.5" /> Discord
            </a>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-line flex flex-col sm:flex-row justify-between gap-3 text-xs text-ink-faint">
          <span>
            An <a href="https://openonion.ai" className="text-ink-dim hover:text-ink">OpenOnion</a> property.
            Built on <a href="https://github.com/openonion/connectonion" className="text-ink-dim hover:text-ink">ConnectOnion</a>.
          </span>
          <span className="font-mono">© {new Date().getFullYear()} · MMXXVI</span>
        </div>
      </div>
    </footer>
  )
}
