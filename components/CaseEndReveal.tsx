"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Heading from "@/components/ui/Heading";
import { WORK_ITEMS } from "@/lib/workLibrary";

/**
 * End-of-case reveal (Elleta 24 Jul, in-flow pass): a normal section at the
 * very end of the case, NOT a modal. A soft dome sits behind the Unique
 * sign-off, the next case, and a share. Rendered once per case by
 * CaseShellV2.
 *
 * Deliberately in-flow: no position:fixed, no body scroll-lock, no dismissed
 * state, no focus trap, no "tap to close". Scrolling up naturally leaves it;
 * the back button re-shows it. An IntersectionObserver is used ONLY to
 * trigger the fade-up when the section enters view (prefers-reduced-motion
 * renders it static).
 *
 * Ours, not pink: a warm cream/steel dome (light), navy dome (dark). The
 * "Thanks for reading" sign-off renders in the SITE's Unique display via
 * Heading tier="case" (no script font, no new font); the heart wears the
 * clay accent. The next-case thumb is a circle with an iris ring holding a
 * simple per-case emblem in steel, never a screenshot, never the live embed.
 *
 * The next case is DYNAMIC: the case studies in workLibrary order, wrapping
 * at the end (chip -> code-first -> drift -> chip). The whole card is one
 * link (accessible name "Read <title>"); the share is Web Share with a
 * clipboard fallback ("Link copied"). It is a real landmark
 * (section aria-label="End of case"); links and buttons are keyboard-operable.
 */

/* case studies only (design-lab is a prototype), in library order */
const CASES = WORK_ITEMS.filter((i) => i.medium === "case study");

export default function CaseEndReveal({ slug }: { slug: string }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const i = CASES.findIndex((c) => c.href.endsWith(`/case-studies/${slug}`));
  const current = i >= 0 ? CASES[i] : undefined;
  const next = CASES[i >= 0 ? (i + 1) % CASES.length : 0];
  const emblem = next.title.trim().charAt(0).toUpperCase();

  /* IO ONLY toggles the fade-up when the section enters view; observe once.
     Reduced-motion renders it static (handled in the styles). */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* lightweight per-case share: native share sheet where available, else a
     clipboard copy with a "Link copied" confirmation. Never a dead click. */
  const onShare = async () => {
    const url = window.location.href;
    const title = current ? `${current.title}, Elleta McDaniel` : document.title;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* the user dismissed the share sheet, or it failed; do nothing */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked; leave the button usable */
    }
  };

  return (
    <section
      ref={ref}
      className={`cs2-endreveal${visible ? " is-visible" : ""}`}
      aria-label="End of case"
    >
      <div className="cs2-endreveal__dome" aria-hidden="true" />
      <div className="cs2-endreveal__inner">
        <Heading tier="case" as="h2" className="cs2-endreveal__thanks">
          Thanks for reading{" "}
          <span className="cs2-endreveal__heart" aria-hidden="true">
            {"♥"}
          </span>
        </Heading>

        <span className="cs2-endreveal__rule" aria-hidden="true" />
        <p className="cs2-endreveal__label">Next case</p>

        <Link href={next.href} className="cs2-endreveal__next" aria-label={`Read ${next.title}`}>
          <span className="cs2-endreveal__thumb" aria-hidden="true">
            {emblem}
          </span>
          <span className="cs2-endreveal__meta">
            <span className="cs2-endreveal__title">{next.title}</span>
            <span className="cs2-endreveal__kicker">{next.kicker}</span>
          </span>
          <span className="cs2-endreveal__arrow" aria-hidden="true">
            &rarr;
          </span>
        </Link>

        <button type="button" className="cs2-endreveal__share" onClick={onShare}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share this case
        </button>
        <span className="cs2-endreveal__copied" role="status" aria-live="polite">
          {copied ? "Link copied" : ""}
        </span>
      </div>
    </section>
  );
}
