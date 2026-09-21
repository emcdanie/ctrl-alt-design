"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { StatusPill } from "@/components/ui/StatusPill";

/* The four examples of "From Drift to Foundation" (Elleta, 20 Sep 2026,
   case-study rebuild). They live in the page, not in an iframe, because
   a LinkedPhrase has to be able to point at a part of one: the parts
   carry data-t and the section lights them.

   All four are recreated and illustrative. No client data, no client
   names, no real screens. Each reads on its own with nothing lit. */

/* ── 01 · the drift ──────────────────────────────────────────────────
   Seventeen near-identical buttons. This is deliberately rule-breaking
   output (seventeen radii, four weights, three treatments), so it is a
   PICTURE, not live DOM: role="img" with a describing name, and the
   shapes inside it are spans, never buttons. Nothing here is operable
   and nothing inside it reaches the accessibility tree. */
const RADII = [0, 2, 4, 6, 8, 10, 12, 999, 3, 5, 7, 9, 14, 16, 20, 1, 11];
const WEIGHTS = [400, 500, 600, 700];
const LABELS = ["Book", "Book now", "Search", "Continue", "Book"];
const CORNERS = [0, 7, 12, 15];
const HEAVY = [1, 2, 11];

const RAW = "#2F5C86"; /* token-waiver: the raw value the foundation tier HOLDS, shown as the specimen. Text on the page, not a colour this file paints with. */

export function ButtonGrave() {
  return (
    <div
      className="drift-grave"
      data-frame-exempt="the drift picture: seventeen deliberately different radii are its content"
      role="img"
      aria-label="Seventeen near-identical buttons from one product, side by side: different corner radii, different weights, and some with no fill at all."
    >
      {RADII.map((r, i) => {
        const keys = [
          ...(CORNERS.includes(i) ? ["corners"] : []),
          ...(HEAVY.includes(i) ? ["weights"] : []),
          ...(i % 7 === 3 ? ["click"] : []),
        ];
        const variant = i % 7 === 3 ? " drift-gb--bare" : i % 6 === 5 ? " drift-gb--outline" : "";
        return (
          <span
            key={i}
            className={`drift-gb${variant}`}
            data-t={keys.length ? keys.join(" ") : undefined}
            style={{ borderRadius: `${r}px`, fontWeight: WEIGHTS[i % 4] }}
          >
            {LABELS[i % 5]}
          </span>
        );
      })}
    </div>
  );
}

/* ── 02 · the audit, and 05 · how it got built ─────────────────────
   One chain picture for both: labelled rows of chips, a linking word
   between them. Each row carries data-t so its phrase can light it. */
type ChainRow = { k: string; label: string; items: string[]; link?: string };

const AUDIT: ChainRow[] = [
  { k: "chip", label: "Filter chip", items: ["⌕ Direct", "Direct", "✓ Direct", "Direct ×"], link: "forces" },
  { k: "sort", label: "Sort control", items: ["Sort: price ▾", "↑↓ Price"], link: "breaks" },
  { k: "empty", label: "Empty state", items: ["No results", "Nothing found. Clear filters?"] },
];

/* recreated; people are roles, never names (NDA). Rows carry the keys
   of the phrases that point at them; Proposed and Shared are context. */
const ROLLOUT: ChainRow[] = [
  { k: "proposed", label: "Proposed", items: ["\u201cnot necessary\u201d"], link: "then" },
  { k: "built", label: "Built", items: ["for myself", "across 6 teams"], link: "then" },
  { k: "dev build", label: "Paired", items: ["1 designer + 1 developer", "Figma library → tokens"], link: "then" },
  { k: "cto", label: "Showed", items: ["the CTO", "→ a funded team"], link: "then" },
  { k: "shared", label: "Shared", items: ["every product team", "approved changes only"] },
];

function Chain({ rows }: { rows: ChainRow[] }) {
  return (
    <div className="drift-chain">
      {rows.map((row) => (
        <div key={row.k}>
          <div className="drift-chain__row" data-t={row.k}>
            <span className="text-code drift-chain__label">{row.label}</span>
            <span className="drift-chain__items">
              {row.items.map((t, i) => (
                <span key={i} className="drift-chain__chip">
                  {t}
                </span>
              ))}
            </span>
          </div>
          {row.link ? (
            <p className="text-code drift-chain__link">
              {row.link} <span aria-hidden="true">↓</span>
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export const AuditChain = () => <Chain rows={AUDIT} />;
export const RolloutChain = () => <Chain rows={ROLLOUT} />;

/* ── 03 · tokens under everything ─────────────────────────────────
   The cascade, on the shared SegmentedControl. "Break the link" leaves
   the component holding a colour the code no longer explains; the
   status says so in words, through role="status", never colour alone. */
export function TokenCascade() {
  const [linked, setLinked] = useState(true);
  return (
    <div className="drift-cascade">
      <div className="drift-cascade__controls">
        <SegmentedControl
          label="Token link"
          sentence
          value={linked ? "linked" : "broken"}
          onChange={(v) => setLinked(v === "linked")}
          options={[
            { value: "linked", label: "Linked" },
            { value: "broken", label: "Break the link" },
          ]}
        />
        <StatusPill tone={linked ? "ok" : "warn"} live>
          <span aria-hidden="true">{linked ? "✓" : "!"}</span>
          {linked ? "Design and code in parity" : "Drift: the button keeps a colour no token explains"}
        </StatusPill>
      </div>

      <div className={`case-pipe${linked ? "" : " case-pipe--drifted"}`}>
        <div className="case-tier" data-t="found">
          <span className="case-tier__t">Foundation</span>
          <span className="text-code case-tier__tok">
            <span className="case-sw" aria-hidden="true" /> --brand-600
          </span>
          <span className="text-code">{RAW}</span>
        </div>
        <span className="text-code case-pipe__to" aria-hidden="true">
          →
        </span>
        <div className="case-tier" data-t="sem">
          <span className="case-tier__t">Semantic</span>
          <span className="text-code case-tier__tok">
            <span className="case-sw" aria-hidden="true" /> --action
          </span>
          <span className="text-code">→ brand-600</span>
        </div>
        <span className="text-code case-pipe__to" aria-hidden="true">
          →
        </span>
        <div className="case-tier case-tier--comp" data-t="comp">
          <span className="case-tier__t">Component</span>
          <span className="drift-book" role="img" aria-label="A Book now button" />
          {!linked && <span className="drift-diff">Hard-coded, no token</span>}
        </div>
      </div>
    </div>
  );
}
