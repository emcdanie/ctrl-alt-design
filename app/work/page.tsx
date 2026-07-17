import type { Metadata } from "next";
import { Suspense } from "react";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";
import WorkLibrary from "@/components/WorkLibrary";

export const metadata: Metadata = {
  title: "Work, Elleta McDaniel",
  description:
    "Work as a library: every case study browsable as a map, a sortable table, or a timeline, filterable by case study and skill.",
};

export default function WorkPage() {
  return (
    <main id="main-content">
      <OverlayNav />
      <section
        className="layout-section"
        style={{ paddingTop: "calc(var(--header-height) + var(--spacing-16))" }}
      >
        <div className="layout-container">
          <PageHeader eyebrow="The library" title="Work" />
          {/* useSearchParams requires a Suspense boundary */}
          <Suspense fallback={null}>
            <WorkLibrary />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
