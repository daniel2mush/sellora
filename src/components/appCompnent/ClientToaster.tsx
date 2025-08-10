"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export default function ClientToaster() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  });

  return mounted ? <Toaster richColors /> : null;
}
