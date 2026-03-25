"use client";

import { stagger as staggerTokens } from "@/lib/motion";
import { useInView } from "./useInView";

interface StaggerContainerProps {
  children: React.ReactNode;
  /** Delay between items in ms. Default: stagger.default (80ms) */
  stagger?: number;
  className?: string;
}

/**
 * Container that provides stagger timing context to child StaggerItems.
 * When the container enters the viewport, children animate in sequence.
 *
 * Uses CSS custom property --stagger-index set on each StaggerItem
 * to calculate individual delays.
 */
export default function StaggerContainer({
  children,
  stagger = staggerTokens.default,
  className,
}: StaggerContainerProps) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={className}
      data-stagger-visible={inView ? "true" : "false"}
      style={{ "--stagger-ms": `${stagger}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
