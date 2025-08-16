'use client'

import { Masonry } from 'masonic'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { productWithUser } from '@/lib/types/productTypes'
import { Download, Shapes, Heart } from 'lucide-react' // Added Heart for like button
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip' // Added for tooltips
import { likeMutation, UnLikeMutation, useLikeProduct } from '@/lib/utils/queryFuntions'
import { useState } from 'react'

export default function MasonryGrid({
  products,
  searchQuery,
}: {
  products: productWithUser[]
  searchQuery: string
}) {
  const masonryKey = `${searchQuery || 'no-value'}-${products.length}-${products
    .map((p) => p.products.id)
    .join(',')}`

  return (
    <div className="w-full p-4">
      {' '}
      {/* Added light background and padding */}
      <Masonry
        key={masonryKey}
        items={products}
        columnGutter={16}
        columnWidth={250}
        overscanBy={2}
        render={({ data }) => ProductCard({ data: data })}
      />
    </div>
  )
}

function ProductCard({ data }: { data: productWithUser }) {
  const { mutate: Like } = likeMutation()
  const { mutate: UnLike } = UnLikeMutation()
  const { data: LikedProductsData, isLoading } = useLikeProduct()

  if (isLoading) return

  console.log(LikedProductsData)

  const likedProduct = LikedProductsData as { productId: string }[]
  let isLiked = new Set()

  if (likedProduct.length > 0) {
    const MyLikes = new Set(likedProduct.map((p) => p.productId))
    isLiked = MyLikes
  }

  const licenseIcon = data.products.price > 0 ? '/license.png' : null

  const LikedProduct = isLiked.has(data.products.id)
  return (
    <div className="w-full relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
      <Link href={`/products/${data.products.id}`}>
        <Image
          src={data.products.thumbnailUrl ?? '/placeholder-image.png'} // Fallback image
          alt={data.products.title}
          width={300}
          height={400} // Adjusted for better aspect ratio control
          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          {licenseIcon && (
            <div className="absolute top-3 right-3 rounded-full bg-black/50 h-5 w-5 flex justify-center items-center">
              <Image src={licenseIcon} alt="license icon" width={20} height={20} />
            </div>
          )}
        </div>
      </Link>

      <TooltipProvider>
        <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-white/90 text-gray-800 hover:bg-white/100 hover:scale-105 transition-all shadow-md"
                size="icon"
                onClick={() => console.log('Add to Collection', data.products.id)}
              >
                <Shapes size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Add to Collection</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="bg-white/90 text-gray-800 hover:bg-white/100 hover:scale-105 transition-all shadow-md"
                size="icon"
                onClick={() => (LikedProduct ? UnLike(data.products.id) : Like(data.products.id))}
              >
                {LikedProduct ? (
                  <Heart size={18} fill="red" stroke="0" color="red" />
                ) : (
                  <Heart size={18} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{LikedProduct ? 'Unlike' : 'Like'}</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}
