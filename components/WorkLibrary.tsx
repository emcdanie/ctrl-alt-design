"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BubbleCluster from "./BubbleCluster";
import CaseCard from "./CaseCard";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { FilterChip } from "@/components/ui/FilterChip";
import { Select } from "@/components/ui/Select";
import { Tag } from "@/components/ui/Tag";
import { StatusPill } from "@/components/ui/StatusPill";
import { SKILLS, WORK_ITEMS, slugify, type WorkItem } from "@/lib/workLibrary";
import styles from "./WorkLibrary.module.css";

/* The library: one collection, three views (segmented control), flat
 * multi-select filter chips with an applied row above the results, and
 * ONE sort source of truth (the URL param; column headers set it in the
 * table view, the select mirrors it on map/timeline where there are no
 * headers). Table is the accessible default. */

const VIEWS = ["table", "map", "timeline"] as const;
type View = (typeof VIEWS)[number];

const SORTS = {
  "year-desc": { label: "Year, newest first", key: "yearStart", dir: -1 },
  "year-asc": { label: "Year, oldest first", key: "yearStart", dir: 1 },
  "title-asc": { label: "Title A-Z", key: "title", dir: 1 },
  "type-asc": { label: "Type A-Z", key: "type", dir: 1 },
} as const;
type SortKey = keyof typeof SORTS;

const SKILLS_VISIBLE = 6;

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

const parseList = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

export default function WorkLibrary() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);
  const trayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trayOpen) return;
    trayRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTrayOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [trayOpen]);

  const view: View = (VIEWS as readonly string[]).includes(params.get("view") ?? "")
    ? (params.get("view") as View)
    : "table";
  const caseFilters = parseList(params.get("case"));
  const skillFilters = parseList(params.get("skill"));
  const sort: SortKey = params.get("sort") && params.get("sort")! in SORTS
    ? (params.get("sort") as SortKey)
    : "year-desc";

  const setParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      if (next.get("view") === "table") next.delete("view");
      if (next.get("sort") === "year-desc") next.delete("sort");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router]
  );

  const toggleList = useCallback(
    (key: "case" | "skill", val: string, current: string[]) => {
      const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
      setParams({ [key]: next.join(",") });
    },
    [setParams]
  );

  const filtered = useMemo(() => {
    let items = WORK_ITEMS;
    if (caseFilters.length) items = items.filter((i) => caseFilters.includes(i.id));
    if (skillFilters.length)
      items = items.filter((i) => i.skills.some((s) => skillFilters.includes(slugify(s))));
    return sortItems(items, sort);
  }, [caseFilters, skillFilters, sort]);

  const hasFilters = caseFilters.length > 0 || skillFilters.length > 0;
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
  ];

  const visibleSkills = skillsExpanded ? SKILLS : SKILLS.slice(0, SKILLS_VISIBLE);

  return (
    <div>
      {/* ── View switch + sort (select only where no headers exist) ── */}
      <div className={styles.controls}>
        <SegmentedControl
          label="View mode"
          options={VIEWS.map((v) => ({ value: v, label: v }))}
          value={view}
          onChange={(v) => setParams({ view: v === "table" ? null : v })}
        />
        {view !== "table" && (
          <Select
            label="Sort"
            value={sort}
            onChange={(v) => setParams({ sort: v === "year-desc" ? null : v })}
            options={Object.entries(SORTS).map(([k, s]) => ({ value: k, label: s.label }))}
          />
        )}
      </div>

      {/* Mobile: one Filter button opens the tray (never 15 wrapped chips) */}
      <div className={styles.trayTrigger}>
        <button
          type="button"
          className={styles.trayTriggerBtn}
          aria-expanded={trayOpen}
          onClick={() => setTrayOpen(true)}
        >
          Filter{appliedChips.length > 0 ? ` (${appliedChips.length})` : ""}
        </button>
      </div>

      {trayOpen && (
        <div
          ref={trayRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className={styles.tray}
        >
          <div className={styles.trayHeader}>
            <p className={styles.count} role="status">
              {filtered.length} of {WORK_ITEMS.length} pieces
            </p>
            <button type="button" className={styles.clearAll} onClick={() => setParams({ case: null, skill: null })}>
              Clear all
            </button>
          </div>
          <details open className={styles.trayGroup}>
            <summary>Case</summary>
            <div className={styles.trayChips}>
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
          </details>
          <details className={styles.trayGroup}>
            <summary>Skill</summary>
            <div className={styles.trayChips}>
              {SKILLS.map((sk) => (
                <FilterChip
                  key={sk}
                  pressed={skillFilters.includes(slugify(sk))}
                  onClick={() => toggleList("skill", slugify(sk), skillFilters)}
                >
                  {sk}
                </FilterChip>
              ))}
            </div>
          </details>
          <div className={styles.trayApply}>
            <Button variant="primary" onClick={() => setTrayOpen(false)} className="w-full">
              Show {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </Button>
          </div>
        </div>
      )}

      {/* ── Filters: flat chips; skills behind progressive disclosure ── */}
      <div className={`${styles.filterRow} ${styles.desktopOnly}`} role="group" aria-label="Filter by case study">
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
      <div className={`${styles.filterRow} ${styles.desktopOnly}`} role="group" aria-label="Filter by skill">
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

      {/* ── Applied filters above the results + live count ── */}
      <div className={styles.appliedRow}>
        <p className={styles.count} role="status">
          {filtered.length} of {WORK_ITEMS.length} pieces
        </p>
        {appliedChips.map((c) => (
          <button key={c.key} type="button" className={styles.appliedChip} onClick={c.remove}>
            {c.label} <span aria-hidden="true">✕</span>
            <span className="sr-only">Remove filter</span>
          </button>
        ))}
        {hasFilters && (
          <button
            type="button"
            className={styles.clearAll}
            onClick={() => setParams({ case: null, skill: null })}
          >
            Clear all
          </button>
        )}
      </div>

      {view === "table" && <TableView items={filtered} sort={sort} setParams={setParams} />}
      {view === "map" && (
        <div className={styles.mapWrap}>
          <BubbleCluster highlightIds={hasFilters ? filtered.map((i) => i.id) : null} />
        </div>
      )}
      {view === "timeline" && <TimelineView items={filtered} />}
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

/* ── Timeline (CaseCards on the rail; reduced-motion flattens) ── */

function TimelineView({ items }: { items: WorkItem[] }) {
  const trackRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = track.scrollLeft + track.clientWidth / 2;
        track.querySelectorAll<HTMLElement>(`.${styles.cardInner}`).forEach((el) => {
          const li = el.parentElement!;
          const center = li.offsetLeft + li.offsetWidth / 2;
          el.style.transform = `translateX(${(mid - center) * 0.05}px)`;
        });
      });
    };
    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const track = trackRef.current;
    if (!track) return;
    const links = [...track.querySelectorAll<HTMLAnchorElement>("a")];
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = e.key === "ArrowRight" ? current + 1 : current - 1;
    if (next >= 0 && next < links.length) {
      e.preventDefault();
      links[next].focus();
      links[next].closest("li")?.scrollIntoView({ inline: "center", block: "nearest", behavior: "auto" });
    }
  };

  const nudge = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <div>
      <div className={styles.tlAffordance}>
        <Button onClick={() => nudge(-1)} ariaLabel="Scroll timeline backwards">
          ←
        </Button>
        <span className={styles.tlHint} aria-hidden="true">
          drag, scroll, or use arrow keys
        </span>
        <Button onClick={() => nudge(1)} ariaLabel="Scroll timeline forwards">
          →
        </Button>
      </div>

      <ul
        ref={trackRef}
        className={styles.tlTrack}
        aria-label="Timeline of work, chronological"
        onKeyDown={onKeyDown}
      >
        {items.map((i) => (
          <li key={i.id} className={styles.tlCard}>
            <div className={styles.cardInner}>
              <p className={styles.tlYear} style={{ color: i.text }}>{i.year}</p>
              <CaseCard item={i} />
            </div>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p className={styles.empty}>No pieces match these filters.</p>}
    </div>
  );
}
