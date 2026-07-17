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
import GlassBanner from "@/components/ui/GlassBanner";
import TestimonialSection from "@/components/TestimonialSection";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

/* ── Data ─────────────────────────────────────────────────────── */

const collaborationCards = [
  {
    title: "I push back respectfully",
    description: "If I think a brief is solving the wrong problem, I'll say so, with evidence, not just instinct. I'd rather surface a challenge early than deliver the wrong thing on time.",
  },
  {
    title: "I get obsessed with solving complex problems",
    description: "Ambiguity doesn't slow me down, it focuses me. I thrive in systems with competing constraints, unclear requirements, and high stakes.",
  },
  {
    title: "I ask for early feedback",
    description: "I share rough work early and often. A scrappy concept that starts a conversation is worth more than a polished direction no one saw coming.",
  },
  {
    title: "I advocate for both users and the business",
    description: "Good design solves for both. I don't treat business goals as a compromise, I treat them as part of the design problem.",
  },
];

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
    title: "Design Systems Course",
    accent: "var(--case-clarity-text)",
    instructor: "Samantha Gordeshko, Smashing Magazine",
    type: "course",
    year: "2025",
    topics: ["Design Systems", "Governance", "Contribution Models"],
    reflection: "A structured pass through design system practice beyond my own habits: governance models, contribution flows, and how other teams keep systems alive after the launch excitement fades.",
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
            <h4 className="heading-item" style={{ marginBottom: "var(--spacing-1)" }}>{entry.title}</h4>
            <p className="body-sm" style={{ margin: 0 }}>{entry.instructor}</p>
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
              gap: "var(--spacing-2)",
              fontFamily: "var(--font-body)",
              fontSize: "var(--typography-font-size-tag)",
              fontWeight: 600,
              color: "var(--color-accent-ink)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
              minHeight: "var(--spacing-touch-target)",
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
    <main className="page-shell min-h-screen text-[var(--color-ink-soft)]">
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
            <div className="grid grid-cols-1 items-stretch gap-[var(--grid-gap)] sm:grid-cols-2">
              {collaborationCards.map((card) => (
                <Card key={card.title} className="h-full">
                  <h4 className="heading-item" style={{ marginBottom: "var(--spacing-1)" }}>
                    {card.title}
                  </h4>
                  <p className="body-base" style={{ margin: 0 }}>
                    {card.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How I solve problems (#how-i-think): the Point of View theses,
            folded in from the retired /point-of-view route. Her words,
            condensed; one accent highlight; ends at the proof case. */}
        <section id="how-i-think" className="layout-section-tight" style={{ scrollMarginTop: "calc(var(--header-height) + var(--spacing-4))" }}>
          <div className="page-container">
            <SectionHeader label="How I Think" title="How I solve problems" />
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-8)", maxWidth: "720px" }}>
              <article>
                <h3 className="heading-subsection" style={{ marginBottom: "var(--spacing-2)" }}>
                  Systems are{" "}
                  <span style={{ color: "var(--color-accent-ink)" }}>agreements</span>, not
                  component libraries.
                </h3>
                <p className="body-base" style={{ margin: 0 }}>
                  A component library is an artefact. The system is the set of agreements around
                  it: what counts as a pattern, who decides, when to extend versus build. When
                  only the artefact exists, every team renegotiates those agreements ad hoc, and
                  that is where drift starts.
                </p>
              </article>
              <article>
                <h3 className="heading-subsection" style={{ marginBottom: "var(--spacing-2)" }}>
                  Governance is what stops the drift.
                </h3>
                <p className="body-base" style={{ margin: 0 }}>
                  Drift is not a tooling failure; it is a decision-making failure. Naming, token
                  structure, and contribution flow are governance surfaces. The systems that hold
                  are the ones where the cheap path and the correct path are the same path.
                </p>
              </article>
              <article>
                <h3 className="heading-subsection" style={{ marginBottom: "var(--spacing-2)" }}>
                  I read code, so design and engineering stay honest.
                </h3>
                <p className="body-base" style={{ margin: 0 }}>
                  Parity between Figma and production is a claim that has to be checked in both
                  directions. Reading the code, tokens, props, rendered output, is how I keep the
                  design side accountable to what actually ships, and vice versa.
                </p>
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
                    color: "var(--color-accent-ink)",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                    minHeight: "var(--spacing-touch-target)",
                  }}
                >
                  See it applied: From Drift to Foundation →
                </Link>
              </article>
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

        {/* Social proof: the page ends with third-party words, then the ask */}
        <TestimonialSection />

        {/* Close + CTA */}
        <section className="layout-section-tight">
          <div className="page-container">
            <p className="body-lg" style={{ maxWidth: "600px", marginBottom: "var(--spacing-8)" }}>
              I&apos;m at my best on hard problems with people who care about getting
              them right.
            </p>
            <GlassBanner
              className="flex flex-col gap-[var(--spacing-8)] md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-tag)", fontWeight: "var(--typography-font-weight-medium)", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-ink-muted)", marginBottom: "var(--spacing-2)" }}>
                  Have a project in mind?
                </p>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--font-subsection)", fontWeight: "var(--typography-font-weight-bold)", color: "var(--color-ink)", lineHeight: 1.15, textTransform: "uppercase" }}>
                  Open to full-time roles &<br />select freelance projects.
                </h2>
              </div>
              <Button href="/contact" className="shrink-0">
                Get in touch ↗
              </Button>
            </GlassBanner>
          </div>
        </section>
      </div>
    </main>
  );
}
