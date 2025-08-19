import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export function useFollowAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (adminId: string) => {
      const res = await axios.post(`/api/follow/${adminId}`)

      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isFollowing'] })
      queryClient.invalidateQueries({ queryKey: ['adminFollowers'] })
    },
  })
}

// unfollow Admin
export function useUnFollowAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (adminId: string) => {
      const res = await axios.delete(`/api/follow/${adminId}`)

      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isFollowing'] })
      queryClient.invalidateQueries({ queryKey: ['adminFollowers'] })
    },
  })
}

//checker
export function useIsFollowing(adminId: string) {
  return useQuery({
    queryKey: ['isFollowing', adminId],
    queryFn: async () => {
      const res = await axios.get(`/api/follow/${adminId}`)

      console.log(res.data, 'Is Following')

      return res.data as boolean
    },
  })
}

//Admin followers
export function useGetAdminFollowers(adminId: string) {
  return useQuery({
    queryKey: ['adminFollowers', adminId],
    queryFn: async () => {
      const res = await axios.get(`/api/followers/${adminId}`)

      console.log(res.data, 'admin Followers')

      return res.data as { Id: string; name: string; image: string | null }[]
    },
  })
}
