import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import styles from "./Card.module.css";

export interface CardProps {
  /** identity colour driving the border tint + hover trace (default iris) */
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
  /**
   * Image variant: full-bleed cover media above the padded body, with
   * the token scrim (--scrim-media) so text over the image stays AA.
   */
  media?: ReactNode;
  /** whole card is ONE link (internal or external), no nested links */
  href?: string;
  /** whole card is ONE button (e.g. opens a modal) */
  onClick?: () => void;
  ariaLabel?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * THE card (one card system, 2026-07-17): every card surface renders
 * through this. Calm at rest (1px accent-tinted border, soft shadow),
 * trace on hover/focus; media cards add a covered top with a token
 * scrim; interactive cards (href/onClick) are a single anchor/button
 * with a visible focus ring and hover lift.
 */
export default function Card({
  accent = "var(--hero-iris-bright)",
  className,
  innerClassName,
  variant = "default",
  media,
  href,
  onClick,
  ariaLabel,
  style,
  children,
}: CardProps) {
  const outerClass = [styles.card, "trace-host", href || onClick ? styles.interactive : "", className]
    .filter(Boolean)
    .join(" ");
  const inner = [
    styles.inner,
    variant === "peek" ? styles.innerPanel : "",
    media != null ? styles.innerFlush : "",
    innerClassName,
  ]
    .filter(Boolean)
    .join(" ");
  const outerStyle = { ["--cc" as string]: accent, ...style };

  const content = (
    <div className={inner}>
      {media != null && (
        <div className={styles.media} aria-hidden={ariaLabel ? true : undefined}>
          {media}
          <span className={styles.scrim} aria-hidden="true" />
        </div>
      )}
      {media != null ? <div className={styles.body}>{children}</div> : children}
    </div>
  );

  if (href) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={outerClass}
          style={outerStyle}
          aria-label={ariaLabel}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={outerClass} style={outerStyle} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={outerClass} style={outerStyle} aria-label={ariaLabel}>
        {content}
      </button>
    );
  }
  return (
    <div className={outerClass} style={outerStyle}>
      {content}
    </div>
  );
}
