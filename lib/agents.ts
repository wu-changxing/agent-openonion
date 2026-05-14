/**
 * Registry client. Reads published agent metadata from oo-api.
 */

const OO_API_URL =
  (process.env.OO_API_URL || process.env.NEXT_PUBLIC_OO_API_URL || 'https://oo.openonion.ai').replace(/\/$/, '')

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
  sourceName?: string
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
  skills: Item[]
  subagents: Item[]
  posts: Item[]
  itemCount: number
}

export type DirectoryEntry = {
  address: string
  alias: string
  name: string
  tagline: string
  tags: string[]
  item_count?: number
  updated_at?: string
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

// ----- oo-api --------------------------------------------------------------

async function fetchJSON<T>(url: string): Promise<T | null> {
  const res = await fetch(url, FETCH_OPTS)
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

type OoDirectory = {
  agents: Array<{
    address: string
    alias?: string
    name?: string
    tagline?: string
    tags?: string[]
    item_count?: number
    updated_at?: string
  }>
}

type OoProfileResponse = {
  profile: (Partial<Profile> & {
    version?: string
    skills?: Array<{ name: string; description?: string }>
  }) | null
  updated_at?: string | null
}

type OoSkillBodyResponse = {
  name?: string
  description?: string
  body?: string
  error?: string
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item'
}

function toDirectoryEntry(entry: OoDirectory['agents'][number]): DirectoryEntry {
  const alias = entry.alias || entry.address
  return {
    address: entry.address,
    alias,
    name: entry.name || alias,
    tagline: entry.tagline || '',
    tags: entry.tags || [],
    item_count: entry.item_count,
    updated_at: entry.updated_at,
  }
}

function skillMetadataToItem(skill: { name: string; description?: string }): Item {
  return {
    type: 'skill',
    slug: slugify(skill.name),
    name: skill.name,
    sourceName: skill.name,
    description: skill.description || '',
    tags: [],
    frontmatter: {},
  }
}

// ----- public API ----------------------------------------------------------

export async function getDirectory(): Promise<DirectoryEntry[]> {
  const data = await fetchJSON<OoDirectory>(`${OO_API_URL}/api/relay/directory`)
  return data?.agents?.map(toDirectoryEntry) ?? []
}

export async function getAllAgentAliases(): Promise<string[]> {
  return (await getDirectory()).map(a => a.alias).filter(Boolean)
}

export async function getAgent(alias: string): Promise<Agent | null> {
  const directory = await getDirectory()
  const entry = directory.find(a => a.alias === alias || a.address === alias)
  if (!entry) return null

  const data = await fetchJSON<OoProfileResponse>(
    `${OO_API_URL}/api/relay/agents/${encodeURIComponent(entry.address)}/profile`
  )
  if (!data?.profile) return null

  const profile: Profile = {
    address: entry.address,
    alias: data.profile.alias || entry.alias,
    name: data.profile.name || data.profile.alias || entry.name,
    bio: data.profile.bio || entry.tagline,
    avatar: data.profile.avatar || '',
    links: data.profile.links || {},
    tags: data.profile.tags || entry.tags,
  }
  const skills = (data.profile.skills || []).map(skillMetadataToItem)

  return {
    profile,
    skills,
    subagents: [],
    posts: [],
    itemCount: skills.length,
  }
}

async function hydrateSkillBody(address: string, item: Item): Promise<Item> {
  if (item.type !== 'skill') return item
  const skillName = item.sourceName || item.name
  const data = await fetchJSON<OoSkillBodyResponse>(
    `${OO_API_URL}/api/relay/agents/${encodeURIComponent(address)}/skills/${encodeURIComponent(skillName)}`
  )
  if (!data?.body || data.error) return item

  return {
    ...buildItem(data.body, item.slug, 'skill'),
    slug: item.slug,
    sourceName: skillName,
    description: data.description || item.description,
  }
}

export async function getItem(alias: string, slug: string): Promise<{ agent: Agent; item: Item } | null> {
  const agent = await getAgent(alias)
  if (!agent) return null
  const all = [...agent.skills, ...agent.subagents, ...agent.posts]
  const item = all.find(i => i.slug === slug)
  if (!item) return null

  const hydrated = await hydrateSkillBody(agent.profile.address, item)
  return { agent, item: hydrated }
}

export async function getAllItemPaths(): Promise<{ user: string; item: string }[]> {
  const aliases = await getAllAgentAliases()
  const agents = await Promise.all(aliases.map(getAgent))
  const out: { user: string; item: string }[] = []
  for (let i = 0; i < aliases.length; i++) {
    const agent = agents[i]
    if (!agent) continue
    for (const it of [...agent.skills, ...agent.subagents, ...agent.posts]) {
      out.push({ user: aliases[i], item: it.slug })
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
