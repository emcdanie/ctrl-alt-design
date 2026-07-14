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
 * A missing/broken image falls back to the initial-letter tile — the
 * mount-time check covers 404s that resolve before hydration attaches onError.
 */
export default function LogoContainer({ src, alt, bg = "#E8E4DC", size = 44 }: LogoContainerProps) {
  const radius = Math.round(size * 0.22); // ~10px at 44px, scales with size
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
        background: failed ? "#E8E4DC" : bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      }}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          style={{ width: "78%", height: "78%", objectFit: "contain" }}
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: `${Math.round(size * 0.32)}px`,
            fontWeight: "var(--typography-font-weight-bold)",
            color: "#1A1A1A",
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
