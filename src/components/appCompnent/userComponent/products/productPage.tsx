// components/ProductPage.jsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { paginationData, productWithUser } from "@/lib/types/productTypes";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProducts } from "@/lib/utils/queryFuntions";
import SkeletonCard from "@/components/skeletonCard";

const MasonryGrid = dynamic(() => import("./mansonry-grid"), {
  ssr: false,
});

interface productPageProps {
  products: productWithUser[];
  paginationData: paginationData;
}

export function UserProducts() {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  const { data, isLoading } = useQuery<productPageProps>({
    queryKey: ["products", searchString],
    queryFn: () => fetchAllProducts(searchString),
  });
  const router = useRouter();

  const searchValue = searchParams.get("content");

  if (isLoading) {
    return (
      <div className="px-4 md:px-10 w-full pt-10">
        <h1 className="text-4xl font-bold text-center mb-10">
          Explore our products
        </h1>
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const { products, paginationData: pagination } = data!;
  const { currentPage, totalPages } = pagination;

  const handlePageChange = (newPage: number) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", newPage.toString());
    router.push(`?${currentParams.toString()}`);
  };

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    pages.push(1);
    if (startPage > 2) pages.push("ellipsis");
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages - 1) pages.push("ellipsis");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  if (!data)
    return (
      <div className=" flex justify-center items-center min-h-[60hv] font-bold text-2xl;">
        No data
      </div>
    );

  return (
    <div className="px-4 md:px-10 w-full pt-10">
      {/* <h1 className="text-4xl font-bold text-center mb-10">
        Explore our products
      </h1> */}

      {/* Masonry Grid */}
      <MasonryGrid searchQuery={searchValue as string} products={products} />

      {/* Pagination Controls */}
      <Pagination className="py-10">
        <PaginationContent className="justify-center mt-10">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              aria-disabled={currentPage === 1}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
          {getPageNumbers().map((page, index) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  className="cursor-pointer"
                  onClick={() => handlePageChange(page)}
                  isActive={page === currentPage}
                  aria-current={page === currentPage ? "page" : undefined}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              aria-disabled={currentPage === totalPages}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
