"use client";

import { useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import OverlayNav from "@/components/OverlayNav";
import BackToWorkButton from "@/components/BackToWorkButton";
import VinylPlayer from "@/components/VinylPlayer";
import Link from "next/link";

/* ── Data ─────────────────────────────────────────────────────── */

const collaborationCards = [
  {
    title: "I push back respectfully",
    description: "If I think a brief is solving the wrong problem, I'll say so — with evidence, not just instinct. I'd rather surface a challenge early than deliver the wrong thing on time.",
  },
  {
    title: "I get obsessed with solving complex problems",
    description: "Ambiguity doesn't slow me down — it focuses me. I thrive in systems with competing constraints, unclear requirements, and high stakes.",
  },
  {
    title: "I ask for early feedback",
    description: "I share rough work early and often. A scrappy concept that starts a conversation is worth more than a polished direction no one saw coming.",
  },
  {
    title: "I advocate for both users and the business",
    description: "Good design solves for both. I don't treat business goals as a compromise — I treat them as part of the design problem.",
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
    reflection: "This workshop fundamentally shaped how I think about filtering as a decision-support system rather than a data-exposure mechanism. The pattern vocabulary I developed here directly influenced the BizAway search and filtering redesign.",
    relatedWork: { label: "Search & Filtering Case Study", href: "/case-studies/filters-decision-support-system" },
  },
  {
    title: "Into Design Systems",
    instructor: "Into Design Systems Conference",
    type: "conference",
    year: "2024",
    topics: ["Design token architecture", "Multi-brand systems", "Component governance", "Design-engineering handoff"],
    reflection: "Attending IDS reinforced my conviction that design systems are fundamentally about shared language and governance, not component libraries. The talks on token architecture directly informed how I structured the BizAway design system.",
    relatedWork: { label: "Design System Case Study", href: "/case-studies/design-system-transformation" },
  },
  {
    title: "Advanced Interface Design Patterns",
    instructor: "Vitaly Friedman / Smashing Magazine",
    type: "course",
    year: "2024",
    topics: ["Complex tables and data grids", "Search UX patterns", "Accordion and disclosure patterns", "Form design at scale"],
    reflection: "The deep-dive into table and data grid patterns was particularly relevant — I was designing admin dashboards at BizAway at the time, and being able to apply these patterns immediately made the learning stick.",
  },
];

const timelineEvents = [
  { year: "2025", label: "Smart Interface Design Patterns — Smashing Magazine" },
  { year: "2025", label: "Brad Frost Maker Program — Design Systems" },
  { year: "2024", label: "Into Design Systems Conference" },
  { year: "2024", label: "Advanced Interface Design Patterns — Smashing Magazine" },
  { year: "2023", label: "Ironhack UX/UI Design Bootcamp" },
];

/* ── Components ──────────────────────────────────────────────── */

function TypeIcon({ type }: { type: string }) {
  const iconProps = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  if (type === "workshop") return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" />
    </svg>
  );
  if (type === "conference") return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
  // course
  return (
    <svg {...iconProps} aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

function LearningCard({ entry }: { entry: LearningEntry }) {
  const [expanded, setExpanded] = useState(false);

  const typeColors: Record<string, { bg: string; color: string }> = {
    workshop: { bg: "rgba(42,95,168,0.1)", color: "#2A5FA8" },
    course: { bg: "rgba(107,63,168,0.1)", color: "#6B3FA8" },
    conference: { bg: "rgba(13,107,74,0.1)", color: "#0D6B4A" },
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

      <div style={{ flex: 1, padding: "24px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
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
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    padding: "2px 10px",
                    borderRadius: "999px",
                    background: style.bg,
                    border: `1px solid ${style.color}22`,
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: style.color,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {entry.type}
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--color-muted)" }}>
                  {entry.year}
                </span>
              </div>
              <h4 className="heading-item" style={{ marginBottom: "4px" }}>{entry.title}</h4>
              <p className="body-sm" style={{ margin: 0 }}>{entry.instructor}</p>
            </div>
          </div>

          {/* Expand icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{
              flexShrink: 0,
              marginTop: "4px",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.25s ease",
            }}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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
        <div style={{ borderTop: "1px solid rgba(26,24,20,0.08)", paddingTop: "16px" }}>
          {/* Topics */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8A8A8A", marginBottom: "8px" }}>
            Topics covered
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
            {entry.topics.map((topic) => (
              <span key={topic} className="tag">{topic}</span>
            ))}
          </div>

          {/* Reflection */}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#8A8A8A", marginBottom: "8px" }}>
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
                fontSize: "13px",
                fontWeight: 600,
                color: "#1A1814",
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
  return (
    <main className="page-shell min-h-screen text-[var(--color-ink-soft)]">
      <CustomCursor />
      <OverlayNav />
      <BackToWorkButton />

      <div className="relative">
        {/* Hero / Intro */}
        <section style={{ padding: "120px 24px 64px" }}>
          <div className="page-container">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16 items-start">
              <div>
                <p className="section-label mb-3">— About</p>
                <h1
                  className="heading-section"
                  style={{ marginBottom: "28px", maxWidth: "640px" }}
                >
                  Hey, I&apos;m Elleta
                </h1>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "600px" }}>
                  <p className="body-lg">
                    I&apos;m a product designer who works at the intersection of systems thinking
                    and interaction design. I care about building things that are coherent, scalable,
                    and genuinely useful — not just polished.
                  </p>
                  <p className="body-lg">
                    Most of my recent work has been in B2B SaaS — design systems, complex data interfaces,
                    and multi-role platforms where the user journey is rarely linear and the stakes are high.
                    I&apos;m drawn to the kind of problems where understanding the system matters more than
                    making the screen look good.
                  </p>
                  <p className="body-lg">
                    I&apos;m at my best when I&apos;m working on hard problems with people who care about
                    getting them right. I think the best design work happens when you can hold the tension
                    between user needs, business constraints, and technical reality — and find the solution
                    that respects all three.
                  </p>
                </div>
              </div>

              {/* Photo */}
              <div style={{
                width: "100%",
                maxWidth: "280px",
                aspectRatio: "1",
                borderRadius: "24px",
                overflow: "hidden",
                background: "#D8D4CC",
                border: "3px solid rgba(26,24,20,0.06)",
                justifySelf: "end",
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/thumbnails/Me.jpeg"
                  alt="Elleta"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { (e.currentTarget.parentElement as HTMLElement).style.background = "#C8C4CC"; e.currentTarget.style.display = "none"; }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="page-container">
          <div style={{ borderTop: "1px solid rgba(26,24,20,0.08)" }} />
        </div>

        {/* Working With Me */}
        <section style={{ padding: "64px 24px" }}>
          <div className="page-container">
            <p className="section-label mb-3">— Working With Me</p>
            <h2 className="heading-subsection" style={{ marginBottom: "24px" }}>
              How I collaborate
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {collaborationCards.map((card) => (
                <div
                  key={card.title}
                  className="card-elevated card-interactive"
                  style={{ padding: "24px", cursor: "default" }}
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

        {/* Learning & Experiments */}
        <section style={{ padding: "64px 24px" }}>
          <div className="page-container">
            <p className="section-label mb-3">— Learning &amp; Experiments</p>
            <h2 className="heading-subsection" style={{ marginBottom: "8px" }}>
              Continuous learning
            </h2>
            <p className="body-base" style={{ marginBottom: "28px", maxWidth: "560px", color: "var(--color-muted)" }}>
              Workshops, courses, and conferences that have shaped how I think about design systems,
              interaction patterns, and complex interfaces.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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

        {/* Timeline */}
        <section style={{ padding: "64px 24px" }}>
          <div className="page-container">
            <p className="section-label mb-3">— Timeline</p>
            <h2 className="heading-subsection" style={{ marginBottom: "28px" }}>
              Learning journey
            </h2>
            <div style={{ position: "relative", paddingLeft: "28px" }}>
              {/* Vertical line */}
              <div
                style={{
                  position: "absolute",
                  left: "7px",
                  top: "8px",
                  bottom: "8px",
                  width: "2px",
                  background: "rgba(26,24,20,0.1)",
                  borderRadius: "1px",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {timelineEvents.map((event, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "16px", position: "relative" }}>
                    {/* Dot */}
                    <div
                      style={{
                        position: "absolute",
                        left: "-24px",
                        top: "6px",
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: i === 0 ? "#1A1814" : "rgba(26,24,20,0.15)",
                        border: "2px solid var(--color-page)",
                      }}
                    />
                    <div>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "var(--color-muted)",
                          display: "block",
                          marginBottom: "2px",
                        }}
                      >
                        {event.year}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "#1A1814",
                        }}
                      >
                        {event.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="page-container">
          <div style={{ borderTop: "1px solid rgba(26,24,20,0.08)" }} />
        </div>

        {/* Currently Listening */}
        <section style={{ padding: "64px 24px 80px" }}>
          <div className="page-container">
            <p className="section-label mb-3">— Currently Listening</p>
            <h2 className="heading-subsection" style={{ marginBottom: "24px" }}>
              Design soundtrack
            </h2>
            <div style={{ maxWidth: "320px" }}>
              <VinylPlayer />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "0 24px 80px" }}>
          <div className="page-container">
            <div
              style={{
                background: "#1A1814",
                borderRadius: "24px",
                padding: "56px 48px",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
              }}
              className="md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", marginBottom: "10px" }}>
                  Have a project in mind?
                </p>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.15, textTransform: "uppercase" }}>
                  Open to full-time roles &<br />select freelance projects.
                </h2>
              </div>
              <Link
                href="/#contact"
                style={{ flexShrink: 0, background: "#EDE8DF", color: "#1A1814", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "13px", padding: "12px 24px", borderRadius: "999px", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}
              >
                Get in touch ↗
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
