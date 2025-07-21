"use client";

import dynamic from "next/dynamic";

const MasonryGrid = dynamic(() => import("./mansonry-grid"), {
  ssr: false,
});

export interface productTypes {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  isPublished: boolean | null;
  thumbnailUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

interface productProps {
  products: productTypes[];
}

export function ProductPage({ products }: productProps) {
  function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]; // make a copy to avoid mutating the original
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  const random = shuffleArray(products);
  return (
    <div className="px-4 md:px-10">
      <h1 className="text-4xl font-bold text-center mb-6">
        Expore our products
      </h1>
      <MasonryGrid products={products} />
    </div>
  );
}
