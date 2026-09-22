"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * "← All work" (Elleta, 22 Sep 2026, W1 release): the ONE way back from a
 * case study or a study page to /work, at the top of the page and beside
 * "Next case" at the end. A real link to /work, never history.back():
 * a reader who arrived from a shared link has no history to go back to.
 *
 * Scroll memory: /work mounts WorkScrollMemory, which keeps the reader's
 * scrollY in sessionStorage and marks when they leave /work through a
 * link. The back link asks for a restore only when that mark exists, so
 * a reader who never saw /work lands at its top. Storage can throw
 * (private mode, blocked site data), so every access is guarded and the
 * link still works without it.
 */

const Y = "work:scrollY";
const FROM = "work:from";
const RESTORE = "work:restore";

function get(k: string): string | null {
  try {
    return sessionStorage.getItem(k);
  } catch {
    return null;
  }
}

function set(k: string, v: string) {
  try {
    sessionStorage.setItem(k, v);
  } catch {
    /* storage blocked: the link still goes to /work */
  }
}

function del(k: string) {
  try {
    sessionStorage.removeItem(k);
  } catch {
    /* storage blocked */
  }
}

export default function CaseBackLink({ className }: { className?: string }) {
  return (
    <Link
      href="/work"
      className={["case-back", className].filter(Boolean).join(" ")}
      onClick={() => {
        /* a push lands at the top; WorkScrollMemory restores after it */
        if (get(FROM) === "1" && get(Y) !== null) set(RESTORE, "1");
      }}
    >
      <span aria-hidden="true">←</span> All work
    </Link>
  );
}

/** Mounted on /work: remembers the scroll and restores it on return. */
export function WorkScrollMemory() {
  useEffect(() => {
    /* returning through CaseBackLink: put the reader back where they were */
    if (get(RESTORE) === "1") {
      del(RESTORE);
      const y = Number(get(Y) ?? 0);
      requestAnimationFrame(() => requestAnimationFrame(() => scrollTo(0, y)));
    }
    /* a fresh visit to /work clears the "came from /work" mark until the
       reader leaves again through a link */
    del(FROM);

    let raf = 0;
    /* once the reader has clicked away, the next page's scroll must not
       overwrite the position they left from */
    let leaving = false;
    const save = () => {
      if (!leaving && location.pathname === "/work") set(Y, String(Math.round(scrollY)));
    };
    const onScroll = () => {
      if (raf || leaving) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        save();
      });
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("/case-studies/") || href.startsWith("/work/studies/")) {
        save();
        leaving = true;
        set(FROM, "1");
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("pagehide", save);
    document.addEventListener("click", onClick, true);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("pagehide", save);
      document.removeEventListener("click", onClick, true);
    };
  }, []);
  return null;
}
