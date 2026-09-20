import type { ReactNode } from "react";
import Spotlight from "@/components/Spotlight";

/* CaseSection (Elleta, 20 Sep 2026, case-study rebuild, approved mock
   _private/specs/case-study/case-study-drift-mock-v4.html).

   The article pattern: one idea per section, a short text column on one
   side and one framed example on the other, alternating sides down the
   page, a hairline between sections. Two columns from 900px (text 5fr,
   figure 6fr); on phones it stacks, text then figure.

   The linked-phrase behaviour is Spotlight's, shared with Part J's
   scan-and-read sections; this only supplies the shell and the keys. */
export default function CaseSection({
  index,
  kicker,
  heading,
  flip = false,
  phrases = [],
  figure,
  children,
}: {
  /** the section number, "01" */
  index: string;
  /** what the section is about, "The drift" */
  kicker: string;
  heading: ReactNode;
  /** every other section flips the figure to the other side */
  flip?: boolean;
  /** the linked-phrase keys in reading order; the index is the number */
  phrases?: string[];
  /** one ExampleFrame */
  figure: ReactNode;
  /** the text column: 2 or 3 short paragraphs */
  children: ReactNode;
}) {
  return (
    <Spotlight
      as="section"
      keys={phrases}
      scrollIntoView
      className={`case-section${flip ? " case-section--flip" : ""}`}
      data-component="CaseSection"
      aria-labelledby={`case-section-${index}`}
    >
      <div className="case-section__text">
        <p className="text-code case-section__kicker">
          {index} · {kicker}
        </p>
        <h2 id={`case-section-${index}`} className="case-section__heading">
          {heading}
        </h2>
        {children}
      </div>
      {figure}
    </Spotlight>
  );
}
