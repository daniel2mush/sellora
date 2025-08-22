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

      <div className=" w-full  grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4   gap-2 ">
        {value.map((data) => (
          <Link key={data.product_id} href={`/products/${data.product_id}`}>
            <div key={data.product_id} className=" relative h-44 w-full overflow-hidden">
              <Image
                src={data.thumbnail_url}
                alt={`Image ${data.title}`}
                className="rounded-lg w-full object-cover"
                fill
                loading="lazy"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
