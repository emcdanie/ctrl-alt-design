import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import SpecimenFrame from "@/components/SpecimenFrame";
import { textLinkClass } from "@/components/ui/TextLink";
import { WORK_THUMBS } from "@/components/diagrams/workThumbs";
import { CoverProduct } from "@/components/case/pictures/Covers";
import type { CaseRowData } from "@/content/cases";
import styles from "./WorkLibrary.module.css";

/** THE case row (W1 release, 22 Sep 2026; mock Part A): the one way a
 *  case is listed, on /work (all of them) and Home (the first three).
 *  One ruled row, the whole row one link: a line thumbnail on the panel,
 *  the Mono meta line, the Geist Light title, the one-line claim, the
 *  signal tags. Hover lifts the row, underlines the title and eases the
 *  drawing up. Data: content/cases.ts. */
export default function CaseRow({ row, layout = "row" }: { row: CaseRowData; layout?: "row" | "featured" | "card" }) {
  if (layout !== "row") return <CaseCardLayout row={row} featured={layout === "featured"} />;
  return (
    <Link
      href={row.href ?? "/work"}
      className={styles.row}
      data-umami-event="case-open"
      data-umami-event-case={(row.href ?? "/work").split("/").pop()}
    >
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

/** Home · v2 (Gate 2, 3 Oct 2026): the case as one card. `featured` puts
 *  the specimen frame beside the text; `card` stacks it on top. The
 *  whole card is the link; a case that isn't live yet carries its status
 *  instead of "Read the case". */
function CaseCardLayout({ row, featured }: { row: CaseRowData; featured: boolean }) {
  const body = (
    <>
      <SpecimenFrame
        path={row.specimen?.path ?? row.title}
        mode={row.specimen?.mode ?? ""}
        caption={row.specimen?.caption ?? ""}
        art={WORK_THUMBS[row.id]}
        cover={row.specimen?.cover === "product" ? <CoverProduct slot="work" label={`${row.title}: a product card`} /> : undefined}
      />
      <span className={styles.cardBody}>
        <span className={styles.metaLine}>
          {row.n} · {row.meta}
          {row.lead ? <> · {row.lead}</> : null}
        </span>
        <span className={featured ? styles.cardTitleFeatured : styles.cardTitle}>{row.title}</span>
        <span className={styles.rowClaim}>{row.claim}</span>
        {row.tags.length ? (
          <span className={styles.rowTags}>
            {row.tags.map((t) => (
              <Tag key={t.text} tone={t.tone} outline={t.outline}>
                {t.text}
              </Tag>
            ))}
          </span>
        ) : null}
        <span className={styles.cardEnd}>
          {row.href ? (
            <span className={textLinkClass}>
              Read the case <span aria-hidden="true">→</span>
            </span>
          ) : row.status ? (
            <Tag>{row.status}</Tag>
          ) : null}
        </span>
      </span>
    </>
  );
  const cls = `${styles.card} ${featured ? styles.cardFeatured : ""}`;
  return row.href ? (
    <Link href={row.href} className={cls} data-umami-event="case-open" data-umami-event-case={row.href.split("/").pop()}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
