import { Check } from "lucide-react";
import Image from "next/image";

export default function JoinToday() {
  //   const value = ["Millions of Pro only resources
  // Unlimited downloads
  // Full commerical rights
  // No attribution required
  // Download bundles and collections
  // Faster downloads and no ads
  // Priority support"]

  const stringList = [
    "Millions of Pro only resources",
    "Unlimited downloads",
    "Full commerical rights",
    "No attribution required",
    "Download bundles and collections",
    "Faster downloads and no ads",
    "Priority support",
  ];
  return (
    <div className=" px-10 my-10 ">
      <div className=" grid grid-cols-1 lg:grid-cols-2">
        {/* Frist div */}
        <div className=" relative aspect-video rounded-2xl overflow-clip">
          <Image
            src={"/joinUs.jpg"}
            alt="join-us"
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
        {/* Second div */}
        <div className=" mt-10 lg:mt-0 lg:pl-10 ">
          <div>
            <h1 className="text-4xl font-bold  mb-6">
              {" "}
              Join Sellora pro Today
            </h1>
          </div>
          <div className=" space-y-4">
            {stringList.map((l, i) => (
              <div key={i} className=" flex items-center gap-3">
                <div className=" w-5 h-5 rounded-full bg-green-400 text-white p-1 font-bold flex items-center justify-center">
                  <Check strokeWidth={5} size={15} />
                </div>
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
