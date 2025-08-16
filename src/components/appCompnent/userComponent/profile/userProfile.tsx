'use client'
import { notFound, useParams, useRouter, useSearchParams } from 'next/navigation'
import { useUserInfo } from './userQuery'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Share2 } from 'lucide-react'

import { FilterBar } from '../filters/filtersBar'
import UserMansory from './mansoryUser'
import { searchQueryProps } from '@/app/actions/userActions/ProductActionsUser'
import { productWithAsset } from '@/lib/types/productTypes'
import UserProfileSkeleton from './userProfileSkeleton'

export default function UserProfilePage() {
  const params = useParams() as { id: string }
  const searchParams = useSearchParams()
  const content = searchParams.get('content')
  const license = searchParams.get('license')

  const { data, isLoading } = useUserInfo(params.id, content as searchQueryProps)

  if (isLoading) return <UserProfileSkeleton />

  if (!data) return notFound()

  const { userInfo, product } = data

  let productCopy = [...product] as productWithAsset[]

  if (license === 'freelicense') {
    productCopy = productCopy.filter((p) => p.products.price <= 0)
  } else if (license === 'prolicense') {
    productCopy = productCopy.filter((p) => p.products.price > 0)
  }

  return (
    <div className=" max-w-7xl mx-auto pt-10 px-10">
      {/* Profile */}
      <div className=" grid grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto ">
        <div className=" flex justify-center md:justify-end md:px-5">
          <Avatar className=" h-25 w-25">
            <AvatarFallback className=" bg-amber-900 text-3xl font-bold text-white">
              {userInfo.name.charAt(0)}
            </AvatarFallback>
            <AvatarImage src={userInfo.image!} alt="user profile" />
          </Avatar>
        </div>
        <div className=" flex justify-center items-center flex-col md:items-start ">
          <h1 className=" font-bold text-2xl">{userInfo.name}</h1>
          {/* Buttons */}
          <div className=" space-x-2">
            <Button className=" px-15">Follow</Button>
            <Button variant={'ghost'}>
              <Share2 />
            </Button>
          </div>
          {/* Info */}
          <div className=" flex items-center justify-between gap-3 mt-3">
            <h2 className=" text-sm font-bold text-gray-600">4 follower</h2>
            <div className=" border-r-2 h-[100%] border-gray-600 " />
            <h2 className=" text-sm font-bold text-gray-600">36k downloads</h2>
          </div>
        </div>
      </div>
      {/* Filters */}
      <FilterBar />

      {/* Monosory grid */}
      <UserMansory key={license} product={productCopy} content={content as string} />
    </div>
  )
}
