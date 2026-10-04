"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Case.module.css";

/* A picture drawn at its frame's design width and scaled down to fit the
   stage, type included, never reflowed (Site v3 rules: "scale the picture
   to fit, never the type outside it"). Below the design width it shrinks;
   it never grows past it. */
export default function ScaledArt({ width, children }: { width: number; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    const el = box.current;
    const art = inner.current;
    if (!el || !art || typeof ResizeObserver === "undefined") return;
    const fit = () => {
      const s = Math.min(1, el.clientWidth / width);
      setScale(s);
      setHeight(art.offsetHeight * s);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    ro.observe(art);
    fit();
    return () => ro.disconnect();
  }, [width]);
  return (
    <div className={styles.scaled} ref={box} style={{ height }}>
      <div className={styles.scaledInner} ref={inner} style={{ width, transform: scale < 1 ? `scale(${scale})` : undefined }}>
        {children}
      </div>
    </div>
  );
}
