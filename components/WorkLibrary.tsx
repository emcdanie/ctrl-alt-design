"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import FindYourFit from "@/components/FindYourFit";
import VideoModal from "@/components/VideoModal";
import { FilterChip } from "@/components/ui/FilterChip";
import { Tag } from "@/components/ui/Tag";
import { SKILLS, SKILL_EVIDENCE, WORK_ITEMS, slugify, type WorkItem } from "@/lib/workLibrary";
import { LAB_PROTOTYPES, LAB_VIDEOS, type LabVideo } from "@/components/LabGrid";
import styles from "./WorkLibrary.module.css";
import { WorkAppliedRow, useWorkFilters } from "@/components/WorkFilters";

/* Everything (Work, 18 Sep 2026): the whole library as numbered rows,
 * newest first: number, name + one line, tags, year, arrow. Case studies
 * come from WORK_ITEMS, explorations and prototypes from the lab arrays
 * (never retyped). The URL stays the one source of truth for the filters
 * (`type`, `skill`, plus the matrix-set `case`), back/forward safe. The
 * view switcher, map and curated cards are retired (Elleta, 18 Sep). */

type RowType = "case-study" | "exploration" | "prototype";

interface Row {
  key: string;
  type: RowType;
  title: string;
  line: string;
  tags: string[];
  /** filter matching: case skills, or the lab piece's tags */
  skills: string[];
  year: string;
  /** latest year in the range; the primary sort */
  yearEnd: number;
  /** case rank, or the lab piece's first-added date; the tie-breaks */
  rank: number;
  added: string;
  caseId?: string;
  href?: string;
  video?: LabVideo;
}

const TYPES: { value: RowType; label: string }[] = [
  { value: "case-study", label: "Case studies" },
  { value: "exploration", label: "Explorations" },
  { value: "prototype", label: "Prototypes" },
];

const SKILLS_VISIBLE = 6;

const lastYear = (year: string) => Math.max(...(year.match(/\d{4}/g) ?? ["0"]).map(Number));

const ROWS: Row[] = [
  ...WORK_ITEMS.filter((i) => i.medium === "case study").map<Row>((i) => ({
    key: i.id,
    type: "case-study",
    title: i.title,
    line: i.impact,
    tags: i.skills.slice(0, 3),
    skills: i.skills,
    year: i.year,
    yearEnd: lastYear(i.year),
    rank: i.rank ?? 99,
    added: "",
    caseId: i.id,
    href: i.href,
  })),
  ...LAB_VIDEOS.map<Row>((v) => ({
    key: v.title,
    type: "exploration",
    title: v.title,
    line: v.subtitle,
    tags: v.tags.slice(0, 3),
    skills: v.tags,
    year: v.added.slice(0, 4),
    yearEnd: Number(v.added.slice(0, 4)),
    rank: 100,
    added: v.added,
    video: v,
  })),
  ...LAB_PROTOTYPES.map<Row>((p) => ({
    key: p.title,
    type: "prototype",
    title: p.title,
    line: p.subtitle,
    tags: p.tags.slice(0, 3),
    skills: p.tags,
    year: p.added.slice(0, 4),
    yearEnd: Number(p.added.slice(0, 4)),
    rank: 100,
    added: p.added,
    href: p.href,
  })),
].sort(
  (a, b) =>
    b.yearEnd - a.yearEnd || a.rank - b.rank || b.added.localeCompare(a.added) || a.title.localeCompare(b.title)
);

export default function WorkLibrary() {
  const { caseFilters, skillFilters, typeFilters, toggleList, clearAll, setFilterParams } =
    useWorkFilters();
  const [activeVideo, setActiveVideo] = useState<LabVideo | null>(null);

  const rows = useMemo(() => {
    let r = ROWS;
    if (caseFilters.length) r = r.filter((x) => x.caseId && caseFilters.includes(x.caseId));
    if (skillFilters.length) r = r.filter((x) => x.skills.some((s) => skillFilters.includes(slugify(s))));
    if (typeFilters.length) r = r.filter((x) => typeFilters.includes(x.type));
    return r;
  }, [caseFilters, skillFilters, typeFilters]);

  return (
    <div className={`section-wide-content ${styles.index}`}>
      <FindYourFit
        chipRow={
          <IndexChips
            skillFilters={skillFilters}
            typeFilters={typeFilters}
            toggleList={toggleList}
            clearTypes={() => setFilterParams({ type: null })}
          />
        }
      />

      <WorkAppliedRow
        caseFilters={caseFilters}
        skillFilters={skillFilters}
        typeFilters={typeFilters}
        toggleList={toggleList}
        clearAll={clearAll}
        matchCount={rows.length}
        total={ROWS.length}
        typeLabels={Object.fromEntries(TYPES.map((t) => [t.value, t.label]))}
      />

      <ol className={styles.rows}>
        {rows.map((r, n) => (
          <li key={r.key} className={styles.row}>
            <span className={styles.rowNum}>{String(n + 1).padStart(2, "0")}</span>
            <div className={styles.rowMain}>
              {r.video ? (
                <button type="button" className={styles.rowTitle} onClick={() => setActiveVideo(r.video!)}>
                  {r.title}
                </button>
              ) : (
                <Link href={r.href!} className={styles.rowTitle}>
                  {r.title}
                </Link>
              )}
              <p className={styles.rowLine}>{r.line}</p>
            </div>
            <span className={styles.rowTags}>
              {r.tags.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </span>
            <span className={styles.rowYear}>{r.year}</span>
            <span className={styles.rowArrow} aria-hidden="true">
              →
            </span>
          </li>
        ))}
      </ol>

      {rows.length === 0 && <p className={styles.empty}>No pieces match these filters.</p>}

      {activeVideo && (
        <VideoModal
          isOpen={true}
          onClose={() => setActiveVideo(null)}
          embedUrl={activeVideo.embed}
          title={activeVideo.title}
          description={activeVideo.subtitle}
          tags={activeVideo.tags}
        />
      )}
    </div>
  );
}

/* The Work chip row: type first (All + the three types), then the skill
   chips. FilterChips (section 5 taxonomy), URL-synced through the shared
   hook. The /skills page keeps its own WorkChipRow order. */
function IndexChips({
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
    <div className={styles.filterRow} role="group" aria-label="Filter the list by type or skill">
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
