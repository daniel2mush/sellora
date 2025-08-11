import Image from "next/image";

export default function ContentType() {
  const gridContent = [
    {
      image: "/content/Content1.webp",
      name: "PNGs",
    },
    {
      image: "/content/Content2.webp",
      name: "Bundles",
    },
    {
      image: "/content/Content3.webp",
      name: "Templates",
    },
    {
      image: "/content/Content4.webp",
      name: "Photos",
    },
    {
      image: "/content/Content5.webp",
      name: "Vectors",
    },
  ];
  return (
    <div className=" h-350px] flex justify-center items-center py-10 ">
      <div className=" w-full px-14 space-y-14">
        {/* Heading */}
        <div>
          <h1 className=" text-3xl font-stretch-90%  font-bold text-center">
            Browse Content
          </h1>
        </div>
        {/* Grids */}
        <div className=" grid gap-4 grid-cols-2  lg:grid-cols-5 w-full">
          {gridContent.map((g, i) => (
            <div key={i} className=" space-y-3 place-items-center">
              {/* image container */}
              <div className=" relative aspect-video w-full rounded-2xl overflow-clip">
                <Image
                  src={g.image}
                  alt={g.name}
                  fill
                  className=" object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <h1 className=" font-bold">{g.name}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
