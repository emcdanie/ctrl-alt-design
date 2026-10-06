import type { ReactNode } from "react";
import s from "./Chip.module.css";

/* CHIP 2.0 figures as live pictures (Site v3, Figma e7U5Hxpr441rT719SPclas,
   Case page / CHIP 1440 407:8187 and 390 407:10271). Atlas is a concept
   mock, so every Atlas panel wears the "concept mock" tag. The 390 frame
   restacks these pictures (panels in a column, the lesson states two up),
   so they are laid out with CSS rather than scaled; the one fixed drawing
   (the Button specimen) scales; the Atlas cover lives in the case hero. Colours read the
   semantic and component tokens, so the pictures follow the theme. Each
   picture names itself (role="img"); everything inside is decorative. */

export function Picture({ label, className = "", children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div role="img" aria-label={label} className={`${s.root} ${className}`.trim()}>
      <div aria-hidden="true" className={s.inner}>
        {children}
      </div>
    </div>
  );
}

export const Mock = () => <span className={s.mock}>concept mock</span>;

export function PanelHead({ children }: { children: ReactNode }) {
  return (
    <span className={s.head}>
      <span className={s.headTitle}>{children}</span>
      <Mock />
    </span>
  );
}

export const Pin = ({ n }: { n: number }) => <span className={s.pin}>{n}</span>;

/* the five Button parts, bottom layer first */
export const PARTS: { n: number; title: string; spec: string }[] = [
  { n: 1, title: "Key shadow", spec: "--shadow-key-resting" },
  { n: 2, title: "Fill", spec: "ink keycap · primary-fill" },
  { n: 3, title: "Box", spec: "44px min · pad 12/20 · r12" },
  { n: 4, title: "Label", spec: "Geist 13 · 700" },
  { n: 5, title: "Focus ring", spec: "3px ochre-deep · focus only" },
];

export function PartLabel({ n, title, spec, short = false }: { n: number; title: string; spec: string; short?: boolean }) {
  return (
    <span className={s.part} data-short={short || undefined}>
      <Pin n={n} />
      <span className={s.partText}>
        <span className={s.partTitle}>{title}</span>
        <code className={s.partSpec}>{spec}</code>
      </span>
    </span>
  );
}

/* ── The hero card · Atlas, the FilterChip specimen ─────────────────
   CHIP's own drawing of the Atlas cover (job 38), at its real size so no
   word renders under 16px at 1440 (14 through the 1024 collage scale):
   the shared cover draws at 9 to 11px and is scaled down further. The
   body wraps, so the same card is the 390 hero card (stage above parts). */
const ATLAS_PARTS = ["Box · 44px min", "Outline · 1px", "Hover wash", "Pressed fill", "Label", "Focus ring · 3px"];

export function ChipAtlas() {
  return (
    <div className={`${s.panel} ${s.atlas}`}>
      <span className={s.head}>
        <span className={s.atlasEyebrow}>Atlas · No. 003 · Actions</span>
        <Mock />
      </span>
      <span className={s.atlasHead}>
        <span className={s.atlasName}>FilterChip</span>
        <Status tone="success">Checks 6 of 6 pass</Status>
      </span>
      <span className={s.atlasBody}>
        <span className={s.atlasStage}>
          <span className={s.atlasChip}>Accessible</span>
          {[1, 3, 5, 2, 4, 6].map((n, i) => (
            <span key={n} className={s.atlasLeader} data-side={i < 3 ? "top" : "bottom"} data-col={i % 3}>
              <Pin n={n} />
            </span>
          ))}
        </span>
        <span className={s.atlasParts}>
          <span className={s.atlasEyebrow}>6 parts, bottom first</span>
          {ATLAS_PARTS.map((p, i) => (
            <span key={p} className={s.atlasPart} data-selected={i === 3 || undefined}>
              <Pin n={i + 1} />
              {p}
            </span>
          ))}
        </span>
      </span>
    </div>
  );
}

/* ── Figure 2 · The gate tells the truth ──────────────────────────── */
const CHECKS: [string, string, "success" | "neutral"][] = [
  ["pass", "Contrast · primary label 15.8:1", "success"],
  ["pass", "Contract parity", "success"],
  ["pass", "Story + docs present", "success"],
  ["pass", "Focus ring visible, both themes", "success"],
  ["44px", "Touch target minimum", "neutral"],
];

const CAUGHT: [string, string][] = [
  ["no story", "BrandWordmark has no story"],
  ["no story", "PatternField has no story"],
  ["6", "components missing a DSDS entry"],
];

function Status({ tone, children }: { tone: "success" | "neutral" | "danger"; children: ReactNode }) {
  return (
    <span className={s.status} data-tone={tone}>
      {children}
    </span>
  );
}

/** the gate's checks as Figure 2 lists them; `count` keeps the first few
 *  (the case showcase) */
export function GateChecks({ count = CHECKS.length }: { count?: number }) {
  return (
    <ul className={s.rows}>
      {CHECKS.slice(0, count).map(([pill, text, tone]) => (
        <li key={text} className={s.row}>
          <Status tone={tone}>{pill}</Status>
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

export function ChipGate({ label }: { label: string }) {
  return (
    <Picture label={label}>
      <div className={s.pair}>
        <div className={s.panel}>
          <PanelHead>Checks · from the gate</PanelHead>
          <GateChecks />
        </div>
        <div className={s.panel}>
          <PanelHead>What the gate caught</PanelHead>
          <ul className={s.rows}>
            {CAUGHT.map(([pill, text]) => (
              <li key={text} className={s.row}>
                <Status tone="danger">{pill}</Status>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <code className={s.source}>Source: BELLA&apos;s gate, 2 Oct 2026</code>
        </div>
      </div>
    </Picture>
  );
}

/* ── Figure 3 · Lesson: one job per state ─────────────────────────── */
const STATES: { state: "rest" | "hover" | "focus" | "press" | "disabled"; note: string }[] = [
  { state: "rest", note: "Rest: the ink keycap." },
  { state: "hover", note: "Hover rolls the label. Nothing lifts." },
  { state: "focus", note: "Focus is the only place ochre-deep appears." },
  { state: "press", note: "Press sinks the key 2px." },
  { state: "disabled", note: "Disabled drops the keycap. No shadow, no roll." },
];

export function Key({ state = "rest", className = "" }: { state?: "rest" | "hover" | "focus" | "press" | "disabled"; className?: string }) {
  return (
    <span className={`${s.key} ${className}`.trim()} data-state={state}>
      {state === "hover" ? (
        /* one label in a key-high window; the track rolls the next one in
           (motion only), reduced motion shows the one label still */
        <span className={s.roll}>
          <span className={s.rollTrack}>
            <span>Save changes</span>
            <span>Save changes</span>
          </span>
        </span>
      ) : (
        <span>Save changes</span>
      )}
    </span>
  );
}

export function ChipLesson({ label }: { label: string }) {
  return (
    <Picture label={label}>
      <div className={`${s.panel} ${s.lesson}`}>
        <PanelHead>Lesson · Button</PanelHead>
        <span className={s.lessonTitle}>One job per state</span>
        <span className={s.lessonLead}>Each state does one thing, so you can read it at a glance. Try them here.</span>
        <ul className={s.states}>
          {STATES.map((st) => (
            <li key={st.state} className={s.stateCell}>
              <Key state={st.state} />
              <code className={s.stateName}>{st.state}</code>
              <span className={s.stateNote}>{st.note}</span>
            </li>
          ))}
        </ul>
        <span className={s.why}>
          Why it matters: when hover, focus and press each look different, a keyboard user always knows where they are, and nobody mistakes a hover for a selection.
        </span>
      </div>
    </Picture>
  );
}

/* ── Figure 4 · Ask, then approve ─────────────────────────────────── */
export function ChipAsk({ label }: { label: string }) {
  return (
    <Picture label={label}>
      <div className={s.ask}>
        <div className={`${s.panel} ${s.obi}`}>
          <span className={s.field}>
            <span className={s.kbd}>⌘K</span>
            <span>
              Ask OBI or jump<span className={s.wide}> to a component</span>
            </span>
          </span>
          <span className={s.who}>You</span>
          <span className={s.question}>Why does Filter chip fail the touch target at 40?</span>
          <span className={s.who}>OBI</span>
          <span className={s.answer}>At 40px the hit area is under the 44px BELLA floor, so Touch target fails and the chip passes 5 of 6. At 44, all six pass.</span>
          <span className={s.who}>Sources</span>
          <span className={s.sources}>
            <span className={s.source2}>FilterChip story</span>
            <span className={s.source2}>Touch target check</span>
          </span>
        </div>
        <div className={s.askSide}>
          <pre className={s.terminal}>
            <code>
              <span>$ audit filter-chip</span>
              <span className={s.termRow}>
                <span>touch target</span>
                <span>40 → 44</span>
              </span>
              <span className={s.termRow}>
                <span>preview</span>
                <span>before → after</span>
              </span>
              <span className={s.termRow}>
                <span>expires</span>
                <span>10 min</span>
              </span>
            </code>
          </pre>
          <div className={`${s.panel} ${s.change}`}>
            <span className={s.changeLabel}>Proposed change</span>
            <span className={s.changeText}>FilterChip box size 40 → 44</span>
            <span className={s.actions}>
              <span className={s.confirm}>Confirm</span>
              <span className={s.cancel}>Cancel</span>
              <span className={s.waiting}>Waiting for Elleta</span>
            </span>
          </div>
        </div>
      </div>
    </Picture>
  );
}
