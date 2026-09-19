import { isValidElement, type ReactNode } from "react";
import Heading from "@/components/ui/Heading";
import { GLOSSARY, type TermId } from "@/content/glossary";

/* A Term accent is a button, and a button pads the heading's accessible
   name ("Bella ." for "Bella."). When the accent is a Term, the heading
   gets its name spelled out: heading, the Term's word, what follows. */
function termName(heading: ReactNode, accent: ReactNode, after: ReactNode): string | undefined {
  if (!isValidElement<{ id?: TermId }>(accent)) return undefined;
  const id = accent.props.id;
  if (!id || !(id in GLOSSARY) || typeof heading !== "string") return undefined;
  if (after != null && typeof after !== "string") return undefined;
  return `${heading} ${GLOSSARY[id].word}${after ?? ""}`;
}

/* The section header (specs/layout-system): heading left (about 40%),
   lead and body right (about 60%, max 42rem) from 1024px, stacked
   below. Content placed after it gets --section-content-gap above.
   The heading takes one iris `accent` word; `after` carries what
   follows it. `as="h1"` for the page opening. */
export default function SectionHeader({
  heading,
  accent,
  after,
  as = "h2",
  id,
  lead,
  children,
}: {
  heading: ReactNode;
  accent?: ReactNode;
  after?: ReactNode;
  as?: "h1" | "h2";
  /** the heading's id (the page opening's Section points at it) */
  id?: string;
  lead?: ReactNode;
  /** body: paragraphs, a list, a link, a figure */
  children?: ReactNode;
}) {
  return (
    <div className="l-header">
      <Heading
        tier={as === "h1" ? "page" : "section"}
        as={as}
        id={id}
        accent={accent}
        after={after}
        label={termName(heading, accent, after)}
      >
        {heading}
      </Heading>
      {lead || children ? (
        <div className="l-header__side">
          {lead ? <p className="text-lead l-header__lead">{lead}</p> : null}
          {children ? <div className="l-header__body text-body">{children}</div> : null}
        </div>
      ) : null}
    </div>
  );
}
