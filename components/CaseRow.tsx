import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { WORK_THUMBS } from "@/components/diagrams/workThumbs";
import type { CaseRowData } from "@/content/cases";
import styles from "./WorkLibrary.module.css";

/** THE case row (W1 release, 22 Sep 2026; mock Part A): the one way a
 *  case is listed, on /work (all of them) and Home (the first three).
 *  One ruled row, the whole row one link: a line thumbnail on the panel,
 *  the Mono meta line, the Geist Light title, the one-line claim, the
 *  signal tags. Hover lifts the row, underlines the title and eases the
 *  drawing up. Data: content/cases.ts. */
export default function CaseRow({ row }: { row: CaseRowData }) {
  return (
    <Link href={row.href} className={styles.row}>
      <span className={styles.thumb}>
        <svg viewBox="0 0 300 180" aria-hidden="true" data-bella-diagram dangerouslySetInnerHTML={{ __html: WORK_THUMBS[row.id] }} />
      </span>
      <span className={styles.rowBody}>
        <span className={styles.metaLine}>
          {row.n} · {row.meta}
          {row.lead ? <> · {row.lead}</> : null}
        </span>
        <span className={styles.rowTitle}>{row.title}</span>
        <span className={styles.rowClaim}>{row.claim}</span>
        <span className={styles.rowTags}>
          {row.tags.map((t) => (
            <Tag key={t.text} tone={t.tone} outline={t.outline}>
              {t.text}
            </Tag>
          ))}
        </span>
      </span>
    </Link>
  );
}

/** The ruled list the rows sit in. */
export function CaseRowList({ rows }: { rows: CaseRowData[] }) {
  return (
    <ul className={styles.index} role="list">
      {rows.map((row) => (
        <li key={row.id}>
          <CaseRow row={row} />
        </li>
      ))}
    </ul>
  );
}
