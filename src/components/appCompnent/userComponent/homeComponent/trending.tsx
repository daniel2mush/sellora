import { GetTrendingImagesAction } from '@/app/actions/userActions/ProductActionsUser'
import Image from 'next/image'
import Link from 'next/link'

interface trendingProps {
  product_id: string
  title: string
  thumbnail_url: string
}

export default async function Trending() {
  const trending = await GetTrendingImagesAction()

  if (!trending) return

  const value = trending as unknown as trendingProps[]

  return (
    <div className="px-4 md:px-10 my-10 max-w-7xl mx-auto  ">
      <h1 className="text-3xl font-bold font-stretch-90% text-center mb-6">Trending Images!</h1>

      <div className=" w-full h-[300] grid grid-cols-4 gap-2 ">
        {value.map((data) => (
          <div key={data.product_id} className=" relative aspect-auto w-full overflow-hidden">
            <Link href={`/products/${data.product_id}`}>
              <Image
                src={data.thumbnail_url}
                alt={`Image ${data.product_id}`}
                className="rounded-lg w-full object-cover"
                fill
                loading="lazy"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
