import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/provider'
import { NavigationWrapper } from '@/components/appCompnent/userComponent/navigation/navigationWrapper'
import ClientToaster from '@/components/appCompnent/ClientToaster'
import Footer from '@/components/appCompnent/userComponent/homeComponent/footer'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Sellora',
  description:
    'This is an asset manager app. it helps designers to sell their assets online and mostly africans developers',
  authors: [{ name: 'Daniel', url: 'mailto:daniel2mush@gmail.com' }],
  creator: 'daniel2mush@gmail.com',
  publisher: 'Sellora Inc',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NavigationWrapper>
          <Providers>
            <main>{children}</main>
          </Providers>
        </NavigationWrapper>
        <ClientToaster />
        {/* <Footer /> */}
      </body>
    </html>
  )
}
