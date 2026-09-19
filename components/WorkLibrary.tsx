"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import FindYourFit from "@/components/FindYourFit";
import VideoModal from "@/components/VideoModal";
import WorkMap, { PieceLink, TypePill, pieceCta } from "@/components/WorkMap";
import Card from "@/components/ui/Card";
import { FilterChip } from "@/components/ui/FilterChip";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Tag } from "@/components/ui/Tag";
import { useWorkFilters } from "@/components/WorkFilters";
import {
  PIECE_TYPES,
  SKILLS,
  SKILL_EVIDENCE,
  WORK_ITEMS,
  WORK_PIECES,
  skillLabel,
  slugify,
  type WorkItem,
  type WorkPiece,
} from "@/lib/workLibrary";
import styles from "./WorkLibrary.module.css";

/* The /work library (approved mock, 19 Sep 2026): the hero with the
 * search, the Type and Topic chips (with counts), the live count and
 * the Cards · Table · Map switcher; then the view. Cards shows the case
 * studies and the experiments in two sections, each dropping out when
 * its cards all filter out; when nothing matches, Obi waits. The URL is
 * the one source of truth (`type`, `topic`, `q`, `view`; `skill` and
 * `case` still read, for older links), so every state deep-links.
 * TODO(learning merge): the chip rows, count line and switcher mirror
 * /learning's; share one toolbar once both branches land. */

type View = "cards" | "table" | "map";

interface WorkState {
  types: string[];
  topics: string[];
  cases: string[];
  q: string;
  view: View;
}

const DEFAULT_STATE: WorkState = { types: [], topics: [], cases: [], q: "", view: "cards" };

const parseList = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);
const asView = (v: string | null): View => (v === "table" || v === "map" ? v : "cards");

/* a long paste is a role for Find my fit, not a search: only short
   text filters the list as you type */
const SEARCH_MAX = 60;

function applyState({ types, topics, cases, q }: WorkState): WorkPiece[] {
  const needle = q.trim().length <= SEARCH_MAX ? q.trim().toLowerCase() : "";
  return WORK_PIECES.filter(
    (p) =>
      (types.length === 0 || types.includes(slugify(p.type))) &&
      (topics.length === 0 || p.topics.some((t) => topics.includes(slugify(t)))) &&
      (cases.length === 0 || cases.includes(p.id)) &&
      (!needle ||
        [p.title, p.line, p.type, ...p.topics, ...p.tags].join(" ").toLowerCase().includes(needle))
  );
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

type Actions = {
  toggle: (key: "type" | "topic", val: string) => void;
  setQuery: (q: string) => void;
  setView: (v: string) => void;
  clearAll: () => void;
};

const noop = () => {};
const NO_ACTIONS: Actions = { toggle: noop, setQuery: noop, setView: noop, clearAll: noop };

/* the URL state and its setters (the toolbar and the sections each
   read it; the URL keeps them in step) */
function useWorkState(): [WorkState, Actions] {
  const params = useSearchParams();
  const { setFilterParams } = useWorkFilters();
  const state: WorkState = {
    types: parseList(params.get("type")),
    topics: [...parseList(params.get("topic")), ...parseList(params.get("skill"))],
    cases: parseList(params.get("case")),
    q: params.get("q") ?? "",
    view: asView(params.get("view")),
  };
  return [
    state,
    {
      toggle: (key, val) => {
        const current = key === "type" ? state.types : state.topics;
        const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
        setFilterParams({ [key]: next.join(","), ...(key === "topic" ? { skill: null } : {}) });
      },
      setQuery: (q) => setFilterParams({ q: q.trim() ? q : null }),
      setView: (v) => setFilterParams({ view: v }, { push: true }),
      clearAll: () => setFilterParams({ type: null, topic: null, skill: null, case: null, q: null }),
    },
  ];
}

const isFiltered = (s: WorkState) => s.types.length + s.topics.length + s.cases.length > 0 || s.q.trim() !== "";

/** The hero's tools: search, chips, count, switcher; then the Table or
 *  Map view when one is chosen. */
export function WorkToolbar() {
  const [state, actions] = useWorkState();
  return <ToolbarView state={state} actions={actions} />;
}

/** The unfiltered toolbar: the server render and the no-JS page. */
export function WorkToolbarStatic() {
  return <ToolbarView state={DEFAULT_STATE} actions={NO_ACTIONS} />;
}

/** The Cards view: case studies, then the experiments. */
export function WorkSections() {
  const [state, actions] = useWorkState();
  return <SectionsView state={state} actions={actions} />;
}

/** The unfiltered sections: the server render and the no-JS page. */
export function WorkSectionsStatic() {
  return <SectionsView state={DEFAULT_STATE} actions={NO_ACTIONS} />;
}

function ToolbarView({ state, actions }: { state: WorkState; actions: Actions }) {
  const [video, setVideo] = useState<WorkPiece | null>(null);
  const shown = applyState(state);
  const cases = shown.filter((p) => p.type === "Case study").length;
  const { toggle, setQuery, setView, clearAll } = actions;

  return (
    <>
      <div className={styles.tools}>
        <FindYourFit
          query={state.q}
          onQueryChange={setQuery}
          chipRow={
            <div className={styles.filters}>
              <ChipRow label="Type">
                {PIECE_TYPES.map((t) => (
                  <FilterChip
                    key={t}
                    className={styles.chip}
                    pressed={state.types.includes(slugify(t))}
                    onClick={() => toggle("type", slugify(t))}
                  >
                    {t}
                    <span className={styles.chipMeta}>{WORK_PIECES.filter((p) => p.type === t).length}</span>
                  </FilterChip>
                ))}
              </ChipRow>
              <ChipRow label="Topic">
                {SKILLS.map((s) => (
                  <FilterChip
                    key={s}
                    className={styles.chip}
                    pressed={state.topics.includes(slugify(s))}
                    onClick={() => toggle("topic", slugify(s))}
                  >
                    {skillLabel(s)}
                    <span className={styles.chipMeta}>{WORK_PIECES.filter((p) => p.topics.includes(s)).length}</span>
                  </FilterChip>
                ))}
              </ChipRow>
              <div className={styles.countBar}>
                <p className={`text-code ${styles.countLine}`} aria-live="polite">
                  {plural(cases, "case study", "case studies")} ·{" "}
                  {plural(shown.length - cases, "experiment", "experiments")}
                </p>
                <div className={styles.countEnd}>
                  {isFiltered(state) && (
                    <button type="button" className={styles.clear} onClick={clearAll}>
                      Clear filters
                    </button>
                  )}
                  <SegmentedControl
                    label="View"
                    options={[
                      { value: "cards", label: "Cards" },
                      { value: "table", label: "Table" },
                      { value: "map", label: "Map" },
                    ]}
                    value={state.view}
                    onChange={setView}
                  />
                </div>
              </div>
            </div>
          }
        />
      </div>

      {state.view === "table" &&
        (shown.length ? <WorkTable pieces={shown} onWatch={setVideo} /> : <Empty clearAll={clearAll} />)}
      {state.view === "map" && (
        <div className={styles.viewGap}>
          <WorkMap
            pieces={WORK_PIECES}
            visible={new Set(shown.map((p) => p.id))}
            topicFilters={SKILLS.filter((s) => state.topics.includes(slugify(s)))}
            onWatch={setVideo}
          />
        </div>
      )}
      <PieceVideo video={video} close={() => setVideo(null)} />
    </>
  );
}

function SectionsView({ state, actions }: { state: WorkState; actions: Actions }) {
  const [video, setVideo] = useState<WorkPiece | null>(null);
  if (state.view !== "cards") return null;
  const shown = applyState(state);
  const cases = shown.filter((p) => p.type === "Case study");
  const lab = shown.filter((p) => p.type !== "Case study");

  return (
    <>
      {cases.length > 0 && (
        <Section id="case-studies" label="Case studies">
          <SectionHeader
            heading="Three systems,"
            accent="up close"
            after="."
            lead="Real teams, real drift. What I found, what I built, what changed."
          />
          <div className="card-grid">
            {cases.map((p) => (
              <WorkCard key={p.id} piece={p} onWatch={setVideo} />
            ))}
          </div>
        </Section>
      )}

      {lab.length > 0 && (
        <Section id="off-the-lead" label="Off the lead">
          <SectionHeader
            heading="Experiments in"
            accent="public"
            after="."
            lead="Self-initiated work, not client projects. Concepts, hackathon builds and prototypes you can click."
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={`illo ${styles.skate}`}
              src="/images/bella/set/bella-skate.webp"
              alt="Illustration of Bella riding a skateboard"
              width={340}
              height={340}
            />
          </SectionHeader>
          <div className={styles.labGrid}>
            {lab.map((p) => (
              <WorkCard key={p.id} piece={p} onWatch={setVideo} />
            ))}
          </div>
        </Section>
      )}

      {shown.length === 0 && (
        <Section id="work-empty" labelledBy="work-empty-title">
          <Empty clearAll={actions.clearAll} />
        </Section>
      )}

      <PieceVideo video={video} close={() => setVideo(null)} />
    </>
  );
}

function PieceVideo({ video, close }: { video: WorkPiece | null; close: () => void }) {
  if (!video?.embed) return null;
  return (
    <VideoModal
      isOpen={true}
      onClose={close}
      embedUrl={video.embed}
      title={video.title}
      description={video.about ?? video.line}
      tags={video.tags}
    />
  );
}

function ChipRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.chipRow} role="group" aria-label={`Filter by ${label.toLowerCase()}`}>
      <span className={`text-code ${styles.chipLabel}`} aria-hidden="true">
        {label}
      </span>
      {children}
    </div>
  );
}

function Empty({ clearAll }: { clearAll: () => void }) {
  return (
    <div className={styles.emptyState}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.emptyArt}
        src="/images/bella/set/obi-sitting.webp"
        alt="Illustration of Obi sitting and waiting"
        width={300}
        height={300}
      />
      <p id="work-empty-title" className={styles.emptyTitle}>
        Nothing matches that yet.
      </p>
      <p className={styles.emptyLine}>
        Obi is waiting.{" "}
        <button type="button" className={styles.clear} onClick={clearAll}>
          Clear filters
        </button>
      </p>
    </div>
  );
}

/* One card for every piece, on the ONE Card system: the cover, the
   kicker (type pill + years), title, one line, two tags, the action.
   A video opens the modal; everything else is one link. */
function WorkCard({ piece, onWatch }: { piece: WorkPiece; onWatch: (p: WorkPiece) => void }) {
  const media = (
    <span className={styles.cover} style={piece.gradient ? { background: piece.gradient } : undefined}>
      {piece.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={piece.cover} alt="" loading="lazy" />
      ) : null}
    </span>
  );
  const body = (
    <>
      <span className={styles.kicker}>
        <TypePill type={piece.type} />
        <span className={`text-code ${styles.kickerDate}`}>{piece.years}</span>
      </span>
      <span className={`heading-item ${styles.cardTitle}`}>{piece.title}</span>
      <span className={`card-body ${styles.cardLine}`}>{piece.line}</span>
      <span className={styles.tags}>
        {piece.tags.slice(0, 2).map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </span>
      <span className={styles.cardGo}>{pieceCta(piece)}</span>
    </>
  );
  return piece.embed ? (
    <Card onClick={() => onWatch(piece)} className={`h-full ${styles.workCard}`} mediaScrim={false} media={media}>
      {body}
    </Card>
  ) : (
    <Card href={piece.href} className={`h-full ${styles.workCard}`} mediaScrim={false} media={media}>
      {body}
    </Card>
  );
}

/* Table: type, title + one line, years, the first three topics, the
   action */
function WorkTable({ pieces, onWatch }: { pieces: WorkPiece[]; onWatch: (p: WorkPiece) => void }) {
  return (
    <div className={`${styles.tableWrap} ${styles.viewGap}`}>
      <table className={`${styles.table} ${styles.workTable}`}>
        <caption className="sr-only">Every piece of work, with its type, years and topics</caption>
        <thead>
          <tr>
            <th scope="col">Type</th>
            <th scope="col">Title</th>
            <th scope="col" className={styles.num}>
              Years
            </th>
            <th scope="col">Topics</th>
            <th scope="col">
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {pieces.map((p) => (
            <tr key={p.id}>
              <td>
                <TypePill type={p.type} />
              </td>
              <td>
                <span className={styles.rowName}>{p.title}</span>
                <span className={styles.rowLine}>{p.line}</span>
              </td>
              <td className={`text-code ${styles.num}`}>{p.years}</td>
              <td className={styles.rowTopics}>{p.topics.slice(0, 3).map(skillLabel).join(", ")}</td>
              <td>
                <PieceLink piece={p} onWatch={onWatch} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
