import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// Next.js adds its own noindex tag to 404 responses; this keeps the page's
// own robots tag in agreement with it.
export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

// Root 404, adapted from the Academic Website and the Teaching Hub. The
// illustration is a PNG master in public/penguins/ (CC BY-NC 4.0, see
// LICENSE-ARTWORK.md); scripts/penguin-assets.mjs generates the WebP.
export default function NotFound() {
  return (
    <main className="not-found-section">
      <div className="shell not-found-layout">
        <div className="not-found-copy">
          <p className="eyebrow">404</p>
          <h1>Page not found</h1>
          <p className="not-found-lead">
            The requested page does not exist or is no longer available.
          </p>
          <Link className="not-found-link" href="/">
            Back to the timeline
          </Link>
        </div>

        <div className="not-found-illustration">
          <Image
            src="/penguins/not-found.webp"
            alt="Penguin with a magnifying glass beside a stack of books"
            width={1024}
            height={1024}
            sizes="(max-width: 560px) 78vw, (max-width: 760px) 72vw, 480px"
            priority
            unoptimized
          />
        </div>
      </div>
    </main>
  )
}
