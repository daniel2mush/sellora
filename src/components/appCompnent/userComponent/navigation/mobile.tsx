import { Button } from "@/components/ui/button";
import { DollarSign, FolderHeart, Home, Menu, Compass, X } from "lucide-react";
// Changed Shapes → Compass for "Explore"
import Image from "next/image";
import MoreOption from "../more/MoreOption";
import { useState } from "react";
import { useSession } from "@/lib/authClient";
import Link from "next/link";

export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const navMenu = [
    {
      name: "Home",
      path: "/",
      icon: <Home size={18} />, // Slightly bigger for better tap targets
    },
    {
      name: "Explore",
      path: "/products",
      icon: <Compass size={18} />, // More universal for "discover/browse"
    },
  ];

  const navSession = [
    {
      name: "Purchases",
      path: "/dashboard/purchases",
      icon: <DollarSign size={18} />,
    },
    {
      name: "Collections",
      path: "/dashboard/collection",
      icon: <FolderHeart size={18} />, // Suggests saved items/favorites
    },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white">
      {/* Trigger */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <Menu />
          </Button>
          <div className="relative w-28 h-10">
            <Image src="/Logo.png" alt="Logo" fill className="object-contain" />
          </div>
        </div>
        <MoreOption />
      </div>

      {/* Sidebar */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 z-50 h-screen bg-black/20">
          <div
            onClick={(e) => e.stopPropagation()} // Prevent click closing when inside menu
            className="h-screen w-60 bg-white pt-5 px-5 shadow-lg">
            {/* Logo */}
            <div className=" flex justify-between items-center">
              <div className="relative w-28 h-10 mb-4">
                <Image
                  src="/Logo.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <Button onClick={() => setOpen(false)} variant={"ghost"}>
                {" "}
                <X size={18} />
              </Button>
            </div>

            {/* Menu Options */}
            <nav>
              {navMenu.map((n) => (
                <Link
                  onClick={() => setOpen(false)}
                  key={n.path}
                  href={n.path}
                  className="py-2 flex gap-3 items-center hover:bg-gray-100 px-3 rounded-md transition">
                  {n.icon}
                  <span>{n.name}</span>
                </Link>
              ))}

              {session?.user && (
                <div className="mt-4 border-t border-gray-200 pt-2">
                  {navSession.map((n) => (
                    <Link
                      onClick={() => setOpen(false)}
                      key={n.path}
                      href={n.path}
                      className="py-2 flex gap-3 items-center hover:bg-gray-100 px-3 rounded-md transition">
                      {n.icon}
                      <span>{n.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
