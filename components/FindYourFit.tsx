"use client";

import { useState, type ReactNode } from "react";
import CaseCard from "@/components/CaseCard";
import { Button } from "@/components/ui/Button";
import { matchFit, type FitMatch } from "@/lib/fit";
import styles from "./WorkLibrary.module.css";

/* find-your-fit (specs/find-your-fit, amended; one-chip-row pass
 * 2026-07-20): the site's one AI touchpoint IS the Work toolbar search.
 * Always visible on the left; the chip row beneath the box is the
 * library's ONE skill/type filter (passed in as `chipRow` — it filters
 * the views, it does not feed this matcher); the view switcher rides
 * the same row on the right (`switcher`). Deterministic trigger
 * matching is the core and the guaranteed fallback; the /api/fit leg
 * (when configured) re-ranks and phrases the reasons, and the UI says
 * so honestly. Results are the existing CaseCards, re-ranked. */

export default function FindYourFit({ switcher, chipRow }: { switcher?: ReactNode; chipRow?: ReactNode }) {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<FitMatch | null>(null);
  const [aiReasons, setAiReasons] = useState<Record<string, string> | null>(null);
  const [ran, setRan] = useState(false);

  const run = async (query: string) => {
    if (!query.trim()) {
      setResult(null);
      setAiReasons(null);
      setRan(false);
      return;
    }
    const det = matchFit(query);
    setResult(det);
    setRan(true);
    setAiReasons(null);
    try {
      const res = await fetch("/api/fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd: query }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ranked?.length) {
          const reasons: Record<string, string> = {};
          for (const r of data.ranked) reasons[r.id] = r.reason;
          setAiReasons(reasons);
          det.cases.sort(
            (a, b) => data.ranked.findIndex((r: { id: string }) => r.id === a.id) - data.ranked.findIndex((r: { id: string }) => r.id === b.id)
          );
          setResult({ ...det });
        }
      }
      /* non-OK (503 unconfigured, 429, 5xx): deterministic result stands, silently */
    } catch {
      /* offline: deterministic result stands */
    }
  };

  const skillNames = result?.matchedSkills.map((m) => m.skill) ?? [];
  const line =
    result && result.cases.length > 0
      ? `Your role emphasises ${skillNames.slice(0, 3).join(", ")}. Closest fit: ${result.cases
          .map((c) => c.title)
          .join(" and ")}.`
      : null;

  return (
    <section aria-label="Find your fit">
      {/* ── ONE toolbar row: search left, view switcher right ── */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarSearch}>
          <div className={styles.searchRow}>
            <label htmlFor="fit-jd" className="sr-only">
              Search a skill, or paste the role you are hiring for
            </label>
            <input
              id="fit-jd"
              type="search"
              value={jd}
              placeholder="Search a skill, or tell me what you are hiring for"
              className={styles.searchInput}
              onChange={(e) => {
                setJd(e.target.value);
                if (!e.target.value.trim()) run("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  run(jd);
                }
              }}
            />
            {/* the page's ONE at-rest primary (Elleta, 17 Jul evening) */}
            <Button variant="primary" onClick={() => run(jd)}>
              Find my fit
            </Button>
            {aiReasons && (
              <span className="section-label" style={{ margin: 0 }}>
                AI-enabled match
              </span>
            )}
          </div>
          {/* the ONE chip row: the library's skill/type filter, under
              the search box in every view */}
          {chipRow}
          <noscript>
            <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-sm)", color: "var(--color-ink-soft)" }}>
              <a href="/work?view=table">Browse the library as a table with filters instead.</a>
            </p>
          </noscript>
        </div>
        {switcher && <div className={styles.toolbarSwitcher}>{switcher}</div>}
      </div>

      {ran && result && result.cases.length === 0 && (
        <p style={{ margin: "var(--spacing-4) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-base)", color: "var(--color-muted)" }}>
          No strong match in the library for that text. The table and map views cover
          everything, and the cards below are the full set of case studies.
        </p>
      )}

      {result && result.cases.length > 0 && (
        <div className={styles.fitResults}>
          <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-base)", color: "var(--color-ink-soft)" }}>
            {line}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--grid-gap)", alignItems: "stretch" }}>
            {result.cases.map((c) => (
              <div key={c.id} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
                <CaseCard item={c} />
                <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-sm)", color: "var(--color-muted)", lineHeight: 1.5 }}>
                  {aiReasons?.[c.id] ?? `Matches on ${c.matched.join(", ")}.`}
                </p>
                <details>
                  <summary style={{ cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-tag)", color: "var(--color-muted)" }}>
                    Why this match
                  </summary>
                  <ul style={{ margin: "var(--spacing-2) 0 0", paddingLeft: "var(--spacing-5)", fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-tag)", color: "var(--color-ink-soft)", lineHeight: 1.6 }}>
                    {result.matchedSkills
                      .filter((m) => c.matched.includes(m.skill))
                      .map((m) => (
                        <li key={m.skill}>
                          &quot;{m.phrases[0]}&quot; in your text → {m.skill} → {c.title}
                        </li>
                      ))}
                  </ul>
                </details>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
