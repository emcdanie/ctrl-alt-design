"use client";

import { useEffect } from "react";

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
    period: "July 2024 — Feb 2026",
    title: "UX/UI Designer — Product & Design Systems",
    company: "BizAway",
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
    company: "United Nations Office at Geneva (UNOG ICTS)",
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
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1A1814]/70 modal-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[#FAFAF8] rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="bg-[#FAFAF8] border-b border-[#1A1814]/8 px-8 py-5 flex items-center justify-between rounded-t-3xl flex-shrink-0">
          <div>
            <p className="section-label mb-1">Curriculum Vitae</p>
            <h2 className="font-display font-bold text-[18px] text-[#1A1814] leading-tight">
              Elleta McDaniel
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/cv/Elleta_McDaniel_Product_Designer_CV.pdf"
              download
              className="bg-[#1A1814] text-[#EDE8DF] text-[13px] font-medium px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
            >
              Download PDF
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#1A1814]/12 hover:bg-[#1A1814]/8 transition-colors cursor-pointer text-[#4A4640] text-[16px]"
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
            <h1 className="font-display font-bold text-[22px] text-[#1A1814] leading-snug mb-0.5">
              Elleta McDaniel
            </h1>
            <p className="text-[13px] text-[#4A4640] font-medium mb-2">
              Product Designer — Design Systems, Data Platforms &amp; Complex UX
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[13px] text-[#8A8480]">
              <span>Barcelona, Spain</span>
              <span>·</span>
              <span>Open to Hybrid/Remote</span>
              <span>·</span>
              <a href="mailto:elletamc@gmail.com" className="hover:text-[#1A1814] transition-colors">elletamc@gmail.com</a>
              <span>·</span>
              <span>+34 633287939</span>
            </div>
          </div>

          <div className="divider" />

          {/* Profile */}
          <div>
            <p className="section-label mb-3">Profile</p>
            <p className="text-[13px] text-[#4A4640] leading-relaxed">
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
            <p className="text-[13px] text-[#4A4640] leading-relaxed">
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
                  <span className="text-[13px] text-[#8A8480] font-medium pt-0.5">{ed.period}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1A1814]">{ed.institution}</p>
                    <p className="text-[13px] text-[#4A4640]">{ed.degree}</p>
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
                  <span className="text-[13px] text-[#8A8480] font-medium pt-0.5 leading-snug">{role.period}</span>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1A1814] leading-snug">
                      {role.title}{" "}
                      <span className="font-normal text-[#4A4640]">@ {role.company}</span>
                    </p>
                    <ul className="mt-2 space-y-1">
                      {role.highlights.map((h) => (
                        <li key={h} className="text-[13px] text-[#4A4640] leading-relaxed flex gap-2">
                          <span className="text-[#8A8480] flex-shrink-0">•</span>
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
