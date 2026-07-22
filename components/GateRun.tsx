"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The gate-run prototype (PR 41 amendment 2, item 5): honest theatre
 * mirroring a real gate run, no invented checks. A commit lands, the
 * thirteen audits run in the REAL gate order (package.json), the
 * chain halts at the first failure exactly like the && chain does
 * (audit:tokens, a raw spacing value in the diff), the fix commits,
 * the re-run goes green, the merge line lands. Auto-plays once when
 * scrolled into view; the Run-it-again action replays (demo-register
 * primary; the page's ONE btn-key primary stays the contact keycap).
 * Reduced motion renders the full history instantly with the one red
 * line struck through. Lines are CSS transitions; JS only schedules
 * state.
 */

/* the real gate order, package.json "gate" */
const AUDITS = [
  "audit:structure",
  "audit:fonts",
  "audit:tokens",
  "audit:copy",
  "audit:reuse",
  "audit:nda",
  "audit:controls",
  "audit:parity",
  "audit:agents",
  "audit:contrast",
  "audit:axe",
  "audit:type",
  "audit:visual",
] as const;

type Line = { text: string; kind: "cmd" | "pass" | "fail" | "note" };

/* the full honest history: run 1 halts at the third audit exactly
   like the && chain; the fix commits; run 2 is green to the merge */
const SCRIPT: Line[] = [
  { text: '$ git commit -m "fix: hero spacing token"', kind: "cmd" },
  { text: "audit:structure PASS", kind: "pass" },
  { text: "audit:fonts PASS", kind: "pass" },
  { text: "TOKEN FAIL components/Hero.tsx: raw spacing 24px in the diff; tokens only", kind: "fail" },
  { text: "gate: red. The chain halts; nothing after tokens runs.", kind: "note" },
  { text: '$ git commit -m "fix: --spacing-6 instead of 24px"', kind: "cmd" },
  ...AUDITS.map((a): Line => ({ text: `${a} PASS`, kind: "pass" })),
  { text: "gate: green (13/13)", kind: "note" },
  { text: "$ gh pr merge, merged on green", kind: "cmd" },
];

export default function GateRun() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(0);
  const [played, setPlayed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const play = () => {
    clearTimers();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(SCRIPT.length);
      return;
    }
    setVisible(0);
    SCRIPT.forEach((_, i) => {
      timers.current.push(setTimeout(() => setVisible(i + 1), 300 * (i + 1)));
    });
  };

  /* auto-play once on scroll into view */
  useEffect(() => {
    const el = hostRef.current;
    if (!el || played) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlayed(true);
      setVisible(SCRIPT.length);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPlayed(true);
          play();
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [played]);

  const done = visible >= SCRIPT.length;

  return (
    <div ref={hostRef} className="pin demo-scope">
      <div className="spec-console" role="log" aria-label="A gate run, replayed">
        {SCRIPT.map((l, i) => (
          <span
            key={`${l.text}-${i}`}
            className={[
              "gr-line",
              i < visible ? "show" : "",
              l.kind === "fail" ? "gr-line--fail" : "",
              /* once the fix has landed, the historical red line reads
                 as resolved history */
              l.kind === "fail" && done ? "gr-line--struck" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {l.text}
          </span>
        ))}
      </div>
      <button type="button" className="demo-btn" onClick={play}>
        Run it again
      </button>
    </div>
  );
}
