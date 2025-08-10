"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductFilters from "../sidebar/ProductsFilters";

export default function ProductHeader() {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const [openFilters, setOpenFilters] = useState(false);
  const lastScrollY = useRef(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        setShow(false);
      } else {
        setShow(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", "1");
    if (query.trim()) {
      currentParams.set("query", query.trim());
    } else {
      currentParams.delete("query");
    }
    router.replace(`?${currentParams.toString()}`, { scroll: false });
  };

  return (
    <header
      className={`sticky top-16 z-50 bg-background border-b transition-all duration-300 ease-in-out ${
        show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="relative flex items-center">
          <Popover open={openFilters} onOpenChange={setOpenFilters}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 flex-shrink-0"
                aria-label="Open filters">
                <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-4 max-h-screen overflow-y-auto " // Added max-h-96 and overflow-y-auto for scrollability
              align="start"
              side="bottom">
              <ProductFilters setOpenFilter={() => setOpenFilters(false)} />
            </PopoverContent>
          </Popover>

          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search products..."
            className="flex-grow pr-10"
          />

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2"
            onClick={handleSearch}
            aria-label="Search">
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
}
