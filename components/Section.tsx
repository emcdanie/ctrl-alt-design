import type { ReactNode } from "react";
import Heading from "@/components/ui/Heading";
import PawTrail, { PawIcon } from "@/components/PawTrail";

/**
 * The section: ONE column on .container + .section, in reading order:
 * label (paw + caps) -> heading -> lede -> body -> extra content (a list,
 * a grid). Reading widths come from the measures (heading 22em, lede
 * 42rem, body and lists 65ch); full-width content (experience, logo and
 * card grids) uses the whole container. Sections are separated by a
 * hairline (.section--ruled), never a card. About and Work use it.
 *
 * variant="hero": the page opening. No label and no rule; the h1 and
 * lede sit left and `side` (the figure) sits right from 1024px, stacked
 * below. It clears the sticky nav by one section gap.
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
  art,
  trail,
  id,
  children,
}: {
  variant?: "row" | "hero";
  /** optional "01" before the label (Work numbers its sections; About does not) */
  index?: string;
  /** the section's short name, e.g. "The short lead" (rows only) */
  label?: string;
  title: ReactNode;
  accent?: ReactNode;
  after?: ReactNode;
  lede?: ReactNode;
  /** after the body: a SectionList or other extra content (hero: the figure) */
  side?: ReactNode;
  /** a small decorative illustration beside the heading (>=768px), above
   *  the content on phones */
  art?: ReactNode;
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
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <section id={id} className={cls} aria-labelledby={headingId}>
      {trail ? <PawTrail /> : null}
      <div className="container">
        <div className={hero ? "section-row__hero" : undefined}>
          <div className="section-row__main">
            {hero || !label ? null : (
              <p className="section-row__meta">
                <PawIcon />
                {index ? (
                  <span aria-hidden="true">
                    <span className="section-row__num">{index}</span> /{" "}
                  </span>
                ) : null}
                {label}
              </p>
            )}
            {(() => {
              const heading = (
                <Heading
                  tier={hero ? "page" : "section"}
                  as={hero ? "h1" : "h2"}
                  id={headingId}
                  accent={accent}
                  after={after}
                >
                  {title}
                </Heading>
              );
              return art ? (
                <div className="section-row__head">
                  {heading}
                  <div className="section-row__art">{art}</div>
                </div>
              ) : (
                heading
              );
            })()}
            {lede ? <p className="text-lead section-row__lede">{lede}</p> : null}
            {children ? <div className="section-row__body text-body">{children}</div> : null}
            {side && !hero ? <div className="section-row__extra">{side}</div> : null}
          </div>
          {side && hero ? <div className="section-row__figure">{side}</div> : null}
        </div>
      </div>
    </section>
  );
}

/** A list with iris › markers (decorative, not read). Two columns from
 *  900px when it has more than four items. */
export function SectionList({ items }: { items: ReactNode[] }) {
  return (
    <ul className={items.length > 4 ? "section-list section-list--cols" : "section-list"}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
