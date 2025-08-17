import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { productWithUser } from '../types/productTypes'
import {
  collection,
  collectionCProps,
  collectionItemTypes,
  Collections,
  CollectionsWithCount,
} from '../types/collectionTypes'

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

export function uselikeMutation() {
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

export function useUnLikeMutation() {
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

//get all collection
export function useGetAllCollection() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const res = await axios.get<collection[]>('/api/collection')
      const data = res.data.reverse()

      return data
    },
  })
}

//Create collection

export function useCreateCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (collectionName: string) => {
      const res = await axios.post('/api/collection', { collectionName })
      return res.data as { message: string }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      queryClient.invalidateQueries({ queryKey: ['collectionsWithProducts'] })
    },
  })
}

//add product to collection

export function useAddProductToCollection() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      productId,
      collectionId,
    }: {
      productId: string
      collectionId: string
    }) => {
      const res = await axios.post('/api/collection/add', { productId, collectionId })
      return res.data as { message: string }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      queryClient.invalidateQueries({ queryKey: ['collectionsWithProducts'] })
    },
  })
}

export function useCollectionChecker(productId: string) {
  return useQuery({
    queryKey: ['checker'],
    queryFn: async () => {
      const res = await axios.get(`/api/collection/checker/${productId}`)

      return res.data as collectionItemTypes[]
    },
  })
}

// get Collection with products

export function useGetCollectionWithProducts(collectionId?: string) {
  return useQuery({
    queryKey: ['collectionsWithProducts'],
    queryFn: async () => {
      const apiroute1 = `/api/collection/product`
      const apiroute2 = `/api/collection/product/${collectionId}`
      const res = await axios.get(collectionId ? apiroute2 : apiroute1)

      console.log(res.data, 'Collection fun')

      return res.data as collectionCProps
    },
  })
}

// Update

export function useEditCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      collectionId,
      collectionName,
    }: {
      collectionId: string
      collectionName: string
    }) => {
      const res = await axios.post(`/api/collection/${collectionId}`, { collectionName })

      console.log(res.data, 'Update results')

      return res.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      queryClient.invalidateQueries({ queryKey: ['collectionsWithProducts'] })
    },
  })
}

//Delete

export function useDeleteCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ collectionId }: { collectionId: string }) => {
      const res = await axios.delete(`/api/collection/${collectionId}`)

      console.log(res.data, 'Delete results')

      return res.data
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] })
      queryClient.invalidateQueries({ queryKey: ['collectionsWithProducts'] })
    },
  })
}
