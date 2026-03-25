"use client";

import { duration, easing, distance as motionDistance } from "@/lib/motion";
import { useInView } from "./useInView";
import { useReducedMotion } from "./useReducedMotion";

interface FadeInProps {
  children: React.ReactNode;
  /** Delay in ms before the transition starts once visible */
  delay?: number;
  /** Y offset to slide up from (px). Default: distance.medium (24px) */
  distance?: number;
  /** Transition duration in ms. Default: duration.entrance (550ms) */
  ms?: number;
  /** HTML tag to render. Default: "div" */
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}

/**
 * Viewport-triggered fade-in + slide-up.
 * Respects prefers-reduced-motion (instant reveal, no slide).
 * Zero external dependencies.
 */
export default function FadeIn({
  children,
  delay = 0,
  distance = motionDistance.medium,
  ms = duration.entrance,
  as: Tag = "div",
  className,
}: FadeInProps) {
  const { ref, inView } = useInView();
  const reduced = useReducedMotion();

  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={ref}
      className={className}
      style={
        reduced
          ? { opacity: inView ? 1 : 0 }
          : {
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : `translateY(${distance}px)`,
              transition: `opacity ${ms}ms ${easing.out} ${delay}ms, transform ${ms}ms ${easing.out} ${delay}ms`,
              willChange: "opacity, transform",
            }
      }
    >
      {children}
    </Component>
  );
}
