import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Explore our products and buy',
}

export default async function ProductLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user.role === 'admin') redirect('/admin/dashboard')
  return <section>{children}</section>
}
