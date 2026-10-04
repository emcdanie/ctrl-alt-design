"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./Case.module.css";

/* The case hero's collage (build-spec "Case hero band + showcase", Elleta,
   4 Oct late): clones of the case's own picture components, tilted a few
   degrees and overlapping, no frame, fading into the band on all four
   edges. Laid out on a 528x480 canvas (the 1440 frame) and scaled to the
   box's width; the box is 528x480 at 1440 and 350x300 at 390, so the
   phone crops a little top and bottom, inside the fades. The collage is a
   picture: one role="img" with a label, everything inside aria-hidden. */

export const COLLAGE_W = 528;
export const COLLAGE_H = 480;

export type CollagePiece = {
  key: string;
  node: ReactNode;
  /** top-left on the 528x480 canvas */
  x: number;
  y: number;
  /** tilt in degrees, within ±6 */
  r?: number;
  /** a piece drawn smaller than its figure size, as the frame draws it */
  s?: number;
  /** the piece's box, for a piece that fills its figure's width or
   *  draws on a canvas of its own (a cover) */
  w?: number;
  h?: number;
  /** false: the 390 frame leaves this piece out */
  phone?: boolean;
};

export default function CaseCollage({ label, pieces }: { label: string; pieces: CollagePiece[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  useEffect(() => {
    const el = box.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const fit = () => setScale(el.clientWidth / COLLAGE_W);
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    fit();
    return () => ro.disconnect();
  }, []);
  return (
    <div
      className={styles.collage}
      ref={box}
      role="img"
      aria-label={label}
      style={scale == null ? undefined : ({ "--collage-scale": scale } as CSSProperties)}
    >
      <div className={styles.collageCanvas} style={{ width: COLLAGE_W, height: COLLAGE_H }} aria-hidden="true">
        {pieces.map((p) => (
          <div
            key={p.key}
            className={styles.collagePiece}
            data-phone={p.phone === false ? "off" : undefined}
            style={{ left: p.x, top: p.y, width: p.w, height: p.h, transform: `rotate(${p.r ?? 0}deg)${p.s ? ` scale(${p.s})` : ""}` }}
          >
            {p.node}
          </div>
        ))}
      </div>
    </div>
  );
}
