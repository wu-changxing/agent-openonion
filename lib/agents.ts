/**
 * Registry client. Reads agent metadata from a remote source keyed by alias.
 *
 * Source of truth: https://github.com/openonion/agent-directory
 * Default fetch URL: https://raw.githubusercontent.com/openonion/agent-directory/main
 *
 * Override with AGENT_REGISTRY_URL to point at a different host (e.g. an
 * oo-api endpoint once it exists). The address (Ed25519 public key) in each
 * directory entry is the canonical key — alias is the human-readable shortcut.
 */

const REGISTRY_URL =
  process.env.AGENT_REGISTRY_URL ||
  'https://raw.githubusercontent.com/openonion/agent-directory/main'

const FETCH_OPTS: RequestInit = {
  // Cache during build, revalidate hourly when running on a server.
  next: { revalidate: 3600 },
}

export type ItemType = 'skill' | 'command' | 'agent' | 'post'

export type Item = {
  type: ItemType
  slug: string
  name: string
  description: string
  argumentHint?: string
  allowedTools?: string
  date?: string
  tags: string[]
  frontmatter: Record<string, string>
}

export type Profile = {
  address: string
  alias: string
  name: string
  bio: string
  avatar: string
  links: Record<string, string>
  tags: string[]
}

export type Agent = {
  profile: Profile
  readme: string
  skills: Item[]
  commands: Item[]
  subagents: Item[]
  posts: Item[]
  itemCount: number
}

export type DirectoryEntry = {
  address: string
  alias: string
  name: string
  tagline: string
  repo: string
  ref: string
  tags: string[]
  featured: boolean
}

export type AgentManifest = {
  profile: Profile
  readme: string
  skills: string[]
  commands: string[]
  subagents: string[]
  posts: string[]
}

// ----- frontmatter (tiny, no dependency) -----------------------------------

function parseFrontmatter(raw: string): { fm: Record<string, string>; body: string } {
  if (!raw.startsWith('---')) return { fm: {}, body: raw }
  const end = raw.indexOf('\n---', 3)
  if (end < 0) return { fm: {}, body: raw }
  const block = raw.slice(3, end).trim()
  const body = raw.slice(end + 4).replace(/^\n+/, '')
  const fm: Record<string, string> = {}
  for (const line of block.split('\n')) {
    const colon = line.indexOf(':')
    if (colon < 0) continue
    const key = line.slice(0, colon).trim()
    let value = line.slice(colon + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (key) fm[key] = value
  }
  return { fm, body }
}

function buildItem(raw: string, slug: string, type: ItemType): Item {
  const { fm, body } = parseFrontmatter(raw)
  const tags = (fm.tags || '').replace(/[\[\]]/g, '').split(',').map(t => t.trim()).filter(Boolean)
  let description = fm.description || ''
  if (!description && type === 'post') {
    description = body.split('\n').find(l => l.trim() && !l.startsWith('#'))?.trim() || ''
  }
  return {
    type,
    slug,
    name: fm.name || fm.title || slug,
    description,
    argumentHint: fm['argument-hint'],
    allowedTools: fm['allowed-tools'],
    date: fm.date,
    tags,
    frontmatter: fm,
  }
}

// ----- registry fetchers ---------------------------------------------------

async function fetchText(url: string): Promise<string | null> {
  const res = await fetch(url, FETCH_OPTS)
  if (!res.ok) return null
  return res.text()
}

async function fetchJSON<T>(url: string): Promise<T | null> {
  const res = await fetch(url, FETCH_OPTS)
  if (!res.ok) return null
  return res.json() as Promise<T>
}

/**
 * Manifest lists which item slugs exist for an agent. The registry repo
 * surfaces this via a manifest.json next to profile.json. To avoid having to
 * commit a manifest, we shell out to the GitHub Trees API for the agent's
 * subdirectories and treat anything ending in .md as an item.
 */
async function fetchAgentItemSlugs(alias: string, dir: string): Promise<string[]> {
  // raw.githubusercontent.com doesn't list directories. Use the GitHub
  // contents API for the registry repo instead.
  const apiUrl = `https://api.github.com/repos/openonion/agent-directory/contents/agents/${alias}/${dir}`
  const res = await fetch(apiUrl, {
    ...FETCH_OPTS,
    headers: process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {},
  })
  if (!res.ok) return []
  const list = (await res.json()) as Array<{ name: string; type: string }>
  return list
    .filter(e => e.type === 'file' && e.name.endsWith('.md'))
    .map(e => e.name.replace(/\.md$/, ''))
}

async function fetchItem(alias: string, dir: string, slug: string, type: ItemType): Promise<Item | null> {
  const text = await fetchText(`${REGISTRY_URL}/agents/${alias}/${dir}/${slug}.md`)
  if (!text) return null
  return buildItem(text, slug, type)
}

async function fetchItems(alias: string, dir: string, type: ItemType): Promise<Item[]> {
  const slugs = await fetchAgentItemSlugs(alias, dir)
  const items = await Promise.all(slugs.map(s => fetchItem(alias, dir, s, type)))
  return items.filter((x): x is Item => Boolean(x))
}

// ----- public API ----------------------------------------------------------

export async function getDirectory(): Promise<DirectoryEntry[]> {
  const data = await fetchJSON<{ agents: DirectoryEntry[] }>(`${REGISTRY_URL}/directory.json`)
  return data?.agents ?? []
}

export async function getAllAgentAliases(): Promise<string[]> {
  return (await getDirectory()).map(a => a.alias).filter(Boolean)
}

export async function getAgent(alias: string): Promise<Agent | null> {
  const profile = await fetchJSON<Profile>(`${REGISTRY_URL}/agents/${alias}/profile.json`)
  if (!profile) return null

  const [readme, skills, commands, subagents, posts] = await Promise.all([
    fetchText(`${REGISTRY_URL}/agents/${alias}/README.md`).then(t => t ?? ''),
    fetchItems(alias, 'skills', 'skill'),
    fetchItems(alias, 'commands', 'command'),
    fetchItems(alias, 'agents', 'agent'),
    fetchItems(alias, 'posts', 'post'),
  ])

  posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  return {
    profile,
    readme,
    skills,
    commands,
    subagents,
    posts,
    itemCount: skills.length + commands.length + subagents.length,
  }
}

export async function getItem(alias: string, slug: string): Promise<{ agent: Agent; item: Item } | null> {
  const agent = await getAgent(alias)
  if (!agent) return null
  const all = [...agent.skills, ...agent.commands, ...agent.subagents, ...agent.posts]
  const item = all.find(i => i.slug === slug)
  return item ? { agent, item } : null
}

export async function getAllItemPaths(): Promise<{ user: string; item: string }[]> {
  const aliases = await getAllAgentAliases()
  const out: { user: string; item: string }[] = []
  for (const alias of aliases) {
    const agent = await getAgent(alias)
    if (!agent) continue
    for (const i of [...agent.skills, ...agent.commands, ...agent.subagents, ...agent.posts]) {
      out.push({ user: alias, item: i.slug })
    }
  }
  return out
}

export function shortAddress(address: string): string {
  if (!address.startsWith('0x') || address.length < 16) return address
  return `${address.slice(0, 10)}…${address.slice(-4)}`
}

export function itemTypeLabel(type: ItemType): string {
  switch (type) {
    case 'skill': return 'Skill'
    case 'command': return 'Command'
    case 'agent': return 'Subagent'
    case 'post': return 'Post'
  }
}

export function itemInstallTarget(type: ItemType, alias: string, slug: string): string {
  switch (type) {
    case 'skill':   return `~/.claude/skills/${alias}/${slug}/SKILL.md`
    case 'command': return `~/.claude/commands/${alias}/${slug}.md`
    case 'agent':   return `~/.claude/agents/${alias}/${slug}.md`
    case 'post':    return ''
  }
}
