"use client";

import { useState } from "react";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import ExperienceSection from "@/components/ExperienceSection";
import ResumeModal from "@/components/ResumeModal";
import MetricsStrip from "@/components/MetricsStrip";
import Card from "@/components/ui/Card";
import DisclosureCard from "@/components/ui/DisclosureCard";
import SectionHeader from "@/components/ui/SectionHeader";
import CtaBanner from "@/components/ui/CtaBanner";
import TestimonialSection from "@/components/TestimonialSection";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import VinylPlayer from "@/components/VinylPlayer";

/* Outside-the-work podcasts (Pass E task 7): her historical list,
 * verbatim, from the pre-lush LearningSection */
const PODCASTS = [
  {
    title: "Honest UX Talks",
    by: "Wix Studio",
    href: "https://podcasts.apple.com/es/podcast/honest-ux-talks-by-wix-studio/id1547832809?l=en-GB",
  },
  {
    title: "Patterns Podcast",
    by: "Design Patterns",
    href: "https://podcasts.apple.com/es/podcast/patterns-podcast/id1491843793?l=en-GB",
  },
  {
    title: "On Purpose",
    by: "Jay Shetty",
    href: "https://podcasts.apple.com/es/podcast/on-purpose-with-jay-shetty/id1450994021?l=en-GB",
  },
];

/* ── Data ─────────────────────────────────────────────────────── */

/* Card voice (Elleta, 21 Jul, card-voice): Unique never renders
   inside a Card. Statements are Geist on the ONE shared
   .card-statement recipe; both statement sections render through the
   same StatementCard. Copy verbatim; accent word + colour picks are
   MINE, flagged for her preview review. Receipts are TODO(elleta)
   content slots: one concrete moment proving the principle (+ case
   link where one exists). NEVER invent them; while the text is empty
   the card renders as a non-interactive statement. */

/* The three How-I-solve-problems theses, her copy verbatim (sentence
   case; the old all-caps came from the retired Unique specimen CSS) */
const THESES = [
  {
    pre: "Systems are ",
    accentWord: "agreements,",
    post: " not component libraries.",
    accent: "var(--case-drift-text)",
    body: "A component library is an artefact. The system is the set of agreements around it: what counts as a pattern, who decides, when to extend versus build. When only the artefact exists, every team renegotiates those agreements ad hoc, and that is where drift starts.",
  },
  {
    pre: "",
    accentWord: "Governance",
    post: " is what stops the drift.",
    accent: "var(--case-guardian-text)",
    body: "Drift is not a tooling failure; it is a decision-making failure. Naming, token structure, and contribution flow are governance surfaces. The systems that hold are the ones where the cheap path and the correct path are the same path.",
  },
  {
    pre: "I read ",
    accentWord: "code,",
    post: " so design and engineering stay honest.",
    accent: "var(--case-code-first-text)",
    body: "Parity between Figma and production is a claim that has to be checked in both directions. Reading the code, tokens, props, rendered output, is how I keep the design side accountable to what actually ships, and vice versa.",
  },
];

const COLLAB_PRINCIPLES = [
  {
    pre: "I push back ",
    accentWord: "respectfully",
    post: "",
    accent: "var(--case-chip-text)",
    body: "If I think a brief is solving the wrong problem, I'll say so, with evidence, not just instinct. I'd rather surface a challenge early than deliver the wrong thing on time.",
    receipt: { text: "" /* TODO(elleta): the concrete moment */, caseHref: "", caseLabel: "" },
  },
  {
    pre: "I get ",
    accentWord: "obsessed",
    post: " with solving complex problems",
    accent: "var(--case-clarity-text)",
    body: "Ambiguity doesn't slow me down, it focuses me. I thrive in systems with competing constraints, unclear requirements, and high stakes.",
    receipt: { text: "" /* TODO(elleta): the concrete moment */, caseHref: "", caseLabel: "" },
  },
  {
    pre: "I ask for ",
    accentWord: "early",
    post: " feedback",
    accent: "var(--case-filters-text)",
    body: "I share rough work early and often. A scrappy concept that starts a conversation is worth more than a polished direction no one saw coming.",
    receipt: { text: "" /* TODO(elleta): the concrete moment */, caseHref: "", caseLabel: "" },
  },
  {
    pre: "I advocate for ",
    accentWord: "both",
    post: " users and the business",
    accent: "var(--case-design-lab-text)",
    body: "Good design solves for both. I don't treat business goals as a compromise, I treat them as part of the design problem.",
    receipt: { text: "" /* TODO(elleta): the concrete moment */, caseHref: "", caseLabel: "" },
  },
];

/* the ONE statement-card renderer for both sections */
function StatementCard({
  p,
  children,
}: {
  p: { pre: string; accentWord: string; post: string; accent: string; body: string };
  children?: React.ReactNode;
}) {
  return (
    <article className="thesis-band trace-host" style={{ "--cc": p.accent } as React.CSSProperties}>
      <h3 className="card-statement" style={{ margin: "0 0 var(--spacing-4)" }}>
        {p.pre}
        <span style={{ color: p.accent }}>{p.accentWord}</span>
        {p.post}
      </h3>
      <p className="card-body" style={{ margin: 0, flex: 1 }}>{p.body}</p>
      {children}
    </article>
  );
}

/* The receipt disclosure: TokenAnnotation pattern language (trigger
   button, aria-expanded/aria-controls, keyboard native, no animation
   so reduced motion is safe by construction). Renders ONLY when the
   receipt text exists. */
function CollabReceipt({ receipt, accent, id }: { receipt: { text: string; caseHref?: string; caseLabel?: string }; accent: string; id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: "var(--spacing-4)" }}>
      <button
        type="button"
        className="tok-annotation__trigger"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        Receipt
      </button>
      {open && (
        <div id={id} className="tok-annotation__panel">
          <p className="card-body" style={{ margin: 0 }}>{receipt.text}</p>
          {receipt.caseHref && (
            <Link href={receipt.caseHref} style={{ color: accent, fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-sm)", fontWeight: 600, display: "inline-flex", marginTop: "var(--spacing-2)" }}>
              {receipt.caseLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

interface LearningEntry {
  title: string;
  instructor: string;
  type: "workshop" | "course" | "conference";
  year: string;
  topics: string[];
  reflection: string;
  relatedWork?: { label: string; href: string };
  certificateSrc?: string;
  /** identity colour for the Card border/trace, so hover accents vary
      per entry instead of all-iris (case palette + hub tokens) */
  accent: string;
}

const learningEntries: LearningEntry[] = [
  {
    title: "Brad Frost Web Maker Program",
    accent: "var(--case-code-first-text)",
    instructor: "Brad Frost",
    type: "course",
    year: "2024-2025",
    topics: ["Atomic Design", "Design Systems", "AI Enablement", "Code-First"],
    reflection: "Contributing to Brad Frost's own component system, code first. Atomic Design learned from the person who wrote it, and the first real proof for me that AI tooling can accelerate system investigation without replacing design judgement.",
    relatedWork: { label: "Code First case study", href: "/case-studies/brad-frost" },
  },
  {
    title: "Smart Interface Design Patterns",
    accent: "var(--case-filters-text)",
    instructor: "Vitaly Friedman / Smashing Magazine",
    type: "workshop",
    year: "2025",
    topics: ["Complex filtering patterns", "Progressive disclosure", "Cognitive load in UI", "Enterprise navigation"],
    reflection: "This workshop fundamentally shaped how I think about filtering as a decision-support system rather than a data-exposure mechanism. The pattern vocabulary I developed here directly influenced the search and filtering redesign on a B2B travel platform.",
    relatedWork: { label: "Search & Filtering Case Study", href: "/case-studies/filters-decision-support-system" },
  },
  {
    title: "Into Design Systems",
    accent: "var(--hub-bright)",
    instructor: "Into Design Systems Conference",
    type: "conference",
    year: "2025 & 2026",
    topics: ["Design token architecture", "Multi-brand systems", "Component governance", "Design-engineering handoff"],
    reflection: "Attending IDS reinforced my conviction that design systems are fundamentally about shared language and governance, not component libraries. The talks on token architecture directly informed how I structured the design system on a B2B travel platform.",
    relatedWork: { label: "Design System Case Study", href: "/case-studies/design-system-transformation" },
  },
  {
    title: "Advanced Interface Design Patterns",
    accent: "var(--case-drift-text)",
    instructor: "Vitaly Friedman / Smashing Magazine",
    type: "course",
    year: "2024",
    topics: ["Complex tables and data grids", "Search UX patterns", "Accordion and disclosure patterns", "Form design at scale"],
    reflection: "The deep-dive into table and data grid patterns was particularly relevant, I was designing admin dashboards on a B2B travel platform at the time, and being able to apply these patterns immediately made the learning stick.",
  },
];

/* ── Components ──────────────────────────────────────────────── */

function TypeIcon({ type }: { type: string }) {
  if (type === "workshop") return <Icon name="EditPencil" size="md" />;
  if (type === "conference") return <Icon name="Microphone" size="md" />;
  return <Icon name="Book" size="md" />;
}

/* ONE branded treatment per entry TYPE (generic metadata, deliberately
   NOT case colours): a quiet tint on the icon tile + type badge so the
   list scans by kind. Ink text keeps AA on every tint in both themes.
   PROVISIONAL pending Elleta's call: per-type colour vs all-neutral,
   and real partner logos vs this icon treatment. */
const TYPE_STYLE: Record<string, { bg: string; fg: string }> = {
  course: { bg: "var(--color-semantic-accent-subtle)", fg: "var(--color-accent-ink)" },
  workshop: { bg: "color-mix(in srgb, var(--color-accent-peri) 26%, transparent)", fg: "var(--color-ink)" },
  conference: { bg: "color-mix(in srgb, var(--color-ink) 8%, transparent)", fg: "var(--color-ink)" },
};

/* Learning entries render on the shared DisclosureCard; the header is
   the icon tile + type/year meta, the body is topics + reflection. */
function LearningEntryCard({ entry }: { entry: LearningEntry }) {
  return (
    <DisclosureCard
      accent={entry.accent}
      header={
        <>
          <div
            style={{
              width: "var(--spacing-10)",
              height: "var(--spacing-10)",
              borderRadius: "var(--radius-lg)",
              background: TYPE_STYLE[entry.type].bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: TYPE_STYLE[entry.type].fg,
              flexShrink: 0,
            }}
          >
            <TypeIcon type={entry.type} />
          </div>
          <div className="min-w-0 flex-1">
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)", marginBottom: "var(--spacing-1)" }}>
              <span
                className="tag"
                style={{ textTransform: "uppercase", background: TYPE_STYLE[entry.type].bg, color: "var(--color-ink)" }}
              >
                {entry.type}
              </span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-tag)", color: "var(--color-muted)" }}>
                {entry.year}
              </span>
            </div>
            <h3 className="heading-item" style={{ marginBottom: "var(--spacing-1)" }}>{entry.title}</h3>
            <p className="card-meta" style={{ margin: 0 }}>{entry.instructor}</p>
          </div>
        </>
      }
    >
      <div style={{ paddingTop: "var(--spacing-4)" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-tag)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-ink-muted)", marginBottom: "var(--spacing-2)" }}>
          Topics covered
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-2)", marginBottom: "var(--spacing-4)" }}>
          {entry.topics.map((topic) => (
            <span key={topic} className="tag">{topic}</span>
          ))}
        </div>

        <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-tag)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-ink-muted)", marginBottom: "var(--spacing-2)" }}>
          What I took away
        </p>
        <p className="body-base" style={{ margin: 0, marginBottom: entry.relatedWork ? "var(--spacing-3)" : 0 }}>
          {entry.reflection}
        </p>

        {entry.relatedWork && (
          <Link
            href={entry.relatedWork.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: "var(--spacing-touch-target)",
              gap: "var(--spacing-2)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--typography-font-size-tag)",
              fontWeight: 600,
              color: "var(--color-accent-ink)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            → {entry.relatedWork.label}
          </Link>
        )}
      </div>
    </DisclosureCard>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function AboutPage() {
  const [resumeOpen, setResumeOpen] = useState(false);
  return (
    <main id="main-content" className="page-shell min-h-screen text-[var(--color-ink-soft)]">
      <OverlayNav />

      <div className="relative">
        {/* Hero / Intro: the portrait bubble IS the page device (one per
            page); title matches the /work flat treatment exactly. */}
        <section className="layout-section-tight" style={{ paddingTop: "calc(var(--header-height) + var(--spacing-12))" }}>
          <div className="page-container">
            <div className="grid grid-cols-1 items-center gap-[var(--grid-gap)] lg:grid-cols-[1fr_auto]">
              <div>
                <PageHeader eyebrow="About" title="Hey, I'm" accent="Elleta" />
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)", maxWidth: "640px" }}>
                  <p className="body-lg">
                I design{" "}
                <strong style={{ fontWeight: 600, color: "var(--color-accent-ink)" }}>
                  AI-enabled design systems
                </strong>{" "}
                for complex, multi-role B2B and enterprise products. Tokens, components, and
                the governance that keeps them from drifting. I read code, trace how components
                actually behave in production, and work with engineers directly, so the system
                stays true on both sides of handoff.
              </p>
                  <p className="body-lg" style={{ color: "var(--color-muted)" }}>
                    Most of my work lives where the user journey is rarely linear and the stakes are
                    high: booking platforms, operational dashboards, data-heavy tools, holding the
                    tension between user needs, business constraints, and technical reality.
                  </p>
                </div>
              </div>

              <div className="photo-bubble justify-self-center lg:justify-self-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/thumbnails/Me.jpeg" alt="Elleta, portrait" />
              </div>
            </div>
          </div>
        </section>

        {/* At-a-glance facts */}
        <section className="layout-section-tight">
          <div className="page-container">
            <MetricsStrip />
          </div>
        </section>

        {/* Working With Me */}
        <section className="layout-section-tight">
          <div className="page-container">
            <SectionHeader label="Working With Me" title="How I collaborate" />
            {/* Same card grammar as How-I-solve-problems: ONE shared
                StatementCard, pair grid; disclosure appears only when a
                receipt line exists (TODO slots render nothing). */}
            <div className="thesis-row thesis-row--pair">
              {COLLAB_PRINCIPLES.map((p, i) => (
                <StatementCard key={p.accentWord} p={p}>
                  {p.receipt.text.trim() !== "" && (
                    <CollabReceipt receipt={p.receipt} accent={p.accent} id={`collab-receipt-${i}`} />
                  )}
                </StatementCard>
              ))}
            </div>
          </div>
        </section>

        {/* How I solve problems (#how-i-think): the Point of View theses,
            folded in from the retired /point-of-view route. Her words,
            condensed; one accent highlight; ends at the proof case. */}
        <section id="how-i-think" className="layout-section-tight" style={{ scrollMarginTop: "calc(var(--header-height) + var(--spacing-4))" }}>
          <div className="page-container">
            {/* D3 (Pass D): the About mid-page Unique-energy moment,
                ONE hero-tier header with the iris accent word */}
            <SectionHeader label="How I Think" tier="page" title="How I solve" accent="problems." />
            {/* D2 (Pass D): the three theses as designed tiles, the
                stat-tile direction. Case colours per her 17 Jul brief
                (supersedes the older About-is-not-a-case note); tokens
                only; copy unchanged. */}
            <div className="thesis-row">
              {/* Card voice (Elleta, 21 Jul): statements in Geist on
                  the shared .card-statement recipe; her copy verbatim;
                  the theme-aware thesis-band surface + trace stays. */}
              {THESES.map((t, i) => (
                <StatementCard key={t.accentWord} p={t}>
                  {i === 2 && (
                    <Link
                      href="/case-studies/design-system-transformation"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "var(--spacing-2)",
                        marginTop: "var(--spacing-4)",
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--typography-font-size-sm)",
                        fontWeight: 600,
                        color: "var(--cc)",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                        minHeight: "var(--spacing-touch-target)",
                      }}
                    >
                      See it applied: From Drift to Foundation →
                    </Link>
                  )}
                </StatementCard>
              ))}
            </div>
          </div>
        </section>

        {/* THE one learning section (#learning) */}
        <section id="learning" className="layout-section-tight">
          <div className="page-container">
            <SectionHeader
              label="Learning"
              title="Continuous learning"
              description="Workshops, courses, and conferences that have shaped how I think about design systems, interaction patterns, and complex interfaces."
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
              {learningEntries.map((entry) => (
                <LearningEntryCard key={entry.title} entry={entry} />
              ))}
            </div>
          </div>
        </section>

        <ExperienceSection onResumeClick={() => setResumeOpen(true)} />
        <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />

        {/* Outside the work (Pass E task 7): the music moment returns,
            rebuilt on the current system. Her historical copy verbatim
            (em dash swept); vinyl + podcasts on the ONE Card. */}
        <section id="outside-the-work" className="layout-section-tight">
          <div className="page-container">
            <SectionHeader label="Outside the work" title="Learning & Inspiration" />
            <div className="grid grid-cols-1 items-stretch gap-[var(--grid-gap)] sm:grid-cols-2">
              <VinylPlayer />
              <Card className="h-full">
                <div style={{ padding: "var(--spacing-6)", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      width: "var(--spacing-12)",
                      height: "var(--spacing-12)",
                      borderRadius: "var(--radius-lg)",
                      background: "var(--color-tag-bg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "var(--spacing-4)",
                      color: "var(--color-ink)",
                    }}
                  >
                    <Icon name="Podcast" size="lg" />
                  </div>
                  <h3 className="heading-item" style={{ marginBottom: "var(--spacing-2)" }}>Podcasts</h3>
                  <p className="card-body" style={{ marginBottom: "var(--spacing-4)" }}>
                    Design thinking, systems, and personal growth, what I listen to between projects.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)", marginTop: "auto" }}>
                    {PODCASTS.map((pod) => (
                      <a
                        key={pod.title}
                        href={pod.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "var(--spacing-2)",
                          padding: "var(--spacing-3) var(--spacing-4)",
                          borderRadius: "var(--radius-lg)",
                          background: "var(--color-tag-bg)",
                          textDecoration: "none",
                          minHeight: "var(--spacing-touch-target)",
                        }}
                      >
                        <span style={{ minWidth: 0 }}>
                          <span
                            style={{
                              display: "block",
                              fontFamily: "var(--font-body)",
                              fontSize: "var(--typography-font-size-base)",
                              fontWeight: 600,
                              color: "var(--color-accent-ink)",
                              textDecoration: "underline",
                              textUnderlineOffset: "3px",
                              lineHeight: 1.3,
                            }}
                          >
                            {pod.title}
                          </span>
                          <span
                            style={{
                              display: "block",
                              fontFamily: "var(--font-body)",
                              fontSize: "var(--typography-font-size-tag)",
                              color: "var(--color-muted)",
                              marginTop: "2px",
                            }}
                          >
                            {pod.by}
                          </span>
                        </span>
                        <Icon name="OpenNewWindow" size="sm" />
                      </a>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Social proof: the page ends with third-party words, then the ask */}
        <TestimonialSection />

        {/* Close + CTA */}
        <section className="layout-section-tight">
          <div className="page-container">
            <p className="body-lg" style={{ maxWidth: "600px", marginBottom: "var(--spacing-8)" }}>
              I&apos;m at my best on hard problems with people who care about getting
              them right.
            </p>
            <CtaBanner title={<>Open to full-time roles &<br />select freelance projects.</>} />
          </div>
        </section>
      </div>
    </main>
  );
}
