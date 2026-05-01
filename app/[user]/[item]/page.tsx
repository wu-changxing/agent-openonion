import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { LuArrowLeft, LuLock } from 'react-icons/lu'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import InstallSnippet from '@/components/InstallSnippet'
import {
  getItem,
  getAllItemPaths,
  itemTypeLabel,
  itemInstallTarget,
} from '@/lib/agents'

type Params = { user: string; item: string }

export async function generateStaticParams(): Promise<Params[]> {
  return getAllItemPaths()
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { user, item: slug } = await params
  const found = await getItem(user, slug)
  if (!found) return { title: 'Not found' }
  const { agent, item } = found
  const title = `${item.type === 'command' ? '/' : ''}${item.name} · @${agent.profile.alias}`
  const description =
    item.description ||
    `${itemTypeLabel(item.type)} published by ${agent.profile.name} on agent.openonion.ai. Subscribe with: oo subscribe ${agent.profile.alias}`
  const canonical = `https://agent.openonion.ai/${agent.profile.alias}/${item.slug}`
  return {
    title,
    description,
    keywords: item.tags,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      authors: [agent.profile.name],
      publishedTime: item.date,
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function ItemPage({ params }: { params: Promise<Params> }) {
  const { user, item: slug } = await params
  const found = await getItem(user, slug)
  if (!found) notFound()
  const { agent, item } = found
  const target = itemInstallTarget(item.type, agent.profile.alias, item.slug)

  return (
    <>
      <Header />
      <main id="main">
        <div className="mx-auto max-w-container px-6 lg:px-8 py-10">
          <Link
            href={`/${agent.profile.alias}`}
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
          >
            <LuArrowLeft className="h-4 w-4" /> {agent.profile.name}
          </Link>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr,20rem] gap-12">
            <div className="min-w-0">
              <div className="flex items-center gap-3 text-ink-faint mb-6">
                <span className="font-mono text-eyebrow uppercase tracking-[0.2em]">
                  §&nbsp;&nbsp;{itemTypeLabel(item.type)}
                </span>
                <span className="hidden sm:block h-px flex-1 max-w-[10rem] bg-line" />
                {item.date ? (
                  <span className="font-serif italic text-sm text-ink-faint">{item.date}</span>
                ) : null}
                <span className="font-mono text-xs text-ink-faint">{item.slug}.md</span>
              </div>
              <h1 className="text-h1 font-semibold text-ink break-words leading-[1.05]">
                {item.type === 'command' ? <span className="text-accent-glow">/</span> : ''}
                {item.name}
              </h1>
              {item.description ? (
                <p className="mt-4 font-serif italic text-ink-muted text-lg leading-relaxed max-w-[58ch]">{item.description}</p>
              ) : null}

              {(item.argumentHint || item.allowedTools) ? (
                <dl className="mt-8 grid grid-cols-1 sm:grid-cols-[max-content,1fr] gap-x-6 gap-y-2 border-t border-b border-line py-4 font-mono text-sm">
                  {item.argumentHint ? (
                    <>
                      <dt className="text-ink-faint uppercase text-xs tracking-wider">arguments</dt>
                      <dd className="text-ink">{item.argumentHint}</dd>
                    </>
                  ) : null}
                  {item.allowedTools ? (
                    <>
                      <dt className="text-ink-faint uppercase text-xs tracking-wider">allowed-tools</dt>
                      <dd className="text-ink">{item.allowedTools}</dd>
                    </>
                  ) : null}
                </dl>
              ) : null}

              <div className="mt-12 rounded-lg border border-dashed border-line bg-paper-soft px-6 py-8 max-w-[58ch]">
                <div className="flex items-start gap-3 text-ink-muted">
                  <LuLock className="h-4 w-4 mt-0.5 text-ink-faint shrink-0" aria-hidden />
                  <div>
                    <p className="font-serif italic">
                      Contents stay with the protocol — not the website.
                    </p>
                    <p className="mt-2 text-sm text-ink-dim leading-relaxed">
                      The website lists what is published; the bundle is fetched and verified
                      through the <span className="font-mono">oo</span> client against the
                      author&apos;s ConnectOnion address. Subscribe to install the full {itemTypeLabel(item.type).toLowerCase()}
                      {' '}locally.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-20 lg:self-start space-y-6">
              {item.type !== 'post' ? (
                <>
                  <div>
                    <p className="text-eyebrow uppercase text-ink-faint mb-3">Subscribe to get this</p>
                    <InstallSnippet command={`oo subscribe ${agent.profile.alias}`} />
                  </div>
                  {target ? (
                    <div>
                      <p className="text-eyebrow uppercase text-ink-faint mb-3">Lands at</p>
                      <code className="block rounded-md border border-line bg-paper-soft px-3 py-2 font-mono text-xs text-ink-muted break-all">
                        {target}
                      </code>
                    </div>
                  ) : null}
                </>
              ) : null}

              {item.tags?.length ? (
                <div>
                  <p className="text-eyebrow uppercase text-ink-faint mb-3">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-dim"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <p className="text-eyebrow uppercase text-ink-faint mb-3">Author</p>
                <Link
                  href={`/${agent.profile.alias}`}
                  className="block rounded-lg border border-line bg-paper-soft p-4 hover:bg-paper-muted hover:border-ink-faint/40 transition-colors"
                >
                  <div className="text-ink font-medium">{agent.profile.name}</div>
                  <div className="font-mono text-xs text-ink-dim mt-1">
                    @{agent.profile.alias}
                  </div>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
