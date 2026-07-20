"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BubbleCluster from "./BubbleCluster";
import CaseCard from "./CaseCard";
import FindYourFit from "@/components/FindYourFit";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Tag } from "@/components/ui/Tag";
import { StatusPill } from "@/components/ui/StatusPill";
import { SKILLS, WORK_ITEMS, slugify, type WorkItem } from "@/lib/workLibrary";
import styles from "./WorkLibrary.module.css";
import { WorkChipRow, WorkAppliedRow, useWorkFilters } from "@/components/WorkFilters";
import CtrlAltDesignSection from "@/components/CtrlAltDesignSection";

/* The library (toolbar rebuild 2026-07-18): ONE toolbar row above
 * everything — find-your-fit search on the left, view switcher on the
 * right, both always visible. Cards is the default view and IS the
 * curated composition (featured CHIP, ranked case grid, Explorations);
 * Map and Table carry the filter rows (dense) and sort. The former
 * ?explore hidden state is retired; the view lives in the URL (`view`
 * param, back/forward safe, defaults keep clean URLs). */

const VIEWS = ["cards", "map", "table"] as const;
type View = (typeof VIEWS)[number];

const SORTS = {
  "year-desc": { label: "Year, newest first", key: "yearStart", dir: -1 },
  "year-asc": { label: "Year, oldest first", key: "yearStart", dir: 1 },
  "title-asc": { label: "Title A-Z", key: "title", dir: 1 },
  "type-asc": { label: "Type A-Z", key: "type", dir: 1 },
} as const;
type SortKey = keyof typeof SORTS;

function sortItems(items: WorkItem[], sort: SortKey): WorkItem[] {
  const { key, dir } = SORTS[sort];
  return [...items].sort((a, b) => {
    if (sort === "year-desc") {
      const ra = a.rank ?? 99;
      const rb = b.rank ?? 99;
      if (ra !== rb) return ra - rb;
      if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
    }
    const av = a[key as keyof WorkItem] as string | number;
    const bv = b[key as keyof WorkItem] as string | number;
    if (av === bv) return a.title.localeCompare(b.title);
    return (av < bv ? -1 : 1) * dir;
  });
}

export default function WorkLibrary() {
  const params = useSearchParams();
  const { caseFilters, skillFilters, typeFilters, toggleList, clearAll, setFilterParams } =
    useWorkFilters();

  const view: View = (VIEWS as readonly string[]).includes(params.get("view") ?? "")
    ? (params.get("view") as View)
    : "cards";
  const sort: SortKey = params.get("sort") && params.get("sort")! in SORTS
    ? (params.get("sort") as SortKey)
    : "year-desc";

  const filtered = useMemo(() => {
    let items = WORK_ITEMS;
    if (caseFilters.length) items = items.filter((i) => caseFilters.includes(i.id));
    if (skillFilters.length)
      items = items.filter((i) => i.skills.some((s) => skillFilters.includes(slugify(s))));
    if (typeFilters.length) items = items.filter((i) => typeFilters.includes(slugify(i.medium)));
    return sortItems(items, sort);
  }, [caseFilters, skillFilters, typeFilters, sort]);

  const hasFilters = caseFilters.length > 0 || skillFilters.length > 0 || typeFilters.length > 0;

  /* every view renders the same filtered set (Pass E task 3): the
     curated Cards composition narrows too, it never ignores a chip */
  const caseItems = filtered.filter((i) => i.medium === "case study");
  const featured = caseItems.find((i) => i.featured);
  const rankedRest = caseItems.filter((i) => !i.featured);
  const showLab = filtered.some((i) => i.medium === "prototype");

  return (
    <div>
      {/* ── ONE stable order in every view (Pass E task 3): toolbar
          (search + chip row | switcher), contextual message, count,
          content. Nothing jumps when the view changes. ── */}
      <FindYourFit
        chipRow={
          <WorkChipRow
            skillFilters={skillFilters}
            typeFilters={typeFilters}
            toggleList={toggleList}
            dense
          />
        }
        switcher={
          <SegmentedControl
            label="View mode"
            options={[
              { value: "cards", label: "cards", icon: "ViewGrid" },
              { value: "map", label: "map", icon: "Map" },
              { value: "table", label: "table", icon: "Table" },
            ]}
            value={view}
            onChange={(v) => setFilterParams({ view: v === "cards" ? null : v }, { push: true })}
          />
        }
      />

      {/* the honest count, identical element in every view */}
      <WorkAppliedRow
        caseFilters={caseFilters}
        skillFilters={skillFilters}
        typeFilters={typeFilters}
        toggleList={toggleList}
        clearAll={clearAll}
        matchCount={filtered.length}
      />

      {/* ── Cards: the curated composition, filtered like every view ── */}
      {view === "cards" && (
        <div>
          <div className={styles.curatedGrid}>
            {featured && (
              <div className={styles.featuredSlot}>
                <CaseCard item={featured} coverSrc="/case/chip/chip-evidence-0-bridge-hero.png" />
              </div>
            )}
            {rankedRest.map((i) => (
              <CaseCard key={i.id} item={i} />
            ))}
          </div>
          {showLab && <CtrlAltDesignSection />}
        </div>
      )}

      {/* sort renders only where order means something: table headers
          (aria-sort buttons). The Map is spatial; it sorts nothing. */}
      {view === "table" && <TableView items={filtered} sort={sort} setParams={setFilterParams} />}
      {view === "map" && (
        <div className={styles.mapWrap}>
          <BubbleCluster highlightIds={hasFilters ? filtered.map((i) => i.id) : null} />
        </div>
      )}
    </div>
  );
}

/* ── Table: the accessible default. Column headers are the sort input
 * in this view (aria-sort buttons writing the same URL param). ── */

function TableView({
  items,
  sort,
  setParams,
}: {
  items: WorkItem[];
  sort: SortKey;
  setParams: (u: Record<string, string | null>) => void;
}) {
  const sortable: { col: string; asc: SortKey; desc?: SortKey }[] = [
    { col: "Title", asc: "title-asc" },
    { col: "Type", asc: "type-asc" },
    { col: "Year", asc: "year-asc", desc: "year-desc" },
  ];

  const ariaSort = (col: string): "ascending" | "descending" | undefined => {
    if (col === "Title" && sort === "title-asc") return "ascending";
    if (col === "Type" && sort === "type-asc") return "ascending";
    if (col === "Year" && sort === "year-asc") return "ascending";
    if (col === "Year" && sort === "year-desc") return "descending";
    return undefined;
  };

  const toggle = (col: (typeof sortable)[number]) => {
    if (col.desc && sort === col.asc) return setParams({ sort: col.desc });
    if (col.desc && sort === col.desc) return setParams({ sort: col.asc });
    setParams({ sort: col.asc === "year-desc" ? null : col.asc });
  };

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption className="sr-only">
          Work library: title, type, skills, year, role, and impact for each piece. Column
          headers with buttons sort the table.
        </caption>
        <thead>
          <tr>
            {["Title", "Type", "Skills", "Year", "Role", "Impact"].map((col) => {
              const s = sortable.find((c) => c.col === col);
              return (
                <th key={col} scope="col" aria-sort={ariaSort(col)}>
                  {s ? (
                    <button type="button" className={styles.thSort} onClick={() => toggle(s)}>
                      {col}
                      <span aria-hidden="true">
                        {ariaSort(col) === "ascending" ? " ↑" : ariaSort(col) === "descending" ? " ↓" : " ↕"}
                      </span>
                    </button>
                  ) : (
                    col
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <th scope="row">
                <Link href={i.href} className={styles.rowTitle} style={{ color: i.text }}>
                  {i.title}
                </Link>
                {i.featured && <StatusPill>Current focus</StatusPill>}
              </th>
              <td>{i.type}</td>
              <td>
                <span className={styles.skillList}>
                  {i.skills.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </span>
              </td>
              <td className={styles.nowrap}>{i.year}</td>
              <td>{i.role}</td>
              <td className={styles.impactCell}>{i.impact}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile companion: stacked cards (table hides <768px) */}
      <ul className={styles.stackList}>
        {items.map((i) => (
          <li key={i.id} className={styles.stackCard}>
            <Link href={i.href} className={styles.rowTitle} style={{ color: i.text }}>
              {i.title}
            </Link>
            {i.featured && <StatusPill>Current focus</StatusPill>}
            <p className={styles.stackMeta}>
              {i.type} · {i.year} · {i.role}
            </p>
            <p className={styles.stackImpact}>{i.impact}</p>
          </li>
        ))}
      </ul>

      {items.length === 0 && <p className={styles.empty}>No pieces match these filters.</p>}
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
                      {marked && (
                        <>
                          <span aria-hidden="true" className={styles.mxDot} />
                          <span className="sr-only">
                            {skill} used in {i.title}
                          </span>
                        </>
                      )}
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
