// components/SkeletonCard.jsx
'use client'

import { Skeleton } from './ui/skeleton'
import { TableCell, TableRow } from './ui/table'

function SkeletonCard() {
  return (
    <div className="w-full relative rounded-lg overflow-hidden border">
      {/* Image placeholder */}
      <div className="w-full h-64 bg-gray-200 animate-pulse" />

      {/* Content placeholders */}
      <div className="absolute bottom-0 left-0 right-0  p-5 space-y-2">
        {/* Title */}
        <div className="h-6 bg-gray-300 rounded w-3/4 animate-pulse" />
        {/* User info */}
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse" />
          <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonCard

/// Admin payments skeleton

export const SkeletonRow = ({ index }: { index: number }) => (
  <TableRow className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
    <TableCell>
      <Skeleton className="h-10 w-10 rounded-full animate-shimmer" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[100px] animate-shimmer" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[150px] animate-shimmer" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[120px] animate-shimmer" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-6 w-[50px] animate-shimmer" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[60px] animate-shimmer" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[80px] animate-shimmer" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[100px] animate-shimmer" />
    </TableCell>
  </TableRow>
)
