"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { TextLink, textLinkClass } from "@/components/ui/TextLink";
import Heading from "@/components/ui/Heading";
import { ResumeLink } from "@/components/ResumeModal";
import styles from "./Case.module.css";

export type CaseLink = {
  href: string;
  /** a 2x cover picture and its pixel size */
  cover: { src: string; width: number; height: number; alt: string };
  meta: string;
  title: string;
};

/* The case end on the v3 template (Figma Next case tab 303:31929, Work card
   compact 299:22226): View CV, the Next case tab, then More work. It sends
   "case-end" to Umami once per page view when it comes into view (Elleta,
   1 Oct 2026), like every case ending. */
export default function NextCase({
  slug,
  next,
  lead,
  more,
}: {
  slug: string;
  next: CaseLink;
  /** the next case's one-line lead */
  lead: string;
  more: CaseLink[];
}) {
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
            <span className={styles.nextCover}>
              <img src={next.cover.src} width={next.cover.width} height={next.cover.height} alt={next.cover.alt} loading="lazy" decoding="async" />
            </span>
            <span className={styles.nextText}>
              <span className={styles.cardMeta}>{next.meta}</span>
              <span className={styles.nextTitle}>{next.title}</span>
              <span className={styles.nextLead}>{lead}</span>
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
                <div className={styles.workCover}>
                  <img src={w.cover.src} width={w.cover.width} height={w.cover.height} alt={w.cover.alt} loading="lazy" decoding="async" />
                </div>
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
