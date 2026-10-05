import type { CoverPicture as Picture } from "@/content/cases";
import { WORK_CASES } from "@/content/cases";
import s from "./Covers.module.css";

/* The case covers, one source everywhere (job 43 + audit fix D1, Elleta,
   5 Oct 2026): Home, /work, Next case and More work all show the stage of
   Figma's "Covers final" row (529:84898), exported at 3x, one picture per
   theme. Pictures, because the recreated UI in them runs under the 14px
   floor at card size (CLAUDE.md section 9); the data is in content/cases.ts. */

export function CoverPicture({ picture }: { picture: Picture }) {
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
      loading="lazy"
      decoding="async"
    />
  ));
}

/* the cover for a case by id, for the case end (Next case and More work) */
export function CaseCover({ id }: { id: string }) {
  const picture = WORK_CASES.find((c) => c.id === id)?.specimen?.picture;
  return picture ? <CoverPicture picture={picture} /> : null;
}
