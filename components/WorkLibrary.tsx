"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BubbleCluster from "./BubbleCluster";
import { SKILLS, WORK_ITEMS, slugify, type WorkItem } from "@/lib/workLibrary";
import styles from "./WorkLibrary.module.css";

/* Mirrors the CHIP Research Library: one collection, three view modes
 * (Map / Table / Timeline), filter chips (case + skill), a sort control,
 * everything reflected in the URL. Table is the accessible default. */

const VIEWS = ["table", "map", "timeline"] as const;
type View = (typeof VIEWS)[number];

const SORTS = {
  "year-desc": { label: "Year, newest first", key: "yearStart", dir: -1 },
  "year-asc": { label: "Year, oldest first", key: "yearStart", dir: 1 },
  "title-asc": { label: "Title A–Z", key: "title", dir: 1 },
  "type-asc": { label: "Type A–Z", key: "type", dir: 1 },
} as const;
type SortKey = keyof typeof SORTS;

function sortItems(items: WorkItem[], sort: SortKey): WorkItem[] {
  const { key, dir } = SORTS[sort];
  return [...items].sort((a, b) => {
    const av = a[key as keyof WorkItem] as string | number;
    const bv = b[key as keyof WorkItem] as string | number;
    if (av === bv) return a.title.localeCompare(b.title);
    return (av < bv ? -1 : 1) * dir;
  });
}

export default function WorkLibrary() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const view: View = (VIEWS as readonly string[]).includes(params.get("view") ?? "")
    ? (params.get("view") as View)
    : "table";
  const caseFilter = params.get("case");
  const skillFilter = params.get("skill");
  const sort: SortKey = params.get("sort") && params.get("sort")! in SORTS
    ? (params.get("sort") as SortKey)
    : "year-desc";

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === null) next.delete(key);
      else next.set(key, value);
      // defaults stay out of the URL
      if (next.get("view") === "table") next.delete("view");
      if (next.get("sort") === "year-desc") next.delete("sort");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router]
  );

  const filtered = useMemo(() => {
    let items = WORK_ITEMS;
    if (caseFilter) items = items.filter((i) => i.id === caseFilter);
    if (skillFilter) items = items.filter((i) => i.skills.some((s) => slugify(s) === skillFilter));
    return sortItems(items, sort);
  }, [caseFilter, skillFilter, sort]);

  const hasFilters = Boolean(caseFilter || skillFilter);

  return (
    <div>
      {/* ── View switch ── */}
      <div className={styles.controls}>
        <div className={styles.viewGroup} role="group" aria-label="View mode">
          {VIEWS.map((v) => (
            <button
              key={v}
              type="button"
              className="btn-key"
              aria-pressed={view === v}
              onClick={() => setParam("view", v === "table" ? null : v)}
            >
              {v}
            </button>
          ))}
        </div>

        <label className={styles.sortControl}>
          <span>Sort</span>
          <select
            value={sort}
            onChange={(e) => setParam("sort", e.target.value === "year-desc" ? null : e.target.value)}
          >
            {Object.entries(SORTS).map(([k, s]) => (
              <option key={k} value={k}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* ── Filter chips ── */}
      <div className={styles.filterRow} role="group" aria-label="Filter by case study">
        <span className={styles.filterLabel}>Case</span>
        {WORK_ITEMS.map((i) => (
          <button
            key={i.id}
            type="button"
            className={`btn-key ${styles.chip}`}
            aria-pressed={caseFilter === i.id}
            onClick={() => setParam("case", caseFilter === i.id ? null : i.id)}
          >
            <span className={styles.chipDot} style={{ background: i.lo }} aria-hidden="true" />
            {i.title}
          </button>
        ))}
      </div>
      <div className={styles.filterRow} role="group" aria-label="Filter by skill">
        <span className={styles.filterLabel}>Skill</span>
        {SKILLS.map((s) => (
          <button
            key={s}
            type="button"
            className={`btn-key ${styles.chip}`}
            aria-pressed={skillFilter === slugify(s)}
            onClick={() => setParam("skill", skillFilter === slugify(s) ? null : slugify(s))}
          >
            {s}
          </button>
        ))}
        {hasFilters && (
          <button
            type="button"
            className={`btn-key ${styles.chip}`}
            onClick={() => {
              const next = new URLSearchParams(params.toString());
              next.delete("case");
              next.delete("skill");
              const qs = next.toString();
              router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
            }}
          >
            Clear filters ✕
          </button>
        )}
      </div>

      <p className={styles.count} role="status">
        {filtered.length} of {WORK_ITEMS.length} pieces
      </p>

      {view === "table" && <TableView items={filtered} sort={sort} setParam={setParam} />}
      {view === "map" && (
        <div className={styles.mapWrap}>
          <BubbleCluster highlightIds={hasFilters ? filtered.map((i) => i.id) : null} />
        </div>
      )}
      {view === "timeline" && <TimelineView items={filtered} />}
    </div>
  );
}

/* ── Table — the accessible default ── */

function TableView({
  items,
  sort,
  setParam,
}: {
  items: WorkItem[];
  sort: SortKey;
  setParam: (k: string, v: string | null) => void;
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
    if (col.desc && sort === col.asc) return setParam("sort", col.desc);
    if (col.desc && sort === col.desc) return setParam("sort", col.asc);
    setParam("sort", col.asc === "year-desc" ? null : col.asc);
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
                <Link href={i.href} className={styles.rowTitle} style={{ color: i.deep }}>
                  {i.title}
                </Link>
              </th>
              <td>{i.type}</td>
              <td>
                <span className={styles.skillList}>
                  {i.skills.map((s) => (
                    <span key={s} className={styles.skillTag}>
                      {s}
                    </span>
                  ))}
                </span>
              </td>
              <td className={styles.nowrap}>{i.year}</td>
              <td>{i.role}</td>
              <td>{i.impact}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p className={styles.empty}>No pieces match these filters.</p>}
    </div>
  );
}

/* ── Timeline — horizontal scroll-snap + light parallax; flattens to a
 * vertical list under prefers-reduced-motion (CSS), where the parallax
 * never runs (JS gate). Arrow keys move between cards. ── */

function TimelineView({ items }: { items: WorkItem[] }) {
  const trackRef = useRef<HTMLUListElement>(null);

  // Light parallax: card content drifts a few px against the scroll.
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
      {/* visible affordance: arrows + hint */}
      <div className={styles.tlAffordance}>
        <button type="button" className="btn-key" onClick={() => nudge(-1)} aria-label="Scroll timeline backwards">
          ←
        </button>
        <span className={styles.tlHint} aria-hidden="true">
          drag, scroll, or use arrow keys
        </span>
        <button type="button" className="btn-key" onClick={() => nudge(1)} aria-label="Scroll timeline forwards">
          →
        </button>
      </div>

      <ul
        ref={trackRef}
        className={styles.tlTrack}
        aria-label="Timeline of work, chronological"
        onKeyDown={onKeyDown}
      >
        {items.map((i) => (
          <li key={i.id} className={styles.tlCard} style={{ ["--cc" as string]: i.lo, ["--ct" as string]: i.deep }}>
            <div className={styles.cardInner}>
              <p className={styles.tlYear}>{i.year}</p>
              <p className={styles.tlTitle}>
                <Link href={i.href}>{i.title}</Link>
              </p>
              <p className={styles.tlType}>{i.type}</p>
              <p className={styles.tlImpact}>{i.impact}</p>
            </div>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p className={styles.empty}>No pieces match these filters.</p>}
    </div>
  );
}
