"use client";

import { Masonry } from "masonic";
import Image from "next/image";
import { useSession } from "@/lib/authClient";
import Link from "next/link";
import { Download, Shapes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productWithUser } from "@/lib/types/productTypes";

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
    <div className=" w-full">
      <Masonry
        key={masonryKey}
        items={products}
        columnWidth={300}
        columnGutter={16}
        render={({ data }) => (
          <div className="w-full relative group rounded-lg overflow-hidden">
            <img
              src={data.products.thumbnailUrl ?? ""}
              alt={data.products.title}
              className="w-full h-auto object-contain group-hover:scale-110 transition-all duration-500"
              loading="lazy"
            />
            <Link href={`/products/${data.products.id}`}>
              <div className=" opacity-0 group-hover:opacity-100 absolute top-0 right-0 left-0 bg-gradient-to-t  from-black via-black/20 to-black/0 w-full h-full  px-5">
                <div className=" h-[100%] relative text-white mb-2 space-y-2 ">
                  <div className=" h-full place-content-end space-y-2 pb-4">
                    {/* Image title */}
                    <h1>{data.products.title}</h1>

                    {/* User info */}
                    <div className=" flex items-center gap-4">
                      <div className=" overflow-hidden rounded-full h-8 w-8 relative">
                        <Image
                          src={data.user.image as string}
                          alt={data.user.name}
                          fill
                          loading="lazy"
                        />
                      </div>

                      <h1 className=" text-sm"> By {data.user.name}</h1>
                    </div>
                  </div>

                  {/* Shortcuts */}
                  <div className=" absolute top-5 right-0  z-50">
                    <div className=" flex flex-col  gap-2 ">
                      <Button
                        className="bg-white  cursor-pointer hover:scale-105 text-gray-800 hover:bg-white"
                        size={"icon"}>
                        <Download size={20} />
                      </Button>
                      <Button
                        className="bg-white cursor-pointer hover:scale-105 text-gray-800 hover:bg-white"
                        size={"icon"}>
                        <Shapes size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
      />
    </div>
  );
}
