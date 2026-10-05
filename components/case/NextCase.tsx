"use client";

import { isValidElement, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { TextLink, textLinkClass } from "@/components/ui/TextLink";
import Heading from "@/components/ui/Heading";
import { ResumeLink } from "@/components/ResumeModal";
import styles from "./Case.module.css";
import { WORK_CASES } from "@/content/cases";
import { CaseCover } from "./pictures/Covers";

export type CoverImage = { src: string; width: number; height: number; alt: string };

export type CaseLink = {
  href: string;
  /** a live cover (components/case/pictures/Covers.tsx, drawn for this
      slot), or a 2x cover picture and its pixel size */
  cover: ReactNode | CoverImage;
  meta: string;
  title: string;
};

const isImage = (c: CaseLink["cover"]): c is CoverImage =>
  typeof c === "object" && c !== null && !isValidElement(c) && "src" in c;

/* A cover slot. Site v3: card covers always sit on the Stage grid, so
   the slot draws it behind the Cover. A live cover is drawn at the slot's
   design width (520 Next case, 490 More work) and scaled to the slot's
   real width through --cover-scale; an image cover just fills it. */
function CoverSlot({ cover, className, design }: { cover: CaseLink["cover"]; className: string; design: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const live = !isImage(cover);
  useEffect(() => {
    const el = ref.current;
    if (!el || !live || typeof ResizeObserver === "undefined") return;
    const fit = () => el.style.setProperty("--cover-scale", String(el.clientWidth / design));
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    fit();
    return () => ro.disconnect();
  }, [design, live]);
  return (
    <div className={className} ref={ref} data-live={live || undefined}>
      {isImage(cover) ? <img src={cover.src} width={cover.width} height={cover.height} alt={cover.alt} loading="lazy" decoding="async" /> : cover}
    </div>
  );
}

/* The case loop (Elleta, 5 Oct 2026, job 40): the four /work cases, each
   case's Next is the one after it, and More work the other two. Meta,
   title and lead come from content/cases.ts, so a card never goes stale. */
const LOOP = ["drift", "theming", "federated", "chip"];
const byId = (id: string) => WORK_CASES.find((c) => c.id === id)!;
const linkOf = (id: string, slot: "next" | "work"): CaseLink & { lead: string } => {
  const c = byId(id);
  return { href: c.href!, meta: c.meta, title: c.title, lead: c.claim, cover: <CaseCover id={id} slot={slot} /> };
};

/* The case end on the v3 template (Figma Next case tab 303:31929, Work card
   compact 299:22226): View CV, the Next case tab, then More work. It sends
   "case-end" to Umami once per page view when it comes into view (Elleta,
   1 Oct 2026), like every case ending. */
export default function NextCase({ slug }: { slug: string }) {
  const k = LOOP.findIndex((id) => byId(id).href?.endsWith(`/${slug}`));
  const nextId = LOOP[(k + 1) % LOOP.length];
  const next = linkOf(nextId, "next");
  const lead = next.lead;
  const more = LOOP.filter((id, n) => n !== k && id !== nextId).map((id) => linkOf(id, "work"));
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
            <CoverSlot cover={next.cover} className={styles.nextCover} design={520} />
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
                <CoverSlot cover={w.cover} className={styles.workCover} design={490} />
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
