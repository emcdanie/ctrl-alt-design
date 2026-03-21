"use client";

import { useState } from "react";
import Link from "next/link";

interface Role {
  title: string;
  company: string;
  period: string;
  isCurrent?: boolean;
  highlights: string[];
  logoSrc?: string;
  logoBg?: string;
  caseStudySlug?: string;
  caseStudyLabel?: string;
}

const roles: Role[] = [
  {
    title: "Product Designer — Design Systems",
    company: "Brad Frost Web (Maker Program)",
    period: "Oct 2025 — Present",
    isCurrent: true,
    logoSrc: "/images/logos/bradfrostwebjpeg.jpeg",
    logoBg: "#1A1A1A",
    caseStudySlug: "case-study/brad-frost",
    caseStudyLabel: "Code First — View case study →",
    highlights: [
      "**Built a production-ready Figma component library** aligned with Brad Frost's Atomic Design methodology — atoms, molecules, organisms, and templates across a real client design system.",
      "**Connected Figma to MCP** (Model Context Protocol) to enable AI-assisted design system investigation — demonstrated live alongside Brad Frost and TJ Pitre in a recorded session.",
      "**Established component governance** criteria: ownership rules, documentation structure, and the decision framework for when to extend versus build feature-specific solutions.",
      "**Worked code-first** — traced prop structures in Storybook, aligned Figma variant names to code, and closed the token chain from primitive → semantic → component.",
    ],
  },
  {
    title: "UX/UI Designer — Product & Design Systems",
    company: "BizAway",
    period: "Jul 2024 — Feb 2026",
    logoSrc: "/images/logos/bizaway_logo.jpeg",
    logoBg: "#F0F4FF",
    caseStudySlug: "case-studies/design-system-transformation",
    caseStudyLabel: "From Drift to Foundation →",
    highlights: [
      "**Led the full UX transformation** of a B2B SaaS travel platform — redesigning booking flows across flights, car rentals, finance, admin, and multi-role dashboards from the ground up.",
      "**Built the company's first scalable design system** — token architecture, reusable component library, and theme support, with tokens integrated directly into production code by engineering.",
      "**Redesigned 5+ end-to-end booking verticals** — search, filtering, sorting, seat selection, and post-booking management — with consistent interaction patterns across a complex multi-team product.",
      "**Delivered investor-grade prototypes** for executive presentations that contributed to funding rounds and accelerated product team expansion.",
    ],
  },
  {
    title: "Product Designer — Data Dashboard (Contract)",
    company: "United Nations Office at Geneva (UNOG ICTS)",
    period: "Oct 2025 — Dec 2025",
    logoSrc: "/images/logos/united_nations_office_at_geneva_logo.jpeg",
    logoBg: "#E8F0FA",
    caseStudySlug: "case-studies/un-operational-dashboard",
    caseStudyLabel: "Designing Operational Clarity →",
    highlights: [
      "**Designed a high-fidelity operational dashboard** for the UN ICT division — translating complex multi-team workflows into clear data visualisations and role-based analytics interfaces.",
      "**Delivered within an 8-week contract** — from stakeholder interviews and IA definition through interactive prototype and annotated engineering handoff specs.",
      "**Mapped 6+ operational domains** into a unified interface — making siloed data accessible and legible to both technical and non-technical users across the organisation.",
      "**Created reusable component patterns** for a high-stakes enterprise environment with strict accessibility and multi-role usage requirements.",
    ],
  },
  {
    title: "UX/UI Designer",
    company: "VML",
    period: "Feb 2023 — Feb 2024",
    logoSrc: "/images/logos/vml.png",
    logoBg: "#FFF0F0",
    highlights: [
      "**Designed across multiple industry verticals** — mobile-native apps, digital products, and client-facing platforms from wireframes through production-ready high-fidelity prototypes.",
      "**Grounded decisions in research** — UX benchmarking, usability evaluations, and user interviews to challenge assumptions before committing to a design direction.",
      "**Partnered directly with engineering** on design QA and handoff documentation to close the gap between design intent and built output.",
      "**Contributed to new business pitches** — translating complex briefs into clear UX frameworks within tight turnaround timelines.",
    ],
  },
];

function BoldLead({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} style={{ fontWeight: 700, color: "#1A1814" }}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

interface ExperienceSectionProps {
  onResumeClick?: () => void;
}

export default function ExperienceSection({ onResumeClick }: ExperienceSectionProps) {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <section id="experience" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="section-label mb-3">— Track Record</p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 400,
                color: "#1A1814",
                lineHeight: 1.1,
              }}
            >
              Experience
            </h2>
          </div>
          {onResumeClick && (
            <button
              onClick={onResumeClick}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 600,
                color: "#EDE8DF",
                border: "none",
                borderRadius: "999px",
                padding: "12px 24px",
                background: "#1A1814",
                cursor: "pointer",
                transition: "background 150ms ease, box-shadow 150ms ease",
                boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#3A3430";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#1A1814";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.15)";
              }}
            >
              Download Resume
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 2v7M4 7l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Expandable role cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {roles.map((role, i) => {
            const isOpen = expanded === i;
            return (
              <div
                key={role.title + role.company}
                style={{
                  borderRadius: "16px",
                  border: "1px solid rgba(26,24,20,0.10)",
                  background: isOpen ? "#FFFFFF" : "#F8F7F4",
                  boxShadow: isOpen
                    ? "0 4px 24px rgba(0,0,0,0.08)"
                    : "0 1px 4px rgba(0,0,0,0.04)",
                  overflow: "hidden",
                  transition: "background 200ms ease, box-shadow 200ms ease",
                }}
                onMouseEnter={e => {
                  if (!isOpen) {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                    (e.currentTarget as HTMLDivElement).style.background = "#FAFAF8";
                  }
                }}
                onMouseLeave={e => {
                  if (!isOpen) {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                    (e.currentTarget as HTMLDivElement).style.background = "#F8F7F4";
                  }
                }}
              >
                {/* Card header — always visible, clickable */}
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
                    {/* Logo */}
                    <div style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      background: role.logoBg || "#E8E4DC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      overflow: "hidden",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }}>
                      {role.logoSrc ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={role.logoSrc}
                          alt={role.company}
                          style={{ width: "80%", height: "80%", objectFit: "contain" }}
                          onError={e => { (e.currentTarget.parentElement as HTMLElement).style.background = "#E8E4DC"; e.currentTarget.style.display = "none"; }}
                        />
                      ) : (
                        <span style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "#1A1A1A" }}>
                          {role.company.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Role summary */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "16px",
                          fontWeight: 600,
                          color: "#1A1814",
                          lineHeight: 1.3,
                        }}>
                          {role.title}
                        </span>
                        {role.isCurrent && (
                          <span style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "#FFFFFF",
                            background: "#1A1A1A",
                            borderRadius: "999px",
                            padding: "2px 8px",
                          }}>
                            NOW
                          </span>
                        )}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        color: "#8A8480",
                        marginTop: "2px",
                      }}>
                        {role.company} · {role.period}
                      </div>
                    </div>
                  </div>

                  {/* Chevron */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    style={{
                      flexShrink: 0,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 250ms ease",
                      color: "#8A8480",
                    }}
                    aria-hidden="true"
                  >
                    <path d="M4.5 7l4.5 4.5L13.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div style={{ padding: "0 24px 28px", borderTop: "1px solid rgba(26,24,20,0.06)" }}>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "20px" }}>
                      {role.highlights.map((h, hi) => (
                        <li
                          key={hi}
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "15px",
                            color: "#4A4640",
                            lineHeight: 1.75,
                            display: "flex",
                            gap: "10px",
                          }}
                        >
                          <span style={{ color: "#CCCCCC", flexShrink: 0, marginTop: "1px" }}>—</span>
                          <span><BoldLead text={h} /></span>
                        </li>
                      ))}
                    </ul>
                    {role.caseStudySlug && (
                      <Link
                        href={`/${role.caseStudySlug}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          marginTop: "20px",
                          fontFamily: "var(--font-body)",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#1A1814",
                          textDecoration: "underline",
                          textUnderlineOffset: "3px",
                          opacity: 0.6,
                          transition: "opacity 150ms ease",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}
                      >
                        {role.caseStudyLabel}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Education */}
        <div style={{ marginTop: "72px" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 400,
            color: "#1A1814",
            lineHeight: 1.1,
            marginBottom: "40px",
          }}>
            Education
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {[
              {
                period: "2022 — 2023",
                name: "Ironhack",
                degree: "UX/UI Design Bootcamp",
                logo: "/images/logos/Ironhack.png",
                logoBg: "#1A1A1A",
              },
              {
                period: "2005 — 2009",
                name: "Arizona State University",
                degree: "BSc in Design, GPA: 3.9/4.0",
                logo: "/images/logos/ASU-logo.png",
                logoBg: "#8C1D40",
              },
            ].map((edu) => (
              <div key={edu.name} className="grid grid-cols-1 sm:grid-cols-[180px_1fr]" style={{ gap: "32px" }}>
                <div style={{ paddingTop: "2px" }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "10px",
                    background: edu.logoBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "8px",
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={edu.logo}
                      alt={edu.name}
                      style={{ width: "80%", height: "80%", objectFit: "contain" }}
                    />
                  </div>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#8A8480", fontWeight: 500 }}>
                    {edu.period}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 600, color: "#1A1814", lineHeight: 1.2, marginBottom: "4px" }}>
                    {edu.name}
                  </h3>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "#8A8480" }}>{edu.degree}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
