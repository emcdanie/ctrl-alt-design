"use client";

import { useState } from "react";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";
import { MatrixView } from "@/components/WorkLibrary";

/* IA lock 2026-07-17: the Work "skills" view promoted to its own page
   (nav: Work · Skills · About · Contact). Same MatrixView component,
   moved not rebuilt; cell colours are the case identity tokens paired
   with dots + labels, never colour alone. */
export default function SkillsPage() {
  const [caseFilters, setCaseFilters] = useState<string[]>([]);
  const [skillFilters, setSkillFilters] = useState<string[]>([]);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  return (
    <main id="main-content">
      <OverlayNav />
      <section
        className="layout-section"
        style={{ paddingTop: "calc(var(--header-height) + var(--spacing-16))" }}
      >
        <div className="layout-container">
          <PageHeader eyebrow="Skill overlap, mapped to the work" title="Skills" />
          <MatrixView
            caseFilters={caseFilters}
            skillFilters={skillFilters}
            toggleCase={(id) => toggle(caseFilters, setCaseFilters, id)}
            toggleSkill={(slug) => toggle(skillFilters, setSkillFilters, slug)}
          />
        </div>
      </section>
    </main>
  );
}
