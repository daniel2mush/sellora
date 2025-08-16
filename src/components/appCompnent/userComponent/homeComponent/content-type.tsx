import Image from 'next/image'

export default function ContentType() {
  const gridContent = [
    {
      image: 'https://res.cloudinary.com/dybyeiofb/image/upload/v1755276940/Content1_ap7ks8.webp',
      name: 'PNGs',
    },
    {
      image: 'https://res.cloudinary.com/dybyeiofb/image/upload/v1755276939/Content2_czua7d.webp',
      name: 'Bundles',
    },
    {
      image: 'https://res.cloudinary.com/dybyeiofb/image/upload/v1755276939/Content3_ifnmcn.webp',
      name: 'Templates',
    },
    {
      image: 'https://res.cloudinary.com/dybyeiofb/image/upload/v1755276940/Content4_bsnb8z.webp',
      name: 'Photos',
    },
    {
      image: 'https://res.cloudinary.com/dybyeiofb/image/upload/v1755276939/Content5_tu7dqm.webp',
      name: 'Vectors',
    },
  ]
  return (
    <div className=" h-350px] flex justify-center items-center py-10 max-w-7xl mx-auto ">
      <div className=" w-full px-14 space-y-14">
        {/* Heading */}
        <div>
          <h1 className=" text-3xl font-stretch-90%  font-bold text-center">Browse Content</h1>
        </div>
        {/* Grids */}
        <div className=" grid gap-4 grid-cols-2  lg:grid-cols-5 w-full">
          {gridContent.map((g, i) => (
            <div key={i} className=" space-y-3 place-items-center">
              {/* image container */}
              <div className=" relative aspect-video w-full rounded-2xl overflow-clip">
                <Image src={g.image} alt={g.name} fill className=" object-cover" loading="lazy" />
              </div>
              <div>
                <h1 className=" font-bold">{g.name}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
