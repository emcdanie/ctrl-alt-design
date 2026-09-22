"use client";

import { useEffect, useRef, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import { Tag } from "@/components/ui/Tag";
import CaseEndReveal from "@/components/CaseEndReveal";
import { findWorkItemBySlug } from "@/lib/workLibrary";

/**
 * Case shell v2 (case-shell-v2 brief, Elleta 22 Jul 2026: one idea
 * per viewport, scannable at a glance). The sticky side title
 * is gone: the case head is a normal in-flow stack (outcome-framed
 * title, one-sentence problem subhead, reading time, tag row, link
 * out where NDA allows), followed by the numbered section spine the
 * page composition provides as children. A thin token-coloured
 * reading-progress indicator renders on case pages only.
 *
 * Every case renders through this shell (the migration completed 23
 * Jul: brad-frost, drift, chip; the old CaseStudyShell is deleted).
 *
 * This file renders SectionHeader and deliberately imports no Card surface
 * (card-voice rule, enforced by audit:reuse); card sections live in
 * the page composition.
 */

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
      <div
        className="cs2-progress__bar"
        style={{ transform: `scaleX(${pct})`, background: color }}
      />
    </div>
  );
}

export default function CaseShellV2({
  slug,
  eyebrow,
  title,
  accent,
  after,
  subhead,
  readingMinutes,
  tags,
  facts,
  lead,
  nda,
  linkOut,
  crumbs = true,
  identity,
  endReveal = true,
  glance = false,
  heroExtra,
  className,
  children,
}: {
  slug: string;
  eyebrow: string;
  /** outcome-framed case title (the thesis) */
  title: string;
  /** the one iris word in the thesis (article mode); `title` is what
   *  comes before it and `after` what follows, so it can sit mid-line */
  accent?: string;
  after?: string;
  /** ONE sentence stating the problem */
  subhead: string;
  readingMinutes: number;
  tags: string[];
  /** ARTICLE MODE (Elleta, 20 Sep 2026, case-study rebuild): pass the
   *  facts row and the head becomes the article hero, a code-role
   *  kicker, the thesis, Role / Team / Timeline / Scope as a dl and one
   *  NDA line. No tags row, no reading time, no subhead: the sections
   *  carry the case now. A case migrates by supplying these two. */
  facts?: { label: string; value: string }[];
  /** article mode with a lead and no facts row (Search, Checkout: the
   *  mocks open on a paragraph, 21 Sep 2026) */
  lead?: string;
  nda?: string;
  /** link out to the shipped surface where NDA allows */
  linkOut?: { label: string; href: string };
  /** the back-to-Work breadcrumb. A case study is read FROM the library,
      so it earns a way back; the System page is a first-class nav item in
      its own right (section 1b) and is not reached through /work, so its
      crumb pointed at a place the reader did not come from. */
  crumbs?: boolean;
  /** identity colour pair for a page with no work-library row. The System
      page deliberately has none, because audit:parity requires slugs and
      WORK_ITEMS rows to be 1:1 and a BELLA row would fail it. Without a
      pair the head renders flat grey while every real case wears its
      colour, so the pair can be supplied directly instead. */
  identity?: { text: string; hi: string };
  /** the thanks-and-next-case close; the System page ends on its claim */
  endReveal?: boolean;
  /** the facts as the mock's at-a-glance strip: four ruled cells (Geist refresh) */
  glance?: boolean;
  /** hero content between the facts and the NDA note (the signal tags) */
  heroExtra?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  /* the registry row where there is one, the explicit pair where there is
     not; everything below reads ONE value either way */
  const caseItem = findWorkItemBySlug(slug) ?? (identity ? { ...identity, title: undefined } : undefined);
  /* the article hero: a facts row, or a lead in its place */
  const article = Boolean(facts || lead);

  return (
    <div className={["cs2", className].filter(Boolean).join(" ")}>
      <ReadingProgress color={caseItem?.text} />

      {/* the page opening, on the same frame as every other page
          (Elleta via Cowork, 21 Sep, O.6): Section, then the breadcrumb
          or the page label, the h1 at the title measure, and the lead
          column under it. The composition's sections follow, each one a
          Section-rhythm block in its own Container. */}
      <Section labelledBy="page-title">
        {/* two levels deep, so the breadcrumb REPLACES the page label
            (Part G): one nav > ol, with BreadcrumbList JSON-LD. Its
            topic and years sit in the facts row, where nothing is lost. */}
        {crumbs && caseItem?.title && (
          <Breadcrumb trail={[{ label: "Work", href: "/work" }, { label: caseItem.title }]} />
        )}
        <SectionHeader
          as="h1"
          id="page-title"
          kicker={crumbs && caseItem?.title ? undefined : eyebrow}
          heading={title}
          accent={article ? accent : undefined}
          after={article ? after : undefined}
          lead={article ? lead : subhead}
        >
          {/* one row of tags at most, under the lede */}
          {!article && tags.length > 0 && (
            <div className="cs-shell__tags">
              {tags.slice(0, 3).map((tag) => (
                /* identity tinting needs the case's colour pair. Without a
                   work-library row those custom properties are unset and
                   the tag falls back to ink on an untinted ground, which
                   failed AA in dark. The no-registry path (the System
                   page) gets the plain tag. Found 27 Jul, first consumer
                   of that path. */
                <Tag
                  key={tag}
                  identity={!!caseItem}
                  style={
                    caseItem
                      ? ({ "--case-tint-text": caseItem.text, "--case-tint-hi": caseItem.hi } as React.CSSProperties)
                      : undefined
                  }
                >
                  {tag}
                </Tag>
              ))}
            </div>
          )}
          {article ? null : <p className="text-meta">{readingMinutes} min read</p>}
          {linkOut && (
            <a href={linkOut.href} target="_blank" rel="noopener noreferrer" className="demo-link">
              <span aria-hidden="true">↗</span> {linkOut.label}
            </a>
          )}
        </SectionHeader>
        {/* the facts row spans the container, one row like the mocks; in
            the 42rem lead column it wrapped to two (audit, 21 Sep) */}
        {(facts || nda || heroExtra) && (
          <div className="case-hero__meta">
            {facts && (
              <dl className={glance ? "case-hero__facts case-hero__facts--glance" : "case-hero__facts"}>
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {heroExtra}
            {nda && (
              <p role="note" className="case-hero__nda">
                {nda}
              </p>
            )}
          </div>
        )}
      </Section>

      {children}

      {/* the end-of-case overlay reveal renders ONCE here for every case
          (triggers when the end enters view); no composition ships its own
          next-case section */}
      {endReveal ? <CaseEndReveal slug={slug} /> : null}
    </div>
  );
}
