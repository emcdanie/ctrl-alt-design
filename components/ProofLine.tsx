import Link from "next/link";
import styles from "./ProofLine.module.css";

/* Site/Proof line (Gate 2, 3 Oct 2026): one proof point as a link to
   its evidence. A Mono label with an arrow, then one line at lead size
   in full ink. The whole item is the target. No display numbers. */
export default function ProofLine({ label, line, href }: { label: string; line: string; href: string }) {
  return (
    <Link href={href} className={styles.proof}>
      <span className={styles.label}>
        {label} <span aria-hidden="true">→</span>
      </span>
      <span className={styles.line}>{line}</span>
    </Link>
  );
}
