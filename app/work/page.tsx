import type { Metadata } from "next";
import { Suspense } from "react";
import OverlayNav from "@/components/OverlayNav";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import styles from "@/components/WorkLibrary.module.css";
import { WorkSections, WorkSectionsStatic, WorkToolbar, WorkToolbarStatic } from "@/components/WorkLibrary";

export const metadata: Metadata = {
  title: "Work, Elleta McDaniel",
  description:
    "Case studies from real teams, plus the experiments I run to stay ahead. Each one shows the system underneath, not just the screens.",
};

/* Work (approved mock, 19 Sep 2026): the hero with the search, the
   Type and Topic chips and the Cards · Table · Map switcher (Table and
   Map render under it), then the Cards view's case studies and
   experiments. The shared footer carries the contact. */
export default function WorkPage() {
  return (
    <main id="main-content" className="page-shell min-h-screen">
      <OverlayNav />

      <Section id="work-hero" labelledBy="work-hero-title">
        <p className={`text-code ${styles.heroNote}`}>{"// the library: cases and experiments"}</p>
        <SectionHeader
          as="h1"
          id="work-hero-title"
          heading="Work that holds its"
          accent="shape"
          after="."
          lead="Case studies from real teams, plus the experiments I run to stay ahead. Each one shows the system underneath, not just the screens."
        />
        {/* useSearchParams needs a Suspense boundary: the unfiltered
            library renders on the server (and without JS), the
            URL-driven one takes over on the client */}
        <Suspense fallback={<WorkToolbarStatic />}>
          <WorkToolbar />
        </Suspense>
      </Section>

      <Suspense fallback={<WorkSectionsStatic />}>
        <WorkSections />
      </Suspense>
    </main>
  );
}
