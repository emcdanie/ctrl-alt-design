"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Heading from "@/components/ui/Heading";
import { Tag } from "@/components/ui/Tag";
import { findWorkItemBySlug } from "@/lib/workLibrary";

/**
 * Case shell v2 (case-shell-v2 brief, Elleta 22 Jul 2026; Carmen
 * audit ADOPT list + the Justine scan rules). The sticky side title
 * is gone: the case head is a normal in-flow stack (outcome-framed
 * title, one-sentence problem subhead, reading time, tag row, link
 * out where NDA allows), followed by the numbered section spine the
 * page composition provides as children. A thin token-coloured
 * reading-progress indicator renders on case pages only.
 *
 * Every case renders through this shell (the migration completed 23
 * Jul: brad-frost, drift, chip; the old CaseStudyShell is deleted).
 *
 * This file renders Heading and deliberately imports no Card surface
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
  subhead,
  readingMinutes,
  tags,
  linkOut,
  children,
}: {
  slug: string;
  eyebrow: string;
  /** outcome-framed case title (the thesis) */
  title: string;
  /** ONE sentence stating the problem */
  subhead: string;
  readingMinutes: number;
  tags: string[];
  /** link out to the shipped surface where NDA allows */
  linkOut?: { label: string; href: string };
  children: React.ReactNode;
}) {
  const caseItem = findWorkItemBySlug(slug);

  return (
    <div className="cs2">
      <ReadingProgress color={caseItem?.text} />

      {/* in-flow head: no sticky side title (brief item 5) */}
      <header className="cs2-head">
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
        <p className="cs-shell__eyebrow" style={caseItem ? { color: caseItem.text, margin: 0 } : { margin: 0 }}>
          {eyebrow}
        </p>
        <Heading tier="page" as="h1" style={caseItem ? { color: caseItem.text } : undefined}>
          {title}
        </Heading>
        <p className="cs2-subhead">{subhead}</p>
        <p className="cs2-meta">
          {readingMinutes} min read
        </p>
        {tags.length > 0 && (
          <div className="cs-shell__tags" style={{ margin: 0 }}>
            {tags.map((tag) => (
              <Tag
                key={tag}
                identity
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
        {linkOut && (
          <a href={linkOut.href} target="_blank" rel="noopener noreferrer" className="demo-link">
            <span style={{ fontSize: "var(--typography-font-size-sm)" }}>↗</span> {linkOut.label}
          </a>
        )}
      </header>

      {children}
    </div>
  );
}
