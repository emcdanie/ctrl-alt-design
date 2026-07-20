"use client";

import { useEffect, useRef, useState } from "react";

/* THE scaled demo frame (visual pass task 2, Elleta 20 Jul): every
 * case embed and activated prototype renders its FULL canvas at an
 * intrinsic design size (default 1280x800) and scales down
 * proportionally to the container. No internal scrolling, no
 * cropping, at every viewport. Non-interactive frames are for
 * viewing: pointer events are suppressed and the frame leaves the
 * tab order. */
export default function ScaledFrame({
  src,
  title,
  designWidth = 1280,
  designHeight = 800,
  interactive = false,
  onLoad,
}: {
  src: string;
  title: string;
  designWidth?: number;
  designHeight?: number;
  interactive?: boolean;
  onLoad?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const apply = () => setScale(el.clientWidth / designWidth);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [designWidth]);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: `${designWidth} / ${designHeight}`,
        overflow: "hidden",
      }}
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        onLoad={onLoad}
        tabIndex={interactive ? undefined : -1}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${designWidth}px`,
          height: `${designHeight}px`,
          border: "none",
          display: "block",
          transformOrigin: "top left",
          transform: scale === null ? undefined : `scale(${scale})`,
          visibility: scale === null ? "hidden" : "visible",
          pointerEvents: interactive ? "auto" : "none",
        }}
        allow={interactive ? "fullscreen" : undefined}
        allowFullScreen={interactive || undefined}
      />
    </div>
  );
}
