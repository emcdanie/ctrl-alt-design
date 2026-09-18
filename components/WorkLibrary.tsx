"use client";

import { useState } from "react";
import Link from "next/link";
import FindYourFit from "@/components/FindYourFit";
import Section from "@/components/Section";
import CaseCard from "@/components/CaseCard";
import LabGrid, { LAB_PROTOTYPES, LAB_VIDEOS } from "@/components/LabGrid";
import { FilterChip } from "@/components/ui/FilterChip";
import { SKILLS, SKILL_EVIDENCE, WORK_ITEMS, slugify, type WorkItem } from "@/lib/workLibrary";
import styles from "./WorkLibrary.module.css";
import { useWorkFilters } from "@/components/WorkFilters";

/* Work filtering (18 Sep 2026): Find my fit and the type + skill chips
 * sit under the hero lede and filter the cards in 01 and 02. The URL is
 * the one source of truth (`type`, `skill`, plus the matrix-set `case`),
 * so ?type=prototype deep-links. A section whose cards all filter out
 * drops out with its heading; if both do, one line offers a reset. */

type WorkType = "case-study" | "exploration" | "prototype";

const TYPES: { value: WorkType; label: string }[] = [
  { value: "case-study", label: "Case studies" },
  { value: "exploration", label: "Explorations" },
  { value: "prototype", label: "Prototypes" },
];

const SKILLS_VISIBLE = 6;

/* Best in show order (Elleta, 18 Sep 2026), by WORK_ITEMS id */
const BEST_IN_SHOW = ["drift", "chip", "code-first"]
  .map((id) => WORK_ITEMS.find((i) => i.id === id))
  .filter((i): i is WorkItem => Boolean(i));

interface Filters {
  caseFilters: string[];
  skillFilters: string[];
  typeFilters: string[];
}

const NO_FILTERS: Filters = { caseFilters: [], skillFilters: [], typeFilters: [] };

function applyFilters({ caseFilters, skillFilters, typeFilters }: Filters) {
  const typeOk = (t: WorkType) => typeFilters.length === 0 || typeFilters.includes(t);
  const skillOk = (skills: string[]) =>
    skillFilters.length === 0 || skills.some((s) => skillFilters.includes(slugify(s)));
  const labOk = caseFilters.length === 0;
  return {
    cases: BEST_IN_SHOW.filter(
      (i) => typeOk("case-study") && skillOk(i.skills) && (caseFilters.length === 0 || caseFilters.includes(i.id))
    ),
    videos: LAB_VIDEOS.filter((v) => labOk && typeOk("exploration") && skillOk(v.tags)),
    prototypes: LAB_PROTOTYPES.filter((p) => labOk && typeOk("prototype") && skillOk(p.tags)),
  };
}

/* ── The toolbar under the hero lede ── */
export function WorkToolbar() {
  const { skillFilters, typeFilters, toggleList, setFilterParams } = useWorkFilters();
  return (
    <FindYourFit
      chipRow={
        <FilterChips
          skillFilters={skillFilters}
          typeFilters={typeFilters}
          toggleList={toggleList}
          clearTypes={() => setFilterParams({ type: null })}
        />
      }
    />
  );
}

/* ── 01 and 02, filtered from the URL ── */
export function WorkSections() {
  const { caseFilters, skillFilters, typeFilters, clearAll } = useWorkFilters();
  return <WorkSectionsView filters={{ caseFilters, skillFilters, typeFilters }} clearAll={clearAll} />;
}

/** The unfiltered sections: the server render and the no-JS page. */
export function WorkSectionsStatic() {
  return <WorkSectionsView filters={NO_FILTERS} />;
}

function WorkSectionsView({ filters, clearAll }: { filters: Filters; clearAll?: () => void }) {
  const { cases, videos, prototypes } = applyFilters(filters);
  const labCount = videos.length + prototypes.length;
  return (
    <>
      {cases.length > 0 && (
        <Section id="best-in-show" index="01" label="Best in show" title="Three systems, up" accent="close" after="." wide>
          <div className="card-grid">
            {cases.map((item) => (
              <CaseCard key={item.id} item={item} cta="Case study →" showFeatured={false} />
            ))}
          </div>
        </Section>
      )}

      {labCount > 0 && (
        <Section
          id="off-the-lead"
          index="02"
          label="Off the lead"
          title="Experiments in"
          accent="public"
          after="."
          lede="Where I try ideas out before a client needs them."
          wide
        >
          <LabGrid videos={videos} prototypes={prototypes} />
        </Section>
      )}

      {cases.length === 0 && labCount === 0 && (
        <section className="section section--ruled" aria-live="polite">
          <div className="container">
            <p className="text-body">
              Nothing matches,{" "}
              <button type="button" className="text-action" onClick={clearAll}>
                clear filters
              </button>
            </p>
          </div>
        </section>
      )}
    </>
  );
}

/* Type first (All + the three types), then the skill chips. FilterChips
   (section 5 taxonomy), URL-synced through the shared hook. The /skills
   page keeps its own WorkChipRow order. */
function FilterChips({
  skillFilters,
  typeFilters,
  toggleList,
  clearTypes,
}: {
  skillFilters: string[];
  typeFilters: string[];
  toggleList: (key: "case" | "skill" | "type", val: string, current: string[]) => void;
  clearTypes: () => void;
}) {
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  const visibleSkills = skillsExpanded ? SKILLS : SKILLS.slice(0, SKILLS_VISIBLE);
  return (
    <div className={styles.filterRow} role="group" aria-label="Filter the work by type or skill">
      <FilterChip className="filter-chip--dense" pressed={typeFilters.length === 0} onClick={clearTypes}>
        All
      </FilterChip>
      {TYPES.map((t) => (
        <FilterChip
          key={t.value}
          className="filter-chip--dense"
          pressed={typeFilters.includes(t.value)}
          onClick={() => toggleList("type", t.value, typeFilters)}
        >
          {t.label}
        </FilterChip>
      ))}
      <span className={styles.chipDivider} aria-hidden="true" />
      {visibleSkills.map((sk) => (
        <FilterChip
          key={sk}
          className="filter-chip--dense"
          pressed={skillFilters.includes(slugify(sk))}
          onClick={() => toggleList("skill", slugify(sk), skillFilters)}
        >
          {sk}
        </FilterChip>
      ))}
      <button
        type="button"
        className={styles.moreToggle}
        aria-expanded={skillsExpanded}
        onClick={() => setSkillsExpanded((e) => !e)}
      >
        {skillsExpanded ? "Show fewer" : `+ ${SKILLS.length - SKILLS_VISIBLE} more`}
      </button>
    </div>
  );
}

/* ── Skills x projects matrix (§8): a real table driven from the same
 * skills arrays as everything else. Marked cell = case tint + dot +
 * sr-only text (never colour-only). Row/column headers are buttons that
 * toggle the SAME URL filters as the chips; active filters emphasise
 * matching cells and dim the rest. ── */

export function MatrixView({
  caseFilters,
  skillFilters,
  toggleCase,
  toggleSkill,
}: {
  caseFilters: string[];
  skillFilters: string[];
  toggleCase: (id: string) => void;
  toggleSkill: (slug: string) => void;
}) {
  const hasFilters = caseFilters.length > 0 || skillFilters.length > 0;
  const emphasised = (item: WorkItem, skillSlug: string) =>
    !hasFilters ||
    ((caseFilters.length === 0 || caseFilters.includes(item.id)) &&
      (skillFilters.length === 0 || skillFilters.includes(skillSlug)));

  return (
    <div className={styles.tableWrap}>
      <table className={`${styles.table} ${styles.matrix}`}>
        <caption className="sr-only">
          Skills by case study. A dot marks a skill used in that case. Row and column
          headers are buttons that toggle the matching filter.
        </caption>
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Skill</span>
            </th>
            {WORK_ITEMS.map((i) => (
              <th key={i.id} scope="col">
                <button
                  type="button"
                  className={styles.mxHead}
                  aria-pressed={caseFilters.includes(i.id)}
                  onClick={() => toggleCase(i.id)}
                >
                  {i.title}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SKILLS.map((skill) => {
            const slug = slugify(skill);
            return (
              <tr key={skill}>
                <th scope="row">
                  <button
                    type="button"
                    className={styles.mxHead}
                    aria-pressed={skillFilters.includes(slug)}
                    onClick={() => toggleSkill(slug)}
                  >
                    {skill}
                  </button>
                </th>
                {WORK_ITEMS.map((i) => {
                  const marked = i.skills.includes(skill);
                  const evidence = SKILL_EVIDENCE[i.id]?.[skill];
                  return (
                    <td
                      key={i.id}
                      className={`${styles.mxCell} ${marked ? styles.mxOn : ""} ${
                        emphasised(i, slug) ? "" : styles.mxDim
                      }`}
                      style={
                        marked
                          ? ({ "--case-tint-hi": i.hi, "--case-tint-text": i.text } as React.CSSProperties)
                          : undefined
                      }
                    >
                      {/* Dead dots are doors (Pass E task 5b): every dot
                          links to its case; a cell with an evidence line
                          exposes it on demand first (disclosure). */}
                      {marked &&
                        (evidence ? (
                          <details className={styles.mxDetails}>
                            <summary
                              className={styles.mxLink}
                              aria-label={`${i.title}: ${skill}, show evidence`}
                            >
                              <span aria-hidden="true" className={styles.mxDot} />
                            </summary>
                            <div className={styles.mxPanel}>
                              <p>{evidence}</p>
                              <Link href={i.href}>Read {i.title}</Link>
                            </div>
                          </details>
                        ) : (
                          <Link
                            href={i.href}
                            className={styles.mxLink}
                            aria-label={`${i.title}: ${skill}, read the case study`}
                          >
                            <span aria-hidden="true" className={styles.mxDot} />
                          </Link>
                        ))}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
