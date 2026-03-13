import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ToolBox | Free Online Tools for Students',
  description: 'All-in-one free online tools for students. Text tools, image tools, calculators, and developer utilities - all free and instant.',
  keywords: ['free tools', 'online tools', 'student tools', 'text converter', 'image tools', 'calculator', 'developer tools'],
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="google-site-verification" content="vwtMlZit0PQL-9PssMwodBQJAImhb7c0LQ0NUtUjbpc" />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased overflow-x-hidden`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
