import type { MetadataRoute } from 'next'
import { getDirectory, getAgent, getAllAgentAliases } from '@/lib/agents'

const SITE = 'https://agent.openonion.ai'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
  ]

  const aliases = await getAllAgentAliases()
  for (const alias of aliases) {
    const agent = await getAgent(alias)
    if (!agent) continue
    entries.push({
      url: `${SITE}/${alias}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
    for (const item of [...agent.skills, ...agent.subagents, ...agent.posts]) {
      entries.push({
        url: `${SITE}/${alias}/${item.slug}`,
        lastModified: item.date ? new Date(item.date) : now,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  for (const entry of await getDirectory()) {
    if (entry.alias) continue
    entries.push({
      url: `${SITE}/${entry.address}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    })
  }

  return entries
}
