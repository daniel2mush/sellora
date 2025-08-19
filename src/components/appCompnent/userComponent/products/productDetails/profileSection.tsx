'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import FollowButton from '../../follow/FollowButton'
import { productWithUser } from '@/lib/types/productTypes'
import Link from 'next/link'
import { useIsFollowing } from '@/lib/utils/followQuery/followQuery'
import UnFollowButton from '../../follow/UnfollowButton'

export default function ProfileSection({
  product,
  isLoggedIn,
  count,
}: {
  product: productWithUser
  isLoggedIn: boolean
  count: number
}) {
  const { data: isFollowing } = useIsFollowing(product.user.id)

  console.log(isLoggedIn, 'Is following')

  return (
    <div className="flex items-center justify-between">
      <Link href={`/profile/${product.user.id}?content=all`}>
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 ring-2 ring-gray-200">
            <AvatarImage src={product.user.image as string} alt={product.user.name} />
            <AvatarFallback>{product.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-lg text-gray-900">{product.user.name}</h2>
            <p className="text-sm text-gray-500">{count} Resources</p>
          </div>
        </div>
      </Link>
      {isLoggedIn ? (
        isFollowing ? (
          <UnFollowButton adminId={product.user.id} />
        ) : (
          <FollowButton adminId={product.user.id} />
        )
      ) : (
        ''
      )}
    </div>
  )
}
