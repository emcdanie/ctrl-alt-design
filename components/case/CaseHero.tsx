import Container from "@/components/layout/Container";
import Heading from "@/components/ui/Heading";
import CaseCollage, { type CollagePiece } from "./CaseCollage";
import styles from "./Case.module.css";

/* The case hero band (build-spec "Case hero band + showcase", Elleta,
   4 Oct late; Figma Template / Case page, the Hero slot): a white band the
   full page width, on the case body's frame. Left, the title (Display/Case
   title), a hairline, the meta row, the intro and, where Figure 1 used to
   carry one, the disclosure line; right, the collage of the case's own
   UI. Two columns from 960px (440 | 88 | 528 at 1440), stacked below
   (text first, 28 apart). CaseShowcase follows it on the grey ground.
   `case-hero` names the band for audit:frame (its h1 sits on the body's
   left edge, not the text column). */

export default function CaseHero({
  title,
  long = false,
  meta,
  intro,
  disclosure,
  collage,
}: {
  title: string;
  /** the long-title size, 56 (three lines at 1440) */
  long?: boolean;
  /** the meta row: left and right */
  meta: [string, string];
  intro: string;
  /** Body/Small under the intro (an NDA or concept-mock line) */
  disclosure?: string;
  collage: { label: string; pieces: CollagePiece[] };
}) {
  return (
    <div className={`case-hero ${styles.heroBand}`}>
      <Container className="container--case">
        <div className={styles.heroGrid}>
          <div className={styles.heroText}>
            <Heading tier="title" long={long} id="case-title">
              {title}
            </Heading>
            <span className={styles.heroRule} aria-hidden="true" />
            {/* two labels (Label/Table), not a paragraph */}
            <div className={styles.heroMeta}>
              <span>{meta[0]}</span>
              <span>{meta[1]}</span>
            </div>
            <p className={styles.heroIntro}>{intro}</p>
            {disclosure ? <p className={styles.heroDisclosure}>{disclosure}</p> : null}
          </div>
          <CaseCollage label={collage.label} pieces={collage.pieces} />
        </div>
      </Container>
    </div>
  );
}
