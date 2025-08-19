import { searchQueryProps } from '@/app/actions/userActions/ProductActionsUser'
import { userProfileTypes } from '@/lib/types/productTypes'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export function useUserInfo(userId: string, content: searchQueryProps) {
  return useQuery({
    queryKey: ['user-profile', userId, content],
    queryFn: async () => {
      const res = await axios.get(`/api/user/${userId}?content=${content}`)
      console.log(res.data, 'Query')

      return res.data as userProfileTypes
    },
  })
}
