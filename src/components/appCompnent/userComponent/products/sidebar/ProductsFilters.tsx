"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Settings2,
  ImageIcon,
  Camera,
  FileImage,
  Layers,
  Globe,
  Star,
} from "lucide-react"; // Added relevant icons
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar"; // Assuming this is used elsewhere, kept it
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Added for potential close button
import { cn } from "@/lib/utils"; // Assuming cn utility for classnames

const ContentOptions = [
  { display: "All", value: "", icon: <Globe className="w-4 h-4" /> },
  { display: "Photos", value: "photos", icon: <Camera className="w-4 h-4" /> },
  { display: "PNGs", value: "pngs", icon: <FileImage className="w-4 h-4" /> },
  { display: "PSDs", value: "psds", icon: <Layers className="w-4 h-4" /> },
  { display: "SVGs", value: "svgs", icon: <Globe className="w-4 h-4" /> }, // Using Globe as a placeholder for vector-like
  {
    display: "Templates",
    value: "templates",
    icon: <Settings2 className="w-4 h-4" />,
  },
  { display: "Vectors", value: "vectors", icon: <Star className="w-4 h-4" /> }, // Star as placeholder
];

const LicenseOptions = [
  { display: "All", value: "", icon: <Globe className="w-4 h-4" /> },
  {
    display: "Free License",
    value: "freelicense",
    icon: <Star className="w-4 h-4 text-yellow-500" />,
  },
  {
    display: "Pro License",
    value: "prolicense",
    icon: <Settings2 className="w-4 h-4 text-blue-500" />,
  },
];

export default function ProductFilters({
  setOpenFilter,
}: {
  setOpenFilter: () => void;
}) {
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
    setOpenFilter();
    router.push(`?${currentParams.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <div className="space-y-6">
        {/* Content Section */}
        <div className="space-y-3 border-b pb-4">
          <h1 className="font-semibold text-lg flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-gray-600" />
            Content
          </h1>
          <RadioGroup
            value={contentType}
            onValueChange={(value) => handleFilterChange("content", value)}
            className="space-y-2">
            {ContentOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors",
                  contentType === option.value && "bg-gray-100"
                )}>
                <RadioGroupItem value={option.value} id={option.value} />
                {option.icon}
                <Label
                  className="text-gray-700 cursor-pointer"
                  htmlFor={option.value}>
                  {option.display}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* License Section */}
        <div className="space-y-3 border-b pb-4">
          <h1 className="font-semibold text-lg flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-gray-600" />
            License Type
          </h1>
          <RadioGroup
            value={licenseType}
            onValueChange={(value) => handleFilterChange("license", value)}
            className="space-y-2">
            {LicenseOptions.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors",
                  licenseType === option.value && "bg-gray-100"
                )}>
                <RadioGroupItem value={option.value} id={option.value} />
                {option.icon}
                <Label
                  className="text-gray-700 cursor-pointer"
                  htmlFor={option.value}>
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
