import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="mx-auto max-w-container px-4 md:px-6 py-16 md:py-24 text-center">
        <p className="font-mono text-eyebrow uppercase text-accent-glow">404</p>
        <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-semibold text-ink">Agent not found</h1>
        <p className="mt-4 text-lg text-ink-muted">
          We couldn't find that agent or item. Try the directory.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[48px] items-center rounded-md border border-accent-glow bg-accent-glow px-4 text-sm text-white hover:bg-accent-deep"
        >
          Browse agents
        </Link>
      </main>
      <Footer />
    </>
  )
}
