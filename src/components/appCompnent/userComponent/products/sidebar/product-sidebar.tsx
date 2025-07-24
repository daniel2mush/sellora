"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Settings2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const ContentOptions = [
  { display: "All Images", value: "" },
  { display: "Photos", value: "photos" },
  { display: "PNGs", value: "pngs" },
  { display: "PSDs", value: "psds" },
  { display: "SVGs", value: "svgs" },
  { display: "Templates", value: "templates" },
  { display: "Vectors", value: "vectors" },
];

const LicenseOptions = [
  { display: "All", value: "" },
  { display: "Free License", value: "freelicense" },
  { display: "Pro License", value: "prolicense" },
];

export default function ProductSideBar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const contentType = searchParams.get("content") || "";
  const licenseType = searchParams.get("license") || "";

  const handleFilterChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", "1"); // Reset to page 1 on filter change
    if (value) {
      currentParams.set(key, value);
    } else {
      currentParams.delete(key);
    }
    router.push(`?${currentParams.toString()}`);
  };

  return (
    <div className="w-full border-r px-4 pt-6 h-full">
      <div className="font-bold text-xl">
        <h1 className="flex font-bold gap-4">
          <Settings2 />
          Filters
        </h1>
      </div>
      <div className="mt-10">
        {/* Content */}
        <div className="space-y-4 border-y py-3">
          <h1 className="font-bold text-[15px]">Content</h1>
          <RadioGroup
            value={contentType}
            onValueChange={(value) => handleFilterChange("content", value)}>
            {ContentOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-3">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label className="text-muted-foreground" htmlFor={option.value}>
                  {option.display}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        {/* License */}
        <div className="space-y-4 border-y py-3">
          <h1 className="font-bold text-[15px]">License Type</h1>
          <RadioGroup
            value={licenseType}
            onValueChange={(value) => handleFilterChange("license", value)}>
            {LicenseOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-3">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label className="text-muted-foreground" htmlFor={option.value}>
                  {option.display}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
