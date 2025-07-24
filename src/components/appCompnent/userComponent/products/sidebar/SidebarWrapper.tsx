"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PanelRightOpen } from "lucide-react";
import ProductSideBar from "./product-sidebar";
export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <section className=" relative flex transition-all duration-300">
      {showSidebar && (
        <div className=" w-64 sticky left-0 top-0 h-screen">
          <ProductSideBar />
        </div>
      )}

      <div className="  w-full">{children}</div>
    </section>
  );
}
