import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className=" flex justify-center items-center min-h-[60vh]">
      <div className=" w-full max-w-lg space-y-6 flex justify-center items-center flex-col">
        <div className=" space-x-5 w-full max-w-lg flex justify-center items-center">
          <h1 className=" text-9xl font-black">404</h1>

          <h2 className=" text-6xl">Page not found!</h2>
        </div>
        <p className=" text-center">
          Sorry the page you are looking for is not found or might have been
          moved
        </p>
        <Button className=" w-full">
          <Link href={"/"}>Go to HomePage</Link>
        </Button>
      </div>
    </div>
  );
}
