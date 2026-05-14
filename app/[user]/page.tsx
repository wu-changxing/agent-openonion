import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProfileHeader from '@/components/ProfileHeader'
import ItemCard from '@/components/ItemCard'
import InstallSnippet from '@/components/InstallSnippet'
import { getAgent, getAllAgentAliases, getDirectory } from '@/lib/agents'

type Params = { user: string }

export async function generateStaticParams(): Promise<Params[]> {
  const aliases = await getAllAgentAliases()
  const directory = await getDirectory()
  return [
    ...aliases.map(user => ({ user })),
    ...directory.map(d => ({ user: d.address })),
  ]
}

async function resolveAlias(userParam: string): Promise<string | null> {
  const directory = await getDirectory()
  const match = directory.find(d => d.address === userParam || d.alias === userParam)
  return match?.alias || null
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { user } = await params
  const alias = await resolveAlias(user)
  if (!alias) return { title: 'Not found' }
  const agent = await getAgent(alias)
  if (!agent) return { title: 'Not found' }
  const title = `${agent.profile.name} (@${agent.profile.alias})`
  const description =
    agent.profile.bio ||
    `${agent.profile.name}'s public AI-agent homepage — ${agent.itemCount} published skills, commands, and subagents on agent.openonion.ai.`
  const canonical = `https://agent.openonion.ai/${agent.profile.alias}`
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
  const alias = await resolveAlias(user)
  if (!alias) notFound()
  const agent = await getAgent(alias!)
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
                          <ItemCard key={item.slug} user={agent.profile.alias} item={item} />
                        ))}
                      </div>
                    ) : (
                      <Grid>
                        {s.items.map(item => (
                          <ItemCard key={item.slug} user={agent.profile.alias} item={item} />
                        ))}
                      </Grid>
                    )}
                  </Section>
                ))
            })()}
          </div>

          <aside className="lg:sticky lg:top-20 lg:self-start space-y-6">
            <div>
              <p className="text-xs uppercase text-slate-200 mb-4">Subscribe</p>
              <InstallSnippet command={`oo subscribe ${agent.profile.alias}`} />
              <p className="mt-4 text-sm text-slate-100 leading-relaxed">
                Installs into Claude Code, Codex, Cursor, Kiro, and OpenClaw — wherever you
                have one. Re-run <code className="text-white">oo update</code> to refresh.
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-200 mb-4">Or by address</p>
              <InstallSnippet command={`oo subscribe ${agent.profile.address}`} />
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
    <section className="mb-16">
      <div className="flex items-baseline justify-between border-b border-gray-700 pb-4 mb-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl text-white font-bold flex items-baseline gap-3">
          <span className="font-mono text-xs text-slate-200 tracking-normal">§&nbsp;{numeral}</span>
          {title}
        </h2>
        <span className="font-mono text-xs text-slate-200">{count}</span>
      </div>
      <p className="font-serif italic text-lg text-slate-100 max-w-[58ch] mb-6">{epigraph}</p>
      {children}
    </section>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
}
