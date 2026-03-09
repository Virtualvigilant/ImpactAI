import { League_Spartan, DM_Sans } from 'next/font/google'
import './globals.css'

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  variable: '--font-spartan',
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500'],
  display: 'swap',
})

export const metadata = {
  title: 'ImpactAI — Offline Intelligence',
  description: 'AI that works where you are. No internet required.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${leagueSpartan.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-black text-brand-off-white font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
