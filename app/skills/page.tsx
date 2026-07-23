"use client";

import { Suspense } from "react";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";
import { MatrixView } from "@/components/WorkLibrary";
import { WorkFilterBar, useWorkFilters } from "@/components/WorkFilters";

/* /skills, matrix only (Elleta 22 Jul 2026): the readable grouped
   list is deleted; the overlap matrix is the ONE view, rendered
   unconditionally. The flat page header stays. */

function MatrixBody() {
  const { caseFilters, skillFilters, typeFilters, toggleList, clearAll, matchCount } = useWorkFilters();
  return (
    <>
      <WorkFilterBar
        caseFilters={caseFilters}
        skillFilters={skillFilters}
        typeFilters={typeFilters}
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
            <MatrixBody />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
