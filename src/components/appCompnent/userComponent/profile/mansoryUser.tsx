'use client'
import { productTypes, productWithAsset } from '@/lib/types/productTypes'
import { Masonry } from 'masonic'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'

export default function UserMansory({
  product,
  content,
}: {
  product: productWithAsset[]
  content: string
}) {
  if (product.length <= 0)
    return (
      <div className=" h-[60vh] flex justify-center items-center">
        <h1 className="text-lg font-semibold text-gray-600">
          No products found. Try adjusting your filters or check back later.
        </h1>
      </div>
    )

  return (
    <div className="mt-10">
      <Masonry
        key={content}
        items={product}
        columnGutter={16}
        columnWidth={250}
        overscanBy={2}
        render={({ data }) => <ProductCard product={data} />}
      />
    </div>
  )
}

function ProductCard({ product }: { product: productWithAsset }) {
  const { id, title, thumbnailUrl, price, createdAt, isPublished } = product.products

  const formattedDate = createdAt ? format(new Date(createdAt), 'MMM dd, yyyy') : 'Unknown date'
  const status = isPublished ? 'Published' : 'Draft'
  const licenseIcon =
    price > 0
      ? 'https://res.cloudinary.com/dybyeiofb/image/upload/v1755276954/license_nmcngm.png'
      : null

  return (
    <Link
      href={`/products/${id}`}
      aria-label={`View details for ${title}`}
      className="block w-full relative group rounded-2xl overflow-hidden shadow-lg  transition-all duration-300 bg-white"
    >
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={title}
          width={300}
          height={400}
          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          No Image Available
        </div>
      )}

      {licenseIcon && (
        <div className="absolute top-3 right-3 rounded-full bg-black/50 h-5 w-5 flex justify-center items-center">
          <Image src={licenseIcon} alt="license icon" width={20} height={20} />
        </div>
      )}
    </Link>
  )
}
