"use client";

import { duration, easing } from "@/lib/motion";
import { useInView } from "./useInView";
import { useReducedMotion } from "./useReducedMotion";

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  /** Start scale (0–1). Default: 0.92 */
  from?: number;
  ms?: number;
  className?: string;
}

/**
 * Viewport-triggered scale + fade entrance.
 * Ideal for cards, images, media blocks.
 */
export default function ScaleIn({
  children,
  delay = 0,
  from = 0.92,
  ms = duration.moderate,
  className,
}: ScaleInProps) {
  const { ref, inView } = useInView();
  const reduced = useReducedMotion();

  return (
    <div
      ref={ref}
      className={className}
      style={
        reduced
          ? { opacity: inView ? 1 : 0 }
          : {
              opacity: inView ? 1 : 0,
              transform: inView ? "scale(1)" : `scale(${from})`,
              transition: `opacity ${ms}ms ${easing.out} ${delay}ms, transform ${ms}ms ${easing.out} ${delay}ms`,
              willChange: "opacity, transform",
            }
      }
    >
      {children}
    </div>
  );
}
