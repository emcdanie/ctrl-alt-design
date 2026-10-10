import Link from "next/link";
import styles from "./ProofCard.module.css";

/* Site/Proof card (Elleta, 6 Oct 2026, H4; Figma "Home · v3 map · 1440"
   164:12263; supersedes 18d's quiet proof line): one proof point as a
   card on the surface. A 40x4 ochre bar, the claim as a card title, then
   the link line. The whole card is the one target. */
export default function ProofCard({ title, link, href }: { title: string; link: string; href: string }) {
  return (
    <Link href={href} className={styles.card} data-card>
      <span className={styles.bar} aria-hidden="true" />
      <span className={`${styles.title} heading-item`}>{title}</span>
      <span className={styles.link}>
        {link} <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
