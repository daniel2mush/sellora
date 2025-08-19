'use client'
import { Button } from '@/components/ui/button'
import { useFollowAdmin } from '@/lib/utils/followQuery/followQuery'
import { UserPlus } from 'lucide-react'
import { toast } from 'sonner'

export default function FollowButton({ adminId }: { adminId: string }) {
  const { mutate, isPending } = useFollowAdmin()
  return (
    <Button
      disabled={isPending}
      onClick={() => mutate(adminId, { onSuccess: () => toast.success('Following') })}
      variant="outline"
      className="hover:bg-gray-100 transition-colors"
    >
      <UserPlus size={20} className="mr-2" />
      Follow
    </Button>
  )
}
