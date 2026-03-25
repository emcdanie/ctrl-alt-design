"use client";

import { duration, easing, distance } from "@/lib/motion";
import { useReducedMotion } from "./useReducedMotion";

interface StaggerItemProps {
  children: React.ReactNode;
  /** Zero-based index of this item in the stagger sequence */
  index: number;
  /** Base stagger delay per item (ms). Default: 80ms */
  stagger?: number;
  /** Whether the parent container is in view */
  visible?: boolean;
  className?: string;
}

/**
 * Individual item within a stagger sequence.
 * Can be used standalone (pass visible prop) or read from
 * a parent StaggerContainer via data attribute.
 *
 * Renders a fade-in + slide-up with computed stagger delay.
 */
export default function StaggerItem({
  children,
  index,
  stagger = 80,
  visible,
  className,
}: StaggerItemProps) {
  const reduced = useReducedMotion();
  const delay = index * stagger;

  return (
    <div
      className={className}
      data-stagger-index={index}
      style={
        reduced
          ? { opacity: visible ? 1 : 0 }
          : {
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : `translateY(${distance.small}px)`,
              transition: `opacity ${duration.moderate}ms ${easing.out} ${delay}ms, transform ${duration.moderate}ms ${easing.out} ${delay}ms`,
              willChange: "opacity, transform",
            }
      }
    >
      {children}
    </div>
  );
}
