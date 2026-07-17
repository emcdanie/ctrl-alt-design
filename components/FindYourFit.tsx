"use client";

import { useState } from "react";
import CaseCard from "@/components/CaseCard";
import { Button } from "@/components/ui/Button";
import { matchFit, type FitMatch } from "@/lib/fit";

/* find-your-fit (specs/find-your-fit, amended): the site's one AI
 * touchpoint, quiet entry on the curated Work state. Deterministic
 * trigger matching is the core and the guaranteed fallback; the /api/fit
 * leg (when configured) re-ranks and phrases the reasons, and the UI
 * says so honestly. Results are the existing CaseCards, re-ranked. No
 * JS: the noscript link sends visitors to the explore filters. */
export default function FindYourFit() {
  const [open, setOpen] = useState(false);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<FitMatch | null>(null);
  const [aiReasons, setAiReasons] = useState<Record<string, string> | null>(null);
  const [ran, setRan] = useState(false);

  const run = async () => {
    if (!jd.trim()) return;
    const det = matchFit(jd);
    setResult(det);
    setRan(true);
    setAiReasons(null);
    try {
      const res = await fetch("/api/fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd }),
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
    <section aria-label="Find your fit" style={{ margin: "var(--spacing-6) 0 var(--spacing-8)" }}>
      {!open ? (
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-base)", color: "var(--color-ink-soft)" }}>
          Hiring?{" "}
          <button
            type="button"
            onClick={() => setOpen(true)}
            style={{
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              font: "inherit",
              fontWeight: 600,
              color: "var(--color-accent-ink)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Paste the role, I&apos;ll point you at the closest work.
          </button>
          <noscript>
            {" "}
            <a href="/work?explore=1">Browse the library with filters instead.</a>
          </noscript>
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
          <label
            htmlFor="fit-jd"
            style={{ fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-sm)", fontWeight: 600, color: "var(--color-ink)" }}
          >
            The role or job description
          </label>
          <textarea
            id="fit-jd"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                run();
              }
            }}
            rows={5}
            style={{
              width: "100%",
              maxWidth: "720px",
              background: "var(--color-card)",
              border: "1px solid var(--color-border-medium)",
              borderRadius: "var(--radius-xl)",
              padding: "var(--spacing-3) var(--spacing-4)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--typography-font-size-base)",
              lineHeight: 1.5,
              color: "var(--color-ink)",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-4)" }}>
            <Button onClick={run}>Find my fit</Button>
            {aiReasons && (
              <span className="section-label" style={{ margin: 0 }}>
                AI-enabled match
              </span>
            )}
          </div>

          {ran && result && result.cases.length === 0 && (
            <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-base)", color: "var(--color-muted)" }}>
              No strong match in the library for that text. The explore filters cover
              everything: <a href="/work?explore=1" style={{ color: "var(--color-accent-ink)", textDecoration: "underline", textUnderlineOffset: "3px" }}>browse the full library</a>.
            </p>
          )}

          {result && result.cases.length > 0 && (
            <>
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
            </>
          )}
        </div>
      )}
    </section>
  );
}
