import type { Metadata } from 'next'
import { Exo_2, Outfit, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/layout/Providers'
import { Toaster } from '@/components/ui/toaster'

const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'EcoDrive — AI-Powered EV Charging Planner',
  description: 'Optimize EV charging station placement using machine learning, spatial analysis, and real-world demand data for any city worldwide.',
  keywords: ['EV charging', 'electric vehicle', 'AI optimization', 'spatial analysis', 'India', 'charging infrastructure'],
  openGraph: {
    title: 'EcoDrive — AI EV Charging Planner',
    description: 'Find optimal EV charging locations in any city using AI',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${exo2.variable} ${outfit.variable} ${jetbrains.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
