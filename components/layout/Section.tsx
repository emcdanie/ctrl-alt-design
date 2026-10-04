import type { ReactNode } from "react";
import Container from "@/components/layout/Container";

/* A page section (specs/layout-system): the section padding, then the
   plain mono label sitting on the hairline rule (no paw since Part Q), then the children (a
   SectionHeader and whatever follows it), all inside Container. The
   label names the region. The page opening has no label: pass
   `labelledBy` with its h1's id instead. The first section on a page
   clears the sticky nav (CSS). */
export default function Section({
  id,
  label,
  labelledBy,
  prose = false,
  ruled = false,
  flushBottom,
  width = "page",
  children,
}: {
  id?: string;
  /** the section's short name, e.g. "Track record" */
  label?: string;
  /** no label (the page opening): the id of the heading that names it */
  labelledBy?: string;
  /** a reading section (Privacy, Accessibility, 404): its paragraphs and
   *  lists keep the body measure instead of running the full container */
  prose?: boolean;
  /** a hairline at the top with no label (a case page's sections) */
  ruled?: boolean;
  /** drop the bottom pad, as a named audit:frame exception: the dated
   *  reason is required and printed on every run (Elleta, 4 Oct 2026,
   *  Home's proof row, so the gaps either side of it are equal) */
  flushBottom?: string;
  /** "case": the Layout B body (1056) of a rebuilt case page (site v3,
   *  CLAUDE.md section 2); "case-edge": the same body with the page's
   *  text on its left edge, not the centred column (About, site v3,
   *  Figma 403:7256: the h1 at x192); every other page keeps the one
   *  frame */
  width?: "page" | "case" | "case-edge";
  children: ReactNode;
}) {
  const labelId = label && id ? `${id}-label` : undefined;
  return (
    <section
      id={id}
      className={["l-section", prose ? "l-section--prose" : "", ruled ? "section--ruled" : "", flushBottom ? "l-section--flush-bottom" : ""].filter(Boolean).join(" ")}
      aria-labelledby={labelId ?? labelledBy}
      data-frame-exempt={flushBottom}
    >
      <Container className={width === "case" ? "container--case" : width === "case-edge" ? "container--case container--edge" : ""}>
        {label ? (
          <p id={labelId} className="l-section__label">
            {label}
          </p>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
