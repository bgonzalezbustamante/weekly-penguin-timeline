import type { Metadata } from 'next'
import { Noto_Serif, Roboto } from 'next/font/google'
import type { ReactNode } from 'react'

import SiteFooter from '@/components/site-footer'
import './globals.css'

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  display: 'swap',
})

const notoSerif = Noto_Serif({
  variable: '--font-noto-serif',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Weekly Penguin Timeline',
  description:
    'Proof-of-concept weekly activity timeline driven by public working-time and coffee analytics.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${notoSerif.variable}`}>
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
