import { CreateAnAccount } from '@/components/appCompnent/userComponent/homeComponent/account'
import { AccordionSection } from '@/components/appCompnent/userComponent/homeComponent/acodion'
import ContentType from '@/components/appCompnent/userComponent/homeComponent/content-type'
import HeroSection from '@/components/appCompnent/userComponent/homeComponent/hero'
import JoinToday from '@/components/appCompnent/userComponent/homeComponent/join'
import Trending from '@/components/appCompnent/userComponent/homeComponent/trending'
import WhyUs from '@/components/appCompnent/userComponent/homeComponent/why'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user.role === 'admin') redirect('/admin/dashboard')
  return (
    <div>
      <HeroSection />
      <ContentType />
      <Trending />
      <WhyUs />
      <JoinToday />
      <AccordionSection />
      <CreateAnAccount />
    </div>
  )
}
