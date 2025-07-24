"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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

const MasonryGrid = dynamic(() => import("./mansonry-grid"), {
  ssr: false,
});

interface productPageProps {
  products: productWithUser[];
  pagination: paginationData;
}

export function ProductPage({ products, pagination }: productPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchValue = searchParams.get("content");

  const [query, setQuery] = useState(searchParams.get("query") || "");

  const { currentPage, totalPages } = pagination;
  const handlePageChange = (newPage: number) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", newPage.toString());
    router.push(`?${currentParams.toString()}`);
  };

  const getPageNumbers = () => {
    const maxPagesToShow = 5; // Show up to 5 page numbers
    const pages: (number | "ellipsis")[] = [];
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    // Always show page 1
    pages.push(1);

    // Add ellipsis after page 1 if needed
    if (startPage > 2) {
      pages.push("ellipsis");
    }

    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push("ellipsis");
    }

    // Always show last page if totalPages > 1
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="px-4 md:px-10 w-full pt-10">
      <h1 className="text-4xl font-bold text-center mb-10">
        Explore our products
      </h1>

      {/* Search Bar */}
      <div className="py-5 rounded-xl w-full px-10 my-10 flex items-center justify-center border">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const currentParams = new URLSearchParams(
                searchParams.toString()
              );
              currentParams.set("page", "1");

              if (query) {
                currentParams.set("query", query);
              } else {
                currentParams.delete("query");
              }

              router.replace(`?${currentParams.toString()}`);
            }
          }}
          placeholder="Search your items..."
          className="w-full placeholder:font-semibold active:outline-none focus:outline-none"
        />
        <Search size={18} />
      </div>

      {/* Masonry Grid */}
      <MasonryGrid
        // key={`${searchQuery || "no-filter"}-${query || "no-query"}`}
        searchQuery={searchValue as string}
        products={products}
      />

      {/* Pagination Controls */}
      <Pagination className=" py-10">
        <PaginationContent className="justify-center mt-10">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              aria-disabled={currentPage === 1}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : " cursor-pointer"
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
                  className=" cursor-pointer"
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
                  : " cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
