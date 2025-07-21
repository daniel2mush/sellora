"use client";

import { Masonry } from "masonic";
import { productTypes } from "./productPage";

export default function MasonryGrid({
  products,
}: {
  products: productTypes[];
}) {
  return (
    <Masonry
      items={products}
      columnWidth={300}
      columnGutter={16}
      columnCount={4}
      render={({ data }) => (
        <div className="w-full rounded-lg overflow-hidden">
          <img
            src={data.thumbnailUrl ?? ""}
            alt={data.title}
            className="w-full h-auto object-contain"
            loading="lazy"
          />
        </div>
      )}
    />
  );
}
