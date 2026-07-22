import type { Metadata } from "next";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseBeat from "@/components/CaseBeat";
import Heading from "@/components/ui/Heading";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

/**
 * The BLANK CaseBeat reference page (_review/case-beat-template-rules.md
 * Part B, Elleta 22 Jul 2026): renders the REAL CaseBeat with
 * placeholder content so the template contract can be verified with
 * nothing real to distract. Three alternating beats + the next-case
 * pointer tier. Controls RIGHT-ALIGNED in the text column (her
 * confirmed rule); visuals flat (the frame lives on the inner
 * placeholder element, never on .beat-visual).
 *
 * Its OWN route, deliberately NOT under case-studies/[slug]: no
 * WORK_ITEMS row, audit:parity stays green. noindex, unlinked.
 * All bracketed strings are placeholders, not copy.
 */

export const metadata: Metadata = {
  title: "CaseBeat template reference",
  robots: { index: false, follow: false },
};

/* the flat placeholder visual: frame on THIS element only */
function PlaceholderVisual() {
  return <div className="beat-placeholder">[Visual]</div>;
}

function PlaceholderBody() {
  return (
    <>
      <p className="cs2-body">
        [Body paragraph placeholder. Short sentences, her voice, max fifty words a paragraph;
        the keyline above carries the point, this text supports it.]
      </p>
      <p className="cs2-body">
        [Second body paragraph placeholder, proving the paragraph rhythm inside one beat.]
      </p>
    </>
  );
}

export default function CaseTemplatePage() {
  return (
    <CaseStudyLayout>
      <div className="layout-container">
        <div className="cs2">
          {/* the page head, placeholder: shows the top of the type
              step (page 72 -> section 50 -> case 40 at 1440) */}
          <header className="cs2-head">
            <p className="cs-shell__eyebrow" style={{ margin: 0 }}>[Eyebrow · Year]</p>
            <Heading tier="page" as="h1">[Case title placeholder, the thesis]</Heading>
            <p className="cs2-subhead">[One sentence stating the problem.]</p>
          </header>

          <div className="cs2-body-col">
            <CaseBeat
              index="01"
              kicker="[Kicker]"
              headline="[Beat headline goes here, one sentence]"
              keyline="[One keyline, bold ink, never iris.]"
              id="tpl-b1"
              body={<PlaceholderBody />}
              control={<Button variant="secondary">[Control]</Button>}
              visual={<PlaceholderVisual />}
              foot={
                <p className="cs2-kicker-row" style={{ margin: 0 }}>[footnote / caption / link]</p>
              }
            />

            {/* flipped: eyebrow + headline + keyline + body + control
                move together to the other side */}
            <CaseBeat
              index="02"
              kicker="[Kicker]"
              headline="[Flipped beat headline, same structure]"
              keyline="[One keyline, bold ink, never iris.]"
              id="tpl-b2"
              flip
              body={<PlaceholderBody />}
              control={<Button variant="secondary">[Control]</Button>}
              visual={<PlaceholderVisual />}
              foot={
                <p className="cs2-kicker-row" style={{ margin: 0 }}>[footnote / caption / link]</p>
              }
            />

            {/* control slot omitted: the optional slot absent, cleanly */}
            <CaseBeat
              index="03"
              kicker="[Kicker]"
              headline="[Beat without a control, the slot is optional]"
              keyline="[One keyline, bold ink, never iris.]"
              id="tpl-b3"
              body={<PlaceholderBody />}
              visual={<PlaceholderVisual />}
              foot={
                <p className="cs2-kicker-row" style={{ margin: 0 }}>[footnote / caption / link]</p>
              }
            />

            {/* the next-case pointer tier: the smallest display step */}
            <section className="cs2-beat" aria-label="Next case">
              <SectionHeader label="Next case" tier="case" title="[Next case pointer]" className="cs2-screen__head" />
            </section>
          </div>
        </div>
      </div>
    </CaseStudyLayout>
  );
}
