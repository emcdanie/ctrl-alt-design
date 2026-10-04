import type { ReactNode } from "react";
import ScaledArt from "@/components/case/ScaledArt";
import { KitStatus } from "@/components/case/kit/Kit";
import s from "./AboutPictures.module.css";

/* About's two pictures (Site v3, Figma e7U5Hxpr441rT719SPclas, About 1440
   403:7256 and 390 403:7591; Elleta, 4 Oct 2026). */

/* ---------- Hero: the glass plates (Hero v4 style) ----------
   Two see-through plates on the glass tokens (CLAUDE.md section 1,
   "Glass"): the Pattern plate behind, its soft fill feathered to an
   ellipse, and the Photo plate in front, the portrait faded at the
   bottom and cut by the plate's edge. The photo is the picture's one
   image with words; the pattern is decoration. A figure, so its plates
   are read as picture, not page cards. */
export function HeroPlates() {
  return (
    <figure className={s.plates}>
      <div className={`${s.plate} ${s.patternPlate}`} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.patternFill} src="/images/about/pattern-soft.webp" alt="" width={900} height={860} decoding="async" fetchPriority="low" />
      </div>
      <div className={`${s.plate} ${s.photoPlate}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={s.portrait}
          src="/images/home/portrait.webp"
          alt="Elleta McDaniel with her dog Bella, who is licking her cheek"
          width={1080}
          height={908}
          fetchPriority="high"
        />
      </div>
    </figure>
  );
}

/* ---------- Figure 1: how this site gets built ----------
   Five steps, left to right at 1440 (drawn at 928 and scaled to fit),
   stacked top to bottom with down arrows where the stage is narrow (the
   390 frame). The two human steps wear the ochre "human" tag and the
   ochre-deep edge. One picture, so role="img" names it and everything
   inside is aria-hidden. */

type Step = { tag: "agent" | "gate" | "human"; title: string; sub: string; art: ReactNode };

const STEPS: Step[] = [
  {
    tag: "agent",
    title: "Cowork plans",
    sub: "writes next.md",
    art: (
      <div className={s.artefact}>
        <span className={s.file}>
          <i className={s.fileIcon} />
          <code>next.md</code>
        </span>
        <code className={s.quiet}># next.md</code>
        <code className={s.quiet}>1. option B</code>
        <code className={s.quiet}>→ report.md</code>
      </div>
    ),
  },
  {
    tag: "agent",
    title: "Claude Code builds",
    sub: "on a branch",
    art: (
      <div className={`${s.artefact} ${s.terminal}`}>
        <code>$ claude</code>
        <code>› go site</code>
        <code className={s.ok}>✓ 4 edits</code>
      </div>
    ),
  },
  {
    tag: "gate",
    title: "The gate checks",
    sub: "npm run gate · NDA scan",
    art: (
      <div className={s.artefact}>
        <code>npm run gate</code>
        <KitStatus className={s.pass}>23/23 green</KitStatus>
      </div>
    ),
  },
  {
    tag: "human",
    title: "I review",
    sub: "the screenshots, then approve",
    art: (
      <div className={s.artefact}>
        <span className={s.screens}>
          <i className={s.shotWide}>
            <b />
            <b />
            <b />
          </i>
          <i className={s.shotPhone}>
            <b />
            <b />
            <b />
          </i>
          <span className={s.approved}>✓</span>
        </span>
        <span className={s.note}>1440 · 390, before / after</span>
      </div>
    ),
  },
  {
    tag: "human",
    title: "I merge",
    sub: "only on green, only when I say",
    art: (
      <div className={s.keyArt}>
        <span className={s.key}>Merge</span>
        <span className={s.note}>only I press it</span>
      </div>
    ),
  },
];

function Flow({ phone = false }: { phone?: boolean }) {
  return (
    <div className={phone ? s.flowPhone : s.flow}>
      {STEPS.map((st, i) => (
        <div key={st.title} className={s.stepWrap}>
          {i > 0 ? <span className={s.arrow}>{phone ? "↓" : "→"}</span> : null}
          <div className={s.step} data-human={st.tag === "human" || undefined}>
            <span className={s.tag} data-tag={st.tag}>
              {st.tag}
            </span>
            {st.art}
            <span className={s.stepTitle}>{st.title}</span>
            <span className={s.stepSub}>{st.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BuildFlow() {
  return (
    <div
      className={s.flowRoot}
      role="img"
      aria-label="How this site gets built, in five steps. Cowork plans and writes next.md (agent). Claude Code builds on a branch (agent). The gate checks: npm run gate and the NDA scan, 23 of 23 green. I review the screenshots at 1440 and 390, before and after, then approve (human). I merge, only on green, only when I say (human)."
    >
      <div className={s.wide} aria-hidden="true">
        <ScaledArt width={928}>
          <Flow />
        </ScaledArt>
      </div>
      <div className={s.phone} aria-hidden="true">
        <Flow phone />
      </div>
    </div>
  );
}
