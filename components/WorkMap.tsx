"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SKILLS } from "@/content/skills";
import { skillLabel, type WorkPiece } from "@/lib/workLibrary";
import styles from "./WorkLibrary.module.css";

/* The work map (approved mock, 19 Sep 2026): skills on the inner ring,
 * the pieces on the outer ring (case studies larger and iris,
 * experiments pink), "E" in the centre. No lines at rest: selecting a
 * dot draws only its connections and fills the floating detail card;
 * the key card sits top-left. Nodes are focusable role="button", Esc
 * clears, the bands and wires take pointer-events: none. Below 760px
 * the cards stack under the map and the outer labels hide.
 * TODO(learning merge): /learning has its own three-ring map
 * (LearningMap); fold both onto one ring-map component once the two
 * branches meet. */

const C = 450;
const R_SKILL = 190;
const R_PIECE = 380;

type Pos = { x: number; y: number; a: number };

/* rounded: server and client Math.sin differ in the last digits */
const round = (n: number) => Math.round(n * 100) / 100;

function ring<T>(items: readonly T[], r: number, key: (t: T) => string) {
  const out: Record<string, Pos> = {};
  items.forEach((t, i) => {
    /* the half-step keeps the top of each ring clear for its label */
    const a = -Math.PI / 2 + Math.PI / items.length + (i * 2 * Math.PI) / items.length;
    out[key(t)] = { x: round(C + r * Math.cos(a)), y: round(C + r * Math.sin(a)), a };
  });
  return out;
}

const short = (t: string, n: number) => (t.length > n ? `${t.slice(0, n - 1)}…` : t);

export default function WorkMap({
  pieces,
  visible,
  topicFilters,
  onWatch,
}: {
  /** every piece (the map always draws the whole set) */
  pieces: WorkPiece[];
  /** ids the filters keep; the rest dim */
  visible: Set<string>;
  /** active Topic filters (skills not in it dim) */
  topicFilters: string[];
  /** open a video piece */
  onWatch: (p: WorkPiece) => void;
}) {
  const [sel, setSel] = useState<string | null>(null);

  const pos = useMemo(
    () => ({ ...ring(SKILLS, R_SKILL, (s) => `S:${s}`), ...ring(pieces, R_PIECE, (p) => `P:${p.id}`) }),
    [pieces]
  );
  const edges = useMemo(() => pieces.flatMap((p) => p.topics.map((s) => [`P:${p.id}`, `S:${s}`] as const)), [pieces]);

  const on = useMemo(() => {
    const set = new Set<string>();
    if (!sel) return set;
    set.add(sel);
    edges.forEach(([a, b]) => {
      if (a === sel) set.add(b);
      if (b === sel) set.add(a);
    });
    return set;
  }, [sel, edges]);

  const clear = useCallback(() => setSel(null), []);
  const pick = (k: string) => setSel((cur) => (cur === k ? null : k));

  useEffect(() => {
    if (!sel) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && clear();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel, clear]);

  const nodeKeys = (k: string) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(k);
    }
  };

  const selPiece = sel?.startsWith("P:") ? pieces.find((p) => `P:${p.id}` === sel) : undefined;
  const selSkill = sel?.startsWith("S:") ? sel.slice(2) : undefined;

  return (
    <div className={`${styles.map} ${sel ? styles.mapFocus : ""}`}>
      <svg className={styles.mapSvg} viewBox="-160 -10 1220 920" role="group" aria-label="Map of the work and the skills behind it">
        <g className={styles.mapDecor} aria-hidden="true">
          <circle cx={C} cy={C} r={R_PIECE + 52} className={styles.bandPieces} />
          <circle cx={C} cy={C} r={R_SKILL + 50} className={styles.bandGround} />
          <circle cx={C} cy={C} r={R_SKILL + 50} className={styles.bandSkills} />
          <circle cx={C} cy={C} r={R_SKILL - 50} className={styles.bandGround} />
          <text x={C} y={C - R_PIECE - 30} textAnchor="middle" className={styles.ringLabel}>
            The work
          </text>
          <text x={C} y={C - R_SKILL - 28} textAnchor="middle" className={styles.ringLabel}>
            Skills
          </text>
          <text x={C} y={C + 5} textAnchor="middle" className={styles.mapCentre}>
            E
          </text>
          {edges.map(([a, b]) => {
            const A = pos[a];
            const B = pos[b];
            const qx = round(C + (A.x + B.x - 2 * C) * 0.4);
            const qy = round(C + (A.y + B.y - 2 * C) * 0.4);
            return (
              <path
                key={`${a}-${b}`}
                d={`M${A.x},${A.y} Q${qx},${qy} ${B.x},${B.y}`}
                className={`${styles.wire} ${sel && (a === sel || b === sel) ? styles.wireOn : ""}`}
              />
            );
          })}
        </g>

        {SKILLS.map((s) => {
          const k = `S:${s}`;
          const p = pos[k];
          const dim = topicFilters.length > 0 && !topicFilters.includes(s);
          return (
            <g
              key={k}
              role="button"
              tabIndex={0}
              aria-label={`Skill: ${skillLabel(s)}`}
              aria-pressed={sel === k}
              className={`${styles.node} ${styles.nodeSkill} ${on.has(k) ? styles.nodeOn : ""} ${dim ? styles.nodeDim : ""}`}
              onClick={() => pick(k)}
              onKeyDown={nodeKeys(k)}
            >
              <circle className={styles.halo} cx={p.x} cy={p.y} r={15} />
              <circle className={styles.dot} cx={p.x} cy={p.y} r={10} />
              <text x={p.x} y={p.y + 26} textAnchor="middle">
                {skillLabel(s)}
              </text>
            </g>
          );
        })}

        {pieces.map((w) => {
          const k = `P:${w.id}`;
          const p = pos[k];
          const isCase = w.type === "Case study";
          const dx = Math.cos(p.a);
          const dy = Math.sin(p.a);
          const vertical = Math.abs(dx) < 0.15;
          const anchor = vertical ? "middle" : dx > 0 ? "start" : "end";
          const lx = round(p.x + dx * 20);
          const ly = round(p.y + dy * 20 + (vertical ? (dy < 0 ? -6 : 14) : 4));
          return (
            <g
              key={k}
              role="button"
              tabIndex={0}
              aria-label={`${w.type}: ${w.title}`}
              aria-pressed={sel === k}
              className={`${styles.node} ${isCase ? styles.nodeCase : styles.nodeExp} ${on.has(k) ? styles.nodeOn : ""} ${
                visible.has(w.id) ? "" : styles.nodeDim
              }`}
              onClick={() => pick(k)}
              onKeyDown={nodeKeys(k)}
            >
              <circle className={styles.halo} cx={p.x} cy={p.y} r={isCase ? 17 : 13} />
              <circle className={styles.dot} cx={p.x} cy={p.y} r={isCase ? 12 : 8} />
              <text x={lx} y={ly} textAnchor={anchor} className={styles.pieceLabel}>
                {short(w.title, 26)}
              </text>
            </g>
          );
        })}
      </svg>

      <div className={styles.mapCards}>
        <div className={`${styles.mapCard} ${styles.mapKey}`}>
          <span className="text-code">Work map</span>
          <b className={styles.mapSum}>
            {pieces.length} pieces, {SKILLS.length} skills
          </b>
          <ul className={styles.keyList}>
            <li>
              <i className={styles.keyCase} aria-hidden="true" />
              Case study
            </li>
            <li>
              <i className={styles.keyExp} aria-hidden="true" />
              Experiment
            </li>
            <li>
              <i className={styles.keySkill} aria-hidden="true" />
              Skill
            </li>
          </ul>
        </div>

        <aside className={`${styles.mapCard} ${styles.mapDetail}`} aria-live="polite" hidden={!sel}>
          {sel && (
            <>
              <button type="button" className={styles.mapClose} onClick={clear} aria-label="Close">
                ×
              </button>
              {selSkill && (
                <>
                  <TypePill type="Skill" />
                  <h3 className={`heading-item ${styles.mapTitle}`}>{skillLabel(selSkill)}</h3>
                  <span className="text-code">
                    {pieces.filter((w) => w.topics.includes(selSkill as never)).length} pieces
                  </span>
                  <ul className={styles.mapList}>
                    {pieces
                      .filter((w) => w.topics.includes(selSkill as never))
                      .map((w) => (
                        <li key={w.id}>{w.title}</li>
                      ))}
                  </ul>
                </>
              )}
              {selPiece && (
                <>
                  <TypePill type={selPiece.type} />
                  <h3 className={`heading-item ${styles.mapTitle}`}>{selPiece.title}</h3>
                  <p className={styles.mapLine}>{selPiece.line}</p>
                  <ul className={styles.mapList}>
                    {selPiece.topics.map((t) => (
                      <li key={t}>{skillLabel(t)}</li>
                    ))}
                  </ul>
                  <p className={styles.mapGo}>
                    <PieceLink piece={selPiece} onWatch={onWatch} />
                  </p>
                </>
              )}
            </>
          )}
        </aside>
      </div>

      <p className={`text-code ${styles.mapHelp}`}>Click a dot to trace it · skills in the middle, the work around them</p>
    </div>
  );
}

/* the type pill: Case study and Prototype iris, Concept pink,
   Hackathon green (and the map's Skill pill green) */
export function TypePill({ type }: { type: WorkPiece["type"] | "Skill" }) {
  const tone =
    type === "Concept" ? styles.pillConcept : type === "Hackathon" || type === "Skill" ? styles.pillHack : "";
  return <span className={`${styles.pill} ${tone}`}>{type}</span>;
}

/* the action for a piece: read a case, try a demo, or watch a video */
export function pieceCta(p: WorkPiece): string {
  return p.embed ? "Watch it →" : p.type === "Case study" ? "Read it →" : "Try it →";
}

export function PieceLink({ piece, onWatch }: { piece: WorkPiece; onWatch: (p: WorkPiece) => void }) {
  if (piece.embed) {
    return (
      <button type="button" className={styles.goButton} onClick={() => onWatch(piece)}>
        {pieceCta(piece)}
        <span className="sr-only"> {piece.title}</span>
      </button>
    );
  }
  return (
    <Link href={piece.href!} className={styles.go}>
      {pieceCta(piece)}
      <span className="sr-only"> {piece.title}</span>
    </Link>
  );
}
