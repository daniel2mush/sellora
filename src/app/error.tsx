"use client";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className=" flex justify-center items-center min-h-screen">
      <div>
        <h2 className=" text-red-500 font-bold">Something went wrong!</h2>
        <Button
          className=" w-full cursor-pointer"
          variant={"destructive"}
          onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
