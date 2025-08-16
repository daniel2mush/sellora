'use client'

import MobileNavigation from './mobile'
import DesktopNavigation from './desktop'
import { useEffect, useState } from 'react'
import { useSession } from '@/lib/authClient'
import { useMediaQuery } from 'react-responsive'
import Footer from '../homeComponent/footer'

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const isMobile = useMediaQuery({ maxWidth: 767 })

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  console.log(isMobile, 'Is mobile now')

  const isUser = session?.user.role !== 'admin'
  return (
    <section>
      {isUser && isMobile ? <MobileNavigation /> : <DesktopNavigation />}
      <main className=" min-h-screen">{children}</main>
      <Footer />
    </section>
  )
}
