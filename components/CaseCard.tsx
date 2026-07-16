import Link from "next/link";
import type { WorkItem } from "@/lib/workLibrary";
import styles from "./CaseCard.module.css";

/**
 * THE case card (IA: one card, used by the dashboard and the library).
 * Image-led: a branded cover slot on top (muted warm placeholder until
 * real cover art lands — no flat colour blocks, no swatch dots; the
 * case colour appears only in the kicker), then kicker / title / impact
 * / skills. The whole card is one link.
 */
export default function CaseCard({
  item,
  coverSrc,
}: {
  item: WorkItem;
  /** real cover art when available; falls back to the warm placeholder */
  coverSrc?: string;
}) {
  return (
    <Link href={item.href} className={styles.card}>
      <span className={styles.cover} aria-hidden="true">
        {coverSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverSrc} alt="" className={styles.coverImg} />
        ) : (
          <span className={styles.coverPlaceholder}>{item.title}</span>
        )}
      </span>
      <span className={styles.body}>
        <span className={styles.kicker} style={{ color: item.text }}>
          {item.kicker}
          {item.featured && <span className={styles.tag}>Current focus</span>}
        </span>
        <span className={styles.title}>{item.title}</span>
        <span className={styles.impact}>{item.impact}</span>
        <span className={styles.skills}>
          {item.skills.slice(0, 4).map((s) => (
            <span key={s} className={styles.skill}>
              {s}
            </span>
          ))}
        </span>
      </span>
    </Link>
  );
}
