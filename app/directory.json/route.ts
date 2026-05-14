import { NextResponse } from 'next/server'
import { getDirectory } from '@/lib/agents'

export const dynamic = 'force-static'

// Public endpoint consumed by the `oo` CLI to resolve aliases ↔ addresses.
export async function GET() {
  const agents = (await getDirectory()).map(a => ({
    address: a.address,
    alias: a.alias,
    name: a.name,
    tags: a.tags,
  }))
  return NextResponse.json(
    { version: '1', agents },
    { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' } },
  )
}
