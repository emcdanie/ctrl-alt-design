"use client";

import { duration, easing, distance } from "@/lib/motion";
import { useReducedMotion } from "./useReducedMotion";

interface HoverLiftProps {
  children: React.ReactNode;
  /** Lift distance in px. Default: distance.micro (3px) */
  lift?: number;
  /** Hover shadow. Default: subtle elevation shadow */
  shadow?: string;
  className?: string;
}

/**
 * Standardized hover lift effect for interactive cards.
 * Animates transform + box-shadow on hover.
 * Falls back to subtle opacity change when reduced motion is on.
 */
export default function HoverLift({
  children,
  lift = distance.micro,
  shadow = "0 12px 32px rgba(44, 24, 16, 0.08)",
  className,
}: HoverLiftProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={`group ${className ?? ""}`}
      style={{
        transition: reduced
          ? `opacity ${duration.fast}ms ${easing.default}`
          : `transform ${duration.normal}ms ${easing.out}, box-shadow ${duration.normal}ms ${easing.out}`,
      }}
      onMouseEnter={(e) => {
        if (reduced) {
          e.currentTarget.style.opacity = "0.85";
        } else {
          e.currentTarget.style.transform = `translateY(-${lift}px)`;
          e.currentTarget.style.boxShadow = shadow;
        }
      }}
      onMouseLeave={(e) => {
        if (reduced) {
          e.currentTarget.style.opacity = "1";
        } else {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }
      }}
    >
      {children}
    </div>
  );
}
