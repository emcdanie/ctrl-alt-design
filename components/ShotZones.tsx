import type { CSSProperties } from "react";

/* ShotZones (Elleta, 20 Sep 2026, Part N item 3): a cropped screenshot
   with percent-positioned zones over it, so a LinkedPhrase can point at
   a part of a raster image the way it points at live DOM.

   Each zone carries a small iris number chip that matches the phrase's
   superscript, VISIBLE AT ALL TIMES. That is the answer to the problem
   the highlight-never-fade rule creates here: with nothing dimmed, an
   unlit zone on a picture would be invisible and a reader would have no
   way to know the picture has parts. The chips are aria-hidden, because
   the phrase already names the target and the image's alt already
   describes the whole thing; they are a visual index, not content.

   Lighting a phrase adds the ring and the soft fill to its zone.
   Nothing else changes and nothing fades. */
export type Zone = {
  /** the data-t key, and the phrase it belongs to */
  k: string;
  /** the superscript number the phrase shows */
  n: number;
  /** percentages, from the mock */
  left: number;
  top: number;
  width: number;
  height: number;
};

export default function ShotZones({
  src,
  alt,
  width,
  height,
  zones,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  zones: Zone[];
}) {
  return (
    /* never wider than half its pixels, so it stays sharp at 2x (Part W5) */
    <div className="shot" style={{ aspectRatio: `${width} / ${height}`, maxWidth: `${width / 2}px` } as CSSProperties}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="shot__img" src={src} alt={alt} width={width} height={height} />
      {zones.map((z) => (
        <span
          key={z.k}
          className="shot__zone"
          data-t={z.k}
          style={
            {
              left: `${z.left}%`,
              top: `${z.top}%`,
              width: `${z.width}%`,
              height: `${z.height}%`,
            } as CSSProperties
          }
        >
          <span className="shot__n" aria-hidden="true">
            {z.n}
          </span>
        </span>
      ))}
    </div>
  );
}
