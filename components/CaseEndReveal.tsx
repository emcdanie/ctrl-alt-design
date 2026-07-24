"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Heading from "@/components/ui/Heading";
import { WORK_ITEMS } from "@/lib/workLibrary";

/**
 * End-of-case reveal, v4 (Elleta 24 Jul; proto case-end-reveal-v4.html):
 * an OVERLAY, not an inline footer. When the reader reaches the end of the
 * case, a fixed modal reveals over the dimmed + blurred page: a soft dome
 * rises from the bottom carrying the sign-off, the next case, and a share.
 * Tap anywhere (or Esc) closes it, revealing the page beneath. It reveals
 * ONCE when the end enters view and, once dismissed, stays dismissed (no
 * re-nag on scroll). Rendered ONCE at the end of every case by CaseShellV2.
 *
 * Ours, not pink: warm-neutral scrim + a steel/peri dome (light), navy dome
 * (dark). The "Thanks for reading" sign-off renders in the SITE's Unique
 * display via Heading tier="case" (no script font, no new font); the heart
 * wears the clay accent. The next-case thumb is a CIRCLE with an iris ring
 * holding a simple per-case emblem in steel, never the busy screenshot and
 * never the live embed.
 *
 * A11y: role="dialog" aria-modal, labelled by the sign-off; focus moves in
 * on open and returns on close; Esc + tap close; focus is trapped while
 * open; body scroll is locked only while open (never blocks scrolling back
 * after dismiss). Reduced-motion: no rise/blur (static), still dismissible.
 */

/* case studies only (design-lab is a prototype), in library order */
const CASES = WORK_ITEMS.filter((i) => i.medium === "case study");

export default function CaseEndReveal({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const thanksId = useId();

  const i = CASES.findIndex((c) => c.href.endsWith(`/case-studies/${slug}`));
  const current = i >= 0 ? CASES[i] : undefined;
  const next = CASES[i >= 0 ? (i + 1) % CASES.length : 0];
  const emblem = next.title.trim().charAt(0).toUpperCase();

  const close = useCallback(() => {
    setOpen(false);
    setDismissed(true);
  }, []);

  /* reveal ONCE when the end enters view; never again once dismissed */
  useEffect(() => {
    if (dismissed) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOpen(true);
          io.disconnect();
        }
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [dismissed]);

  /* while open: remember focus, move it in, lock scroll, trap Tab + Esc.
     On close everything is restored, so scrolling back is never blocked. */
  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = dialogRef.current;
    dialog?.focus({ preventScroll: true });

    const focusables = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab") {
        const items = focusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || active === dialog)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      restoreFocusRef.current?.focus?.({ preventScroll: true });
    };
  }, [open, close]);

  /* lightweight per-case share: native share sheet where available, else a
     clipboard copy with a "Link copied" confirmation. Keeps the overlay open
     (does not bubble to the tap-to-close handler). */
  const onShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = window.location.href;
    const title = current ? `${current.title}, Elleta McDaniel` : document.title;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* dismissed or failed; do nothing */
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
    <>
      {/* in-flow trigger at the very end of the case */}
      <div ref={sentinelRef} className="cs2-endreveal-sentinel" aria-hidden="true" />

      {open && (
        <div
          className="cs2-endoverlay"
          onClick={close}
          role="presentation"
        >
          <div className="cs2-endoverlay__dome" aria-hidden="true" />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={thanksId}
            tabIndex={-1}
            className="cs2-endoverlay__inner"
            onClick={(e) => e.stopPropagation()}
          >
            <Heading tier="case" as="h2" id={thanksId} className="cs2-endoverlay__thanks">
              Thanks for reading{" "}
              <span className="cs2-endoverlay__heart" aria-hidden="true">
                {"♥"}
              </span>
            </Heading>

            <span className="cs2-endoverlay__rule" aria-hidden="true" />
            <p className="cs2-endoverlay__label">Next case</p>

            <Link
              href={next.href}
              className="cs2-endoverlay__next"
              aria-label={`Read ${next.title}`}
            >
              <span className="cs2-endoverlay__thumb" aria-hidden="true">
                {emblem}
              </span>
              <span className="cs2-endoverlay__meta">
                <span className="cs2-endoverlay__title">{next.title}</span>
                <span className="cs2-endoverlay__kicker">{next.kicker}</span>
              </span>
              <span className="cs2-endoverlay__arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>

            <button type="button" className="cs2-endoverlay__share" onClick={onShare}>
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
            <span className="cs2-endoverlay__copied" role="status" aria-live="polite">
              {copied ? "Link copied" : ""}
            </span>

            <button type="button" className="cs2-endoverlay__close" onClick={close}>
              Tap anywhere to close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
