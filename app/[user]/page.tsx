import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProfileHeader from '@/components/ProfileHeader'
import ItemCard from '@/components/ItemCard'
import InstallSnippet from '@/components/InstallSnippet'
import AgentPrompt from '@/components/AgentPrompt'
import { getAgent, getDirectory } from '@/lib/agents'

type Params = { user: string }

// URL paths are addresses only — aliases are display-only (a paid-tier
// feature later), so we never emit alias-shaped routes.
export async function generateStaticParams(): Promise<Params[]> {
  const directory = await getDirectory()
  return directory.map(d => ({ user: d.address }))
}

async function isKnownAddress(userParam: string): Promise<boolean> {
  const directory = await getDirectory()
  return directory.some(d => d.address === userParam)
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { user } = await params
  if (!(await isKnownAddress(user))) return { title: 'Not found' }
  const agent = await getAgent(user)
  if (!agent) return { title: 'Not found' }
  const title = `${agent.profile.name} (@${agent.profile.alias})`
  const description =
    agent.profile.bio ||
    `${agent.profile.name}'s public AI-agent homepage — ${agent.itemCount} published skills, commands, and subagents on agent.openonion.ai.`
  const canonical = `https://agent.openonion.ai/${agent.profile.address}`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'profile',
      images: agent.profile.avatar ? [{ url: agent.profile.avatar }] : undefined,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function UserPage({ params }: { params: Promise<Params> }) {
  const { user } = await params
  if (!(await isKnownAddress(user))) notFound()
  const agent = await getAgent(user)
  if (!agent) notFound()

  return (
    <>
      <Header />
      <main id="main">
        <ProfileHeader profile={agent.profile} itemCount={agent.itemCount} />

        <div className="mx-auto max-w-container px-4 md:px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr),18rem] gap-12">
          <div className="min-w-0">
            {(() => {
              const sections = [
                { numeral: 'I', title: 'Skills', epigraph: 'Reusable capabilities the agent can call on — each one a small unit of expertise.', items: agent.skills },
                { numeral: 'II', title: 'Subagents', epigraph: 'Specialised collaborators with their own scope, tools, and tone of voice.', items: agent.subagents },
                { numeral: 'III', title: 'Posts', epigraph: 'Notes, demos, and stray thoughts published from the workshop floor.', items: agent.posts },
              ]
              return sections
                .filter(s => s.items.length > 0)
                .map(s => (
                  <Section key={s.title} numeral={s.numeral} title={s.title} count={s.items.length} epigraph={s.epigraph}>
                    {s.title === 'Posts' ? (
                      <div className="space-y-3">
                        {s.items.map(item => (
                          <ItemCard key={item.slug} user={agent.profile.address} item={item} />
                        ))}
                      </div>
                    ) : (
                      <Grid>
                        {s.items.map(item => (
                          <ItemCard key={item.slug} user={agent.profile.address} item={item} />
                        ))}
                      </Grid>
                    )}
                  </Section>
                ))
            })()}
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start space-y-8">
            <div>
              <p className="mb-4 text-eyebrow uppercase text-ink-faint">§&nbsp;&nbsp;Subscribe</p>
              <InstallSnippet
                command={`oo subscribe ${agent.profile.address}`}
                caption="in your shell"
                figure="Fig. 01"
              />
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                Installs into Claude Code, Codex, Cursor, Kiro, and OpenClaw — wherever you
                have one. Re-run <code className="text-ink">oo update</code> to refresh.
              </p>
            </div>
            <div>
              <p className="mb-4 text-eyebrow uppercase text-ink-faint">§&nbsp;&nbsp;Ask your agent</p>
              <AgentPrompt
                prompt={`/oo subscribe ${agent.profile.address}`}
                caption="paste into the chat"
                figure="Fig. 02"
              />
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                Works in any agent that has the <code className="text-ink">oo</code> skill
                installed — it resolves the address and runs the subscribe flow for you.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Section({
  numeral,
  title,
  count,
  epigraph,
  children,
}: {
  numeral: string
  title: string
  count: number
  epigraph: string
  children: React.ReactNode
}) {
  return (
    <section className="relative mb-16">
      <span
        aria-hidden
        className="numeral-watermark absolute -top-10 right-2 hidden md:block translate-x-2"
      >
        {numeral}
      </span>
      <div className="relative mb-4 flex items-baseline justify-between border-b border-line pb-4">
        <h2 className="flex items-baseline gap-3 text-2xl md:text-3xl lg:text-4xl font-semibold text-ink">
          <span className="font-mono text-eyebrow text-ink-faint">§&nbsp;{numeral}</span>
          {title}
        </h2>
        <span className="font-mono text-xs text-ink-faint">{count}</span>
      </div>
      <p className="mb-6 max-w-[58ch] font-serif text-lg italic text-ink-muted">{epigraph}</p>
      {children}
    </section>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
}
