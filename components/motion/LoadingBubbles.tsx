"use client";

import { useReducedMotion } from "./useReducedMotion";

interface LoadingBubblesProps {
  /** Number of bubbles. Default: 3 */
  count?: number;
  /** Bubble diameter in px. Default: 8 */
  size?: number;
  /** Color of the bubbles. Default: currentColor */
  color?: string;
  className?: string;
}

/**
 * Lightweight floating bubble loading indicator.
 * Three dots that gently bounce in sequence.
 * Respects reduced motion (static dots, no animation).
 */
export default function LoadingBubbles({
  count = 3,
  size = 8,
  color = "currentColor",
  className,
}: LoadingBubblesProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: `${size * 0.75}px`,
      }}
      role="status"
      aria-label="Loading"
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          style={{
            display: "block",
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "50%",
            backgroundColor: color,
            opacity: reduced ? 0.5 : undefined,
            animation: reduced
              ? "none"
              : `loadingBubble 1.2s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}
