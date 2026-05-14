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
    <div className="border-b border-gray-700 bg-gray-900">
      <div className="mx-auto max-w-container px-4 md:px-6 py-16 md:py-24">
        <div className="flex items-center gap-3 text-slate-200 mb-8">
          <span className="font-mono text-xs uppercase tracking-normal">
            §&nbsp;&nbsp;Profile
          </span>
          <span className="hidden sm:block h-px flex-1 max-w-[14rem] bg-gray-700" />
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
              className="rounded-lg border border-gray-700"
            />
          ) : (
            <div className="h-24 w-24 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl text-white font-serif italic">
              {profile.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">{profile.name}</h1>
              {profile.alias ? (
                <span className="font-mono text-sm text-slate-200">@{profile.alias}</span>
              ) : null}
            </div>
            {profile.bio ? (
              <p className="mt-4 font-serif italic text-xl text-slate-100 max-w-2xl leading-relaxed">{profile.bio}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex min-h-[48px] items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-3 font-mono text-sm text-slate-100">
                <span className="text-green-400">●</span>
                {shortAddress(profile.address)}
                <CopyButton value={profile.address} label="" />
              </span>
              {Object.entries(profile.links || {}).map(([key, url]) => {
                const Icon = linkIcon[key] || LuGlobe
                return (
                  <a
                    key={key}
                    href={url}
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-md px-2 text-sm text-slate-100 hover:text-purple-400 hover:bg-gray-800"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="capitalize">{key}</span>
                  </a>
                )
              })}
              <span className="ml-auto text-sm text-slate-200">
                <span className="text-white">{itemCount}</span> published item
                {itemCount === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
