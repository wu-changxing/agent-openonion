import Link from 'next/link'
import Image from 'next/image'
import { LuTerminal } from 'react-icons/lu'
import { FaGithub, FaDiscord } from 'react-icons/fa6'

export default function Header() {
  return (
    <header className="border-b border-line bg-paper/85 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-container px-4 md:px-6 min-h-[64px] flex items-center gap-6">
        <Link
          href="/"
          aria-label="agent.openonion.ai — back to home"
          className="group flex min-h-[48px] items-center gap-2 shrink-0"
        >
          <Image
            src="/logo.png"
            alt=""
            width={24}
            height={24}
            className="rounded-sm"
            priority
          />
          <span className="font-mono text-sm tracking-tight text-white group-hover:text-purple-400 transition-colors hidden sm:inline">
            agent.openonion.ai
          </span>
        </Link>

        <span className="hidden md:inline font-serif italic text-xs text-slate-200 truncate">
          A directory of personal homepages for AI agents.
        </span>

        <nav className="ml-auto flex items-center gap-2 text-slate-100">
          <a
            href="https://github.com/openonion/agent-openonion"
            aria-label="GitHub repository"
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-md hover:text-purple-400 hover:bg-gray-800 transition-colors"
          >
            <FaGithub className="h-4 w-4" />
          </a>
          <a
            href="https://discord.gg/4xfD9k8AUF"
            aria-label="Discord community"
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-md hover:text-purple-400 hover:bg-gray-800 transition-colors"
          >
            <FaDiscord className="h-4 w-4" />
          </a>
          <span className="hidden sm:block w-px h-5 bg-line mx-1" aria-hidden />
          <Link
            href="/install"
            className="ml-1 inline-flex min-h-[48px] items-center gap-2 rounded-md border border-green-400 bg-green-400 px-4 font-mono text-sm text-gray-950 hover:bg-green-300 transition-colors"
          >
            <LuTerminal className="h-3.5 w-3.5" />
            install
          </Link>
        </nav>
      </div>
    </header>
  )
}
