"use client";

import { Fragment, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterChip } from "@/components/ui/FilterChip";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { MatrixView } from "@/components/WorkLibrary";
import LearningMap from "@/components/LearningMap";
import {
  COUNTS,
  LEARNING,
  LEARNING_TYPES,
  countTopic,
  countType,
  formatMonth,
  isCertificate,
  matchesType,
  onMap,
  type LearningEntry,
  type LearningType,
} from "@/content/learning";
import { SKILLS, slugify } from "@/content/skills";
import { WORK_ITEMS } from "@/lib/workLibrary";
import work from "./WorkLibrary.module.css";
import styles from "./Learning.module.css";

/* The /learning library (specs/learning): search, Type and Topic chips
 * with counts, the live count, then one of four views. The URL is the
 * state (Work toolbar rule): `view`, `type`, `topic`, `q`, `sort`,
 * back/forward safe, defaults keep clean URLs. View changes push;
 * filter, search and sort changes replace. Podcast and Off the clock
 * entries render in Timeline and Table only. */

const VIEWS = ["timeline", "table", "map", "skills"] as const;
type View = (typeof VIEWS)[number];
const SORTS = [
  "date-desc",
  "date-asc",
  "type-asc",
  "type-desc",
  "title-asc",
  "title-desc",
] as const;
type Sort = (typeof SORTS)[number];

const parseList = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);
/* chips come from the data: a type or topic renders only when it has entries */
const TYPES = LEARNING_TYPES.filter((t) => countType(t) > 0);
const TOPICS = SKILLS.filter((s) => countTopic(s) > 0);

export const workById = (id: string) => WORK_ITEMS.find((w) => w.id === id);
export const hashtag = (s: string) => `#${slugify(s)}`;

export function DateLabel({ entry }: { entry: LearningEntry }) {
  return entry.dateToConfirm ? (
    <span
      className={`text-code ${styles["date-meta"]} ${styles.tbc}`}
      title="Date to confirm"
    >
      {formatMonth(entry.date)}
      <span className="sr-only"> (date to confirm)</span>
    </span>
  ) : (
    <span className={`text-code ${styles["date-meta"]}`}>
      {formatMonth(entry.date)}
    </span>
  );
}

/* pills are iris-soft, never solid purple (Elleta, 19 Sep 2026) */
export function TypePill({ entry }: { entry: LearningEntry }) {
  return <span className={styles.pill}>{entry.type}</span>;
}

export function InProgress() {
  return (
    <span className={`${styles.pill} ${styles.pillProgress}`}>In progress</span>
  );
}

export function UsedIn({ ids }: { ids: string[] }) {
  const items = ids.map(workById).filter((w) => w != null);
  if (!items.length) return null;
  return (
    <span className={styles["used-meta"]}>
      Used in{" "}
      <span className={styles["arrow-meta"]} aria-hidden="true">
        →
      </span>{" "}
      {items.map((w, i) => (
        <Fragment key={w.id}>
          {i > 0 ? ", " : ""}
          <Link href={w.href}>{w.title}</Link>
        </Fragment>
      ))}
    </span>
  );
}

export default function LearningLibrary() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const view: View = (VIEWS as readonly string[]).includes(
    params.get("view") ?? "",
  )
    ? (params.get("view") as View)
    : "timeline";
  const sort: Sort = (SORTS as readonly string[]).includes(
    params.get("sort") ?? "",
  )
    ? (params.get("sort") as Sort)
    : "date-desc";
  const typeFilters = parseList(params.get("type"));
  const topicFilters = parseList(params.get("topic"));
  const urlQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);

  const setParams = useCallback(
    (updates: Record<string, string | null>, opts?: { push?: boolean }) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      if (next.get("view") === "timeline") next.delete("view");
      if (next.get("sort") === "date-desc") next.delete("sort");
      const qs = next.toString();
      const url = qs ? `${pathname}?${qs}` : pathname;
      if (opts?.push) router.push(url, { scroll: false });
      else router.replace(url, { scroll: false });
    },
    [params, pathname, router],
  );

  const toggle = (key: "type" | "topic", val: string, current: string[]) =>
    setParams({
      [key]: (current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val]
      ).join(","),
    });

  const q = urlQuery.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      LEARNING.filter(
        (e) =>
          (!typeFilters.length ||
            TYPES.some(
              (t) =>
                typeFilters.includes(slugify(t)) &&
                matchesType(e, t as LearningType),
            )) &&
          (!topicFilters.length ||
            e.topics.some((t) => topicFilters.includes(slugify(t)))) &&
          (!q ||
            [e.title, e.from, e.type, ...e.topics, ...(e.items ?? [])]
              .join(" ")
              .toLowerCase()
              .includes(q)),
      ),
    [typeFilters, topicFilters, q],
  );

  const hasFilters =
    typeFilters.length > 0 || topicFilters.length > 0 || q.length > 0;
  const clearAll = () => {
    setQuery("");
    setParams({ type: null, topic: null, q: null });
  };

  return (
    <div className={styles.library}>
      <div className={styles.filters}>
        <div className={work.searchRow}>
          <label htmlFor="learning-q" className="sr-only">
            Search the library
          </label>
          <input
            id="learning-q"
            type="search"
            value={query}
            placeholder="Search a course, a teacher or a topic"
            className={`${work.searchInput} ${styles.search}`}
            onChange={(e) => {
              setQuery(e.target.value);
              setParams({ q: e.target.value.trim() ? e.target.value : null });
            }}
          />
        </div>
        <ChipRow label="Type">
          {TYPES.map((t) => (
            <FilterChip
              key={t}
              pressed={typeFilters.includes(slugify(t))}
              onClick={() => toggle("type", slugify(t), typeFilters)}
            >
              {t}
              <span className="text-code filter-chip__count">
                {countType(t)}
              </span>
            </FilterChip>
          ))}
        </ChipRow>
        <ChipRow label="Topic">
          {TOPICS.map((s) => (
            <FilterChip
              key={s}
              pressed={topicFilters.includes(slugify(s))}
              onClick={() => toggle("topic", slugify(s), topicFilters)}
            >
              {s}
              <span className="text-code filter-chip__count">
                {countTopic(s)}
              </span>
            </FilterChip>
          ))}
        </ChipRow>
        <div className={styles.toolbar}>
          <p className={styles["results-meta"]} aria-live="polite">
            <b>{filtered.length}</b> of {COUNTS.entries} entries
          </p>
          <div className={styles.toolbarEnd}>
            {hasFilters && (
              <button type="button" className={styles.clear} onClick={clearAll}>
                Clear filters
              </button>
            )}
            <SegmentedControl
              label="View"
              sentence
              options={[
                { value: "timeline", label: "Timeline" },
                { value: "table", label: "Table" },
                { value: "map", label: "Map" },
                { value: "skills", label: "Skills" },
              ]}
              value={view}
              onChange={(v) => setParams({ view: v }, { push: true })}
            />
          </div>
        </div>
      </div>

      <div className={styles.view}>
        {view === "timeline" && <Timeline entries={filtered} />}
        {view === "table" && (
          <Table
            entries={filtered}
            sort={sort}
            setSort={(s) => setParams({ sort: s })}
          />
        )}
        {view === "map" && (
          <LearningMap
            visible={new Set(filtered.map((e) => e.id))}
            topicFilters={topicFilters}
          />
        )}
        {view === "skills" && (
          <Skills
            entries={filtered}
            topicFilters={topicFilters}
            toggleTopic={(s) => toggle("topic", s, topicFilters)}
          />
        )}
      </div>
    </div>
  );
}

function ChipRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="filter-chip-row"
      role="group"
      aria-label={`Filter by ${label.toLowerCase()}`}
    >
      <span className="filter-chip-row__label" aria-hidden="true">
        {label}
      </span>
      {children}
    </div>
  );
}

function Empty() {
  return (
    <p className={styles.empty}>Nothing matches. Try clearing a filter.</p>
  );
}

/* ── Timeline: by year, newest first ── */
function Timeline({ entries }: { entries: LearningEntry[] }) {
  if (!entries.length) return <Empty />;
  const sorted = [...entries].sort(
    (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
  );
  const years = [...new Set(sorted.map((e) => e.date.slice(0, 4)))];
  return (
    <div className={styles.timeline}>
      {years.map((y) => (
        <div key={y}>
          <h3 id={`year-${y}`} className={`heading-item ${styles.year}`}>
            {y}
          </h3>
          <ul className={styles.tl}>
            {sorted
              .filter((e) => e.date.startsWith(y))
              .map((e) => (
                <li
                  key={e.id}
                  id={`entry-${e.id}`}
                  className={isCertificate(e) ? styles.tlCert : undefined}
                >
                  <p className={styles.meta}>
                    <DateLabel entry={e} />
                    <TypePill entry={e} />
                    <span className={styles["from-meta"]}>{e.from}</span>
                  </p>
                  <h4 className={`heading-item ${styles.entryTitle}`}>
                    {e.link ? (
                      <a
                        href={e.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {e.title} <span aria-hidden="true">↗</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      e.title
                    )}
                  </h4>
                  {e.status === "in-progress" && <InProgress />}
                  {e.took && (
                    <p className={styles.took}>
                      <span className={styles.tookLabel}>
                        What I took from it:{" "}
                      </span>
                      {e.took}
                    </p>
                  )}
                  {e.items && (
                    <details className={styles.items}>
                      <summary>{e.items.length} classes</summary>
                      <ul>
                        {e.items.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </details>
                  )}
                  {(e.topics.length > 0 || e.usedIn.length > 0) && (
                    <p className={styles.tags}>
                      {e.topics.map((t) => (
                        <span key={t} className={styles.hashtag}>
                          {hashtag(t)}
                        </span>
                      ))}
                      <UsedIn ids={e.usedIn} />
                    </p>
                  )}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ── Table: sortable headers carry aria-sort ── */
function Table({
  entries,
  sort,
  setSort,
}: {
  entries: LearningEntry[];
  sort: Sort;
  setSort: (s: Sort) => void;
}) {
  const [key, dir] = sort.split("-") as [
    "date" | "type" | "title",
    "asc" | "desc",
  ];
  const sorted = [...entries].sort((a, b) => {
    const A = key === "date" ? a.date : key === "type" ? a.type : a.title;
    const B = key === "date" ? b.date : key === "type" ? b.type : b.title;
    return (
      (A.localeCompare(B) || a.title.localeCompare(b.title)) *
      (dir === "asc" ? 1 : -1)
    );
  });
  const cols: { k: "date" | "type" | "title"; label: string }[] = [
    { k: "date", label: "Date" },
    { k: "type", label: "Type" },
    { k: "title", label: "Title" },
  ];
  const th = (c: (typeof cols)[number]) => {
    const on = key === c.k;
    return (
      <th
        key={c.k}
        scope="col"
        aria-sort={on ? (dir === "asc" ? "ascending" : "descending") : "none"}
        className={c.k === "date" ? styles.num : undefined}
      >
        <button
          type="button"
          className={work.thSort}
          onClick={() =>
            setSort(
              on
                ? (`${c.k}-${dir === "asc" ? "desc" : "asc"}` as Sort)
                : (`${c.k}-${c.k === "date" ? "desc" : "asc"}` as Sort),
            )
          }
        >
          {c.label}
          <span aria-hidden="true">
            {on ? (dir === "asc" ? " ↑" : " ↓") : " ↕"}
          </span>
        </button>
      </th>
    );
  };
  return (
    <div className={`${work.tableWrap} ${styles.tableWrap}`}>
      <table className={`${work.table} ${styles.table}`}>
        <caption className="sr-only">
          The learning library: date, type, title, who it was from, topics, and
          the projects it was used in. Date, Type and Title headers sort the
          table.
        </caption>
        <thead>
          <tr>
            {cols.map(th)}
            <th scope="col">From</th>
            <th scope="col">Topics</th>
            <th scope="col">Used in</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((e) => (
            <tr key={e.id}>
              <td className={styles.num}>
                <DateLabel entry={e} />
              </td>
              <td>
                <TypePill entry={e} />
              </td>
              <th scope="row" className={styles.rowTitle}>
                {e.title}
                {e.status === "in-progress" && <InProgress />}
              </th>
              <td>{e.from}</td>
              <td className={styles["topics-meta"]}>{e.topics.join(", ")}</td>
              <td>
                {e.usedIn.length ? (
                  <UsedInLinks ids={e.usedIn} />
                ) : (
                  <span className={styles.notYet}>Not yet</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* below 768px the Work pattern: stacked rows in the same order */}
      <ul className={work.stackList}>
        {sorted.map((e) => (
          <li key={e.id} className={work.stackCard}>
            <p className={styles.meta}>
              <DateLabel entry={e} />
              <TypePill entry={e} />
              {e.status === "in-progress" && <InProgress />}
            </p>
            <p className={styles.stackTitle}>{e.title}</p>
            <p className={styles["from-meta"]}>{e.from}</p>
            {e.usedIn.length > 0 && (
              <p className={styles.tags}>
                <UsedIn ids={e.usedIn} />
              </p>
            )}
          </li>
        ))}
      </ul>
      {!entries.length && <Empty />}
    </div>
  );
}

function UsedInLinks({ ids }: { ids: string[] }) {
  return (
    <>
      {ids
        .map(workById)
        .filter((w) => w != null)
        .map((w, i) => (
          <Fragment key={w.id}>
            {i > 0 ? ", " : ""}
            <Link href={w.href} className={styles.inlineLink}>
              {w.title}
            </Link>
          </Fragment>
        ))}
    </>
  );
}

/* ── Skills: the matrix, extended with where each skill was learned ── */
function Skills({
  entries,
  topicFilters,
  toggleTopic,
}: {
  entries: LearningEntry[];
  topicFilters: string[];
  toggleTopic: (slug: string) => void;
}) {
  const shown = new Set(entries.map((e) => e.id));
  const mapped = LEARNING.filter(onMap);
  return (
    <>
      <MatrixView
        caseFilters={[]}
        skillFilters={topicFilters}
        toggleSkill={toggleTopic}
        learnedFrom={(skill) =>
          mapped
            .filter((e) => e.topics.includes(skill))
            .map((e) => ({
              id: e.id,
              label: `${e.type}: ${e.title}, ${e.from}`,
              certificate: isCertificate(e),
              muted: !shown.has(e.id),
            }))
        }
      />
      <ul className={styles.key} aria-label="Key">
        <li className={styles["key-meta"]}>
          <i
            className={`${styles.keyDot} ${styles.keyDotFilled}`}
            aria-hidden="true"
          />
          Certificate
        </li>
        <li className={styles["key-meta"]}>
          <i className={styles.keyDot} aria-hidden="true" />
          Course, workshop, event or reading
        </li>
        <li className={styles["key-meta"]}>
          <i className={styles.keyCell} aria-hidden="true" />
          Tinted cell: used in that project
        </li>
      </ul>
    </>
  );
}
