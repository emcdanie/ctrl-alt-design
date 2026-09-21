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
  children: ReactNode;
}) {
  const labelId = label && id ? `${id}-label` : undefined;
  return (
    <section
      id={id}
      className={["l-section", prose ? "l-section--prose" : "", ruled ? "section--ruled" : ""].filter(Boolean).join(" ")}
      aria-labelledby={labelId ?? labelledBy}
    >
      <Container>
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
