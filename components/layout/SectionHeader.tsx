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

/* The section header (specs/layout-system): layout="stacked" (the
   default since 20 Sep 2026, Elleta: "the body text has moved above the
   image, that was not the idea, put it back under the heading"): label,
   heading, then the lead and body under it, left-aligned, the text
   column capped at 42rem. layout="split" puts the lead beside the
   heading from 1024px; it is kept as an option and used nowhere.
   Content placed after it gets --section-content-gap above.
   The heading takes one iris `accent` word; `after` carries what
   follows it. `as="h1"` for the page opening. */
export default function SectionHeader({
  heading,
  accent,
  after,
  as = "h2",
  kicker,
  layout = "stacked",
  id,
  lead,
  figure,
  children,
}: {
  heading: ReactNode;
  accent?: ReactNode;
  after?: ReactNode;
  as?: "h1" | "h2";
  /** the page label above an h1: code role, sentence case, muted
   *  (Elleta, 20 Sep 2026, Part G). A page two levels deep passes its
   *  Breadcrumb here instead, which replaces the label. */
  kicker?: ReactNode;
  /** "stacked" (default): heading above the lead at every width;
   *  "split": heading beside the lead from 1024px */
  layout?: "split" | "stacked";
  /** the heading's id (the page opening's Section points at it) */
  id?: string;
  lead?: ReactNode;
  /** an illustration the text WRAPS AROUND from 768px (Elleta, 20 Sep
   *  2026, Part H): it floats beside the lead and body, with
   *  shape-outside following the art's own outline, and the heading
   *  always reads first above it. On phones it stacks, art under the
   *  text. `figureShape` names the image to cut the shape from when it
   *  is not the same file as `src` (an SVG, or art with no alpha). */
  figure?: ReactNode;
  /** body: paragraphs, a list, a link, a figure */
  children?: ReactNode;
}) {
  const heading_ = (
    <>
      {kicker ? <p className="text-code l-header__kicker">{kicker}</p> : null}
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
    </>
  );
  const side_ =
    lead || children ? (
      <div className="l-header__side">
        {lead ? <p className="text-lead l-header__lead">{lead}</p> : null}
        {children ? <div className="l-header__body text-body">{children}</div> : null}
      </div>
    ) : null;
  const text = (
    <>
      {heading_}
      {side_}
    </>
  );
  return (
    <div
      className={[
        "l-header",
        layout === "split" ? "l-header--split" : "",
        figure ? "l-header--figure" : "",
        /* section heads reveal; the page opening (h1) is there at once */
        as === "h1" ? "" : "reveal",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* the heading reads first, then the art floats, then the lead and
          body wrap around it (Part H item 2) */}
      {figure ? (
        <>
          {heading_}
          <div className="l-header__figure">{figure}</div>
          {side_}
        </>
      ) : (
        text
      )}
    </div>
  );
}
