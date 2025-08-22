'use client'

import { Search } from 'lucide-react'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <div className="relative h-full min-h-[450px] w-full">
      <Image
        src="https://res.cloudinary.com/dybyeiofb/image/upload/f_auto/v1755861756/Screenshot_2025-08-15_at_17.21.48_hpawx7_cckmyd.webp"
        alt="Hero background"
        fill
        priority
        quality={90}
        placeholder="blur"
        blurDataURL="/blurBackground.webp"
        className="object-cover object-center w-full h-full bg-white"
        // onBlur={() => setLoaded(true)}
      />
      (
      <div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Foreground content */}
        <div className="relative flex items-center justify-center min-h-[450px] px-10">
          <div className="space-y-20 max-w-7xl mx-auto">
            {/* Text section */}
            <div className="space-y-3 text-center">
              <h1 className="text-3xl lg:text-5xl font-black text-white">
                Download Free Vectors, Stock Photos, <br /> Stock Videos, and More
              </h1>
              <p className="text-xl font-medium text-white">
                Professional quality creative resources to get your projects done faster.
              </p>
            </div>

            {/* Search section */}
            <div className="h-15 bg-white rounded-2xl flex justify-center items-center space-x-4 overflow-hidden">
              {/* Logo */}
              <div className="bg-black p-3 h-full w-50 text-white flex items-center justify-center">
                <div className="relative w-20 md:w-32 h-16">
                  <Image
                    src="https://res.cloudinary.com/dybyeiofb/image/upload/f_auto/f_auto/v1755276942/Logo_bbchps.png"
                    alt="logo"
                    fill
                    className="filter invert dark:invert-0 object-contain"
                  />
                </div>
              </div>
              {/* Search input */}
              <div className="flex-11/12 w-full flex justify-center items-center pr-6">
                <input
                  type="text"
                  placeholder="Search vectors..."
                  className="w-full active:outline-none focus:outline-none placeholder:font-bold"
                />
                <Search className="text-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
      )
    </div>
  )
}
