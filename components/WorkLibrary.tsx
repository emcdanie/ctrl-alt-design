"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { FilterChip } from "@/components/ui/FilterChip";
import { Tag } from "@/components/ui/Tag";
import { STUDIES, STUDY_KINDS, studyHref, type Study, type StudyKind } from "@/content/studies";
import { SKILLS, SKILL_EVIDENCE, WORK_ITEMS, slugify, type WorkCase, type WorkItem } from "@/lib/workLibrary";
import styles from "./WorkLibrary.module.css";

/* /work (Elleta, 19 Sep 2026): the three case cards, and the pattern
 * studies list: one row of type chips over one row per study (the
 * problem first, then the project, then a framed crop). The skills
 * matrix below serves /skills and /quick. */

/** A case study card on the ONE Card system: flat until hover. */
export function CaseStudyCard({ item }: { item: WorkCase }) {
  return (
    <Card
      href={item.href}
      className={`h-full ${styles.caseCard}`}
      media={
        <span className={styles.cover}>
          {item.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.cover} alt="" loading="lazy" />
          ) : null}
        </span>
      }
    >
      <span className={styles.kicker}>
        <span className={styles.pill}>Case study</span>
        <span className={`text-code ${styles.kickerDate}`}>{item.years}</span>
      </span>
      <span className={`heading-item ${styles.cardTitle}`}>{item.title}</span>
      <span className={`card-body ${styles.cardLine}`}>{item.line}</span>
      <span className={styles.tags}>
        {item.tags.slice(0, 2).map((t) => (
          <Tag key={t} outline>
            {t}
          </Tag>
        ))}
      </span>
      <span className={styles.cardGo}>Read it →</span>
    </Card>
  );
}

/** The pattern studies: one chip row (All and the three kinds, with
 *  counts), then one row per study. The server renders every row. */
export function StudiesList() {
  const [kind, setKind] = useState<StudyKind | null>(null);
  const shown = kind ? STUDIES.filter((s) => s.kind === kind) : STUDIES;
  return (
    <div className={styles.studies}>
      <div className={styles.studyChips} role="group" aria-label="Filter the studies by type">
        <FilterChip className={styles.chip} pressed={kind === null} onClick={() => setKind(null)}>
          All <span className={`text-code ${styles.chipMeta}`}>{STUDIES.length}</span>
        </FilterChip>
        {STUDY_KINDS.map((k) => (
          <FilterChip key={k} className={styles.chip} pressed={kind === k} onClick={() => setKind(kind === k ? null : k)}>
            {k} <span className={`text-code ${styles.chipMeta}`}>{STUDIES.filter((s) => s.kind === k).length}</span>
          </FilterChip>
        ))}
      </div>
      <ul className={styles.studyList}>
        {shown.map((s) => (
          <li key={s.id}>
            <StudyRow study={s} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function StudyRow({ study: s }: { study: Study }) {
  const body = (
    <>
      <span className={styles.studyText}>
        <span className={`text-code ${styles.studyMeta}`}>
          {s.year} / {s.kind}
        </span>
        <h3 className={`heading-item ${styles.studyTitle}`}>
          {s.title}{" "}
          <span className={styles.studyArrow} aria-hidden="true">
            →
          </span>
        </h3>
        <span className={styles.studyLine}>
          <span className={styles.studyProject}>{s.project}.</span> {s.line}
        </span>
      </span>
      <span className={styles.tile}>
        <Image
          className={styles.tileImg}
          src={s.thumb.src}
          width={s.thumb.width}
          height={s.thumb.height}
          sizes="(min-width: 600px) 13rem, 5.5rem"
          loading="lazy"
          alt=""
          unoptimized={s.thumb.src.endsWith(".svg")}
        />
      </span>
    </>
  );
  /* brief pages route in the app; demos are static files */
  return s.page ? (
    <Link href={studyHref(s)} className={styles.studyRow}>
      {body}
    </Link>
  ) : (
    <a href={studyHref(s)} className={styles.studyRow}>
      {body}
    </a>
  );
}

/* ── Skills x projects matrix (§8): a real table driven from the same
 * skills arrays as everything else. Marked cell = case tint + dot +
 * sr-only text (never colour-only). Row/column headers are buttons that
 * toggle the SAME URL filters as the chips; active filters emphasise
 * matching cells and dim the rest. ── */

export function MatrixView({
  caseFilters,
  skillFilters,
  toggleCase,
  toggleSkill,
}: {
  caseFilters: string[];
  skillFilters: string[];
  toggleCase: (id: string) => void;
  toggleSkill: (slug: string) => void;
}) {
  const hasFilters = caseFilters.length > 0 || skillFilters.length > 0;
  const emphasised = (item: WorkItem, skillSlug: string) =>
    !hasFilters ||
    ((caseFilters.length === 0 || caseFilters.includes(item.id)) &&
      (skillFilters.length === 0 || skillFilters.includes(skillSlug)));

  return (
    <div className={styles.tableWrap}>
      <table className={`${styles.table} ${styles.matrix}`}>
        <caption className="sr-only">
          Skills by case study. A dot marks a skill used in that case. Row and column
          headers are buttons that toggle the matching filter.
        </caption>
        <thead>
          <tr>
            <th scope="col">
              <span className="sr-only">Skill</span>
            </th>
            {WORK_ITEMS.map((i) => (
              <th key={i.id} scope="col">
                <button
                  type="button"
                  className={styles.mxHead}
                  aria-pressed={caseFilters.includes(i.id)}
                  onClick={() => toggleCase(i.id)}
                >
                  {i.title}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SKILLS.map((skill) => {
            const slug = slugify(skill);
            return (
              <tr key={skill}>
                <th scope="row">
                  <button
                    type="button"
                    className={styles.mxHead}
                    aria-pressed={skillFilters.includes(slug)}
                    onClick={() => toggleSkill(slug)}
                  >
                    {skill}
                  </button>
                </th>
                {WORK_ITEMS.map((i) => {
                  const marked = i.skills.includes(skill);
                  const evidence = SKILL_EVIDENCE[i.id]?.[skill];
                  return (
                    <td
                      key={i.id}
                      className={`${styles.mxCell} ${marked ? styles.mxOn : ""} ${
                        emphasised(i, slug) ? "" : styles.mxDim
                      }`}
                      style={
                        marked
                          ? ({ "--case-tint-hi": i.hi, "--case-tint-text": i.text } as React.CSSProperties)
                          : undefined
                      }
                    >
                      {/* Dead dots are doors (Pass E task 5b): every dot
                          links to its case; a cell with an evidence line
                          exposes it on demand first (disclosure). */}
                      {marked &&
                        (evidence ? (
                          <details className={styles.mxDetails}>
                            <summary
                              className={styles.mxLink}
                              aria-label={`${i.title}: ${skill}, show evidence`}
                            >
                              <span aria-hidden="true" className={styles.mxDot} />
                            </summary>
                            <div className={styles.mxPanel}>
                              <p>{evidence}</p>
                              <Link href={i.href}>Read {i.title}</Link>
                            </div>
                          </details>
                        ) : (
                          <Link
                            href={i.href}
                            className={styles.mxLink}
                            aria-label={`${i.title}: ${skill}, read the case study`}
                          >
                            <span aria-hidden="true" className={styles.mxDot} />
                          </Link>
                        ))}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
