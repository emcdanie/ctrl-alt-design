import type { ReactNode } from "react";
import Heading from "@/components/ui/Heading";
import { Tag } from "@/components/ui/Tag";

/**
 * The numbered section: index label | heading, lede, body | side slot.
 * About and Work both build their pages from it. Sections are separated
 * by a thin rule, never a card. One column on phones.
 *
 * The heading takes one iris `accent` word; `after` carries whatever
 * follows it, e.g. title="A shared language, not a" accent="rulebook"
 * after=".".
 */
export default function Section({
  index,
  label,
  title,
  accent,
  after,
  lede,
  side,
  id,
  children,
}: {
  /** "01" */
  index: string;
  /** "the short version" */
  label: string;
  title: ReactNode;
  accent?: ReactNode;
  after?: ReactNode;
  lede?: ReactNode;
  /** optional right column: SectionList, SectionTags, or other content */
  side?: ReactNode;
  id?: string;
  /** the body copy */
  children?: ReactNode;
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} className="section-row" aria-labelledby={headingId}>
      <div className="page-container">
        <div className="section-row__grid">
          <p className="section-row__meta">
            <span className="section-row__num">{index}</span> / {label}
          </p>
          <div className="section-row__main">
            <Heading tier="section" as="h2" id={headingId} accent={accent} after={after}>
              {title}
            </Heading>
            {lede ? <p className="section-row__lede">{lede}</p> : null}
            {children ? <div className="section-row__body">{children}</div> : null}
          </div>
          {side ? <div className="section-row__side">{side}</div> : null}
        </div>
      </div>
    </section>
  );
}

/** Side-slot list with iris › markers (decorative, hidden from AT). */
export function SectionList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="section-list">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/** Side-slot tags: the existing non-interactive Tag, wrapped. */
export function SectionTags({ items }: { items: string[] }) {
  return (
    <div className="section-tags">
      {items.map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
    </div>
  );
}
