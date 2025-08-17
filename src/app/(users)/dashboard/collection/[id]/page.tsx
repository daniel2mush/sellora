'use client'

import { useGetCollectionWithProducts } from '@/lib/utils/queryFuntions'
import { Folder } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function CollectionDetails() {
  const params = useParams()
  const { id } = params

  const { data } = useGetCollectionWithProducts(id?.toString())

  console.log(data, 'Data')

  if (!data) return
  const collectionName = data.collectionsWithCounts[0].collectionName
  return (
    <div className=" max-w-7xl mx-auto py-10 px-10">
      <h1 className=" font-bold text-xl md:text-3xl flex items-center gap-4">
        <Folder size={30} />
        {collectionName}
      </h1>
      <div className=" grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5 mt-10">
        {data?.productsInCollection.toReversed().map((c) => (
          <Link
            href={`/products/${c.productId}`}
            key={c.productId}
            className=" overflow-hidden border-2 group hover:border-indigo-400 shadow hover:shadow-2xl rounded-2xl "
          >
            <div className=" relative aspect-square shadow w-full">
              <Image
                src={c.thumbnail!}
                alt={c.name}
                fill
                className=" object-cover group-hover:scale-110 transition-all duration-300 ease-in-out  "
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
