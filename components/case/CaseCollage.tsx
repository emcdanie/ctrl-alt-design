"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./Case.module.css";

/* The case hero's collage (build-spec "Case hero band + showcase", Elleta,
   4 Oct late; straightened 5 Oct, job 34: "why do you keep making things
   crooked"): clones of the case's own picture components, straight and
   overlapping, no frame and no fades. Laid out on a 528x480 canvas (the
   1440 frame, Figma straighten pass) and scaled to the box's width at
   every width, so every piece sits fully inside the box: nothing with
   text or a control is ever cut. A piece's x/y is its drawn top-left
   (scale grows from that corner), so the numbers read straight off the
   Figma frame. The collage is a picture: one role="img" with a label,
   everything inside aria-hidden. */

export const COLLAGE_W = 528;
export const COLLAGE_H = 480;

export type CollagePiece = {
  key: string;
  node: ReactNode;
  /** the drawn top-left on the 528x480 canvas */
  x: number;
  y: number;
  /** a piece drawn smaller than its figure size, as the frame draws it */
  s?: number;
  /** the piece's box, for a piece that fills its figure's width or
   *  draws on a canvas of its own (a cover) */
  w?: number;
  h?: number;
  /** false: the 390 frame leaves this piece out */
  phone?: boolean;
};

export default function CaseCollage({
  label,
  pieces,
  phone,
  phoneLabel,
}: {
  label: string;
  pieces: CollagePiece[];
  /** below 640px: this one card at its own size instead of the collage */
  phone?: ReactNode;
  /** the phone card's own name (it shows one card, not the collage) */
  phoneLabel?: string;
}) {
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
  const collage = (
    <div
      className={styles.collage}
      data-has-phone={phone ? "" : undefined}
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
            data-key={p.key}
            data-phone={p.phone === false ? "off" : undefined}
            style={{ left: p.x, top: p.y, width: p.w, height: p.h, transform: p.s ? `scale(${p.s})` : undefined }}
          >
            {p.node}
          </div>
        ))}
      </div>
    </div>
  );
  if (!phone) return collage;
  return (
    <>
      {collage}
      <div className={styles.collagePhone} role="img" aria-label={phoneLabel ?? label}>
        <div aria-hidden="true">{phone}</div>
      </div>
    </>
  );
}
