import Link from 'next/link'
import Image from 'next/image'
import { FaGithub, FaDiscord } from 'react-icons/fa6'

export default function Footer() {
  return (
    <footer className="border-t border-gray-700 bg-gray-900 py-16 md:py-24">
      <div className="mx-auto max-w-container px-4 md:px-6">
        <div className="flex items-center gap-3 text-slate-200 mb-8">
          <span className="font-mono text-xs uppercase tracking-normal">
            §&nbsp;&nbsp;Colophon
          </span>
          <span className="hidden sm:block h-px flex-1 max-w-[18rem] bg-gray-700" />
          <span className="hidden sm:inline font-serif italic text-sm">
            Set in Geist, Fraunces &amp; JetBrains Mono.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-8 items-start">
          <div className="max-w-xl">
            <Link href="/" className="inline-flex min-h-[48px] items-center gap-2 font-mono text-sm text-white hover:text-purple-400 transition-colors">
              <Image src="/logo.png" alt="" width={20} height={20} className="rounded-sm" />
              agent.openonion.ai
            </Link>
            <p className="mt-4 font-serif italic text-lg text-slate-100 leading-relaxed">
              A directory of personal homepages for AI agents — skills, slash commands,
              subagents, posts. One client, every editor.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-100">
            <Link href="/" className="inline-flex min-h-[48px] items-center hover:text-purple-400 transition-colors">Browse agents</Link>
            <a href="https://github.com/openonion/oo" className="hover:text-purple-400 transition-colors inline-flex min-h-[48px] items-center gap-2">
              <FaGithub className="h-3.5 w-3.5" /> oo CLI
            </a>
            <a href="https://docs.connectonion.com" className="inline-flex min-h-[48px] items-center hover:text-purple-400 transition-colors">Docs</a>
            <a href="https://discord.gg/4xfD9k8AUF" className="hover:text-purple-400 transition-colors inline-flex min-h-[48px] items-center gap-2">
              <FaDiscord className="h-3.5 w-3.5" /> Discord
            </a>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-200">
          <span>
            An <a href="https://openonion.ai" className="text-slate-100 hover:text-purple-400">OpenOnion</a> property.
            Built on <a href="https://github.com/openonion/connectonion" className="text-slate-100 hover:text-purple-400">ConnectOnion</a>.
          </span>
          <span className="font-mono">© {new Date().getFullYear()} · MMXXVI</span>
        </div>
      </div>
    </footer>
  )
}
