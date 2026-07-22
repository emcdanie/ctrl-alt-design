"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Beat 03 (PR 41 amendment 3, item 3): the animated system tree,
 * Elleta's CHIP map generalized. The atomic hierarchy draws in level
 * by level on scroll; then the point animates: a parity gap lights
 * one atom in the recorded drift colour and the drift PROPAGATES
 * upward along the edges to every consumer. Click (or focus + enter)
 * any node to see its consumers highlighted. CSS transitions only;
 * reduced motion renders the final propagated state instantly.
 *
 * DATA IS REAL: nodes are BELLA components and every edge is a
 * verified import in this repo (Icon -> SegmentedControl and
 * BubbleCluster; FilterChip -> WorkFilterBar; Tag and StatusPill ->
 * WorkLibrary; Card -> CaseCard; SegmentedControl, WorkFilterBar and
 * CaseCard -> WorkLibrary).
 */

/* design space 640 x 360; positions in that space */
const NODES = [
  { id: "icon", name: "Icon", level: 0, x: 80, y: 310 },
  { id: "tag", name: "Tag", level: 0, x: 235, y: 310 },
  { id: "pill", name: "StatusPill", level: 0, x: 390, y: 310 },
  { id: "chip", name: "FilterChip", level: 0, x: 545, y: 310 },
  { id: "seg", name: "SegmentedControl", level: 1, x: 140, y: 185 },
  { id: "card", name: "Card", level: 1, x: 340, y: 185 },
  { id: "filterbar", name: "WorkFilterBar", level: 1, x: 520, y: 185 },
  { id: "cluster", name: "BubbleCluster", level: 2, x: 110, y: 60 },
  { id: "casecard", name: "CaseCard", level: 2, x: 340, y: 60 },
  { id: "library", name: "WorkLibrary", level: 2, x: 530, y: 60 },
] as const;

const EDGES: readonly [string, string][] = [
  ["icon", "seg"],
  ["icon", "cluster"],
  ["tag", "library"],
  ["pill", "library"],
  ["chip", "filterbar"],
  ["card", "casecard"],
  ["seg", "library"],
  ["filterbar", "library"],
  ["casecard", "library"],
];

/* the demo drift source: Icon, whose gap reaches WorkLibrary two
   levels up through SegmentedControl */
const DRIFT_SOURCE = "icon";

function closureOf(start: string): Set<string> {
  const hit = new Set<string>([start]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const [a, b] of EDGES) {
      if (hit.has(a) && !hit.has(b)) {
        hit.add(b);
        grew = true;
      }
    }
  }
  return hit;
}

export default function SystemTree() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [drifting, setDrifting] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      setDrifting(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          /* the point animates after the levels have drawn */
          const t = setTimeout(() => setDrifting(true), 2200);
          io.disconnect();
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const driftSet = drifting && !selected ? closureOf(DRIFT_SOURCE) : null;
  const selSet = selected ? closureOf(selected) : null;
  const active = selSet ?? driftSet;

  const nodeDelay = (id: string, level: number) => {
    if (!active) return undefined;
    /* propagation climbs level by level */
    return { transitionDelay: `${level * 0.45}s` };
  };

  return (
    <div ref={ref} className={`tree${inView ? " in" : ""}`}>
      <div className="tree__space">
        <svg className="tree__edges" viewBox="0 0 640 360" preserveAspectRatio="none" aria-hidden="true">
          {EDGES.map(([a, b]) => {
            const na = NODES.find((n) => n.id === a)!;
            const nb = NODES.find((n) => n.id === b)!;
            const on = active ? active.has(a) && active.has(b) : false;
            return (
              <line
                key={`${a}-${b}`}
                x1={na.x}
                y1={na.y - 14}
                x2={nb.x}
                y2={nb.y + 14}
                className={`tree__edge tree__edge--lv${na.level}${on ? " on" : ""}`}
                style={on ? { transitionDelay: `${na.level * 0.45 + 0.2}s` } : undefined}
              />
            );
          })}
        </svg>
        {NODES.map((n) => {
          const lit = active?.has(n.id) ?? false;
          return (
            <button
              key={n.id}
              type="button"
              className={`tree__node tree__node--lv${n.level}${lit ? " drift" : ""}`}
              style={{
                left: `${(n.x / 640) * 100}%`,
                top: `${(n.y / 360) * 100}%`,
                ...(lit ? nodeDelay(n.id, n.level) : {}),
              }}
              aria-pressed={selected === n.id}
              onClick={() => setSelected(selected === n.id ? null : n.id)}
            >
              {n.name}
            </button>
          );
        })}
      </div>
      {/* the plain caption (polish pass): what this is and why it
          matters, unmistakable */}
      <p className="ds-section__note" style={{ margin: 0 }} aria-live="polite">
        {selected
          ? `${NODES.find((n) => n.id === selected)?.name}: every highlighted node consumes it, directly or through the chain.`
          : "Every node is a real component in this repo. Drift in one primitive propagates up to everything that imports it."}
      </p>
      <p className="tree__kicker">atoms · molecules · organisms · red = the drift path</p>
    </div>
  );
}
