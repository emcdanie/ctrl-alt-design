"use client";

import Link from "next/link";
import Image from "next/image";

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
    logoSrc: "https://logo.clearbit.com/bradfrost.com",
    logoBg: "#1A1A1A",
    caseStudySlug: "case-study/brad-frost",
    caseStudyLabel: "View project →",
    highlights: [
      "Building a scalable Figma component library aligned with Brad Frost's Atomic Design methodology, contributing to a production-ready design system used across client web interfaces.",
      "Defining reusable UI components and interaction patterns to support consistent implementation, with direct input into accessibility standards and usage documentation.",
      "Contributing to design system governance: component ownership criteria, documentation structure, and the framework for deciding when to extend versus build feature-specific solutions.",
      "Applying Atomic Design principles (atoms → molecules → organisms → templates) to create a component hierarchy that supports both design consistency and engineering reuse.",
    ],
  },
  {
    title: "UX/UI Designer — Product & Design Systems",
    company: "BizAway",
    period: "Jul 2024 — Feb 2026",
    logoSrc: "https://logo.clearbit.com/bizaway.com",
    logoBg: "#F0F4FF",
    caseStudySlug: "case-studies/design-system-transformation",
    caseStudyLabel: "From Drift to Foundation →",
    highlights: [
      "Led the UX transformation of a complex B2B SaaS travel platform — redesigning the booking foundation across flights, car rentals, finance, admin, and multi-role dashboards.",
      "Built and implemented the company's first scalable design system from scratch: token architecture, reusable component library, and theme support, with tokens integrated directly into production code.",
      "Re-architected end-to-end booking verticals including search, filtering, sorting, seat selection, and post-booking management — designing consistent interaction patterns across API and edge-case constraints.",
      "Delivered high-fidelity prototypes for executive and investor presentations, contributing to funding that accelerated product development and team expansion.",
    ],
  },
  {
    title: "Product Designer — Data Dashboard Prototype (Contract)",
    company: "United Nations Office at Geneva (UNOG ICTS)",
    period: "Oct 2025 — Dec 2025",
    logoSrc: "https://logo.clearbit.com/un.org",
    logoBg: "#E8F0FA",
    caseStudySlug: "case-studies/un-operational-dashboard",
    caseStudyLabel: "Designing Operational Clarity →",
    highlights: [
      "Designed a high-fidelity dashboard prototype supporting operational transparency across multiple UN teams — translating complex organisational workflows into clear data visualisations and interactive analytics interfaces.",
      "Conducted stakeholder interviews and requirements gathering across technical and non-technical users to define information architecture and layout structure.",
      "Created modular UI components and scalable layout patterns suited to a high-stakes, multi-role enterprise environment with strict accessibility and usability requirements.",
      "Delivered annotated design specs and a component usage guide to support engineering handoff within a compressed 8-week timeline.",
    ],
  },
  {
    title: "UX/UI Designer",
    company: "VML",
    period: "Feb 2023 — Feb 2024",
    logoSrc: "https://logo.clearbit.com/vml.com",
    logoBg: "#FFF0F0",
    highlights: [
      "Designed mobile-native interfaces and digital products for client-facing applications across multiple industry verticals, from wireframes through high-fidelity prototypes.",
      "Conducted UX research, benchmarking, and usability evaluations to ground design decisions in observed user behaviour rather than assumption.",
      "Collaborated cross-functionally with product managers and developers to ensure consistent implementation of user-centred designs through handoff documentation and design QA.",
      "Contributed to pitch and proposal materials for new business, translating complex briefs into clear UX frameworks and interaction concepts within tight turnaround timelines.",
    ],
  },
];

function BoldLead({ text }: { text: string }) {
  const dashIdx = text.indexOf(" — ");
  if (dashIdx === -1) return <span>{text}</span>;
  return (
    <>
      <strong style={{ fontWeight: 600, color: "#1A1A1A" }}>{text.slice(0, dashIdx)}</strong>
      <span>{text.slice(dashIdx)}</span>
    </>
  );
}

interface ExperienceSectionProps {
  onResumeClick?: () => void;
}

export default function ExperienceSection({ onResumeClick }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
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
                fontSize: "13px",
                fontWeight: 500,
                color: "#1A1814",
                border: "1px solid rgba(26,24,20,0.2)",
                borderRadius: "999px",
                padding: "8px 20px",
                background: "transparent",
                cursor: "pointer",
                transition: "background 150ms ease, color 150ms ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#1A1814";
                e.currentTarget.style.color = "#EDE8DF";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#1A1814";
              }}
              className="hidden sm:block"
            >
              Open full resume ↗
            </button>
          )}
        </div>

        {/* Roles */}
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {roles.map((role) => (
            <div
              key={role.title + role.company}
              style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                gap: "32px",
              }}
              className="grid-cols-1 sm:grid-cols-[180px_1fr]"
            >
              {/* Left — period + logo */}
              <div style={{ paddingTop: "2px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  {/* Company logo */}
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: role.logoBg || "#E8E4DC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}>
                    {role.logoSrc ? (
                      <img
                        src={role.logoSrc}
                        alt={role.company}
                        style={{ width: "24px", height: "24px", objectFit: "contain" }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          if (e.currentTarget.nextSibling) {
                            (e.currentTarget.nextSibling as HTMLElement).style.display = "flex";
                          }
                        }}
                      />
                    ) : null}
                    <span style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#1A1A1A",
                      lineHeight: 1,
                      display: role.logoSrc ? "none" : "flex",
                    }}>
                      {role.company.charAt(0)}
                    </span>
                  </div>
                  {role.isCurrent && (
                    <span style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase" as const,
                      color: "#FFFFFF",
                      background: "#1A1A1A",
                      borderRadius: "999px",
                      padding: "2px 8px",
                    }}>
                      NOW
                    </span>
                  )}
                </div>
                <span style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  color: "#8A8480",
                  fontWeight: 500,
                }}>
                  {role.period}
                </span>
              </div>

              {/* Right — role + highlights */}
              <div>
                <div style={{ marginBottom: "16px" }}>
                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    fontWeight: 600,
                    color: "#1A1814",
                    lineHeight: 1.2,
                    marginBottom: "4px",
                  }}>
                    {role.title}
                  </h3>
                  <span style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    color: "#8A8480",
                  }}>
                    {role.company}
                  </span>
                </div>
                <ul style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {role.highlights.map((h) => (
                    <li
                      key={h}
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "15px",
                        color: "#4A4640",
                        lineHeight: 1.65,
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      <span style={{ color: "#BBBBBB", flexShrink: 0, marginTop: "1px" }}>—</span>
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
                      marginTop: "16px",
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
            </div>
          ))}
        </div>

        {/* Education */}
        <div style={{ marginTop: "64px" }}>
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
                logo: "https://logo.clearbit.com/ironhack.com",
                logoBg: "#1A1A1A",
              },
              {
                period: "2005 — 2009",
                name: "Arizona State University",
                degree: "BSc in Design, GPA: 3.9/4.0",
                logo: "https://logo.clearbit.com/asu.edu",
                logoBg: "#8C1D40",
              },
            ].map((edu) => (
              <div key={edu.name} style={{
                display: "grid",
                gridTemplateColumns: "180px 1fr",
                gap: "32px",
              }}>
                <div style={{ paddingTop: "2px" }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: edu.logoBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "8px",
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.06)",
                  }}>
                    <img
                      src={edu.logo}
                      alt={edu.name}
                      style={{ width: "24px", height: "24px", objectFit: "contain" }}
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
