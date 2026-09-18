import type { ReactNode } from "react";
import Heading from "@/components/ui/Heading";
import { Tag } from "@/components/ui/Tag";
import PawTrail from "@/components/PawTrail";

/**
 * The numbered section: index label | heading, lede, body | side slot,
 * on .container + .section. About and Work build their pages from it.
 * Sections are separated by a hairline (.section--ruled), never a card.
 * One column on phones.
 *
 * variant="hero": the page opening on the same grid. No index label and
 * no rule; the h1 and lede span the index + main columns and the side
 * slot holds the figure. It starts directly under the nav.
 *
 * The heading takes one iris `accent` word; `after` carries whatever
 * follows it, e.g. title="A shared language, not a" accent="rulebook"
 * after=".". Sizes come from the text utilities, never from here.
 */
export default function Section({
  variant = "row",
  index,
  label,
  title,
  accent,
  after,
  lede,
  side,
  wide,
  trail,
  id,
  children,
}: {
  variant?: "row" | "hero";
  /** "01" (rows only) */
  index?: string;
  /** the section's short name, e.g. "The short lead" (rows only) */
  label?: string;
  title: ReactNode;
  accent?: ReactNode;
  after?: ReactNode;
  lede?: ReactNode;
  /** optional right column: SectionList, SectionTags, a figure */
  side?: ReactNode;
  /** main column also takes the (empty) side column */
  wide?: boolean;
  /** a paw trail in this section's top padding (adds no height) */
  trail?: boolean;
  id?: string;
  /** the body copy */
  children?: ReactNode;
}) {
  const hero = variant === "hero";
  const headingId = id ? `${id}-title` : undefined;
  const cls = [
    "section",
    "section-row",
    hero ? "section--hero" : "section--ruled",
    wide && !side ? "section-row--wide" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <section id={id} className={cls} aria-labelledby={headingId}>
      {trail ? <PawTrail /> : null}
      <div className="container">
        <div className="section-row__grid">
          {hero ? null : (
            <p className="section-row__meta">
              <span className="section-row__num">{index}</span> / {label}
            </p>
          )}
          <div className="section-row__main">
            <Heading
              tier={hero ? "page" : "section"}
              as={hero ? "h1" : "h2"}
              id={headingId}
              accent={accent}
              after={after}
            >
              {title}
            </Heading>
            {lede ? <p className="text-lead section-row__lede">{lede}</p> : null}
            {children ? <div className="section-row__body text-body">{children}</div> : null}
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
