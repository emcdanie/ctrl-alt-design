"use client";

import Link from "next/link";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  artifactCaption: string;
  caseStudySlug: string;
  caseStudyLabel: string;
  color: string;
  hoverColor: string;
  accentColor: string;
}

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery & Research",
    description: "Deep-dive into user needs, business goals, and technical constraints. Workshops, interviews, and competitive audits.",
    artifactCaption: "Mapped system dependencies across infrastructure domains during the UN PRISM project, revealing hidden operational relationships that informed the dashboard architecture.",
    caseStudySlug: "un-operational-dashboard",
    caseStudyLabel: "Designing Operational Clarity →",
    color: "#E8F2FA",
    hoverColor: "#D4E8F5",
    accentColor: "#3A7DB5",
  },
  {
    number: "02",
    title: "Structure & Systems",
    description: "Information architecture, user flows, and content hierarchies. Making sense of complexity before touching pixels.",
    artifactCaption: "Designed a hierarchical filtering architecture to simplify configuration workflows in a complex SaaS interface.",
    caseStudySlug: "filters-decision-support-system",
    caseStudyLabel: "Filters Are a Decision-Support System →",
    color: "#FDF3E3",
    hoverColor: "#FAE8CC",
    accentColor: "#C07A2A",
  },
  {
    number: "03",
    title: "Design Systems",
    description: "Token-based component libraries, design language definition, and scalable patterns built to last.",
    artifactCaption: "Built token-based component architecture and design documentation to align design and engineering across a scaling SaaS platform.",
    caseStudySlug: "design-system-transformation",
    caseStudyLabel: "From Drift to Foundation →",
    color: "#F0EDF8",
    hoverColor: "#E3DDF3",
    accentColor: "#6B5CA5",
  },
  {
    number: "04",
    title: "Prototyping & Validation",
    description: "Interactive prototypes tested with real users. Iterating fast based on observed behaviour, not assumptions.",
    artifactCaption: "Interactive prototype used to validate operational workflows with stakeholders before engineering implementation began.",
    caseStudySlug: "un-operational-dashboard",
    caseStudyLabel: "Designing Operational Clarity →",
    color: "#EBF5EC",
    hoverColor: "#D9EDD9",
    accentColor: "#3A8A42",
  },
  {
    number: "05",
    title: "Delivery & Documentation",
    description: "Handoff-ready specs, developer notes, design documentation, and ongoing support through build.",
    artifactCaption: "Governance documentation and implementation guidance created to support development and reduce UI drift over time.",
    caseStudySlug: "design-system-transformation",
    caseStudyLabel: "From Drift to Foundation →",
    color: "#FAF0EC",
    hoverColor: "#F5E3DB",
    accentColor: "#B55A3A",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="section-label mb-3">— My Approach</p>
            <h2 className="font-display font-extrabold text-[#1A1814] leading-tight" style={{ fontSize: "clamp(32px, 5vw, 48px)" }}>
              My Process
            </h2>
          </div>
          <p className="text-[16px] text-[#8A8480] max-w-xs sm:text-right leading-relaxed">
            A structured approach that brings order to ambiguity — from first question to final handoff.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl min-h-[220px] relative overflow-hidden group border border-white/60 shadow-[0_8px_24px_rgba(44,24,16,0.05),0_2px_6px_rgba(44,24,16,0.03),inset_0_1px_0_rgba(255,255,255,0.85)]"
              style={{
                background: step.color,
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            >
              {/* Default state */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "52px",
                    fontWeight: 700,
                    color: step.accentColor,
                    opacity: 0.25,
                    lineHeight: 1,
                  }}
                >
                  {step.number}
                </div>
                <div>
                  <h3 style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1A1A1A",
                    marginBottom: "8px",
                    lineHeight: 1.3,
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "14px",
                    color: "#666666",
                    lineHeight: 1.6,
                  }}>
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Hover state */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ background: step.hoverColor }}>
                <div>
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    color: "#2C2C2C",
                    lineHeight: 1.6,
                    marginBottom: "12px",
                  }}>
                    {step.artifactCaption}
                  </p>
                  <Link
                    href={`/case-studies/${step.caseStudySlug}`}
                    className="font-semibold underline underline-offset-2 hover:opacity-70 transition-opacity"
                    style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#1A1A1A" }}
                  >
                    {step.caseStudyLabel}
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
