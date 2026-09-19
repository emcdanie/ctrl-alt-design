"use client";

import { useId, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { FilterChip } from "@/components/ui/FilterChip";
import { Tag } from "@/components/ui/Tag";
import { STUDIES, STUDY_KINDS, studyHref, type Study, type StudyKind } from "@/content/studies";
import { SKILL_EVIDENCE, WORK_ITEMS, type WorkCase, type WorkItem } from "@/lib/workLibrary";
import { SKILLS, slugify } from "@/content/skills";
import styles from "./WorkLibrary.module.css";

/* /work (Elleta, 19 Sep 2026): the three case cards, and the pattern
 * studies list: one row of type chips over one row per study (the
 * problem first, then the project, then a framed crop). The skills
 * matrix below serves /skills and /quick. */

/** A case study card on the ONE Card system: flat until hover. `quiet`
 *  (Home): the kicker is the kind and years in the code role, no tags,
 *  no "Read it"; the title's arrow shows on hover only. */
export function CaseStudyCard({ item, quiet = false }: { item: WorkCase; quiet?: boolean }) {
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
      {quiet ? (
        <span className={`text-code ${styles.kickerQuiet}`}>
          {item.kind} · {item.years}
        </span>
      ) : (
        <span className={styles.kicker}>
          <span className={styles.pill}>Case study</span>
          <span className={`text-code ${styles.kickerDate}`}>{item.years}</span>
        </span>
      )}
      <span className={`heading-item ${styles.cardTitle}`}>
        {item.title}
        {quiet ? (
          <span className={styles.hoverArrow} aria-hidden="true">
            {" "}
            →
          </span>
        ) : null}
      </span>
      <span className={`card-body ${styles.cardLine}`}>{item.line}</span>
      {quiet ? null : (
        <>
          <span className={styles.tags}>
            {item.tags.slice(0, 2).map((t) => (
              <Tag key={t} outline>
                {t}
              </Tag>
            ))}
          </span>
          <span className={styles.cardGo}>Read it →</span>
        </>
      )}
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
      <div className={`filter-chip-row ${styles.studyChips}`} role="group" aria-label="Filter the studies by type">
        <FilterChip pressed={kind === null} onClick={() => setKind(null)}>
          All <span className="text-code filter-chip__count">{STUDIES.length}</span>
        </FilterChip>
        {STUDY_KINDS.map((k) => (
          <FilterChip key={k} pressed={kind === k} onClick={() => setKind(kind === k ? null : k)}>
            {k} <span className="text-code filter-chip__count">{STUDIES.filter((s) => s.kind === k).length}</span>
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
 * matching cells and dim the rest.
 * /learning (19 Sep 2026) extends it: `learnedFrom` adds a "Learned
 * from" dot column (filled = certificate, each dot focusable with its
 * tooltip) under a "Learned from | Used in" header row; without
 * `toggleCase` the case headers are plain text. ── */

export type LearnedDotData = { id: string; label: string; certificate: boolean; muted: boolean };

export function MatrixView({
  caseFilters,
  skillFilters,
  toggleCase,
  toggleSkill,
  learnedFrom,
}: {
  caseFilters: string[];
  skillFilters: string[];
  toggleCase?: (id: string) => void;
  toggleSkill: (slug: string) => void;
  learnedFrom?: (skill: (typeof SKILLS)[number]) => LearnedDotData[];
}) {
  const hasFilters = caseFilters.length > 0 || skillFilters.length > 0;
  const emphasisedRow = (skillSlug: string) => skillFilters.length === 0 || skillFilters.includes(skillSlug);
  const emphasised = (item: WorkItem, skillSlug: string) =>
    !hasFilters ||
    ((caseFilters.length === 0 || caseFilters.includes(item.id)) &&
      (skillFilters.length === 0 || skillFilters.includes(skillSlug)));

  return (
    <div className={styles.tableWrap}>
      <table className={`${styles.table} ${styles.matrix}`}>
        <caption className="sr-only">
          {learnedFrom
            ? "Skills: where I learned each one and the case studies I used it in. A filled dot is a certificate. Skill headers are buttons that toggle the topic filter."
            : "Skills by case study. A dot marks a skill used in that case. Row and column headers are buttons that toggle the matching filter."}
        </caption>
        <thead>
          {learnedFrom && (
            <tr className={styles.mxGroups}>
              <td />
              <th scope="colgroup">Learned from</th>
              <th scope="colgroup" colSpan={WORK_ITEMS.length}>
                Used in
              </th>
            </tr>
          )}
          <tr>
            <th scope="col">{learnedFrom ? <span className={styles["mx-meta"]}>Skill</span> : <span className="sr-only">Skill</span>}</th>
            {learnedFrom && (
              <th scope="col">
                <span className={styles["mx-meta"]}>Courses, events, reading</span>
              </th>
            )}
            {WORK_ITEMS.map((i) => (
              <th key={i.id} scope="col">
                {toggleCase ? (
                  <button
                    type="button"
                    className={styles.mxHead}
                    aria-pressed={caseFilters.includes(i.id)}
                    onClick={() => toggleCase(i.id)}
                  >
                    {i.title}
                  </button>
                ) : (
                  <span className={styles["mx-meta"]}>{i.title}</span>
                )}
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
                {learnedFrom && (
                  <td className={`${styles.mxLearn} ${emphasisedRow(slug) ? "" : styles.mxDim}`}>
                    <span className={styles.mxDots}>
                      {learnedFrom(skill).map((d) => (
                        <LearnedDot key={d.id} dot={d} />
                      ))}
                    </span>
                  </td>
                )}
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

/* a "Learned from" dot: focusable, its tooltip on hover and focus (and
   pinned on tap) is also its name; filled = certificate */
function LearnedDot({ dot }: { dot: LearnedDotData }) {
  const tipId = useId();
  const [pinned, setPinned] = useState(false);
  return (
    <span className={styles.lDotWrap}>
      <button
        type="button"
        className={`${styles.lDot} ${dot.certificate ? styles.lDotCert : ""} ${dot.muted ? styles.lDotMuted : ""}`}
        aria-labelledby={tipId}
        onClick={() => setPinned((p) => !p)}
        onBlur={() => setPinned(false)}
        onKeyDown={(e) => e.key === "Escape" && setPinned(false)}
      />
      <span id={tipId} role="tooltip" className={`${styles["l-meta-tip"]} ${pinned ? styles["l-meta-tip-on"] : ""}`}>
        {dot.label}
      </span>
    </span>
  );
}
