import type { CSSProperties } from "react";
import type { CoverPicture as Picture } from "@/content/cases";
import { WORK_CASES } from "@/content/cases";
import s from "./Covers.module.css";

/* The case covers, one source everywhere (job 43 + audit fix D1, Elleta,
   5 Oct 2026): Home, /work, Next case and More work all show the stage of
   Figma's "Covers final" row (529:84898), exported at 3x, one picture per
   theme. Pictures, because the recreated UI in them runs under the 14px
   floor at card size (CLAUDE.md section 9); the data is in content/cases.ts. */

export function CoverPicture({ picture, eager = false }: { picture: Picture; eager?: boolean }) {
  return (["light", "dark"] as const).map((t) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={t}
      className={s.picture}
      data-theme-only={t}
      src={`/images/case/covers/${picture.name}-${t}.webp`}
      width={picture.width}
      height={picture.height}
      alt={picture.alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  ));
}

/* the cover for a case by id, for the case end (Next case and More work) */
export function CaseCover({ id }: { id: string }) {
  const picture = WORK_CASES.find((c) => c.id === id)?.specimen?.picture;
  return picture ? <CoverStage picture={picture} /> : null;
}

/* the detail as fractions of the picture, for the stage's CSS: position, size,
   the room each side, the picture's aspect and its natural width (the sharp
   cap is half of it) */
const region = ({ detail: r, width, height }: Picture): Record<string, string | number> => ({
  "--rx": r.x / width,
  "--ry": r.y / height,
  "--rw": r.w / width,
  "--rh": r.h / height,
  "--rp": (r.pad ?? 0) / width,
  "--ar": height / width,
  "--pw": `${width}px`,
});

/* the shapes the light picture is cut to in dark (CoverPicture.detail.keepLight):
   a clipPath in the picture's own proportions, so it scales with it */
function KeepLightClip({ picture: { name, width: W, height: H, detail } }: { picture: Picture }) {
  const k = detail.keepLight;
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

/* THE cover stage (X2, 7 Oct 2026), the one every cover uses: Home, /work,
   Next case, More work. A fixed aspect per band (--cover-aspect: 4:3 phone,
   2:1 tablet, 4:3 desktop), sized from the card's own width, showing the
   cover's one detail centred, never scaled past half its pixels. */
export function CoverStage({ picture, eager = false }: { picture: Picture; eager?: boolean }) {
  return (
    <span
      className={s.stage}
      data-keep-light={picture.detail.keepLight ? "" : undefined}
      style={{ ...region(picture), ...(picture.detail.keepLight ? { "--keep-clip": `url(#keep-${picture.name})` } : {}) } as CSSProperties}
    >
      <KeepLightClip picture={picture} />
      <CoverPicture picture={picture} eager={eager} />
    </span>
  );
}
