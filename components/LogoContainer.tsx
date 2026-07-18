"use client";

import { useEffect, useRef, useState } from "react";

interface LogoContainerProps {
  src?: string;
  alt: string;
  bg?: string;
  /** Pixel size applied to both width and height. Default: 44 */
  size?: number;
}

/**
 * Consistent square logo container used across ExperienceSection,
 * CaseStudyGrid, and any other place that renders a company/client logo.
 * One warm neutral tile for every logo by default (linen token); pass `bg`
 * only when a mark genuinely needs a dark tile for contrast. Logos never
 * crop or distort: object-fit contain inside consistent padding.
 * A missing/broken image falls back to the initial-letter tile — the
 * mount-time check covers 404s that resolve before hydration attaches onError.
 */
export default function LogoContainer({
  src,
  alt,
  bg = "var(--color-supporting-linen)",
  size = 48,
}: LogoContainerProps) {
  const radius = Math.round(size * 0.22); // ~10px at 48px, scales with size
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  const showImg = !!src && !failed;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${radius}px`,
        background: failed ? "var(--color-supporting-linen)" : bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
        // consistent breathing room: image fills the rest via contain
        padding: `${Math.round(size * 0.075)}px`,
        border: "1px solid var(--color-semantic-border-subtle)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--typography-font-size-base)",
            fontWeight: "var(--typography-font-weight-bold)",
            color: "var(--color-ink)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {alt.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
