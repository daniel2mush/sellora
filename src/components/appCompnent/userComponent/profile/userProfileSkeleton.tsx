'use client'
import { Skeleton } from '@/components/ui/skeleton'

export default function UserProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto pt-10 px-10 space-y-10">
      {/* Profile Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto gap-6">
        <div className="flex justify-center md:justify-end md:px-5">
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
        <div className="flex flex-col justify-center items-center md:items-start space-y-4">
          <Skeleton className="h-6 w-40" /> {/* Name */}
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-20" />
            <div className="border-r-2 h-4 border-gray-300" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <Skeleton className="h-10 w-full rounded-md" />

      {/* Masonry Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}
