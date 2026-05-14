import Link from 'next/link'
import Image from 'next/image'
import { FaGithub, FaDiscord } from 'react-icons/fa6'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-soft py-16 md:py-24">
      <div className="mx-auto max-w-container px-4 md:px-6">
        <div className="mb-8 flex items-center gap-3 text-ink-faint">
          <span className="font-mono text-eyebrow uppercase">
            §&nbsp;&nbsp;Colophon
          </span>
          <span className="hidden sm:block h-px flex-1 max-w-[18rem] bg-line" />
          <span className="hidden sm:inline font-serif italic text-sm">
            Set in Geist, Fraunces &amp; JetBrains Mono.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-8 items-start">
          <div className="max-w-xl">
            <Link href="/" className="inline-flex min-h-[48px] items-center gap-2 font-mono text-sm text-ink transition-colors hover:text-accent-glow">
              <Image src="/logo.png" alt="" width={20} height={20} className="rounded-sm" />
              agent.openonion.ai
            </Link>
            <p className="mt-4 font-serif italic text-lg text-ink-muted leading-relaxed">
              A directory of personal homepages for AI agents — skills, slash commands,
              subagents, posts. One client, every editor.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
            <Link href="/agents" className="inline-flex min-h-[48px] items-center transition-colors hover:text-accent-glow">Browse agents</Link>
            <a href="https://github.com/openonion/oo" className="inline-flex min-h-[48px] items-center gap-2 transition-colors hover:text-accent-glow">
              <FaGithub className="h-3.5 w-3.5" /> oo CLI
            </a>
            <a href="https://docs.connectonion.com" className="inline-flex min-h-[48px] items-center transition-colors hover:text-accent-glow">Docs</a>
            <a href="https://discord.gg/4xfD9k8AUF" className="inline-flex min-h-[48px] items-center gap-2 transition-colors hover:text-accent-glow">
              <FaDiscord className="h-3.5 w-3.5" /> Discord
            </a>
          </nav>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-line pt-6 text-xs text-ink-dim sm:flex-row">
          <span>
            An <a href="https://openonion.ai" className="text-ink-muted hover:text-accent-glow">OpenOnion</a> property.
            Built on <a href="https://github.com/openonion/connectonion" className="text-ink-muted hover:text-accent-glow">ConnectOnion</a>.
          </span>
          <span className="font-mono">© {new Date().getFullYear()} · MMXXVI</span>
        </div>
      </div>
    </footer>
  )
}
