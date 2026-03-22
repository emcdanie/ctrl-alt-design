"use client";

import { useState } from "react";
import LogoContainer from "@/components/LogoContainer";
import ExperienceCard from "@/components/ExperienceCard";

const roles = [
  {
    title: "Product Designer — Design Systems",
    company: "Brad Frost Web (Maker Program)",
    period: "Oct 2025 — Present",
    isCurrent: true,
    logoSrc: "/images/logos/bradfrostwebjpeg.jpeg",
    logoBg: "#1A1A1A",
    caseStudySlug: "case-studies/brad-frost",
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

const education = [
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
];

interface ExperienceSectionProps {
  onResumeClick?: () => void;
}

interface SectionShellProps {
  id: string;
  children: React.ReactNode;
}

function SectionShell({ id, children }: SectionShellProps) {
  return (
    <section id={id} className="px-6 py-20">
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  label: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

function SectionHeader({ label, title, description, action }: SectionHeaderProps) {
  return (
    <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="section-label mb-3">{label}</p>
        <h2 className="heading-section">
          {title}
        </h2>
        {description && (
          <p className="body-base mt-3 max-w-xl" style={{ color: "var(--color-muted)" }}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export default function ExperienceSection({ onResumeClick }: ExperienceSectionProps) {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <SectionShell id="experience">
      <SectionHeader
        label="— Track Record"
        title="Experience"
        action={
          onResumeClick ? (
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
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#3A3430";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1A1814";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.15)";
              }}
            >
              Download Resume
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 2v7M4 7l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : null
        }
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {roles.map((role, i) => (
          <ExperienceCard
            key={role.title + role.company}
            {...role}
            isOpen={expanded === i}
            onToggle={() => setExpanded(expanded === i ? null : i)}
          />
        ))}
      </div>

      <div style={{ marginTop: "72px" }}>
        <h2 className="heading-subsection" style={{ marginBottom: "40px" }}>
          Education
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {education.map((edu) => (
            <div
              key={edu.name}
              className="grid grid-cols-1 gap-8 sm:grid-cols-[180px_1fr]"
            >
              <div style={{ paddingTop: "2px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <LogoContainer src={edu.logo} alt={edu.name} bg={edu.logoBg} size={48} />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "#8A8480",
                    fontWeight: 500,
                  }}
                >
                  {edu.period}
                </span>
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#1A1814",
                    lineHeight: 1.2,
                    marginBottom: "4px",
                  }}
                >
                  {edu.name}
                </h3>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "15px", color: "#8A8480" }}>
                  {edu.degree}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}