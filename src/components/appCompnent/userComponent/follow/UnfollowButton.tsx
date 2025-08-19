'use client'
import { Button } from '@/components/ui/button'
import { useUnFollowAdmin } from '@/lib/utils/followQuery/followQuery'
import { Check } from 'lucide-react'
import { toast } from 'sonner'

export default function UnFollowButton({ adminId }: { adminId: string }) {
  const { mutate, isPending } = useUnFollowAdmin()
  return (
    <Button
      disabled={isPending}
      onClick={() => mutate(adminId, { onSuccess: () => toast.success('UnFollowing') })}
      variant="outline"
      className="hover:bg-gray-100 transition-colors"
    >
      <Check size={20} className="mr-2" />
      Following
    </Button>
  )
}
