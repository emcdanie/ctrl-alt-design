"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { TextLink, textLinkClass } from "@/components/ui/TextLink";
import Heading from "@/components/ui/Heading";
import { ResumeLink } from "@/components/ResumeModal";
import styles from "./Case.module.css";
import { WORK_CASES } from "@/content/cases";
import { CaseCover } from "./pictures/Covers";

export type CaseLink = {
  href: string;
  /** the case's cover picture (components/case/pictures/Covers.tsx) */
  cover: ReactNode;
  meta: string;
  title: string;
};

/* A cover slot: the case's cover picture, as on Home and /work */
function CoverSlot({ cover, className }: { cover: ReactNode; className: string }) {
  return <div className={className}>{cover}</div>;
}

/* The case loop (Elleta, 5 Oct 2026, job 40): the four /work cases, each
   case's Next is the one after it, and More work the other two. Meta,
   title and lead come from content/cases.ts, so a card never goes stale. */
const LOOP = ["drift", "theming", "federated", "chip"];
const byId = (id: string) => WORK_CASES.find((c) => c.id === id)!;
const linkOf = (id: string): CaseLink & { lead: string } => {
  const c = byId(id);
  return { href: c.href!, meta: c.meta, title: c.title, lead: c.claim, cover: <CaseCover id={id} /> };
};

/* The case end on the v3 template (Figma Next case tab 303:31929, Work card
   compact 299:22226): View CV, the Next case tab, then More work. It sends
   "case-end" to Umami once per page view when it comes into view (Elleta,
   1 Oct 2026), like every case ending. */
export default function NextCase({ slug }: { slug: string }) {
  const k = LOOP.findIndex((id) => byId(id).href?.endsWith(`/${slug}`));
  const nextId = LOOP[(k + 1) % LOOP.length];
  const next = linkOf(nextId);
  const lead = next.lead;
  const more = LOOP.filter((id, n) => n !== k && id !== nextId).map((id) => linkOf(id));
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const end = ref.current;
    if (!end || typeof IntersectionObserver === "undefined") return;
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
    <>
      <div className={styles.end} ref={ref}>
        <ResumeLink className={`${textLinkClass} ${styles.back}`} label="View CV" />
        <div className={styles.end} role="group" aria-labelledby="next-case-label">
          <p id="next-case-label" className={styles.endLabel}>
            Next case
          </p>
          <Link className={styles.nextTab} href={next.href} data-umami-event="next-case">
            <CoverSlot cover={next.cover} className={styles.nextCover} />
            <span className={styles.nextText}>
              <span className={styles.cardMeta}>{next.meta}</span>
              <span className={styles.nextTitle}>{next.title}</span>
              {lead ? <span className={styles.nextLead}>{lead}</span> : null}
              <span className={styles.read}>
                Read the case <Icon name="ArrowRight" size="sm" />
              </span>
            </span>
          </Link>
        </div>
      </div>
      <section className={styles.end} aria-labelledby="more-work-h">
        <div className={styles.moreHead}>
          <Heading tier="section" id="more-work-h" className={styles.moreHeading}>
            More work
          </Heading>
          <TextLink href="/work">
            All work <span aria-hidden="true">→</span>
          </TextLink>
        </div>
        <ul className={styles.workCards}>
          {more.map((w) => (
            <li key={w.href}>
              <Link className={styles.workCard} href={w.href}>
                <CoverSlot cover={w.cover} className={styles.workCover} />
                <div className={styles.workText}>
                  <p className={styles.cardMeta}>{w.meta}</p>
                  <p className={styles.workTitle}>{w.title}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
