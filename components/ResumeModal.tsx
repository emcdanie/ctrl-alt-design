"use client";

import { useEffect, useRef } from "react";
import { social } from "@/lib/social";

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

const skills = [
  "Product Design", "Interaction Design", "UX Strategy", "Data Visualization",
  "Design Systems", "Token Architecture", "Component Libraries", "Figma (Advanced)",
  "Prototyping", "Information Architecture", "User Research", "Usability Testing",
  "Accessibility", "Agile / Scrum", "Multi-role Dashboards", "Cross-functional Collaboration",
];

const education = [
  {
    period: "2022 — 2023",
    institution: "Ironhack",
    degree: "UX/UI Design",
  },
  {
    period: "2005 — 2009",
    institution: "Arizona State University",
    degree: "Bachelors of Science in Design, GPA: 3.9/4.0",
  },
];

const roles = [
  {
    period: "Oct 2025 — Current",
    title: "Product Designer — Design Systems",
    company: "Brad Frost Web (Maker Program)",
    highlights: [
      "Building a scalable Figma component library aligned with Brad Frost's Atomic Design methodology, contributing to a production-ready design system used across client web interfaces.",
      "Defining reusable UI components and interaction patterns to support consistent implementation, with direct input into accessibility standards and usage documentation.",
      "Contributing to design system governance: component ownership criteria, documentation structure, and the framework for deciding when to extend the system versus build feature-specific solutions.",
      "Working closely with front-end developers to validate feasibility and ensure design decisions.",
    ],
  },
  {
    period: "Apr 2026 — Jul 2026",
    title: "Design Systems Specialist",
    company: "Mango (Contract)",
    highlights: [
      "Owned cross-platform component governance across Web, iOS, and Android — defining, governing, and releasing reusable components across multiple shared Figma libraries, documented in Zeroheight.",
      "Established AI-assisted design-system workflows with Claude, Figma MCP, and the Desktop Bridge — enabling automated audits, machine-readable component patterns, and scalable documentation.",
      "Led design-to-code parity initiatives — bridging Figma and production codebases so the system stays true across design and build.",
      "Ran accessibility and dark-mode audits across the system, and defined metrics for adoption, coverage, efficiency, and quality.",
    ],
  },
  {
    period: "July 2024 — Feb 2026",
    title: "UX/UI Designer — Product & Design Systems",
    company: "***REMOVED***",
    highlights: [
      "Led the UX transformation of a complex B2B SaaS travel platform — redesigning the booking foundation across flights, car rentals, finance, admin, and multi-role dashboards.",
      "Built and implemented the company's first scalable design system from scratch: token architecture, reusable component library, and theme support, with tokens integrated directly into production code.",
      "Re-architected end-to-end booking verticals including search, filtering, sorting, seat selection, and post-booking management — designing consistent interaction patterns across API and edge-case constraints.",
      "Delivered high-fidelity prototypes for executive and investor presentations, contributing to funding that accelerated product development and team expansion.",
    ],
  },
  {
    period: "Oct 2025 — Dec 2025",
    title: "Product Designer — Data Dashboard Prototype (Contract)",
    company: "A UN agency — Geneva (contract)",
    highlights: [
      "Designed a high-fidelity dashboard prototype supporting operational transparency across multiple UN teams — translating complex organisational workflows into clear data visualisations and interactive analytics interfaces.",
      "Conducted stakeholder interviews and requirements gathering across technical and non-technical users to define information architecture and layout structure.",
      "Created modular UI components and scalable layout patterns suited to a high-stakes, multi-role enterprise environment with strict accessibility and usability requirements.",
    ],
  },
  {
    period: "Feb 2023 — Feb 2024",
    title: "UX/UI Designer",
    company: "VML",
    highlights: [
      "Designed mobile-native interfaces and digital products for client-facing applications, from wireframes through high-fidelity prototypes.",
      "Conducted UX research, benchmarking, and usability evaluations; collaborated cross-functionally with product managers and developers to ensure consistent implementation of user-centred designs.",
    ],
  },
];

export default function ResumeModal({ open, onClose }: ResumeModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Focus management — capture opener, focus the dialog, restore on close */
  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement as HTMLElement | null;
      closeBtnRef.current?.focus();
    } else {
      openerRef.current?.focus();
      openerRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[color:var(--modal-backdrop)] modal-backdrop" onClick={onClose} />

      {/* Modal */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-modal-title"
        className="relative bg-[color:var(--surface-paper)] rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl"
      >

        {/* Header */}
        <div className="bg-[color:var(--surface-paper)] border-b border-[color:var(--ink-on-paper-border)] px-8 py-5 flex items-center justify-between rounded-t-3xl flex-shrink-0">
          <div>
            <p className="section-label mb-1">Curriculum Vitae</p>
            <h2 id="resume-modal-title" className="font-display font-bold text-[length:var(--typography-font-size-lg)] text-[color:var(--ink-on-paper)] leading-tight">
              Elleta McDaniel
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* PDF download — enabled once /public/cv/Elleta_McDaniel_Product_Designer_CV.pdf is added */}
            <span
              className="bg-[color:var(--ink-on-paper-border)] text-[var(--color-semantic-text-inverse)]/50 text-[length:var(--typography-font-size-tag)] font-medium px-4 py-2 rounded-full cursor-not-allowed select-none"
              title="PDF coming soon"
              aria-disabled="true"
            >
              Download PDF
            </span>
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[color:var(--ink-on-paper-border)] hover:bg-[color:var(--ink-on-paper-border)] transition-colors cursor-pointer text-[color:var(--ink-on-paper-soft)] text-[length:var(--typography-font-size-base)]"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto no-scrollbar px-8 py-7 space-y-7">

          {/* Name + contact */}
          <div>
            {/* h2 (not h1) — the page h1 stays unique; dialog title is the header h2 */}
            <h2 className="font-display font-bold text-[length:var(--typography-font-size-2xl)] text-[color:var(--ink-on-paper)] leading-snug mb-0.5">
              Elleta McDaniel
            </h2>
            <p className="text-[length:var(--typography-font-size-tag)] text-[color:var(--ink-on-paper-soft)] font-medium mb-2">
              Product Designer — Design Systems, Data Platforms &amp; Complex UX
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[length:var(--typography-font-size-tag)] text-[color:var(--ink-on-paper-muted)]">
              <span>Barcelona, Spain</span>
              <span>·</span>
              <span>Open to Hybrid/Remote</span>
              <span>·</span>
              <a href="mailto:elletamc@gmail.com" className="hover:text-[color:var(--ink-on-paper)] transition-colors">elletamc@gmail.com</a>
              <span>·</span>
              <span>+34 633287939</span>
              <span>·</span>
              <a href={social.linkedin} className="hover:text-[color:var(--ink-on-paper)] transition-colors">linkedin.com/in/elleta-mcdaniel</a>
            </div>
          </div>

          <div className="divider" />

          {/* Profile */}
          <div>
            <p className="section-label mb-3">Profile</p>
            <p className="text-[length:var(--typography-font-size-base)] text-[color:var(--ink-on-paper-soft)] leading-relaxed">
              Product designer with a focus on design systems, platform architecture, and complex multi-role interfaces.
              I work at the intersection of system-level thinking and engineering collaboration, building scalable component
              libraries, defining interaction patterns, and creating governance frameworks that reduce repeated
              decision-making across teams. My work spans B2B SaaS booking platforms, internal tooling, and data-dense
              dashboards for high-stakes environments. I&apos;m as comfortable working upstream on system architecture as
              I am deep in component states and accessibility logic.
            </p>
          </div>

          <div className="divider" />

          {/* Skills */}
          <div>
            <p className="section-label mb-3">Skills</p>
            <p className="text-[length:var(--typography-font-size-base)] text-[color:var(--ink-on-paper-soft)] leading-relaxed">
              {skills.join(" · ")}
            </p>
          </div>

          <div className="divider" />

          {/* Education */}
          <div>
            <p className="section-label mb-4">Education</p>
            <div className="space-y-4">
              {education.map((ed) => (
                <div key={ed.institution} className="grid grid-cols-[120px_1fr] gap-4">
                  <span className="text-[length:var(--typography-font-size-tag)] text-[color:var(--ink-on-paper-muted)] font-medium pt-0.5">{ed.period}</span>
                  <div>
                    <p className="text-[length:var(--typography-font-size-tag)] font-semibold text-[color:var(--ink-on-paper)]">{ed.institution}</p>
                    <p className="text-[length:var(--typography-font-size-tag)] text-[color:var(--ink-on-paper-soft)]">{ed.degree}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* Employment */}
          <div>
            <p className="section-label mb-4">Employment</p>
            <div className="space-y-6">
              {roles.map((role) => (
                <div key={role.title + role.company} className="grid grid-cols-[120px_1fr] gap-4">
                  <span className="text-[length:var(--typography-font-size-tag)] text-[color:var(--ink-on-paper-muted)] font-medium pt-0.5 leading-snug">{role.period}</span>
                  <div>
                    <p className="text-[length:var(--typography-font-size-tag)] font-semibold text-[color:var(--ink-on-paper)] leading-snug">
                      {role.title}{" "}
                      <span className="font-normal text-[color:var(--ink-on-paper-soft)]">@ {role.company}</span>
                    </p>
                    <ul className="mt-2 space-y-1">
                      {role.highlights.map((h) => (
                        <li key={h} className="text-[length:var(--typography-font-size-base)] text-[color:var(--ink-on-paper-soft)] leading-relaxed flex gap-2">
                          <span className="text-[color:var(--ink-on-paper-muted)] flex-shrink-0">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}
