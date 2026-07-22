"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";
import { MatrixView } from "@/components/WorkLibrary";
import { WorkFilterBar, useWorkFilters } from "@/components/WorkFilters";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { WORK_ITEMS, type Skill } from "@/lib/workLibrary";

/* /skills v2 (case-shell-v2 brief item 15, Elleta 22 Jul 2026): the
   overlap matrix read as a puzzle, so the DEFAULT view is a plain
   grouped list: per skill, a plain-language line (TODO(elleta),
   renders nothing while empty) and a "proven in" link to the
   highest-ranked live piece carrying that skill. The matrix stays as
   the secondary toggle (it already existed; the switch is one
   SegmentedControl). */

/* grouping taxonomy: my mechanical pick, flagged in the PR */
const GROUPS: { title: string; skills: Skill[] }[] = [
  { title: "Systems", skills: ["Design Systems", "Design Tokens", "Design System Governance", "Component Libraries"] },
  { title: "AI and code", skills: ["AI-enabled Design", "Figma ⇄ Code"] },
  { title: "Craft", skills: ["Product Design", "UX Research", "Accessibility"] },
];

/* one plain-language line per skill, HER voice; a TODO slot renders
   nothing until her words land (the recorded placeholder rule) */
const SKILL_LINES: Partial<Record<Skill, string>> = {
  /* TODO(elleta): one line per skill, e.g.
     "Design Tokens": "..." */
};

/** the best live proof: lowest rank among case/lab rows carrying the
    skill; none means the row renders honestly linkless */
function provenIn(skill: Skill) {
  return WORK_ITEMS.filter((i) => i.skills.includes(skill)).sort(
    (a, b) => (a.rank ?? 99) - (b.rank ?? 99) || a.title.localeCompare(b.title)
  )[0];
}

function SkillsList() {
  return (
    <div className="sk-groups">
      {GROUPS.map((g) => (
        <section key={g.title} className="sk-group" aria-label={g.title}>
          <p className="ds-section__kicker" style={{ margin: 0 }}>{g.title}</p>
          <ul className="sk-group__list">
            {g.skills.map((skill) => {
              const proof = provenIn(skill);
              const line = SKILL_LINES[skill] ?? "";
              return (
                <li key={skill} className="sk-row">
                  <span className="sk-row__name heading-item">{skill}</span>
                  {line.trim() !== "" && <span className="sk-row__line">{line}</span>}
                  {proof && (
                    <Link href={proof.href} className="sk-row__proof">
                      Proven in {proof.title}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

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
  const [view, setView] = useState("list");
  return (
    <main id="main-content">
      <OverlayNav />
      <section
        className="layout-section"
        style={{ paddingTop: "calc(var(--header-height) + var(--spacing-16))" }}
      >
        <div className="layout-container">
          <PageHeader eyebrow="Skill overlap, mapped to the work" title="Skills" />
          <div style={{ marginBottom: "var(--spacing-6)" }}>
            <SegmentedControl
              label="Skills views"
              options={[
                { value: "list", label: "List" },
                { value: "matrix", label: "Matrix" },
              ]}
              value={view}
              onChange={setView}
            />
          </div>
          {view === "list" ? (
            <SkillsList />
          ) : (
            /* useSearchParams requires a Suspense boundary */
            <Suspense fallback={null}>
              <MatrixBody />
            </Suspense>
          )}
        </div>
      </section>
    </main>
  );
}
