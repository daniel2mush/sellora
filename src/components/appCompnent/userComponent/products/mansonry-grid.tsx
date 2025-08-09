"use client";

import { Masonry } from "masonic";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { productWithUser } from "@/lib/types/productTypes";
import { Download, Shapes } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="w-full">
      <Masonry
        key={masonryKey}
        items={products}
        columnWidth={300}
        columnGutter={16}
        render={({ data }) => (
          <div className="w-full relative group rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
            <img
              src={data.products.thumbnailUrl ?? ""}
              alt={data.products.title}
              className="w-full h-auto object-contain group-hover:scale-110 transition-all duration-500"
              loading="lazy"
            />
            {data.products.price === 0 && (
              <div className="absolute top-2 right-2">
                <Badge variant={"secondary"}>Free</Badge>
              </div>
            )}
            <Link href={`/products/${data.products.id}`}>
              <div className="opacity-0 group-hover:opacity-100 absolute top-0 right-0 left-0 bg-black/30 w-full h-full px-5 transition-opacity duration-300">
                <div className="h-full flex flex-col justify-end space-y-2 pb-4 text-white">
                  <h1 className="text-lg font-semibold">
                    {data.products.title}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="overflow-hidden rounded-full h-8 w-8 relative">
                      <Image
                        src={data.user.image as string}
                        alt={data.user.name}
                        fill
                        loading="lazy"
                      />
                    </div>
                    <h1 className="text-sm">By {data.user.name}</h1>
                  </div>
                </div>
              </div>
            </Link>
            {/* Action Buttons */}
            <div className="absolute top-2 left-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                className="bg-white text-gray-800 hover:bg-gray-100 cursor-pointer"
                size="icon"
                onClick={() => console.log("Download", data.products.id)}>
                <Download size={20} />
              </Button>
              <Button
                className="bg-white text-gray-800 hover:bg-gray-100 cursor-pointer"
                size="icon"
                onClick={() =>
                  console.log("Add to Collection", data.products.id)
                }>
                <Shapes size={20} />
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
}
