"use client";

import { duration, easing, distance as motionDistance } from "@/lib/motion";
import { useInView } from "./useInView";
import { useReducedMotion } from "./useReducedMotion";

interface SlideUpProps {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  ms?: number;
  className?: string;
}

/**
 * Viewport-triggered vertical slide entrance (no fade).
 * Good for elements that should feel like they're rising into place.
 */
export default function SlideUp({
  children,
  delay = 0,
  distance = motionDistance.medium,
  ms = duration.entrance,
  className,
}: SlideUpProps) {
  const { ref, inView } = useInView();
  const reduced = useReducedMotion();

  return (
    <div
      ref={ref}
      className={className}
      style={
        reduced
          ? {}
          : {
              transform: inView ? "translateY(0)" : `translateY(${distance}px)`,
              transition: `transform ${ms}ms ${easing.out} ${delay}ms`,
              willChange: "transform",
            }
      }
    >
      {children}
    </div>
  );
}
