'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export function useFilterParams() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`?${params.toString()}`)
  }

  function getFilter(key: string) {
    return searchParams.get(key)
  }

  return { setFilter, getFilter }
}
