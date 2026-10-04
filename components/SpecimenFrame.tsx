import styles from "./SpecimenFrame.module.css";

/* Site/Specimen frame, light (Gate 2, 3 Oct 2026): the case card's
   picture. A header strip (Mono path left, mode right), the drawing on
   a faint grid at full ink with its one highlighted part in ochre, and a
   footer strip with a Mono caption. The inset surface inside a raised
   card. Not the Atlas specimen: no pins, no legend. A picture: hidden
   from the accessibility tree, so the card's link name starts at its
   meta line. */
export default function SpecimenFrame({
  path,
  mode,
  caption,
  art,
}: {
  path: string;
  mode: string;
  caption: string;
  /** inner markup of a 300 x 180 data-bella-diagram drawing (workThumbs) */
  art?: string;
}) {
  return (
    <span className={styles.frame} aria-hidden="true">
      <span className={`text-code ${styles.strip}`}>
        <span className={`text-code ${styles.path}`}>{path}</span>
        <span className="text-code">{mode}</span>
      </span>
      <span className={styles.stage}>
        {art ? (
          <svg viewBox="0 0 300 180" aria-hidden="true" data-bella-diagram dangerouslySetInnerHTML={{ __html: art }} />
        ) : (
          <span className={`text-code ${styles.empty}`}>redrawn diagram to come</span>
        )}
      </span>
      <span className={`text-code ${styles.strip} ${styles.foot}`}>{caption}</span>
    </span>
  );
}
