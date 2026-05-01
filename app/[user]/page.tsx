import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { marked } from 'marked'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProfileHeader from '@/components/ProfileHeader'
import ItemCard from '@/components/ItemCard'
import InstallSnippet from '@/components/InstallSnippet'
import { getAgent, getAllAgentAliases, getDirectory } from '@/lib/agents'

type Params = { user: string }

export function generateStaticParams(): Params[] {
  const aliases = getAllAgentAliases()
  const directory = getDirectory()
  // Include both alias and full address routes
  return [
    ...aliases.map(user => ({ user })),
    ...directory.map(d => ({ user: d.address })),
  ]
}

function resolveAlias(userParam: string): string | null {
  if (getAgent(userParam)) return userParam
  const directory = getDirectory()
  const match = directory.find(d => d.address === userParam || d.alias === userParam)
  return match?.alias || null
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { user } = await params
  const alias = resolveAlias(user)
  if (!alias) return { title: 'Not found' }
  const agent = getAgent(alias)
  if (!agent) return { title: 'Not found' }
  return {
    title: `${agent.profile.name} (@${agent.profile.alias})`,
    description: agent.profile.bio,
  }
}

export default async function UserPage({ params }: { params: Promise<Params> }) {
  const { user } = await params
  const alias = resolveAlias(user)
  if (!alias) notFound()
  const agent = getAgent(alias!)
  if (!agent) notFound()

  return (
    <>
      <Header />
      <main id="main">
        <ProfileHeader profile={agent.profile} itemCount={agent.itemCount} />

        <div className="mx-auto max-w-container px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-[1fr,20rem] gap-12">
          <div className="min-w-0">
            {agent.readme ? (
              <section
                className="prose-editorial mb-16"
                dangerouslySetInnerHTML={{ __html: marked.parse(agent.readme.trim()) as string }}
              />
            ) : null}

            {(() => {
              const sections = [
                { numeral: 'I', title: 'Skills', epigraph: 'Reusable capabilities the agent can call on — each one a small unit of expertise.', items: agent.skills },
                { numeral: 'II', title: 'Slash commands', epigraph: 'Single-shot operations triggered by name. Predictable inputs, predictable outputs.', items: agent.commands },
                { numeral: 'III', title: 'Subagents', epigraph: 'Specialised collaborators with their own scope, tools, and tone of voice.', items: agent.subagents },
                { numeral: 'IV', title: 'Posts', epigraph: 'Notes, demos, and stray thoughts published from the workshop floor.', items: agent.posts },
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
              <p className="text-eyebrow uppercase text-ink-faint mb-3">Subscribe</p>
              <InstallSnippet command={`oo subscribe ${agent.profile.alias}`} />
              <p className="mt-3 text-xs text-ink-dim leading-relaxed">
                Installs into Claude Code, Codex, Cursor, Kiro, and OpenClaw — wherever you
                have one. Re-run <code className="text-ink-muted">oo update</code> to refresh.
              </p>
            </div>
            <div>
              <p className="text-eyebrow uppercase text-ink-faint mb-3">Or by address</p>
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
      <div className="flex items-baseline justify-between border-b border-line pb-3 mb-3">
        <h2 className="text-h2 text-ink font-semibold flex items-baseline gap-3">
          <span className="font-mono text-eyebrow text-ink-faint tracking-[0.2em]">§&nbsp;{numeral}</span>
          {title}
        </h2>
        <span className="font-mono text-xs text-ink-faint">{count}</span>
      </div>
      <p className="font-serif italic text-ink-muted max-w-[58ch] mb-6">{epigraph}</p>
      {children}
    </section>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
}
