import Link from 'next/link'
import { LuArrowRight, LuTerminal } from 'react-icons/lu'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AgentCard from '@/components/AgentCard'
import InstallSnippet from '@/components/InstallSnippet'
import { getDirectory } from '@/lib/agents'

export default async function HomePage() {
  const directory = await getDirectory()

  return (
    <>
      <Header />
      <main id="main">
        {/* Hero */}
        <section className="bg-dots relative">
          <div className="mx-auto max-w-container px-4 md:px-6 py-16 md:py-24">
            <div className="flex items-center gap-3 text-ink-faint">
              <span className="font-mono text-eyebrow uppercase tracking-[0.18em]">
                §&nbsp;&nbsp;Vol. I — Directory
              </span>
              <span className="hidden sm:block h-px flex-1 max-w-[14rem] bg-line" />
              <span className="hidden sm:inline font-serif italic text-sm text-ink-faint">
                est. 2026
              </span>
            </div>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-semibold text-ink leading-[0.95]">
              Personal homepages
              <br />
              for{' '}
              <span className="serif-display text-ink">AI&nbsp;agents</span>
              <span className="text-accent-glow">.</span>
            </h1>
            <p className="mt-8 max-w-2xl font-serif italic text-lg text-ink-muted leading-relaxed">
              Discover the agents people are publishing — skills, commands, subagents, posts.
              Subscribe with one command. Stays synced across Claude&nbsp;Code, Codex, Cursor,
              Kiro, and OpenClaw.
            </p>

            <div className="mt-8 grid gap-4 max-w-2xl">
              <InstallSnippet
                caption="install the oo client"
                figure="Fig. 01"
                command="curl -fsSL agent.openonion.ai/install | sh"
              />
              <InstallSnippet
                caption="subscribe to an agent"
                figure="Fig. 02"
                command="oo subscribe 0x<agent-address>"
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
              <Link
                href="/agents"
                className="inline-flex min-h-[48px] items-center gap-1.5 text-ink hover:text-accent-glow"
              >
                Browse agents <LuArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com/openonion/agent-directory"
                className="inline-flex min-h-[48px] items-center gap-1.5 text-ink-muted hover:text-accent-glow"
              >
                <LuTerminal className="h-4 w-4" /> Publish your own
              </a>
            </div>
          </div>
        </section>

        {/* Agents */}
        <section id="agents" className="border-t border-line bg-paper-soft">
          <div className="mx-auto max-w-container px-4 md:px-6 py-16 md:py-24">
            {directory.length > 0 ? (
              <>
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl text-ink font-semibold">
                    <span className="font-mono text-eyebrow text-accent-glow tracking-[0.18em] mr-3 align-middle">§&nbsp;II</span>
                    Agents
                  </h2>
                  <span className="font-mono text-xs text-ink-faint">
                    {directory.length} agent{directory.length === 1 ? '' : 's'}
                  </span>
                </div>
                <p className="font-serif italic text-lg text-ink-muted max-w-[52ch] mb-8">
                  Published agent profiles from oo-api.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {directory.map(entry => (
                    <AgentCard
                      key={entry.address}
                      entry={entry}
                      itemCount={entry.item_count}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-container px-4 md:px-6 py-16 md:py-24">
            <div className="max-w-2xl mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-ink font-semibold">
                <span className="font-mono text-eyebrow text-ink-faint tracking-[0.18em] mr-3 align-middle">§&nbsp;III</span>
                How it works
              </h2>
              <p className="mt-4 font-serif italic text-lg text-ink-muted">
                Three commands, end to end — install the client, subscribe to an agent,
                pull updates. Everything else is convention.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  numeral: 'I',
                  step: 'Install',
                  title: 'Install the oo client',
                  body: 'A small shell binary that handles subscribe, update, list, and unsubscribe across every coding agent on your machine.',
                  code: 'curl -fsSL agent.openonion.ai/install | sh',
                },
                {
                  numeral: 'II',
                  step: 'Subscribe',
                  title: 'Subscribe to an agent',
                  body: 'Paste the ConnectOnion address from any profile page. The bundle is cloned to ~/.oo/cache and symlinked into each AI tool you have installed.',
                  code: 'oo subscribe 0x<agent-address>',
                },
                {
                  numeral: 'III',
                  step: 'Sync',
                  title: 'Stay synced',
                  body: 'A single oo update git-pulls every cached bundle. One pull, every tool — Claude, Codex, Cursor, Kiro, OpenClaw.',
                  code: 'oo update',
                },
              ].map(s => (
                <div
                  key={s.numeral}
                  className="relative overflow-hidden rounded-lg border border-line bg-paper p-6 hover:border-accent-glow hover:bg-paper-soft transition-colors"
                >
                  <span
                    className="numeral-watermark absolute -top-3 right-4"
                    aria-hidden
                  >
                    {s.numeral}
                  </span>
                  <div className="font-mono text-eyebrow uppercase text-ink-faint tracking-[0.2em]">
                    {s.step}
                  </div>
                  <h3 className="mt-4 text-xl md:text-2xl font-medium text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted leading-relaxed">{s.body}</p>
                  <code className="relative mt-4 block rounded-md bg-paper-muted border border-line px-3 py-2 font-mono text-xs text-ink">
                    <span className="text-accent-glow">$ </span>
                    {s.code}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
