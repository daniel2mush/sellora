'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from '@/lib/authClient'

import Image from 'next/image'
import MoreOption from '../more/MoreOption'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
export default function DesktopNavigation() {
  const { data: session, isPending } = useSession()
  const pathname = usePathname()

  const navMenu = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/products' },
  ]

  const navSession = [
    { name: 'Purchases', path: '/dashboard/purchases' },
    { name: 'Collections', path: '/dashboard/collection' },
  ]

  const lastScrollY = useRef(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > 100 && currentScrollY > lastScrollY.current) {
        setShow(false)
      } else {
        setShow(true)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (pathname === '/auth' || isPending) {
    return null
  }

  if (session?.user.role === 'admin') return null

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white shadow-md transition-all duration-300 ease-in-out ',
        show ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-10 max-w-7xl">
        {/* Logo */}
        <Link href="/" className="relative w-20 md:w-32 h-10">
          <Image src="/Logo.png" alt="Logo" fill className="object-contain" priority />
        </Link>

        {/* Menu */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navMenu.map((item) => {
              const isActive = pathname === item.path
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-primary',
                      isActive
                        ? 'text-primary border-b-2 border-primary pb-1'
                        : 'text-muted-foreground'
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
            {session?.user &&
              navSession.map((item) => {
                const isActive = pathname === item.path
                return (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className={cn(
                        'text-sm font-medium transition-colors hover:text-primary',
                        isActive
                          ? 'text-primary border-b-2 border-primary pb-1'
                          : 'text-muted-foreground'
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                )
              })}
          </ul>
        </nav>

        {/* More Options */}
        <MoreOption />
      </div>
    </header>
  )
}
