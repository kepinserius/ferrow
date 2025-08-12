import { Providers } from '@/components/Providers'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import localFont from 'next/font/local'

// Load local Akko font
const akko = localFont({
  src: [
    {
      path: '../assets/font/akko/Akko Bold.otf',
      weight: '700',
      style: 'normal',
    }
  ],
  variable: '--font-akko',
  display: 'swap',
})

// Load local Open Sans font
const openSans = localFont({
  src: [
    {
      path: '../assets/font/open-sans/OpenSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/font/open-sans/OpenSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/font/open-sans/OpenSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/font/open-sans/OpenSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/font/open-sans/OpenSans-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../assets/font/open-sans/OpenSans-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../assets/font/open-sans/OpenSans-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../assets/font/open-sans/OpenSans-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    }
  ],
  variable: '--font-opensans',
  display: 'swap',
})

export const metadata = {
  title: 'Ferrow - Premium Natural Pet Food',
  description: 'Makanan hewan premium berbahan alami, grain-free, terinspirasi dari diet predator liar',
  keywords: 'pet food, natural, grain-free, premium, dog food, cat food',
  icons: {
    icon: `/favicon.ico`,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${openSans.variable} ${akko.variable} scroll-smooth`}>
      <head>
        <meta name="theme-color" content="#EFE4C8" />
      </head>
      <body className="font-sans antialiased bg-ferrow-cream-400 text-ferrow-green-800" suppressHydrationWarning={true}>
        <Providers>{children}</Providers> {/* Gunakan Providers di sini */}
      </body>
    </html>
  )
}
