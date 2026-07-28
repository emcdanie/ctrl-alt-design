"use client";

import { useId, useState } from "react";

/**
 * The gate, explorable (28 Jul 2026, readability audit P2).
 *
 * The sixteen audits have now been a definition list, a three-column
 * definition grid and a two-column table, and every version was the same
 * shape: a wall you read top to bottom when the only question anyone
 * actually asks is "what does THIS one refuse". So it is a grid of
 * sixteen chips, and selecting one reveals a panel about it.
 *
 * PROGRESSIVE DISCLOSURE, not a card flip. The panel is one inline
 * region below the grid, rendered as real text in the document: it can
 * be read by a screen reader, found by browser search, and copied. Flip
 * cards hide half their content behind a transform and put the answer on
 * a face that search cannot reach.
 *
 * The pattern is a tablist, because that is exactly what this is: one
 * selection out of a set, one panel showing the selection. That buys the
 * arrow-key behaviour every screen-reader user already expects, rather
 * than sixteen buttons with hand-rolled key handling.
 *
 * NOTHING IN THE PANEL IS INVENTED. The refusal line is hers, from the
 * same GATE array the page has always used, and audit:debt asserts that
 * array against the audits the gate really runs, in both directions. The
 * file path and the command are derived at build from the package.json
 * entry that runs the check. There is no hand-written "assertion" field,
 * because a sixteen-entry list of restated assertions is sixteen things
 * to go stale, and the refusal line already IS the assertion.
 */

export type GateAudit = { name: string; line: string };

export default function GateExplorer({
  audits,
  files,
}: {
  audits: readonly GateAudit[];
  /** audit name to the script(s) that run it, derived from package.json */
  files: Record<string, string[]>;
}) {
  const [active, setActive] = useState(0);
  const base = useId();
  const tabId = (i: number) => `${base}-tab-${i}`;
  const panelId = `${base}-panel`;
  const current = audits[active];
  const currentFiles = files[current.name] ?? [];

  /* roving focus: the tablist is ONE tab stop, arrows move within it */
  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = audits.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    document.getElementById(tabId(next))?.focus();
  };

  return (
    <div className="gx">
      <div
        className="gx-grid"
        role="tablist"
        aria-label="The audits in the gate"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
      >
        {audits.map((a, i) => (
          <button
            key={a.name}
            id={tabId(i)}
            type="button"
            role="tab"
            className={`gx-chip${i === active ? " is-active" : ""}`}
            aria-selected={i === active}
            aria-controls={panelId}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {a.name}
          </button>
        ))}
      </div>

      <div className="gx-panel" id={panelId} role="tabpanel" aria-labelledby={tabId(active)} tabIndex={0}>
        <p className="gx-panel__name">{current.name}</p>
        <p className="gx-panel__line">{current.line}</p>
        <dl className="gx-panel__meta">
          <div className="gx-panel__row">
            <dt>Where it lives</dt>
            <dd>
              {currentFiles.length > 0
                ? currentFiles.join(", ")
                : "the CI workflow, .github/workflows/gate.yml"}
            </dd>
          </div>
          <div className="gx-panel__row">
            <dt>How to run it</dt>
            <dd>
              {currentFiles.length > 0 ? `npm run ${current.name}` : "npm run gate"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
