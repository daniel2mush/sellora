import UserProfilePage from '@/components/appCompnent/userComponent/profile/userProfile'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'User profile',
}

export default function ProfilePage() {
  return (
    <div className=" max-w-7xl mx-auto min-h-screen">
      <UserProfilePage />
    </div>
  )
}
