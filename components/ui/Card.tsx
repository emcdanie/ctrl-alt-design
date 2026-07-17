import type { CSSProperties, ReactNode } from "react";
import styles from "./Card.module.css";

export interface CardProps {
  /** identity colour driving the animated border trace + dark halo (default iris) */
  accent?: string;
  /** extra classes on the outer trace wrapper */
  className?: string;
  /** extra classes on the inner glass panel (e.g. custom padding/layout) */
  innerClassName?: string;
  /**
   * "default": theme-aware panel (--color-card, flips navy in dark).
   * "peek": the fixed always-light reveal panel (--hero-panel-*), for
   * elements that float light on navy (the bubble-cluster open peek).
   */
  variant?: "default" | "peek";
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * The animated-border reveal card from the bubble cluster, promoted to a
 * reusable primitive: a conic-gradient border that traces in light mode and a
 * soft identity-colour halo in dark, over a glass inner panel. Honours
 * prefers-reduced-motion (the border freezes). Pass `accent` for the identity
 * colour; defaults to iris. Use everywhere a bordered card is needed so the
 * treatment stays one system.
 */
export default function Card({
  accent = "var(--hero-iris-bright)",
  className,
  innerClassName,
  variant = "default",
  style,
  children,
}: CardProps) {
  const inner = [styles.inner, variant === "peek" ? styles.innerPanel : "", innerClassName]
    .filter(Boolean)
    .join(" ");
  return (
    <div
      className={className ? `${styles.card} ${className}` : styles.card}
      style={{ ["--cc" as string]: accent, ...style }}
    >
      <div className={inner}>{children}</div>
    </div>
  );
}
