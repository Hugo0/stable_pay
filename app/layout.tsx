import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Pwa from './Pwa'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stable Pay',
  description: 'Manifesting easier and hastle-free global payments',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Pwa />
      </body>
    </html>
  )
}
