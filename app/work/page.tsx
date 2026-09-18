import type { Metadata } from "next";
import { Suspense } from "react";
import OverlayNav from "@/components/OverlayNav";
import Heading from "@/components/ui/Heading";
import Section from "@/components/Section";
import GetInTouch from "@/components/GetInTouch";
import { WorkSections, WorkSectionsStatic, WorkToolbar } from "@/components/WorkLibrary";

export const metadata: Metadata = {
  title: "Work, Elleta McDaniel",
  description:
    "Case studies from real teams, plus the experiments I run to stay ahead. Each one shows the system underneath, not just the screens.",
};

/* Work (18 Sep 2026): hero with Find my fit and the filter chips, then
   01 Best in show and 02 Off the lead, filtered from the URL, and a
   close. Thesis: design systems that hold up in real products, and
   experiments in public to stay ahead. */
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
        lede="Case studies from real teams, plus the experiments I run to stay ahead. Each one shows the system underneath, not just the screens."
      >
        {/* useSearchParams requires a Suspense boundary */}
        <div className="page-tools">
          <Suspense fallback={null}>
            <WorkToolbar />
          </Suspense>
        </div>
      </Section>

      {/* the unfiltered sections render on the server (and without JS);
          the URL-filtered ones take over on the client */}
      <Suspense fallback={<WorkSectionsStatic />}>
        <WorkSections />
      </Suspense>

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
