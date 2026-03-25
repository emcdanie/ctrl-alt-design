"use client";

import { useEffect } from "react";
import { initWebVitals } from "@/lib/web-vitals";
import { initA11yAudit } from "@/lib/a11y-dev";

/**
 * Dev-only component that initializes:
 *  - Web Vitals monitoring (LCP, CLS, INP, FCP)
 *  - Accessibility auditing (axe-core)
 *
 * Renders nothing. Only active in development.
 * Include once in layout.tsx.
 */
export default function DevTools() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    initWebVitals();
    initA11yAudit();
  }, []);

  return null;
}
