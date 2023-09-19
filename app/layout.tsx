import './globals.css'
import type { Metadata } from 'next'
import PrivyProviderB from '../lib/providers/PrivyProvidersB'
import ZeroDevProviderComponent from '../lib/providers/ZeroDevProviderComponent'
import {ToastContainer} from "react-toastify";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import {Toaster} from "react-hot-toast";

const APP_NAME = "Stable Pay Global";
const APP_DESCRIPTION = "Enabling cross border payments";

export const metadata: Metadata = {
  title: "Stable Pay Global",
  description: APP_DESCRIPTION,
  twitter: {
    card: "summary_large_image",
    creator: "@iammukul",
    images: "/payments.png",
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
  keywords: ["KeyChain Global Payments", "Global Payments"],
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
          <Toaster />
          <NavBar />
          <body className='min-h-screen bg-black-100'>
            {/* <ToastContainer /> */}
            {children}
          </body>
          <Footer />
        </PrivyProviderB>
      </ZeroDevProviderComponent>
    </html>
  )
}
