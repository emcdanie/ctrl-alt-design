"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ResumeLink } from "@/components/ResumeModal";
import { CASES } from "@/content/cases";

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string>) => void };
  }
}

const slugOf = (href?: string) => href?.split("/").pop() ?? "";

/* The one case ending (Elleta, 1 Oct 2026; replaces CaseEndReveal): Let's
 * talk, View CV, and the next case in /work order, wrapping to the first.
 * Nothing else goes in it. It also sends "case-end" to Umami once per page
 * view, when this block comes into view, on every case (Elleta, 1 Oct
 * 2026); no Umami, no call. */
export default function CaseEnd({ slug }: { slug: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const i = CASES.findIndex((c) => slugOf(c.href) === slug);
  const next = CASES[(i + 1) % CASES.length];

  useEffect(() => {
    const end = ref.current;
    if (!end) return;
    let sent = false;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || sent) return;
      sent = true;
      io.disconnect();
      window.umami?.track("case-end", { case: slug });
    });
    io.observe(end);
    return () => io.disconnect();
  }, [slug]);

  return (
    /* not ruled: a ruled section on the mock cases must open on an
       eyebrow and an h2 (audit:visual), and this block holds neither */
    <Section>
      <div className="case-end" ref={ref}>
        <Button href="/contact" variant="primary" trackEvent="lets-talk">
          Let&rsquo;s talk
        </Button>
        <ResumeLink className="text-action" label="View CV" />
        <Link
          href={next.href ?? "/work"}
          className="text-action"
          data-umami-event="next-case"
          data-umami-event-case={slugOf(next.href)}
        >
          {/* one inline run: in the flex link a bare space drops and the
              arrow would wrap as its own item, away from the title */}
          <span>
            Next case: {next.title}
            <span aria-hidden="true">{"\u00a0\u2192"}</span>
          </span>
        </Link>
      </div>
    </Section>
  );
}
