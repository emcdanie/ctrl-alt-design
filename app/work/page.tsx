import type { Metadata } from "next";
import { Suspense } from "react";
import OverlayNav from "@/components/OverlayNav";
import Heading from "@/components/ui/Heading";
import Section from "@/components/Section";
import CaseCard from "@/components/CaseCard";
import LabGrid from "@/components/LabGrid";
import WorkLibrary from "@/components/WorkLibrary";
import GetInTouch from "@/components/GetInTouch";
import { WORK_ITEMS, type WorkItem } from "@/lib/workLibrary";

export const metadata: Metadata = {
  title: "Work, Elleta McDaniel",
  description:
    "Design systems that hold up in real products, and the experiments behind them: three case studies, the lab, and the whole library as one filterable list.",
};

/* Best in show order (Elleta, 18 Sep 2026), by WORK_ITEMS id */
const BEST_IN_SHOW = ["drift", "chip", "code-first"]
  .map((id) => WORK_ITEMS.find((i) => i.id === id))
  .filter((i): i is WorkItem => Boolean(i));

/* Work (18 Sep 2026): hero, three numbered Sections and a close, on the
   Section pattern. Thesis: design systems that hold up in real products,
   and experiments in public to stay ahead. */
export default function WorkPage() {
  return (
    <main id="main-content" className="page-shell min-h-screen">
      <OverlayNav />

      <Section
        variant="hero"
        id="work-hero"
        title="Work that holds its"
        accent="shape"
        after="."
        lede={
          <>
            I build design systems that give designers and developers a <strong>shared language</strong>: tokens,
            components, and the decisions behind them, written down kindly so everyone can use them.
          </>
        }
      />

      <Section id="best-in-show" index="01" label="Best in show" title="Three" accent="systems" after=", in production." wide>
        <div className="card-grid">
          {BEST_IN_SHOW.map((item) => (
            <CaseCard key={item.id} item={item} cta="Case study →" showFeatured={false} />
          ))}
        </div>
      </Section>

      <Section
        id="off-the-lead"
        index="02"
        label="Off the lead"
        title="Experiments in"
        accent="public"
        after="."
        lede="Rapid investigations into complex interaction patterns, system dashboards, and AI-enabled workflows."
        wide
      >
        <LabGrid />
      </Section>

      <Section id="everything" index="03" label="Everything" title="The whole" accent="library" after="." wide>
        {/* useSearchParams requires a Suspense boundary */}
        <Suspense fallback={null}>
          <WorkLibrary />
        </Suspense>
      </Section>

      {/* Close: one display line and the one Get in touch (the site has
          no footer button yet, so nothing is duplicated) */}
      <section className="section section--ruled" aria-labelledby="work-close-title">
        <div className="container">
          <div className="page-close">
            <Heading tier="section" as="h2" id="work-close-title" accent="next" after=" one.">
              Let&apos;s build the
            </Heading>
            <GetInTouch />
          </div>
        </div>
      </section>
    </main>
  );
}
