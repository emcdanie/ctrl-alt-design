"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SKILLS, WORK_ITEMS, slugify } from "@/lib/workLibrary";
import { FilterChip } from "@/components/ui/FilterChip";
import styles from "./WorkLibrary.module.css";

/* ONE filter implementation for the library collection (skills-filters
   pass 2026-07-17). The URL is the single source of truth: comma
   `case`/`skill` params, back/forward safe. WorkLibrary consumes this
   on /work (zero behaviour change); /skills renders the same bar above
   the matrix. Chips are FilterChips per the section 5 taxonomy, never
   keycaps. */

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
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      if (next.get("view") === "map") next.delete("view");
      if (next.get("sort") === "year-desc") next.delete("sort");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
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

export function WorkFilterBar({
  caseFilters,
  skillFilters,
  typeFilters,
  toggleList,
  clearAll,
  matchCount,
  desktopOnly = false,
}: {
  caseFilters: string[];
  skillFilters: string[];
  typeFilters: string[];
  toggleList: (key: "case" | "skill" | "type", val: string, current: string[]) => void;
  clearAll: () => void;
  matchCount: number;
  /** /work hides the rows on mobile (its tray takes over); /skills shows them everywhere */
  desktopOnly?: boolean;
}) {
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  const visibleSkills = skillsExpanded ? SKILLS : SKILLS.slice(0, SKILLS_VISIBLE);
  const hasFilters = caseFilters.length > 0 || skillFilters.length > 0 || typeFilters.length > 0;
  const rowClass = desktopOnly ? `${styles.filterRow} ${styles.desktopOnly}` : styles.filterRow;

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

  return (
    <>
      <div className={rowClass} role="group" aria-label="Filter by case study">
        <span className={styles.filterLabel}>Case</span>
        {WORK_ITEMS.map((i) => (
          <FilterChip
            key={i.id}
            pressed={caseFilters.includes(i.id)}
            onClick={() => toggleList("case", i.id, caseFilters)}
          >
            {i.title}
          </FilterChip>
        ))}
      </div>
      <div className={rowClass} role="group" aria-label="Filter by type">
        <span className={styles.filterLabel}>Type</span>
        {MEDIUMS.map((m) => (
          <FilterChip
            key={m}
            pressed={typeFilters.includes(slugify(m))}
            onClick={() => toggleList("type", slugify(m), typeFilters)}
          >
            {m}
          </FilterChip>
        ))}
      </div>
      <div className={rowClass} role="group" aria-label="Filter by skill">
        <span className={styles.filterLabel}>Skill</span>
        {visibleSkills.map((s) => (
          <FilterChip
            key={s}
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
      </div>

      <div className={styles.appliedRow}>
        <p className={styles.count} role="status">
          {matchCount} of {WORK_ITEMS.length} pieces
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
    </>
  );
}
