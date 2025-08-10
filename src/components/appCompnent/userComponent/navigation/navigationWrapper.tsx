"use client";

import MobileNavigation from "./mobile";
import DesktopNavigation from "./desktop";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/authClient";

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    function Checker() {
      setIsMobile(window.innerWidth <= 767);
    }
    Checker();
    setIsMounted(true);
    // listener
    window.addEventListener("resize", Checker);
    // clean up
    return () => window.removeEventListener("resize", Checker);
  }, []);

  if (!isMounted) return null;

  const isUser = session?.user.role !== "admin";
  return (
    <section>
      {isUser && isMobile ? <MobileNavigation /> : <DesktopNavigation />}
      {children}
    </section>
  );
}
