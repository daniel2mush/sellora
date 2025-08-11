import { getImageUrl } from "@/lib/shared/get-image";
import { Search } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  const backgroundStyle: React.CSSProperties = {
    backgroundImage: `url(${getImageUrl(`Background${4}.jpg`)})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
  return (
    <div style={backgroundStyle} className=" h-full min-h-[450px] w-full ">
      <div className=" bg-black/50 w-full min-h-[450px] flex items-center justify-center px-10">
        <div className=" space-y-20">
          {/* Text section */}
          <div className=" space-y-3">
            <h1 className="  text-center text-3xl lg:text-5xl font-stretch-90% font-black text-white">
              Download Free Vectors, Stock Photos, <br /> Stock Videos, and More
            </h1>
            <p className=" text-xl font-medium text-white text-center">
              Professional quality creative resources to get your projects done
              faster.
            </p>
          </div>
          {/* Search section */}
          <div className=" h-15  bg-white rounded-2xl flex justify-center items-center space-x-4 overflow-clip ">
            {/* Sellora logo */}
            <div className=" bg-black p-3 h-full w-50 text-white flex items-center justify-center ">
              <div className="  relative w-20 md:w-32  h-16">
                <Image
                  src={"/Logo.png"}
                  alt="logo"
                  fill
                  className=" filter invert dark:invert-0 object-contain"
                />
              </div>{" "}
            </div>
            {/* Search input */}
            <div className=" flex-11/12 w-full flex justify-center items-center pr-6">
              <input
                type="text"
                placeholder="Search vectors...."
                className=" w-full active:outline-none focus:outline-none placeholder:font-bold"
              />
              <Search className=" text-gray-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
