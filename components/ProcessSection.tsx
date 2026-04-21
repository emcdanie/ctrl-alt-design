"use client";

import { useState } from "react";
import Link from "next/link";

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  artifactCaption: string;
  caseStudySlug: string;
  caseStudyLabel: string;
  accentColor: string;
}

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery & Research",
    description:
      "Deep-dive into user needs, business goals, and technical constraints. Workshops, interviews, and competitive audits.",
    artifactCaption:
      "Mapped system dependencies across infrastructure domains during the UN ***REMOVED*** project, revealing hidden operational relationships that informed the dashboard architecture.",
    caseStudySlug: "un-operational-dashboard",
    caseStudyLabel: "Designing Operational Clarity →",
    accentColor: "#3A7DB5",
  },
  {
    number: "02",
    title: "Structure & Systems",
    description:
      "Information architecture, user flows, and content hierarchies. Making sense of complexity before touching pixels.",
    artifactCaption:
      "Designed a hierarchical filtering architecture to simplify configuration workflows in a complex SaaS interface.",
    caseStudySlug: "filters-decision-support-system",
    caseStudyLabel: "Filters Are a Decision-Support System →",
    accentColor: "#C07A2A",
  },
  {
    number: "03",
    title: "Design Systems",
    description:
      "Token-based component libraries, design language definition, and scalable patterns built to last.",
    artifactCaption:
      "Built token-based component architecture and design documentation to align design and engineering across a scaling SaaS platform.",
    caseStudySlug: "design-system-transformation",
    caseStudyLabel: "From Drift to Foundation →",
    accentColor: "#6B5CA5",
  },
  {
    number: "04",
    title: "Prototyping & Validation",
    description:
      "Interactive prototypes tested with real users. Iterating fast based on observed behaviour, not assumptions.",
    artifactCaption:
      "Interactive prototype used to validate operational workflows with stakeholders before engineering implementation began.",
    caseStudySlug: "un-operational-dashboard",
    caseStudyLabel: "Designing Operational Clarity →",
    accentColor: "#3A8A42",
  },
  {
    number: "05",
    title: "Delivery & Documentation",
    description:
      "Handoff-ready specs, developer notes, design documentation, and ongoing support through build.",
    artifactCaption:
      "Governance documentation and implementation guidance created to support development and reduce UI drift over time.",
    caseStudySlug: "design-system-transformation",
    caseStudyLabel: "From Drift to Foundation →",
    accentColor: "#B55A3A",
  },
];

const HEADER_ID = (step: string) => `process-step-${step}-header`;
const REGION_ID = (step: string) => `process-step-${step}-panel`;

export default function ProcessSection() {
  // One item open at a time; first item open by default so the section
  // renders with content, not just collapsed headers.
  const [openNumber, setOpenNumber] = useState<string | null>(steps[0].number);

  const toggle = (number: string) =>
    setOpenNumber((current) => (current === number ? null : number));

  return (
    <section id="process" className="layout-section">
      <div className="layout-container">
        {/* Header */}
        <div className="layout-header flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="section-label mb-3">— My Approach</p>
            <h2 className="heading-section">My Process</h2>
          </div>
          <p className="body-lg max-w-xs sm:text-right" style={{ color: "var(--color-muted)" }}>
            A structured approach that brings order to ambiguity — from first question to final handoff.
          </p>
        </div>

        {/* Accordion — one open at a time, first open by default. */}
        <div className="process-accordion" role="list">
          {steps.map((step) => {
            const isOpen = openNumber === step.number;
            const headerId = HEADER_ID(step.number);
            const regionId = REGION_ID(step.number);

            return (
              <div
                key={step.number}
                role="listitem"
                className="process-accordion-item"
              >
                <h3 className="process-accordion-heading">
                  <button
                    type="button"
                    id={headerId}
                    aria-expanded={isOpen}
                    aria-controls={regionId}
                    onClick={() => toggle(step.number)}
                    className="process-accordion-trigger"
                  >
                    <span
                      className="process-accordion-number"
                      style={{ color: step.accentColor }}
                      aria-hidden="true"
                    >
                      {step.number}
                    </span>
                    <span className="process-accordion-title">{step.title}</span>
                    <span
                      className="process-accordion-chevron"
                      data-open={isOpen}
                      aria-hidden="true"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M4 6l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </h3>

                <section
                  id={regionId}
                  role="region"
                  aria-labelledby={headerId}
                  className="process-accordion-panel"
                  data-open={isOpen}
                >
                  <div className="process-accordion-panel-inner">
                    <p className="process-accordion-description">
                      {step.description}
                    </p>
                    <p className="process-accordion-artifact">
                      {step.artifactCaption}
                    </p>
                    <Link
                      href={`/case-studies/${step.caseStudySlug}`}
                      className="process-accordion-link"
                    >
                      {step.caseStudyLabel}
                    </Link>
                  </div>
                </section>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
