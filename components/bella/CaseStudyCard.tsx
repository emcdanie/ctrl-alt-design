import Link from "next/link";
import styles from "./CaseStudyCard.module.css";

export type CaseStudyCoverVariant = "graphite" | "peri" | "sage";

export interface CaseStudyCardProps {
  cover: {
    variant: CaseStudyCoverVariant;
    /** mono kicker, e.g. "DESIGN SYSTEMS · 2024–2025" */
    kicker: string;
    /** "what's inside" ingredient lines */
    ingredients: string[];
    /** the project's token palette, rendered as a swatch row */
    swatches: string[];
  };
  title: string;
  description: string;
  href: string;
}

const COVER_VARIANT_CLASS: Record<CaseStudyCoverVariant, string> = {
  graphite: styles.coverGraphite,
  peri: styles.coverPeri,
  sage: styles.coverSage,
};

/**
 * "Ingredient label" case card (from _proto/_cards2.html): a coloured
 * label cover — kicker, one Fraunces title, what's-inside list, real
 * token swatches — over a warm-white body with the description and an
 * iris "Read case" cue. The whole card is one link.
 */
export default function CaseStudyCard({
  cover,
  title,
  description,
  href,
}: CaseStudyCardProps) {
  return (
    <article className={styles.card}>
      <Link href={href} className={styles.link}>
        <div className={`${styles.cover} ${COVER_VARIANT_CLASS[cover.variant]}`}>
          <div>
            <p className={styles.kicker}>{cover.kicker}</p>
            <h3 className={styles.coverTitle}>{title}</h3>
          </div>
          <div>
            <ul className={styles.ingredients}>
              {cover.ingredients.map((line) => (
                <li key={line}>◦ {line}</li>
              ))}
            </ul>
            <div className={styles.swatches} aria-hidden="true">
              {cover.swatches.map((color) => (
                <i key={color} style={{ background: color }} />
              ))}
            </div>
          </div>
        </div>
        <div className={styles.body}>
          <p className={styles.description}>{description}</p>
          <div className={styles.foot}>
            <span className={styles.read}>
              Read case <span className={styles.arrow} aria-hidden="true">→</span>
            </span>
            <span className={styles.brand}>ELLETA™</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
