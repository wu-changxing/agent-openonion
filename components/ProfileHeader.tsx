import Image from 'next/image'
import { LuGlobe } from 'react-icons/lu'
import { FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import type { Profile } from '@/lib/agents'
import { shortAddress } from '@/lib/agents'
import CopyButton from './CopyButton'

const linkIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub,
  x: FaXTwitter,
  website: LuGlobe,
}

export default function ProfileHeader({
  profile,
  itemCount,
}: {
  profile: Profile
  itemCount: number
}) {
  return (
    <div className="bg-dots relative border-b border-line bg-paper">
      <div className="mx-auto max-w-container px-4 md:px-6 py-16 md:py-24">
        <div className="mb-8 flex items-center gap-3 text-ink-faint">
          <span className="font-mono text-eyebrow uppercase">
            §&nbsp;&nbsp;Profile
          </span>
          <span className="hidden sm:block h-px flex-1 max-w-[14rem] bg-line" />
          <span className="hidden sm:inline font-serif italic text-sm">
            agent dossier
          </span>
        </div>
        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt={`${profile.name} avatar`}
              width={96}
              height={96}
              className="rounded-lg border border-line"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-line bg-paper-soft font-serif text-2xl italic text-ink">
              {profile.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-ink">{profile.name}</h1>
              {profile.alias ? (
                <span className="font-serif italic text-xl md:text-2xl text-accent-glow">
                  @{profile.alias}
                </span>
              ) : null}
            </div>
            {profile.bio ? (
              <p className="mt-4 max-w-2xl font-serif text-xl italic leading-relaxed text-ink-muted">{profile.bio}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex min-h-[48px] items-center gap-2 rounded-md border border-line bg-paper-soft px-3 font-mono text-sm text-ink-muted">
                <span className="text-accent-glow">●</span>
                {shortAddress(profile.address)}
                <CopyButton value={profile.address} label="" />
              </span>
              {Object.entries(profile.links || {}).map(([key, url]) => {
                const Icon = linkIcon[key] || LuGlobe
                return (
                  <a
                    key={key}
                    href={url}
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-md px-2 text-sm text-ink-muted hover:bg-paper-muted hover:text-accent-glow"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="capitalize">{key}</span>
                  </a>
                )
              })}
              <span className="ml-auto text-sm text-ink-dim">
                <span className="text-ink">{itemCount}</span> published item
                {itemCount === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
