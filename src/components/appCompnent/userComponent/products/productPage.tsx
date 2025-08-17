// components/ProductPage.jsx
'use client'

import { useSearchParams } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { paginationData, productWithUser } from '@/lib/types/productTypes'
import { useQuery } from '@tanstack/react-query'
import { fetchAllProducts } from '@/lib/utils/queryFuntions'
import MasonryGridSkeleton from '@/components/skeletonCard'
import { getPageNumbers, handlePageChange } from './productFun'
import MasonryGrid from './mansonry-grid'

interface productPageProps {
  products: productWithUser[]
  paginationData: paginationData
}

export function UserProducts() {
  const searchParams = useSearchParams()
  const searchString = searchParams.toString()
  const license = searchParams.get('license')

  const { data, isLoading } = useQuery<productPageProps>({
    queryKey: ['products', searchString],
    queryFn: () => fetchAllProducts(searchString),
  })

  const searchValue = searchParams.get('content')

  if (isLoading) {
    return (
      <div className="px-4 md:px-10 w-full pt-10 max-w-7xl mx-auto">
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <MasonryGridSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const { products, paginationData: pagination } = data!
  const { currentPage, totalPages } = pagination

  let productCopy = [...products] as productWithUser[]

  if (license === 'freelicense') {
    productCopy = productCopy.filter((p) => p.products.price <= 0)
  } else if (license === 'prolicense') {
    productCopy = productCopy.filter((p) => p.products.price > 0)
  }

  if (!data)
    return (
      <div className=" flex justify-center items-center min-h-[60hv] font-bold text-2xl;">
        No data
      </div>
    )

  return (
    <div className="px-4 md:px-10 w-full pt-10 max-w-7xl mx-auto">
      {/* Masonry Grid */}
      <div className=" min-h-[40vh]">
        <MasonryGrid searchQuery={searchValue as string} products={productCopy} />
      </div>

      {/* Pagination Controls */}
      <Pagination className="py-10">
        <PaginationContent className="justify-center mt-10">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1, searchParams.toString())}
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
          {getPageNumbers({ currentPage, totalPages }).map((page, index) =>
            page === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  className="cursor-pointer"
                  onClick={() => handlePageChange(page, searchParams.toString())}
                  isActive={page === currentPage}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1, searchParams.toString())}
              aria-disabled={currentPage === totalPages}
              className={
                currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
