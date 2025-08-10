import { Album, Bubbles, DatabaseZap, Image } from "lucide-react";

export default function WhyUs() {
  return (
    <div className=" min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-3xl font-bold font-stretch-90% text-center mb-6">
          Why us
        </h1>
        {/* content */}
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-14 ">
          {/* First grid */}
          <div className=" w-[400px] place-items-center space-y-5">
            <div>
              <Image strokeWidth={1} size={80} />
            </div>
            <div className="place-items-center space-y-5">
              <h1 className=" text-xl font-bold">Huge Content Library</h1>
              <p className="text-muted-foreground text-center">
                Download from millions of vectors, <br /> photos, images, and
                videos
              </p>
            </div>
          </div>
          {/* Second grid */}
          <div className=" w-[400px] place-items-center space-y-5">
            <div>
              <Album strokeWidth={1} size={80} />
            </div>
            <div className="place-items-center space-y-5">
              <h1 className=" text-xl font-bold">Simple Licensing</h1>
              <p className="text-muted-foreground text-center">
                Full commercial rights and no required <br /> attribution on
                Sellora Pro
              </p>
            </div>
          </div>
          {/* Third Grid */}
          <div className=" w-[400px] place-items-center space-y-5">
            <div>
              <Bubbles strokeWidth={1} size={80} />
            </div>
            <div className="place-items-center space-y-5">
              <h1 className=" text-xl font-bold">Fresh Content</h1>
              <p className="text-muted-foreground text-center">
                Thousands of new professional quality <br /> resources added
                every day
              </p>
            </div>
          </div>
          {/* Fourth grid */}
          <div className=" w-[400px] place-items-center space-y-5">
            <div>
              <DatabaseZap strokeWidth={1} size={80} />
            </div>
            <div className="place-items-center space-y-5">
              <h1 className=" text-xl font-bold">Flexible Plans</h1>
              <p className="text-muted-foreground text-center">
                Plan options to match every budget <br /> and content need{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
