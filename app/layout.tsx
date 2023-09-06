import './globals.css'
import type { Metadata } from 'next'
import PrivyProviderB from './providers/PrivyProvidersB'
import ZeroDevProviderComponent from './providers/ZeroDevProviderComponent'

const APP_NAME = "Stable Pay Global";
const APP_DESCRIPTION = "Enabling cross border payments";

export const metadata: Metadata = {
  title: "Stable Pay Global",
  description: APP_DESCRIPTION,
  twitter: {
    card: "summary_large_image",
    creator: "@imamdev_",
    images: "https://example.com/og.png",
  },
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: "#FFFFFF",
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  manifest: "/manifest.json",
  icons: [
    { rel: "apple-touch-icon", url: "/icons/apple-touch-icon.png" },
    { rel: "shortcut icon", url: "/favicon.ico" },
  ],
  keywords: ["nextjs", "pwa", "next-pwa"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ZeroDevProviderComponent>
        <PrivyProviderB>
          <body>
            {children}
          </body>
        </PrivyProviderB>
      </ZeroDevProviderComponent>
    </html>
  )
}
