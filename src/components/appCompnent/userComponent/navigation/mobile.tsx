'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet'
import { Compass, DollarSign, FolderHeart, Home, Menu } from 'lucide-react'
import Image from 'next/image'
import { useSession } from '@/lib/authClient'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { DialogTitle } from '@/components/ui/dialog'
import UserMenu from '../more/MoreOption'

export default function MobileNavigation() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navMenu = [
    { name: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
    {
      name: 'Explore',
      path: '/products',
      icon: <Compass className="h-5 w-5" />,
    },
  ]

  const navSession = [
    {
      name: 'Purchases',
      path: '/dashboard/purchases',
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      name: 'Collections',
      path: '/dashboard/collection',
      icon: <FolderHeart className="h-5 w-5" />,
    },
  ]

  const lastScrollY = useRef(50)
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

  if (pathname === '/auth') {
    return null
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-background shadow-md transition-all duration-300 ease-in-out ${
        show ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <SheetHeader className="mb-6">
              <DialogTitle className="sr-only">Main navigation menu</DialogTitle>
              <div className="relative w-32 h-10">
                <Image src="/Logo.png" alt="Logo" fill className="object-contain" priority />
              </div>
            </SheetHeader>
            <nav className="flex flex-col space-y-2">
              {navMenu.map((item) => (
                <SheetClose key={item.path} asChild>
                  <Link
                    href={item.path}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-accent rounded-md transition-colors"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </SheetClose>
              ))}
              {session?.user && (
                <>
                  <div className="my-4 border-t border-border" />
                  {navSession.map((item) => (
                    <SheetClose key={item.path} asChild>
                      <Link
                        href={item.path}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-accent rounded-md transition-colors"
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="relative w-28 h-8">
          <Image src="/Logo.png" alt="Logo" fill className="object-contain" priority />
        </Link>

        <UserMenu />
      </div>
    </header>
  )
}
