"use client";

import { Suspense } from "react";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";
import { MatrixView } from "@/components/WorkLibrary";
import { WorkFilterBar, useWorkFilters } from "@/components/WorkFilters";

/* /skills (skills-filters pass 2026-07-17): the same URL-synced filter
   bar as /work above the overlap matrix. Chips and matrix cells read
   and write the same comma params, back/forward safe. Active-filter
   overlap colouring is the matrix's existing emphasis (case identity
   tints + dots), no new colour system. */
function SkillsBody() {
  const { caseFilters, skillFilters, toggleList, clearAll, matchCount } = useWorkFilters();
  return (
    <>
      <WorkFilterBar
        caseFilters={caseFilters}
        skillFilters={skillFilters}
        toggleList={toggleList}
        clearAll={clearAll}
        matchCount={matchCount}
      />
      <MatrixView
        caseFilters={caseFilters}
        skillFilters={skillFilters}
        toggleCase={(id) => toggleList("case", id, caseFilters)}
        toggleSkill={(slug) => toggleList("skill", slug, skillFilters)}
      />
    </>
  );
}

export default function SkillsPage() {
  return (
    <main id="main-content">
      <OverlayNav />
      <section
        className="layout-section"
        style={{ paddingTop: "calc(var(--header-height) + var(--spacing-16))" }}
      >
        <div className="layout-container">
          <PageHeader eyebrow="Skill overlap, mapped to the work" title="Skills" />
          {/* useSearchParams requires a Suspense boundary */}
          <Suspense fallback={null}>
            <SkillsBody />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
