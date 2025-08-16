import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { productWithUser } from '../types/productTypes'

export async function fetchAllProducts(searchParams: string) {
  try {
    const res = await axios.get(`/api/products?${searchParams}`)

    if (res.status === 200) {
      return res.data
    }

    throw new Error('Error occured while fetching products')
  } catch (error) {
    console.log(error)
    throw new Error('Error occured while fetching products, please try again ')
  }
}

export function useGetSingleProduct(productId: string) {
  return useQuery<productWithUser>({
    queryKey: ['single-product', productId],
    queryFn: async () => {
      const res = await axios.get(`/api/products/${productId}`)

      if (res.status === 200) {
        return res.data.data
      }
    },
  })
}

export function useLikeProduct() {
  return useQuery({
    queryKey: ['like'],
    queryFn: async () => {
      const res = await axios.get(`/api/products/like`)
      return res.data
    },
  })
}

export function likeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await axios.post('/api/products/like', { productId })

      console.log(res.data, 'Like results')

      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['like'] })
    },
  })
}

export function UnLikeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await axios.post('/api/products/unlike', { productId })

      console.log(res.data, 'Unlike results')

      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['like'] })
    },
  })
}
