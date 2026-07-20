"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SKILLS, WORK_ITEMS, slugify } from "@/lib/workLibrary";
import { FilterChip } from "@/components/ui/FilterChip";
import styles from "./WorkLibrary.module.css";

/* ONE chip row, one job (Pass E task 3). The quick-pick chips under
   the search ARE the skill filter, in every view; TYPE folds into the
   end of the same row, visually separated. The former CASE and SKILL
   rows are deleted as duplicates (a seven-item library needs no filter
   listing the items; the matrix headers still toggle `case` for
   overlap emphasis). The URL stays the single source of truth: comma
   `skill`/`type` (+ matrix-set `case`) params, back/forward safe.
   Chips are FilterChips per the section 5 taxonomy, never keycaps. */

const SKILLS_VISIBLE = 6;
const parseList = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

export function useWorkFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const caseFilters = parseList(params.get("case"));
  const skillFilters = parseList(params.get("skill"));
  const typeFilters = parseList(params.get("type"));

  const setFilterParams = useCallback(
    (updates: Record<string, string | null>, opts?: { push?: boolean }) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      if (next.get("view") === "cards") next.delete("view");
      if (next.get("sort") === "year-desc") next.delete("sort");
      const qs = next.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      /* view changes PUSH (back/forward traverses views); filter and
         sort tweaks replace (no history spam while narrowing) */
      if (opts?.push) router.push(url, { scroll: false });
      else router.replace(url, { scroll: false });
    },
    [params, pathname, router]
  );

  const toggleList = useCallback(
    (key: "case" | "skill" | "type", val: string, current: string[]) => {
      const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
      setFilterParams({ [key]: next.join(",") });
    },
    [setFilterParams]
  );

  const clearAll = useCallback(
    () => setFilterParams({ case: null, skill: null, type: null }),
    [setFilterParams]
  );

  /* pieces matching the active filters (the live count, all three dims) */
  const matchCount = (() => {
    let items = WORK_ITEMS;
    if (caseFilters.length) items = items.filter((i) => caseFilters.includes(i.id));
    if (skillFilters.length)
      items = items.filter((i) => i.skills.some((s) => skillFilters.includes(slugify(s))));
    if (typeFilters.length) items = items.filter((i) => typeFilters.includes(slugify(i.medium)));
    return items.length;
  })();

  return { caseFilters, skillFilters, typeFilters, toggleList, clearAll, setFilterParams, matchCount };
}

/* TYPE values are DERIVED from the data: only mediums that exist render */
const MEDIUMS = [...new Set(WORK_ITEMS.map((i) => i.medium))];

/* ── The ONE chip row: skills, then type, visually separated ── */
export function WorkChipRow({
  skillFilters,
  typeFilters,
  toggleList,
  dense = false,
}: {
  skillFilters: string[];
  typeFilters: string[];
  toggleList: (key: "case" | "skill" | "type", val: string, current: string[]) => void;
  dense?: boolean;
}) {
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  const visibleSkills = skillsExpanded ? SKILLS : SKILLS.slice(0, SKILLS_VISIBLE);
  const chipClass = dense ? "filter-chip--dense" : undefined;

  return (
    <div className={styles.filterRow} role="group" aria-label="Filter the library by skill or type">
      {visibleSkills.map((s) => (
        <FilterChip
          key={s}
          className={chipClass}
          pressed={skillFilters.includes(slugify(s))}
          onClick={() => toggleList("skill", slugify(s), skillFilters)}
        >
          {s}
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
      <span className={styles.chipDivider} aria-hidden="true" />
      {MEDIUMS.map((m) => (
        <FilterChip
          key={m}
          className={chipClass}
          pressed={typeFilters.includes(slugify(m))}
          onClick={() => toggleList("type", slugify(m), typeFilters)}
        >
          {m}
        </FilterChip>
      ))}
    </div>
  );
}

/* ── Applied filters + the honest count (same element in every view) ── */
export function WorkAppliedRow({
  caseFilters,
  skillFilters,
  typeFilters,
  toggleList,
  clearAll,
  matchCount,
  view,
  caseCount = 0,
  labCount = 0,
  mapTotal = 0,
  mapLab = 0,
  mapHighlighted = 0,
}: {
  caseFilters: string[];
  skillFilters: string[];
  typeFilters: string[];
  toggleList: (key: "case" | "skill" | "type", val: string, current: string[]) => void;
  clearAll: () => void;
  matchCount: number;
  /** view-honest counts (Elleta, 21 Jul): the line reports what the
      CURRENT view renders, never hidden items. Absent view (the /skills
      bar) keeps the generic library count. */
  view?: "cards" | "table" | "map";
  caseCount?: number;
  labCount?: number;
  mapTotal?: number;
  mapLab?: number;
  mapHighlighted?: number;
}) {
  const hasFilters = caseFilters.length > 0 || skillFilters.length > 0 || typeFilters.length > 0;

  const appliedChips = [
    ...caseFilters.map((id) => ({
      key: `case:${id}`,
      label: WORK_ITEMS.find((i) => i.id === id)?.title ?? id,
      remove: () => toggleList("case", id, caseFilters),
    })),
    ...skillFilters.map((sl) => ({
      key: `skill:${sl}`,
      label: SKILLS.find((s) => slugify(s) === sl) ?? sl,
      remove: () => toggleList("skill", sl, skillFilters),
    })),
    ...typeFilters.map((m) => ({
      key: `type:${m}`,
      label: MEDIUMS.find((x) => slugify(x) === m) ?? m,
      remove: () => toggleList("type", m, typeFilters),
    })),
  ];

  /* the line reports what the CURRENT view renders (Elleta, 21 Jul):
     cards = case cards + lab cards on screen; map = cluster bubbles;
     table (and the /skills bar) = the filtered library rows */
  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
  const countLabel =
    view === "cards"
      ? `${plural(caseCount, "case study", "case studies")}${
          labCount ? ` · ${plural(labCount, "lab piece", "lab pieces")}` : ""
        }`
      : view === "map"
        ? hasFilters
          ? `${mapHighlighted} of ${mapTotal + mapLab} highlighted on the map`
          : `${plural(mapTotal, "case study", "case studies")}${
              mapLab ? ` · ${plural(mapLab, "lab piece", "lab pieces")}` : ""
            } on the map`
        : `${matchCount} of ${WORK_ITEMS.length} pieces`;

  return (
    <div className={styles.appliedRow}>
      <p className={styles.count} role="status">
        {countLabel}
        {hasFilters ? `, matching ${appliedChips.map((c) => c.label).join(" + ")}` : ""}
      </p>
      {appliedChips.map((c) => (
        <button key={c.key} type="button" className={styles.appliedChip} onClick={c.remove}>
          {c.label} <span aria-hidden="true">✕</span>
          <span className="sr-only">Remove filter</span>
        </button>
      ))}
      {hasFilters && (
        <button type="button" className={styles.clearAll} onClick={clearAll}>
          Clear all
        </button>
      )}
    </div>
  );
}

/* /skills: the same one row + applied/count, stacked (no search there) */
export function WorkFilterBar({
  caseFilters,
  skillFilters,
  typeFilters,
  toggleList,
  clearAll,
  matchCount,
  dense = false,
}: {
  caseFilters: string[];
  skillFilters: string[];
  typeFilters: string[];
  toggleList: (key: "case" | "skill" | "type", val: string, current: string[]) => void;
  clearAll: () => void;
  matchCount: number;
  dense?: boolean;
}) {
  return (
    <>
      <WorkChipRow
        skillFilters={skillFilters}
        typeFilters={typeFilters}
        toggleList={toggleList}
        dense={dense}
      />
      <WorkAppliedRow
        caseFilters={caseFilters}
        skillFilters={skillFilters}
        typeFilters={typeFilters}
        toggleList={toggleList}
        clearAll={clearAll}
        matchCount={matchCount}
      />
    </>
  );
}
