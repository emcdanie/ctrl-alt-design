"use client";

import { useEffect, useState } from "react";
import { duration, easing } from "@/lib/motion";
import { useReducedMotion } from "./useReducedMotion";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps page content with a simple fade-in on mount.
 * Use in layout.tsx or individual page components.
 * Respects prefers-reduced-motion.
 */
export default function PageTransition({ children, className }: PageTransitionProps) {
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Small delay to ensure the transition is visible after hydration
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={className}
      style={
        reduced
          ? {}
          : {
              opacity: mounted ? 1 : 0,
              transition: `opacity ${duration.moderate}ms ${easing.out}`,
            }
      }
    >
      {children}
    </div>
  );
}
