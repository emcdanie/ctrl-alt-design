import type { CSSProperties } from "react";
import type { CoverPicture as Picture } from "@/content/cases";
import { CoverPicture } from "@/components/case/pictures/Covers";
import styles from "./SpecimenFrame.module.css";

/* Site/Specimen frame, light (Gate 2, 3 Oct 2026): the case card's
   picture. A header strip (path left, mode right), the drawing on
   a faint grid at full ink with its one highlighted part in ochre, and a
   footer strip with a caption. The inset surface inside a raised
   card. Not the Atlas specimen: no pins, no legend. A picture: hidden
   from the accessibility tree, so the card's link name starts at its
   meta line. */
/* the phone crop as fractions of the picture, for the stage's CSS (X) */
const region = ({ phone: r, width, height }: Picture): Record<string, number> =>
  r ? { "--rx": r.x / width, "--ry": r.y / height, "--rw": r.w / width, "--rh": r.h / height, "--rp": (r.pad ?? 0) / width, "--ar": height / width } : {};

/* the shapes the light picture is cut to in dark on phones (see CoverPicture.phone.keepLight):
   a clipPath in the picture's own proportions, so it scales with it */
function KeepLightClip({ picture: { name, width: W, height: H, phone } }: { picture: Picture }) {
  const k = phone?.keepLight;
  if (!k) return null;
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <clipPath id={`keep-${name}`} clipPathUnits="objectBoundingBox">
        {k.rects.map(([x, y, w, h, r]) => (
          <rect key={`${x}-${y}`} x={x / W} y={y / H} width={w / W} height={h / H} rx={r / W} ry={r / H} />
        ))}
        {k.circles.map(([cx, cy, r]) => (
          <ellipse key={`${cx}-${cy}`} cx={cx / W} cy={cy / H} rx={r / W} ry={r / H} />
        ))}
      </clipPath>
    </svg>
  );
}

export default function SpecimenFrame({
  path,
  mode,
  caption,
  art,
  picture,
  eager,
}: {
  path: string;
  mode: string;
  caption: string;
  /** inner markup of a 300 x 180 data-bella-diagram drawing (workThumbs) */
  art?: string;
  /** the stage as a Figma picture, light and dark (job 43), in place of `art` */
  picture?: Picture;
  /** above the fold: load now, never wait for a scroll (job O2) */
  eager?: boolean;
}) {
  return (
    <span className={styles.frame} aria-hidden="true">
      <span className={styles.strip}>
        <span className={styles.path}>{path}</span>
        <span>{mode}</span>
      </span>
      <span
        className={`${styles.stage} ${picture ? styles.stagePicture : ""}`.trim()}
        data-region={picture?.phone ? "" : undefined}
        data-keep-light={picture?.phone?.keepLight ? "" : undefined}
        style={picture ? ({ "--cover-focus": picture.focus, ...region(picture), ...(picture.phone?.keepLight ? { "--keep-clip": `url(#keep-${picture.name})` } : {}) } as CSSProperties) : undefined}
      >
        {picture?.phone?.keepLight ? <KeepLightClip picture={picture} /> : null}
        {picture ? (
          <CoverPicture picture={picture} eager={eager} />
        ) : art ? (
          <svg viewBox="0 0 300 180" aria-hidden="true" data-bella-diagram dangerouslySetInnerHTML={{ __html: art }} />
        ) : null}
      </span>
      <span className={`${styles.strip} ${styles.foot}`}>{caption}</span>
    </span>
  );
}
