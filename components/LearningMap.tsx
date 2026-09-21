"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { COUNTS, LEARNING, countTopic, formatMonth, isCertificate, onMap, type LearningEntry } from "@/content/learning";
import { SKILLS, slugify, type Skill } from "@/content/skills";
import { WORK_ITEMS } from "@/lib/workLibrary";
import styles from "./Learning.module.css";

/* The learning map (specs/learning, Component map style): three filled
 * concentric bands, learned from (outer), skills (middle), projects
 * (inner), "E" in the centre. No lines at rest: selecting a dot draws
 * only its path and dims the rest. Key and detail cards float over the
 * map. Drag pans, Shift+scroll and +/- zoom, Recenter resets, Esc
 * clears. Nodes are focusable role="button"; the bands, rings and wires
 * take pointer-events: none. Below 700px a skill list replaces the
 * drawing and opens the same detail card. */

const C = 450;
const RING = { L: 370, S: 235, W: 105 };
const VIEWBOX_W = 1240;

type NodeKind = "L" | "S" | "W";
type Pos = { x: number; y: number; a: number };

const LEARNED = LEARNING.filter(onMap);
const PROJECTS = WORK_ITEMS.filter((w) => w.medium === "case study");

const round = (n: number) => Math.round(n * 100) / 100;

function place<T>(items: readonly T[], r: number, key: (t: T) => string, offset = 0) {
  const out: Record<string, Pos> = {};
  items.forEach((t, i) => {
    const a = -Math.PI / 2 + offset + (i * 2 * Math.PI) / items.length;
    /* rounded: server and client Math.sin differ in the last digits */
    out[key(t)] = { x: round(C + r * Math.cos(a)), y: round(C + r * Math.sin(a)), a };
  });
  return out;
}

const POS: Record<string, Pos> = {
  /* half-step offsets keep the top of each ring clear for its label */
  ...place(LEARNED, RING.L, (e) => `L:${e.id}`, Math.PI / LEARNED.length),
  ...place(SKILLS, RING.S, (s) => `S:${s}`, Math.PI / SKILLS.length),
  ...place(PROJECTS, RING.W, (w) => `W:${w.id}`, Math.PI / 3),
};

/* learned -> skill, skill -> project */
const EDGES: [string, string][] = [
  ...LEARNED.flatMap((e) => e.topics.map((s) => [`L:${e.id}`, `S:${s}`] as [string, string])),
  ...PROJECTS.flatMap((w) => w.skills.map((s) => [`S:${s}`, `W:${w.id}`] as [string, string])),
];

/* the path through a node: its skills and their projects (or back) */
function pathOf(k: string): Set<string> {
  const on = new Set([k]);
  const kind = k[0] as NodeKind;
  if (kind === "S") {
    EDGES.forEach(([a, b]) => {
      if (a === k) on.add(b);
      if (b === k) on.add(a);
    });
  } else if (kind === "L") {
    EDGES.forEach(([a, b]) => a === k && on.add(b));
    [...on].filter((x) => x[0] === "S").forEach((s) => EDGES.forEach(([a, b]) => a === s && b[0] === "W" && on.add(b)));
  } else {
    EDGES.forEach(([a, b]) => b === k && on.add(a));
    [...on].filter((x) => x[0] === "S").forEach((s) => EDGES.forEach(([a, b]) => b === s && a[0] === "L" && on.add(a)));
  }
  return on;
}

const short = (t: string, n: number) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);

export default function LearningMap({ visible, topicFilters }: { visible: Set<string>; topicFilters: string[] }) {
  const [sel, setSel] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const on = useMemo(() => (sel ? pathOf(sel) : null), [sel]);
  const clear = useCallback(() => setSel(null), []);
  const pick = (k: string) => setSel((cur) => (cur === k ? null : k));
  const recenter = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSel(null);
  };

  /* Shift+scroll zooms (a plain scroll still scrolls the page) */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.shiftKey) return;
      e.preventDefault();
      const d = e.deltaY || e.deltaX;
      setZoom((z) => Math.min(2, Math.max(0.7, z * (d > 0 ? 0.92 : 1.08))));
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, []);

  const topicSlugs = new Set(topicFilters);
  const skillFaded = (s: Skill) => topicSlugs.size > 0 && !topicSlugs.has(slugify(s));

  const node = (k: string, kind: NodeKind, r: number, label: string, text: string, extra = "") => {
    const p = POS[k];
    const out = kind === "L";
    const dx = Math.cos(p.a);
    const dy = Math.sin(p.a);
    const lx = out ? p.x + dx * (r + 10) : p.x;
    const ly = out ? p.y + dy * (r + 10) + 5 : p.y + r + 20;
    const anchor = out ? (Math.abs(dx) < 0.08 ? "middle" : dx >= 0 ? "start" : "end") : "middle";
    const cls = [styles.node, styles[`node${kind}`], extra, on?.has(k) ? styles.on : "", sel === k ? styles.sel : ""].join(" ");
    return (
      <g
        key={k}
        className={cls}
        tabIndex={0}
        role="button"
        aria-label={label}
        aria-pressed={sel === k}
        onClick={() => pick(k)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            pick(k);
          }
        }}
      >
        <circle className={styles.halo} cx={p.x} cy={p.y} r={r + 6} />
        <circle className={styles.dot} cx={p.x} cy={p.y} r={r} />
        <text x={lx.toFixed(1)} y={ly.toFixed(1)} textAnchor={anchor}>
          {text}
        </text>
      </g>
    );
  };

  return (
    <div
      className={`${styles.map} ${on ? styles.focus : ""}`}
      onKeyDown={(e) => {
        if (e.key === "Escape") clear();
      }}
    >
      <div className={styles.mapStage}>
        <svg
          ref={svgRef}
          viewBox={`-170 -10 ${VIEWBOX_W} 920`}
          role="group"
          aria-label="Learning map: outer ring learned from, middle ring skills, inner ring projects"
          className={dragging ? styles.grabbing : undefined}
          onPointerDown={(e) => {
            if ((e.target as Element).closest(`.${styles.node}`)) return;
            drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragging(true);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const k = VIEWBOX_W / e.currentTarget.getBoundingClientRect().width;
            setPan({ x: drag.current.px + (e.clientX - drag.current.x) * k, y: drag.current.py + (e.clientY - drag.current.y) * k });
          }}
          onPointerUp={() => {
            drag.current = null;
            setDragging(false);
          }}
        >
          <g
            className={dragging ? styles.zoomLayerNow : styles.zoomLayer}
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: `${C}px ${C}px` }}
          >
            <g className={styles.bands} aria-hidden="true">
              <circle className={styles.bandGround} cx={C} cy={C} r={RING.L + 48} />
              <circle className={styles.bandL} cx={C} cy={C} r={RING.L + 48} />
              <circle className={styles.bandGround} cx={C} cy={C} r={RING.S + 40} />
              <circle className={styles.bandS} cx={C} cy={C} r={RING.S + 40} />
              <circle className={styles.bandGround} cx={C} cy={C} r={RING.W + 40} />
              <circle className={styles.bandW} cx={C} cy={C} r={RING.W + 40} />
              <circle className={styles.bandGround} cx={C} cy={C} r={RING.W - 40} />
              <text className={styles.ringLabel} x={C} y={C - RING.L - 26} textAnchor="middle">
                Learned from
              </text>
              <text className={styles.ringLabel} x={C} y={C - RING.S - 20} textAnchor="middle">
                Skills
              </text>
              <text className={styles.ringLabel} x={C} y={C - RING.W - 20} textAnchor="middle">
                Used in
              </text>
              <circle className={styles.centre} cx={C} cy={C} r={28} />
              <text className={styles.centreText} x={C} y={C + 7} textAnchor="middle">
                E
              </text>
            </g>
            <g className={styles.wires} aria-hidden="true">
              {on &&
                EDGES.filter(([a, b]) => on.has(a) && on.has(b)).map(([a, b]) => {
                  const A = POS[a];
                  const B = POS[b];
                  const cx = C + (A.x + B.x - 2 * C) * 0.28;
                  const cy = C + (A.y + B.y - 2 * C) * 0.28;
                  return (
                    <path
                      key={`${a}>${b}`}
                      d={`M${A.x.toFixed(1)},${A.y.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${B.x.toFixed(1)},${B.y.toFixed(1)}`}
                    />
                  );
                })}
            </g>
            {LEARNED.map((e) =>
              node(
                `L:${e.id}`,
                "L",
                8,
                `${e.type}: ${e.title}`,
                short(e.title, 24),
                `${isCertificate(e) ? styles.cert : ""} ${visible.has(e.id) ? "" : styles.fade}`
              )
            )}
            {SKILLS.map((s) => node(`S:${s}`, "S", 11, `Skill: ${s}`, s, skillFaded(s) ? styles.fade : ""))}
            {PROJECTS.map((w) => node(`W:${w.id}`, "W", 14, `Project: ${w.title}`, short(w.title, 16)))}
          </g>
        </svg>
        <p className={styles["help-meta"]} aria-hidden="true">
          Shift+scroll to zoom · Drag to pan · Click a dot to trace it
        </p>
      </div>

      {/* below 700px: the skills as a list, opening the same card */}
      <ul className={styles.mapList} aria-label="Skills">
        {SKILLS.map((s) => (
          <li key={s}>
            <button type="button" className={styles.mapListBtn} aria-pressed={sel === `S:${s}`} onClick={() => {
                pick(`S:${s}`);
                requestAnimationFrame(() => detailRef.current?.scrollIntoView({ block: "nearest" }));
              }}>
              {s}
              <span className="text-code">{countTopic(s, LEARNED)}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* the detail card and the key sit beside the drawing (below it
          under 1024px), never over it: neither may cover a node */}
      <div className={styles.mapSide}>
        <div ref={detailRef} className={`${styles.floatCard} ${styles.detailCard} ${sel ? "" : styles.hidden}`} aria-live="polite">
          {sel && (
            <>
              <button type="button" className={styles.closeBtn} aria-label="Close" onClick={clear}>
                ×
              </button>
              <Detail k={sel} />
            </>
          )}
        </div>
        <div className={`${styles.floatCard} ${styles.keyCard}`}>
          <p className={styles["card-eyebrow"]}>Learning map</p>
          <p className={styles.keyTitle}>
            {COUNTS.onMap} sources, {SKILLS.length} skills, {PROJECTS.length} projects
          </p>
          <ul className={styles.keyList}>
            <li className={styles["key-meta"]}>
              <i className={`${styles.keySwatch} ${styles.swL}`} aria-hidden="true" />
              Learned from <span className={styles.codeNote}>{COUNTS.onMap}</span>
            </li>
            <li className={styles["key-meta"]}>
              <i className={`${styles.keySwatch} ${styles.swS}`} aria-hidden="true" />
              Skills <span className={styles.codeNote}>{SKILLS.length}</span>
            </li>
            <li className={styles["key-meta"]}>
              <i className={`${styles.keySwatch} ${styles.swW}`} aria-hidden="true" />
              Used in <span className={styles.codeNote}>{PROJECTS.length}</span>
            </li>
          </ul>
          <div className={styles.mapCtl}>
            <button type="button" className={styles.ctlBtn} onClick={recenter}>
              Recenter
            </button>
            <button type="button" className={styles.ctlBtn} aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(2, z + 0.2))}>
              +
            </button>
            <button type="button" className={styles.ctlBtn} aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(0.7, z - 0.2))}>
              −
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Pills only for links (Elleta, 20 Sep 2026): a pill says "press me",
   so a list of plain words wears none. `plain` is the list of names;
   the default is the list of links. */
function List({ items, plain = false }: { items: ReactNode[]; plain?: boolean }) {
  const cls = plain ? styles.listName : styles.listPill;
  return (
    <ul className={plain ? `${styles.detailList} ${styles.detailList_plain}` : styles.detailList}>
      {items.length ? items.map((t, i) => <li key={i} className={cls}>{t}</li>) : <li className={cls}>Not yet</li>}
    </ul>
  );
}

/* a source, linked to its entry in the timeline */
function EntryLink(e: LearningEntry) {
  return (
    <Link href={`/learning?view=timeline#entry-${e.id}`} className={styles.inlineLink}>
      {e.short ?? e.title}
    </Link>
  );
}

function Detail({ k }: { k: string }) {
  const kind = k[0] as NodeKind;
  const id = k.slice(2);
  if (kind === "L") {
    const e = LEARNED.find((x) => x.id === id) as LearningEntry;
    return (
      <>
        <span className={styles.pill}>{e.type}</span>
        <h3 className={`heading-item ${styles.detailTitle}`}>{e.title}</h3>
        <p className={styles["detail-meta"]}>
          {e.from} · <span className="text-code">{formatMonth(e.date)}</span>
        </p>
        {e.took && <p className={styles.detailTook}>{e.took}</p>}
        <p className={styles.detailSub}>Skills</p>
        <List items={e.topics} plain />
        <p className={styles.detailSub}>Used in</p>
        <List items={e.usedIn.map((u) => WorkLink(u))} />
      </>
    );
  }
  if (kind === "S") {
    const skill = id as Skill;
    const src = LEARNED.filter((e) => e.topics.includes(skill));
    const used = PROJECTS.filter((w) => w.skills.includes(skill));
    return (
      <>
        <span className={`${styles.pill} ${styles.pillS}`}>Skill</span>
        <h3 className={`heading-item ${styles.detailTitle}`}>{skill}</h3>
        <p className={styles["detail-meta"]}>
          {src.length} sources · {used.length} projects
        </p>
        <p className={styles.detailSub}>Learned from</p>
        <List items={src.slice(0, 8).map((e) => EntryLink(e))} plain />
        {src.length > 8 && (
          <p className={styles.detailMore}>
            <Link href={`/learning?view=timeline&topic=${slugify(skill)}#library`} className={styles.inlineLink}>
              {src.length - 8} more in the Timeline
            </Link>
          </p>
        )}
        <p className={styles.detailSub}>Used in</p>
        <List items={used.map((w) => WorkLink(w.id))} />
      </>
    );
  }
  const w = PROJECTS.find((x) => x.id === id)!;
  return (
    <>
      <span className={`${styles.pill} ${styles.pillW}`}>Case study</span>
      <h3 className={`heading-item ${styles.detailTitle}`}>{w.title}</h3>
      <p className={styles["detail-meta"]}>{w.skills.length} skills in play</p>
      <p className={styles.detailSub}>Skills</p>
      <List items={w.skills} plain />
      <p className={styles.detailLink}>
        <Link href={w.href}>
          Read the case study <span aria-hidden="true">→</span>
        </Link>
      </p>
    </>
  );
}

function WorkLink(id: string) {
  const w = WORK_ITEMS.find((x) => x.id === id);
  return w ? (
    <Link href={w.href} className={styles.inlineLink}>
      {w.title}
    </Link>
  ) : (
    id
  );
}
