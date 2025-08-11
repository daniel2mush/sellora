"use client";

import Image from "next/image";

const images = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  src: `/Mansonry/Mansonry${i + 1}.jpg`,
}));

export default function Trending() {
  return (
    <div className="px-4 md:px-10 my-10  ">
      <h1 className="text-3xl font-bold font-stretch-90% text-center mb-6">
        Trending Images!
      </h1>

      <div className=" w-full h-[300] grid grid-cols-4 gap-2 ">
        {images.map((data) => (
          <div
            key={data.id}
            className=" relative aspect-auto w-full overflow-hidden">
            <Image
              src={data.src}
              alt={`Image ${data.id}`}
              className="rounded-lg w-full object-cover"
              fill
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
