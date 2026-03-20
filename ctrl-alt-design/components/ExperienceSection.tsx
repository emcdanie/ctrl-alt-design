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
    logoSrc: "/images/logos/brad-frost.png",
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
    logoSrc: "/images/logos/bizaway.png",
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
    logoSrc: "/images/logos/un.png",
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

// Renders inline **bold** markdown anywhere in the string
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
                    width: "48px",
                    height: "48px",
                    borderRadius: "10px",
                    background: role.logoBg || "#E8E4DC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}>
                    {role.logoSrc ? (
                      <img
                        src={role.logoSrc}
                        alt={role.company}
                        style={{ width: "30px", height: "30px", objectFit: "contain" }}
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
                logo: "/images/logos/ironhack.png",
                logoBg: "#1A1A1A",
              },
              {
                period: "2005 — 2009",
                name: "Arizona State University",
                degree: "BSc in Design, GPA: 3.9/4.0",
                logo: "/images/logos/asu.png",
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
                    <img
                      src={edu.logo}
                      alt={edu.name}
                      style={{ width: "30px", height: "30px", objectFit: "contain" }}
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
