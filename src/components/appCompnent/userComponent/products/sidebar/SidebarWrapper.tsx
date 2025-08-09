"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, PanelRightOpen } from "lucide-react";
import ProductSideBar from "./product-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useMediaQuery } from "react-responsive";
export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <section className=" relative flex transition-all duration-300">
      {!isMobile && (
        <div className=" w-64 sticky left-0 top-0 h-screen">
          <ProductSideBar />
        </div>
      )}

      {isMobile && <div></div>}

      <div className="  w-full">{children}</div>
    </section>
  );
}
