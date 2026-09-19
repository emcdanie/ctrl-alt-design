"use client";

import { useMemo, useState } from "react";
import { VOICES, VOICE_GROUPS, type Voice } from "@/content/voices";
import { WORK_ITEMS } from "@/lib/workLibrary";
import styles from "./Learning.module.css";

/* Who I follow (specs/learning): the people network from the approved
 * mock, as it is. Twelve voices on one circle, sorted into three colour
 * groups, wires between whose ideas build on whose. Selecting a name
 * lights its wires and opens the detail card; Esc or Recenter clears.
 * Below 700px the drawing gives way to a list of names that opens the
 * same card. */

const R = 280;
const C = 380;
const ORDER = [...VOICES].sort((a, b) => a.group - b.group);
const POS = Object.fromEntries(
  ORDER.map((v, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / ORDER.length;
    /* rounded: server and client Math.sin differ in the last digits */
    return [v.id, { x: Math.round((C + R * Math.cos(a)) * 100) / 100, y: Math.round((C + R * Math.sin(a)) * 100) / 100, a }];
  })
);
const EDGES: [string, string][] = (() => {
  const seen = new Set<string>();
  const out: [string, string][] = [];
  for (const v of ORDER)
    for (const c of v.connects) {
      const k = [v.id, c].sort().join("|");
      if (!seen.has(k) && POS[c]) {
        seen.add(k);
        out.push([v.id, c]);
      }
    }
  return out;
})();
const byId = (id: string) => VOICES.find((v) => v.id === id) as Voice;
const neighbours = (id: string) => EDGES.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : []));

export default function VoicesNetwork() {
  const [sel, setSel] = useState<string | null>(null);
  const on = useMemo(() => (sel ? new Set([sel, ...neighbours(sel)]) : null), [sel]);
  const pick = (id: string) => setSel((cur) => (cur === id ? null : id));

  return (
    <div
      className={`${styles.map} ${styles.voices} ${on ? styles.focus : ""}`}
      onKeyDown={(e) => {
        if (e.key === "Escape") setSel(null);
      }}
    >
      <div className={styles.mapStage}>
        <svg viewBox="-90 20 940 720" role="group" aria-label="Network of the voices I follow and how their ideas connect">
          <circle className={styles.voiceRing} cx={C} cy={C} r={R} aria-hidden="true" />
          <g className={styles.voiceWires} aria-hidden="true">
            {EDGES.map(([a, b]) => {
              const A = POS[a];
              const B = POS[b];
              const lit = sel != null && (a === sel || b === sel);
              return (
                <path
                  key={`${a}|${b}`}
                  className={lit ? styles.wireOn : undefined}
                  d={`M${A.x.toFixed(1)},${A.y.toFixed(1)} Q${C},${C} ${B.x.toFixed(1)},${B.y.toFixed(1)}`}
                />
              );
            })}
          </g>
          {ORDER.map((v) => {
            const p = POS[v.id];
            const dx = Math.cos(p.a);
            const dy = Math.sin(p.a);
            const anchor = dx > 0.25 ? "start" : dx < -0.25 ? "end" : "middle";
            return (
              <g
                key={v.id}
                className={[styles.node, styles.nodeV, styles[`g${v.group}`], on?.has(v.id) ? styles.on : "", sel === v.id ? styles.sel : ""].join(" ")}
                tabIndex={0}
                role="button"
                aria-label={v.name}
                aria-pressed={sel === v.id}
                onClick={() => pick(v.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    pick(v.id);
                  }
                }}
              >
                <circle className={styles.halo} cx={p.x} cy={p.y} r={16} />
                <circle className={styles.dot} cx={p.x} cy={p.y} r={10} />
                <text x={(p.x + dx * 24).toFixed(1)} y={(p.y + dy * 24 + 5).toFixed(1)} textAnchor={anchor}>
                  {v.name}
                </text>
              </g>
            );
          })}
        </svg>
        <p className={styles["help-meta"]} aria-hidden="true">
          Click a name · lines show whose ideas build on whose
        </p>
      </div>

      <ul className={styles.mapList} aria-label="The people I learn from">
        {ORDER.map((v) => (
          <li key={v.id}>
            <button type="button" className={styles.mapListBtn} aria-pressed={sel === v.id} onClick={() => pick(v.id)}>
              <i className={`${styles.keySwatch} ${styles[`sw${v.group}`]}`} aria-hidden="true" />
              {v.name}
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.mapSide}>
        <div className={`${styles.floatCard} ${styles.keyCard}`}>
          <p className={styles["card-eyebrow"]}>Voices</p>
          <p className={styles.keyTitle}>
            {VOICES.length} people, {Object.keys(VOICE_GROUPS).length} conversations
          </p>
          <ul className={styles.keyList}>
            {Object.entries(VOICE_GROUPS).map(([g, label]) => (
              <li key={g} className={styles["key-meta"]}>
                <i className={`${styles.keySwatch} ${styles[`sw${g}`]}`} aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
          <div className={styles.mapCtl}>
            <button type="button" className={styles.ctlBtn} onClick={() => setSel(null)}>
              Recenter
            </button>
          </div>
        </div>
        <div className={`${styles.floatCard} ${styles.detailCard} ${sel ? "" : styles.hidden}`} aria-live="polite">
          {sel && <VoiceDetail v={byId(sel)} onClose={() => setSel(null)} />}
        </div>
      </div>
    </div>
  );
}

function VoiceDetail({ v, onClose }: { v: Voice; onClose: () => void }) {
  const shaped = v.shaped.map((id) => WORK_ITEMS.find((w) => w.id === id)?.title).filter(Boolean);
  return (
    <>
      <button type="button" className={styles.closeBtn} aria-label="Close" onClick={onClose}>
        ×
      </button>
      <span className={`${styles.pill} ${styles[`pill${v.group}`]}`}>{v.source}</span>
      <h3 className={`heading-item ${styles.detailTitle}`}>{v.title}</h3>
      <p className={styles["detail-meta"]}>{v.name}</p>
      <blockquote className={styles.quote}>
        <p>“{v.quote}”</p>
      </blockquote>
      <p className={styles.detailTook}>{v.summary}</p>
      <p className={styles.detailSub}>Connects to</p>
      <ul className={styles.detailList}>
        {neighbours(v.id).map((id) => (
          <li key={id} className={styles.listPill}>
            {byId(id).name}
          </li>
        ))}
      </ul>
      <p className={styles.detailSub}>Shaped</p>
      <ul className={styles.detailList}>
        {shaped.length ? (
          shaped.map((t) => (
            <li key={t} className={styles.listPill}>
              {t}
            </li>
          ))
        ) : (
          <li className={styles.listPill}>My thinking (no project yet)</li>
        )}
      </ul>
      {v.url && (
        <p className={styles.detailLink}>
          <a href={v.url} target="_blank" rel="noopener noreferrer">
            Read the piece <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      )}
    </>
  );
}
