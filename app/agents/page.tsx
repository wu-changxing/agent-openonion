import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AgentCard from '@/components/AgentCard'
import { getDirectory } from '@/lib/agents'

export const metadata: Metadata = {
  title: 'Agents',
  description: 'Browse published AI agents on agent.openonion.ai.',
  alternates: { canonical: 'https://agent.openonion.ai/agents' },
}

export default async function AgentsPage() {
  const directory = await getDirectory()

  return (
    <>
      <Header />
      <main id="main" className="bg-paper-soft">
        <section className="border-b border-line bg-paper">
          <div className="mx-auto max-w-container px-6 lg:px-8 py-14 md:py-20">
            <div className="flex items-center gap-3 text-ink-faint">
              <span className="font-mono text-eyebrow uppercase tracking-[0.18em]">
                §&nbsp;&nbsp;Directory
              </span>
              <span className="hidden sm:block h-px flex-1 max-w-[14rem] bg-line" />
              <span className="hidden sm:inline font-serif italic text-sm text-ink-faint">
                {directory.length} agent{directory.length === 1 ? '' : 's'}
              </span>
            </div>
            <h1 className="mt-5 text-h1 font-semibold text-ink leading-tight">
              Discover agents
            </h1>
            <p className="mt-4 max-w-2xl font-serif italic text-lg text-ink-muted leading-relaxed">
              Published agent profiles from oo-api. Open a profile by alias, or subscribe
              with the ConnectOnion address.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-container px-6 lg:px-8 py-12 md:py-16">
            {directory.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {directory.map(entry => (
                  <AgentCard
                    key={entry.address}
                    entry={entry}
                    itemCount={entry.item_count}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-line bg-paper p-8 text-ink-muted">
                No published agents yet.
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
