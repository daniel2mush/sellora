"use client";

import { useMediaQuery } from "react-responsive";
import MobileNavigation from "./mobile";
import DesktopNavigation from "./desktop";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/authClient";

export function NavigationWrapper({ children }: { children: React.ReactNode }) {
  // const isMobile = useMediaQuery({ maxWidth: 767 });

  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    function Checker() {
      setIsMobile(window.innerWidth <= 767);
    }
    Checker();
    // listener
    window.addEventListener("resize", Checker);
    // clean up
    return () => window.removeEventListener("resize", Checker);
  }, []);

  const isUser = session?.user.role !== "admin";

  return (
    <section>
      {isUser ? isMobile ? <MobileNavigation /> : <DesktopNavigation /> : null}

      {children}
    </section>
  );
}
