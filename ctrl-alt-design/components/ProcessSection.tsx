"use client";

import { useState } from "react";
import Link from "next/link";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  bg: string;
  textColor: string;
  artifactCaption: string;
  caseStudySlug: string;
  caseStudyLabel: string;
}

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery & Research",
    description: "Deep-dive into user needs, business goals, and technical constraints. Workshops, interviews, and competitive audits.",
    bg: "#E8B86D",
    textColor: "#5A3A10",
    artifactCaption: "Mapped system dependencies across infrastructure domains during the UN PRISM project, revealing hidden operational relationships that informed the dashboard architecture.",
    caseStudySlug: "un-operational-dashboard",
    caseStudyLabel: "Designing Operational Clarity →",
  },
  {
    number: "02",
    title: "Structure & Systems",
    description: "Information architecture, user flows, and content hierarchies. Making sense of complexity before touching pixels.",
    bg: "#C8D97A",
    textColor: "#3A4A10",
    artifactCaption: "Designed a hierarchical filtering architecture to simplify configuration workflows in a complex SaaS interface.",
    caseStudySlug: "filters-decision-support-system",
    caseStudyLabel: "Filters Are a Decision-Support System →",
  },
  {
    number: "03",
    title: "Design Systems",
    description: "Token-based component libraries, design language definition, and scalable patterns built to last.",
    bg: "#7DC4C4",
    textColor: "#10404A",
    artifactCaption: "Built token-based component architecture and design documentation to align design and engineering across a scaling SaaS platform.",
    caseStudySlug: "design-system-transformation",
    caseStudyLabel: "From Drift to Foundation →",
  },
  {
    number: "04",
    title: "Prototyping & Validation",
    description: "Interactive prototypes tested with real users. Iterating fast based on observed behaviour, not assumptions.",
    bg: "#E8A0A0",
    textColor: "#5A1A1A",
    artifactCaption: "Interactive prototype used to validate operational workflows with stakeholders before engineering implementation began.",
    caseStudySlug: "un-operational-dashboard",
    caseStudyLabel: "Designing Operational Clarity →",
  },
  {
    number: "05",
    title: "Delivery & Documentation",
    description: "Handoff-ready specs, developer notes, design documentation, and ongoing support through build.",
    bg: "#B8A8D8",
    textColor: "#2A1A5A",
    artifactCaption: "Governance documentation and implementation guidance created to support development and reduce UI drift over time.",
    caseStudySlug: "design-system-transformation",
    caseStudyLabel: "From Drift to Foundation →",
  },
];

export default function ProcessSection() {
  // Track which card is expanded (for mobile tap)
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

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
          {steps.map((step, idx) => {
            const isExpanded = expandedIdx === idx;

            return (
              <div
                key={step.number}
                className="rounded-2xl min-h-[220px] relative overflow-hidden cursor-pointer group"
                style={{ backgroundColor: step.bg }}
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
              >
                {/* ── Default state ─────────────────────────────── */}
                <div
                  className={`absolute inset-0 p-5 flex flex-col justify-between transition-opacity duration-300 ${
                    isExpanded ? "opacity-0 pointer-events-none" : "opacity-100 md:group-hover:opacity-0"
                  }`}
                >
                  <div
                    className="font-display font-normal text-4xl leading-none"
                    style={{ color: step.textColor, opacity: 0.6 }}
                  >
                    {step.number}
                  </div>
                  <div>
                    <h3
                      className="font-display font-bold mb-2 leading-snug"
                      style={{ color: step.textColor, fontSize: "16px" }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="leading-relaxed"
                      style={{ color: step.textColor, opacity: 0.75, fontSize: "13px" }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* ── Hover / expanded state ─────────────────────── */}
                <div
                  className={`absolute inset-0 p-5 flex flex-col justify-end transition-opacity duration-300 ${
                    isExpanded ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"
                  }`}
                  style={{
                    background: `linear-gradient(to top, ${step.bg} 0%, ${step.bg}CC 60%, transparent 100%)`,
                  }}
                >
                  {/* Artifact placeholder — replaces with image when available */}
                  <div
                    className="absolute inset-0 -z-10 opacity-20"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                      backgroundSize: "30px",
                    }}
                  />

                  <div
                    className="translate-y-1 transition-transform duration-300 group-hover:translate-y-0"
                    style={{ color: step.textColor }}
                  >
                    <p className="leading-snug mb-3 opacity-90" style={{ fontSize: "13px" }}>
                      {step.artifactCaption}
                    </p>
                    <Link
                      href={`/case-studies/${step.caseStudySlug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-semibold underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity"
                      style={{ fontSize: "13px", color: step.textColor }}
                    >
                      {step.caseStudyLabel}
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
