import type { WorkItem } from "@/lib/workLibrary";
import Card from "@/components/ui/Card";
import styles from "./CaseCard.module.css";

/**
 * THE case card, on the ONE Card system (media variant). Image-led:
 * honest cover art (item.cover) or the muted warm placeholder; then
 * kicker / title / impact / skills. The whole card is one link with
 * hover lift, title underline, and a visible focus ring.
 */
export default function CaseCard({
  item,
  coverSrc,
}: {
  item: WorkItem;
  /** override cover (e.g. the featured CHIP still) */
  coverSrc?: string;
}) {
  const cover = coverSrc ?? item.cover;
  return (
    <Card
      href={item.href}
      accent={item.text}
      className={styles.caseCard}
      media={
        <>
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" loading="lazy" />
          ) : (
            <span className={styles.coverPlaceholder}>{item.title}</span>
          )}
          {/* the pill rides the cover (Elleta, 20 Jul): it never
              forces the eyebrow to wrap */}
          {item.featured && <span className={styles.tag}>Current focus</span>}
        </>
      }
    >
      <span className={styles.kicker} style={{ color: item.text }}>
        {item.kicker}
      </span>
      <span className={`heading-item ${styles.title}`}>{item.title}</span>
      <span className={`card-body ${styles.impact}`}>{item.impact}</span>
      <span className={styles.skills}>
        {item.skills.slice(0, 4).map((s) => (
          <span key={s} className={styles.skill}>
            {s}
          </span>
        ))}
      </span>
    </Card>
  );
}
