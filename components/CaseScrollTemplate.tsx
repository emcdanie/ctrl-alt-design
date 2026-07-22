"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Heading from "@/components/ui/Heading";
import SectionHeader from "@/components/ui/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import DesignSystemNav, { type RailSection } from "@/components/DesignSystemNav";
import { findWorkItemBySlug } from "@/lib/workLibrary";

/**
 * THE case scroll-spine template (Elleta's decision record 22 Jul;
 * spec specs/case-scroll-template; contracts
 * _proto/case-template.html + case-layout.html + the scroll-spine
 * reference). One repeating beat module on ONE spacing rhythm
 * (--rhythm-* aliases of --spacing-*, align-items start), a sticky
 * spine rail on the reused DesignSystemNav scroll-spy (case skin:
 * dashed connector, filled active dot, hash-synced), the canonical
 * step set as the default rail, her narrative headline inside each
 * section. Schema-driven and reusable; Code First is the first
 * consumer. SUPERSEDES the five-beat layout for this case (named,
 * recorded in DESIGN.md).
 *
 * This file renders the Heading primitive and deliberately imports
 * no Card surface (card-voice rule); figure frames and outcome cards
 * live in CaseTemplateBlocks.
 */

export const CANONICAL_STEPS = [
  "Context",
  "Problem",
  "Key decisions",
  "Challenges",
  "Impact",
  "Outcome & learnings",
] as const;

export interface CaseSection {
  /** rail label; the canonical set is the default vocabulary */
  step: string;
  id: string;
  /** mono kicker above the headline (her voice) */
  kicker: string;
  /** her narrative headline; omit for setup sections (the header
      already holds the thesis) */
  heading?: string;
  body: React.ReactNode;
}

function ReadingProgress({ color }: { color?: string }) {
  const [pct, setPct] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      if (raf.current) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = 0;
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        setPct(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);
  return (
    <div className="cs2-progress" aria-hidden="true">
      <div className="cs2-progress__bar" style={{ transform: `scaleX(${pct})`, background: color }} />
    </div>
  );
}

export default function CaseScrollTemplate({
  slug,
  eyebrow,
  title,
  sub,
  readingMinutes,
  tags,
  sessionLink,
  sections,
  children,
}: {
  slug: string;
  eyebrow: string;
  /** the thesis, display tier */
  title: string;
  /** one-sentence subhead */
  sub: string;
  readingMinutes: number;
  tags: string[];
  /** the ONE recorded-session link (header meta only, by law) */
  sessionLink?: { label: string; href: string };
  sections: CaseSection[];
  /** the end sequence after the beats (next case, thanks) */
  children?: React.ReactNode;
}) {
  const caseItem = findWorkItemBySlug(slug);
  const rail: RailSection[] = sections.map((s) => ({ id: s.id, label: s.step, desc: "" }));

  return (
    <div className="cst">
      <ReadingProgress color={caseItem?.text} />

      <nav aria-label="Breadcrumb" className="cs-shell__crumbs">
        <Link href="/work" className="cs-shell__backlink">
          <span aria-hidden="true">←</span> Work
        </Link>
        {caseItem?.title && (
          <>
            <span aria-hidden="true" className="cs-shell__crumb-sep">/</span>
            <span className="cs-shell__crumb" aria-current="page">{caseItem.title}</span>
          </>
        )}
      </nav>

      {/* the case header (proto): thesis + sub + ONE meta row */}
      <header className="cst-head">
        <p className="cs-shell__eyebrow" style={caseItem ? { color: caseItem.text, margin: 0 } : { margin: 0 }}>
          {eyebrow}
        </p>
        <Heading tier="case" as="h1" style={caseItem ? { color: caseItem.text } : undefined}>
          {title}
        </Heading>
        <p className="cst-sub">{sub}</p>
        <div className="cst-meta">
          <span className="cst-meta__item">{readingMinutes} min read</span>
          <span className="cst-meta__dot" aria-hidden="true" />
          <span className="cs-shell__tags" style={{ margin: 0 }}>
            {tags.map((t) => (
              <Tag
                key={t}
                identity
                style={
                  caseItem
                    ? ({ "--case-tint-text": caseItem.text, "--case-tint-hi": caseItem.hi } as React.CSSProperties)
                    : undefined
                }
              >
                {t}
              </Tag>
            ))}
          </span>
          {sessionLink && (
            <>
              <span className="cst-meta__dot" aria-hidden="true" />
              <a href={sessionLink.href} target="_blank" rel="noopener noreferrer" className="demo-link">
                <span style={{ fontSize: "var(--typography-font-size-sm)" }}>↗</span> {sessionLink.label}
              </a>
            </>
          )}
        </div>
      </header>

      {/* the spine: rail + beats */}
      <div className="cst-layout">
        <DesignSystemNav sections={rail} ariaLabel="Case sections" variant="case" />
        <div className="cst-content">
          {sections.map((s, i) => (
            <section key={s.id} className="cst-beat" aria-label={s.step}>
              <div className="cst-bhead">
                <span className="cst-bnum" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div className="cst-bhead__text">
                  <p className="eyebrow" style={{ margin: 0 }}>{s.kicker}</p>
                  {s.heading ? (
                    <SectionHeader id={s.id} title={s.heading} className="cst-bhead__title" />
                  ) : (
                    /* setup sections: the anchor still needs the id */
                    <span id={s.id} className="cst-anchor" aria-hidden="true" />
                  )}
                </div>
              </div>
              <div className="cst-bbody-slot">{s.body}</div>
            </section>
          ))}
          {children}
        </div>
      </div>
    </div>
  );
}

/** the standard beat body: text beside its visual, START-aligned (the
    floating-title fix); flip alternates the Z-pattern */
export function BeatBody({
  flip = false,
  txt,
  fig,
}: {
  flip?: boolean;
  txt: React.ReactNode;
  fig?: React.ReactNode;
}) {
  if (!fig) return <div className="cst-bbody cst-bbody--txtonly">{txt}</div>;
  return (
    <div className={`cst-bbody${flip ? " cst-bbody--flip" : ""}`}>
      <div className="cst-txt">{txt}</div>
      <div className="cst-fig-col">{fig}</div>
    </div>
  );
}
