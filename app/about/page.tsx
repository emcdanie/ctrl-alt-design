"use client";

import { useState } from "react";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import ExperienceSection from "@/components/ExperienceSection";
import ResumeModal from "@/components/ResumeModal";
import MetricsStrip from "@/components/MetricsStrip";
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
}

const learningEntries: LearningEntry[] = [
  {
    title: "Brad Frost Web Maker Program",
    instructor: "Brad Frost",
    type: "course",
    year: "2024-2025",
    topics: ["Atomic Design", "Design Systems", "AI Enablement", "Code-First"],
    reflection: "Contributing to Brad Frost's own component system, code first. Atomic Design learned from the person who wrote it, and the first real proof for me that AI tooling can accelerate system investigation without replacing design judgement.",
    relatedWork: { label: "Code First case study", href: "/case-studies/brad-frost" },
  },
  {
    title: "Design Systems Course",
    instructor: "Samantha Gordeshko, Smashing Magazine",
    type: "course",
    year: "2025",
    topics: ["Design Systems", "Governance", "Contribution Models"],
    reflection: "A structured pass through design system practice beyond my own habits: governance models, contribution flows, and how other teams keep systems alive after the launch excitement fades.",
  },
  {
    title: "Smart Interface Design Patterns",
    instructor: "Vitaly Friedman / Smashing Magazine",
    type: "workshop",
    year: "2025",
    topics: ["Complex filtering patterns", "Progressive disclosure", "Cognitive load in UI", "Enterprise navigation"],
    reflection: "This workshop fundamentally shaped how I think about filtering as a decision-support system rather than a data-exposure mechanism. The pattern vocabulary I developed here directly influenced the search and filtering redesign on a B2B travel platform.",
    relatedWork: { label: "Search & Filtering Case Study", href: "/case-studies/filters-decision-support-system" },
  },
  {
    title: "Into Design Systems",
    instructor: "Into Design Systems Conference",
    type: "conference",
    year: "2025 & 2026",
    topics: ["Design token architecture", "Multi-brand systems", "Component governance", "Design-engineering handoff"],
    reflection: "Attending IDS reinforced my conviction that design systems are fundamentally about shared language and governance, not component libraries. The talks on token architecture directly informed how I structured the design system on a B2B travel platform.",
    relatedWork: { label: "Design System Case Study", href: "/case-studies/design-system-transformation" },
  },
  {
    title: "Advanced Interface Design Patterns",
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

function LearningCard({ entry }: { entry: LearningEntry }) {
  const [expanded, setExpanded] = useState(false);

  /* One treatment for every entry type: the site accent (About colour
     pass). Iris text on the accent-subtle plate, AA both themes. */
  const style = {
    bg: "var(--color-semantic-accent-subtle)",
    color: "var(--color-accent-ink)",
  };

  return (
    <div
      className="card-elevated"
      style={{
        padding: 0,
        cursor: "pointer",
        transition: "transform 0.24s ease, box-shadow 0.24s ease",
        display: "flex",
        overflow: "hidden",
      }}
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "";
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          width: "4px",
          flexShrink: 0,
          background: style.color,
          borderRadius: "4px 0 0 4px",
        }}
      />

      <div style={{ flex: 1, padding: "var(--spacing-6)" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--spacing-3)" }}>
          <div style={{ display: "flex", gap: "14px", flex: 1 }}>
            {/* Type icon */}
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: style.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: style.color,
                flexShrink: 0,
              }}
            >
              <TypeIcon type={entry.type} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)", marginBottom: "6px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    padding: "2px 10px",
                    borderRadius: "var(--radius-full)",
                    background: style.bg,
                    border: "1px solid var(--color-semantic-accent-border)",
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    fontWeight: "var(--typography-font-weight-bold)",
                    color: style.color,
                    letterSpacing: "var(--typography-letter-spacing-wide)",
                    textTransform: "uppercase",
                  }}
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
          </div>

          {/* Expand icon */}
          <Icon
            name="NavArrowDown"
            size="sm"
            style={{
              marginTop: "var(--spacing-1)",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.25s ease",
            }}
          />
        </div>

      {/* Expandable content */}
      <div
        className="expand-transition"
        style={{
          maxHeight: expanded ? "500px" : "0px",
          opacity: expanded ? 1 : 0,
          marginTop: expanded ? "16px" : "0px",
        }}
      >
        <div style={{ borderTop: "1px solid var(--color-border-soft)", paddingTop: "var(--spacing-4)" }}>
          {/* Topics */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-tag)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-ink-muted)", marginBottom: "var(--spacing-2)" }}>
            Topics covered
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "var(--spacing-4)" }}>
            {entry.topics.map((topic) => (
              <span key={topic} className="tag">{topic}</span>
            ))}
          </div>

          {/* Reflection */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-tag)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-ink-muted)", marginBottom: "var(--spacing-2)" }}>
            What I took away
          </p>
          <p className="body-base" style={{ margin: 0, marginBottom: entry.relatedWork ? "12px" : "0px" }}>
            {entry.reflection}
          </p>

          {/* Related work */}
          {entry.relatedWork && (
            <Link
              href={entry.relatedWork.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "var(--font-body)",
                fontSize: "var(--typography-font-size-tag)",
                fontWeight: 600,
                color: "var(--color-ink)",
                textDecoration: "none",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              → {entry.relatedWork.label}
            </Link>
          )}
        </div>
      </div>
      </div>{/* /inner content */}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function AboutPage() {
  const [resumeOpen, setResumeOpen] = useState(false);
  return (
    <main className="page-shell min-h-screen text-[var(--color-ink-soft)]">
      <OverlayNav />

      <div className="relative">
        {/* Hero / Intro */}
        <section className="layout-section" style={{ paddingTop: "calc(var(--header-height) + var(--spacing-16))" }}>
          <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 items-start">
              <div>
                <PageHeader eyebrow="About" title="Hey, I'm Elleta" variant="bubble" />
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)", maxWidth: "600px" }}>
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
                </div>
              </div>

              {/* Photo */}
              <div style={{
                width: "100%",
                maxWidth: "280px",
                aspectRatio: "1",
                borderRadius: "var(--radius-3xl)",
                overflow: "hidden",
                background: "var(--color-surface)",
                border: "3px solid var(--color-border-medium)",
                justifySelf: "end",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/thumbnails/Me.jpeg"
                  alt="Elleta"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { (e.currentTarget.parentElement as HTMLElement).style.background = "var(--color-surface)"; e.currentTarget.style.display = "none"; }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* The problem space */}
        <section className="layout-section-tight">
          <div className="page-container">
            <p className="section-label mb-3">The problem space</p>
            <p className="body-lg" style={{ maxWidth: "600px" }}>
              Most of my work lives where the user journey is rarely linear and the stakes are
              high: booking platforms, operational dashboards, data-heavy tools, holding the
              tension between user needs, business constraints, and technical reality.
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="page-container">
          <div style={{ borderTop: "1px solid var(--color-border-soft)" }} />
        </div>

        {/* At-a-glance facts, relocated from landing */}
        <section className="layout-section-tight">
          <div className="page-container">
            <MetricsStrip />
          </div>
        </section>

        {/* Divider */}
        <div className="page-container">
          <div style={{ borderTop: "1px solid var(--color-border-soft)" }} />
        </div>

        {/* Working With Me */}
        <section className="layout-section">
          <div className="page-container">
            <p className="section-label mb-3">Working With Me</p>
            <h2 className="heading-subsection" style={{ marginBottom: "var(--spacing-6)" }}>
              How I collaborate
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {collaborationCards.map((card) => (
                <div
                  key={card.title}
                  className="card-elevated card-interactive"
                  style={{ padding: "var(--spacing-6)", cursor: "default" }}
                >
                  <h4 className="heading-item" style={{ marginBottom: "6px" }}>
                    {card.title}
                  </h4>
                  <p className="body-base" style={{ margin: 0 }}>
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="page-container">
          <div style={{ borderTop: "1px solid var(--color-border-soft)" }} />
        </div>

        {/* THE one learning section (#learning) */}
        <section id="learning" className="layout-section">
          <div className="page-container">
            <p className="section-label mb-3">Learning</p>
            <h2 className="heading-subsection" style={{ marginBottom: "var(--spacing-2)" }}>
              Continuous learning
            </h2>
            <p className="body-base" style={{ marginBottom: "28px", maxWidth: "560px", color: "var(--color-muted)" }}>
              Workshops, courses, and conferences that have shaped how I think about design systems,
              interaction patterns, and complex interfaces.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
              {learningEntries.map((entry) => (
                <LearningCard key={entry.title} entry={entry} />
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="page-container">
          <div style={{ borderTop: "1px solid var(--color-border-soft)" }} />
        </div>

        <ExperienceSection onResumeClick={() => setResumeOpen(true)} />
        <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />

        {/* Close + CTA */}
        <section className="layout-section-tight">
          <div className="page-container">
            <p className="body-lg" style={{ maxWidth: "600px", marginBottom: "var(--spacing-8)" }}>
              I&apos;m at my best on hard problems with people who care about getting
              them right.
            </p>
            <div
              style={{
                background: "var(--color-semantic-background-inverse)",
                borderRadius: "var(--radius-3xl)",
                padding: "56px var(--spacing-12)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-8)",
              }}
              className="md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-tag)", fontWeight: "var(--typography-font-weight-medium)", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--color-semantic-text-inverse)", opacity: 0.65, marginBottom: "10px" }}>
                  Have a project in mind?
                </p>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: "var(--typography-font-weight-bold)", color: "var(--color-semantic-text-inverse)", lineHeight: 1.15, textTransform: "uppercase" }}>
                  Open to full-time roles &<br />select freelance projects.
                </h2>
              </div>
              <Button href="/contact" className="shrink-0">
                Get in touch ↗
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
