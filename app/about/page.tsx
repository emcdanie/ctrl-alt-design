"use client";

import { useState } from "react";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";
import ProcessSection from "@/components/ProcessSection";
import ExperienceSection from "@/components/ExperienceSection";
import TestimonialSection from "@/components/TestimonialSection";
import CtrlAltDesignSection from "@/components/CtrlAltDesignSection";
import ResumeModal from "@/components/ResumeModal";
import BackToWorkButton from "@/components/BackToWorkButton";
import VinylPlayer from "@/components/VinylPlayer";
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
    title: "Smart Interface Design Patterns",
    instructor: "Vitaly Friedman / Smashing Magazine",
    type: "workshop",
    year: "2025",
    topics: ["Complex filtering patterns", "Progressive disclosure", "Cognitive load in UI", "Enterprise navigation"],
    reflection: "This workshop fundamentally shaped how I think about filtering as a decision-support system rather than a data-exposure mechanism. The pattern vocabulary I developed here directly influenced the ***REMOVED*** search and filtering redesign.",
    relatedWork: { label: "Search & Filtering Case Study", href: "/case-studies/filters-decision-support-system" },
  },
  {
    title: "Into Design Systems",
    instructor: "Into Design Systems Conference",
    type: "conference",
    year: "2024",
    topics: ["Design token architecture", "Multi-brand systems", "Component governance", "Design-engineering handoff"],
    reflection: "Attending IDS reinforced my conviction that design systems are fundamentally about shared language and governance, not component libraries. The talks on token architecture directly informed how I structured the ***REMOVED*** design system.",
    relatedWork: { label: "Design System Case Study", href: "/case-studies/design-system-transformation" },
  },
  {
    title: "Advanced Interface Design Patterns",
    instructor: "Vitaly Friedman / Smashing Magazine",
    type: "course",
    year: "2024",
    topics: ["Complex tables and data grids", "Search UX patterns", "Accordion and disclosure patterns", "Form design at scale"],
    reflection: "The deep-dive into table and data grid patterns was particularly relevant, I was designing admin dashboards at ***REMOVED*** at the time, and being able to apply these patterns immediately made the learning stick.",
  },
];

const timelineEvents = [
  { year: "2025", label: "Smart Interface Design Patterns, Smashing Magazine" },
  { year: "2025", label: "Brad Frost Maker Program, Design Systems" },
  { year: "2024", label: "Into Design Systems Conference" },
  { year: "2024", label: "Advanced Interface Design Patterns, Smashing Magazine" },
  { year: "2023", label: "Ironhack UX/UI Design Bootcamp" },
];

/* ── Components ──────────────────────────────────────────────── */

function TypeIcon({ type }: { type: string }) {
  if (type === "workshop") return <Icon name="EditPencil" size="md" />;
  if (type === "conference") return <Icon name="Microphone" size="md" />;
  return <Icon name="Book" size="md" />;
}

function LearningCard({ entry }: { entry: LearningEntry }) {
  const [expanded, setExpanded] = useState(false);

  const typeColors: Record<string, { bg: string; color: string }> = {
    workshop: { bg: "var(--color-supporting-linen)", color: "var(--ink-on-paper)" },
    course: { bg: "var(--color-supporting-linen)", color: "var(--ink-on-paper)" },
    conference: { bg: "var(--color-supporting-linen)", color: "var(--ink-on-paper)" },
  };

  const style = typeColors[entry.type] ?? typeColors.workshop;

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
                    border: `1px solid ${style.color}22`,
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
        <div style={{ borderTop: "1px solid rgba(26,24,20,0.08)", paddingTop: "var(--spacing-4)" }}>
          {/* Topics */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-tag)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B665D", marginBottom: "var(--spacing-2)" }}>
            Topics covered
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "var(--spacing-4)" }}>
            {entry.topics.map((topic) => (
              <span key={topic} className="tag">{topic}</span>
            ))}
          </div>

          {/* Reflection */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-tag)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6B665D", marginBottom: "var(--spacing-2)" }}>
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
      <BackToWorkButton />

      <div className="relative">
        {/* Hero / Intro */}
        <section className="layout-section" style={{ paddingTop: "calc(var(--header-height) + var(--spacing-16))" }}>
          <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 items-start">
              <div>
                <PageHeader eyebrow="About" title="Hey, I'm Elleta" />
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "600px" }}>
                  <p className="body-lg">
                    I&apos;m a product designer who works at the intersection of systems thinking
                    and interaction design. I care about building things that are coherent, scalable,
                    and genuinely useful, not just polished.
                  </p>
                  <p className="body-lg">
                    Most of my recent work has been in B2B SaaS, design systems, complex data interfaces,
                    and multi-role platforms where the user journey is rarely linear and the stakes are high.
                    I&apos;m drawn to the kind of problems where understanding the system matters more than
                    making the screen look good.
                  </p>
                  <p className="body-lg">
                    I&apos;m at my best when I&apos;m working on hard problems with people who care about
                    getting them right. I think the best design work happens when you can hold the tension
                    between user needs, business constraints, and technical reality, and find the solution
                    that respects all three.
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
                border: "3px solid rgba(26,24,20,0.06)",
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

        {/* Divider */}
        <div className="page-container">
          <div style={{ borderTop: "1px solid rgba(26,24,20,0.08)" }} />
        </div>

        {/* At-a-glance facts, relocated from landing */}
        <section className="layout-section-tight">
          <div className="page-container">
            <MetricsStrip />
          </div>
        </section>

        {/* Divider */}
        <div className="page-container">
          <div style={{ borderTop: "1px solid rgba(26,24,20,0.08)" }} />
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
          <div style={{ borderTop: "1px solid rgba(26,24,20,0.08)" }} />
        </div>

        {/* Learning & Experiments, THE learning section (#learning) */}
        <section id="learning" className="layout-section">
          <div className="page-container">
            <p className="section-label mb-3">Learning &amp; Experiments</p>
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
          <div style={{ borderTop: "1px solid rgba(26,24,20,0.08)" }} />
        </div>

        {/* Divider */}
        <div className="page-container">
          <div style={{ borderTop: "1px solid rgba(26,24,20,0.08)" }} />
        </div>

        {/* Currently Listening */}
        <section className="layout-section">
          <div className="page-container">
            <p className="section-label mb-3">Currently Listening</p>
            <h2 className="heading-subsection" style={{ marginBottom: "var(--spacing-6)" }}>
              Design soundtrack
            </h2>
            <div style={{ maxWidth: "320px" }}>
              <VinylPlayer />
            </div>
          </div>
        </section>

        {/* ── Absorbed from the old home stack (IA consolidation) ── */}
        <ProcessSection />
        <ExperienceSection onResumeClick={() => setResumeOpen(true)} />
        <CtrlAltDesignSection />
        <TestimonialSection />
        <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />

        {/* CTA */}
        <section className="layout-section-tight">
          <div className="page-container">
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
              <Link href="/contact" className="btn-key" style={{ flexShrink: 0 }}>
                Get in touch ↗
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
