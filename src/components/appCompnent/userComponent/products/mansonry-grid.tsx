"use client";

import { Masonry } from "masonic";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { productWithUser } from "@/lib/types/productTypes";
import { Download, Shapes, Heart } from "lucide-react"; // Added Heart for like button
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Added for tooltips

export default function MasonryGrid({
  products,
  searchQuery,
}: {
  products: productWithUser[];
  searchQuery: string;
}) {
  const masonryKey = `${searchQuery || "no-value"}-${products.length}-${products
    .map((p) => p.products.id)
    .join(",")}`;

  return (
    <div className="w-full p-4 bg-gray-50">
      {" "}
      {/* Added light background and padding */}
      <Masonry
        key={masonryKey}
        items={products}
        columnWidth={300}
        columnGutter={16}
        render={({ data }) => (
          <div className="w-full relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
            <Image
              src={data.products.thumbnailUrl ?? "/placeholder-image.png"} // Fallback image
              alt={data.products.title}
              width={300}
              height={400} // Adjusted for better aspect ratio control
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
              loading="lazy"
            />
            <div className="absolute top-3 right-3">
              {data.products.price === 0 ? (
                <Badge className="bg-green-500 text-white px-3 py-1 text-sm font-semibold shadow-md">
                  Free
                </Badge>
              ) : (
                <Badge className="bg-indigo-500 text-white px-3 py-1 text-sm font-semibold shadow-md">
                  ${(data.products.price / 100).toFixed(2)}
                </Badge>
              )}
            </div>
            <Link href={`/products/${data.products.id}`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <h1 className="text-xl font-bold leading-tight mb-1">
                  {data.products.title}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="overflow-hidden rounded-full h-7 w-7 relative ring-2 ring-white/50">
                    <Image
                      src={data.user.image as string}
                      alt={data.user.name}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-sm font-medium">By {data.user.name}</p>
                </div>
              </div>
            </Link>
            {/* Action Buttons with Tooltips */}
            <TooltipProvider>
              <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="bg-white/90 text-gray-800 hover:bg-white/100 hover:scale-105 transition-all shadow-md"
                      size="icon"
                      onClick={() => console.log("Download", data.products.id)}>
                      <Download size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Download</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="bg-white/90 text-gray-800 hover:bg-white/100 hover:scale-105 transition-all shadow-md"
                      size="icon"
                      onClick={() =>
                        console.log("Add to Collection", data.products.id)
                      }>
                      <Shapes size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Add to Collection
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="bg-white/90 text-gray-800 hover:bg-white/100 hover:scale-105 transition-all shadow-md"
                      size="icon"
                      onClick={() => console.log("Like", data.products.id)}>
                      <Heart size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Like</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        )}
      />
    </div>
  );
}
