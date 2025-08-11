import { GetUserInformation } from '@/app/actions/userActions/userActions'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function UserProfile({ params }: PageProps) {
  const { id } = await params

  const { userInfo: user } = await GetUserInformation(id)

  if (!user) return notFound()

  return (
    <div>
      <div className="relative h-20 w-20 rounded-full">
        <Image src={user.image as string} alt={user.name} fill className="object-cover" />
      </div>
    </div>
  )
}
