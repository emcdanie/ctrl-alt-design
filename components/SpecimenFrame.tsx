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
export default function SpecimenFrame({
  path,
  mode,
  caption,
  art,
  picture,
}: {
  path: string;
  mode: string;
  caption: string;
  /** inner markup of a 300 x 180 data-bella-diagram drawing (workThumbs) */
  art?: string;
  /** the stage as a Figma picture, light and dark (job 43), in place of `art` */
  picture?: Picture;
}) {
  return (
    <span className={styles.frame} aria-hidden="true">
      <span className={styles.strip}>
        <span className={styles.path}>{path}</span>
        <span>{mode}</span>
      </span>
      <span className={`${styles.stage} ${picture ? styles.stagePicture : ""}`.trim()}>
        {picture ? (
          <CoverPicture picture={picture} />
        ) : art ? (
          <svg viewBox="0 0 300 180" aria-hidden="true" data-bella-diagram dangerouslySetInnerHTML={{ __html: art }} />
        ) : null}
      </span>
      <span className={`${styles.strip} ${styles.foot}`}>{caption}</span>
    </span>
  );
}
