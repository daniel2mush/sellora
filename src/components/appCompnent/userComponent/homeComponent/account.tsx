import Image from 'next/image'
import Link from 'next/link'

export function CreateAnAccount() {
  return (
    <div
      style={{
        background: 'linear-gradient(to right, #3E00A0, #9C27B0, #E91E63, #FF8A65, #FFB74D)',
      }}
      className=" relative w-full h-[350px] flex items-center justify-center    overflow-hidden"
    >
      {/* Content */}
      <div className=" z-40 text-white flex flex-col items-center justify-center space-y-5 max-w-7xl mx-auto">
        <h1 className=" text-3xl md:text-5xl font-black  ">Create a Free Account</h1>
        <p className=" text-balance text-center text-[20px] font-medium ">
          Explore thousands of free vectors, photos, images, and videos created <br /> by amazing
          artists all over the world!
        </p>
        <button className=" py-4 px-7 rounded font-bold  bg-white text-primary">
          <Link href={'/auth'}>Sign Up Free</Link>
        </button>
      </div>
      {/* Image 3 */}
      <div className=" opacity-0 md:opacity-100 flex-nowrap absolute top-20 left-40 ">
        <div className=" relative  w-[200px] h-[100px]">
          <Image
            src={
              'https://res.cloudinary.com/dybyeiofb/image/upload/f_auto/v1755276941/dots_nv9s2p.webp'
            }
            alt="spiral"
            fill
            className=" object-contain "
          />
        </div>
      </div>
      {/* Image one */}
      <div className=" opacity-0 lg:opacity-100 flex-nowrap absolute top-20 -left-10 -translate-x-96">
        <div className=" relative  w-[800px] h-[400px]">
          <Image
            src={
              'https://res.cloudinary.com/dybyeiofb/image/upload/f_auto/v1755276941/spiral_pwk3cx.webp'
            }
            alt="spiral"
            fill
            className=" object-contain "
          />
        </div>
      </div>
      {/* Image 2 */}
      <div className=" opacity-0 lg:opacity-100 flex-nowrap absolute -top-30 -right-10  rotate-180 translate-x-96">
        <div className=" relative  w-[800px] h-[400px]">
          <Image
            src={
              'https://res.cloudinary.com/dybyeiofb/image/upload/f_auto/v1755276941/spiral_pwk3cx.webp'
            }
            alt="spiral"
            fill
            className=" object-contain "
          />
        </div>
      </div>
    </div>
  )
}
