import type { CSSProperties, ReactNode } from "react";
import styles from "./GlassBanner.module.css";

/**
 * THE end-of-page CTA surface: a light frosted-glass gradient panel
 * (iris/periwinkle + mint over a light base; tint-over-navy in dark).
 * Replaces the dark background-inverse slabs. Driven entirely by the
 * --banner-* tokens in globals.css; content uses normal semantic inks
 * so text flips with the theme. Static surface, no motion. CTAs inside
 * stay the keycap Button.
 */
export default function GlassBanner({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      className={className ? `${styles.banner} ${className}` : styles.banner}
      style={style}
    >
      {children}
    </div>
  );
}
