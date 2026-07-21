"use client";

import { useState } from "react";
import LogoContainer from "@/components/LogoContainer";
import ExperienceCard from "@/components/ExperienceCard";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionShell from "@/components/ui/SectionShell";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/* Logo slots (Pass E task 9c, supersedes the Pass C list): PUBLIC orgs
   carry logoSrc, now including the two orgs from the employers file
   (their marks re-enter as fresh assets Elleta provides; no logoSrc
   until a file exists, LogoContainer falls back to the initial-letter
   tile). Case studies stay industry-not-client, always.
   TODO(elleta): files to upload/replace in public/images/logos/:
   1. mango.png            MISSING (card renders the fallback "M" tile)
   2. ASU-logo.png         REPLACE (3840x2160 letterboxed canvas; re-export trimmed)
   3. bradfrostwebjpeg.jpeg REPLACE (baked-in cream padding; clean PNG)
   4. bizaway mark          NEW (fresh asset from Elleta; add logoSrc then)
   5. UNOG mark             NEW (fresh asset from Elleta; add logoSrc then) */
const roles = [
  {
    title: "Product Designer, Design Systems",
    company: "Brad Frost Web (Maker Program)",
    period: "Oct 2025, Present",
    isCurrent: true,
    logoSrc: "/images/logos/bradfrostwebjpeg.jpeg",
    caseStudySlug: "case-studies/brad-frost",
    caseStudyLabel: "Code First, View case study →",
    highlights: [
      "**Built a production-ready Figma component library** aligned with Brad Frost's Atomic Design methodology, atoms, molecules, organisms, and templates across a real client design system.",
      "**Connected Figma to MCP** (Model Context Protocol) to enable AI-enabled design system investigation, demonstrated live alongside Brad Frost and TJ Pitre in a recorded session.",
      "**Established component governance** criteria: ownership rules, documentation structure, and the decision framework for when to extend versus build feature-specific solutions.",
      "**Worked code-first**, traced prop structures in Storybook, aligned Figma variant names to code, and closed the token chain from primitive → semantic → component.",
    ],
  },
  {
    title: "Design Systems Specialist",
    company: "Mango · Contract",
    period: "Apr 2026, Jul 2026",
    logoSrc: "/images/logos/mango.png",
    highlights: [
      "**Owned cross-platform component governance** across Web, iOS, and Android, defining, governing, and releasing reusable components across multiple shared Figma libraries, documented in Zeroheight.",
      "**Established AI-enabled design-system workflows** with Claude, Figma MCP, and the Desktop Bridge, enabling automated audits, machine-readable component patterns, and scalable documentation.",
      "**Led design-to-code parity initiatives**, bridging Figma and production codebases so the system stays true across design and build.",
      "**Ran accessibility and dark-mode audits** across the system, and defined metrics for adoption, coverage, efficiency, and quality.",
    ],
  },
  {
    title: "UX/UI Designer, Product & Design Systems",
    company: "BizAway" /* TODO(elleta): exact entry wording is yours; the name is restored per _private/nda-employers.txt (Pass E task 9) */,
    period: "Jul 2024, Feb 2026",
    caseStudySlug: "case-studies/design-system-transformation",
    caseStudyLabel: "From Drift to Foundation →",
    highlights: [
      "**Led the full UX transformation** of a B2B SaaS travel platform, redesigning booking flows across flights, car rentals, finance, admin, and multi-role dashboards from the ground up.",
      "**Built the company's first scalable design system**, token architecture, reusable component library, and theme support, with tokens integrated directly into production code by engineering.",
      "**Redesigned 5+ end-to-end booking verticals**, search, filtering, sorting, seat selection, and post-booking management, with consistent interaction patterns across a complex multi-team product.",
      "**Delivered investor-grade prototypes** for executive presentations that contributed to funding rounds and accelerated product team expansion.",
    ],
  },
  {
    title: "Product Designer, Data Dashboard (Contract)",
    company: "UN Office at Geneva (UNOG) · Contract" /* TODO(elleta): exact entry wording is yours; the name is restored per _private/nda-employers.txt (Pass E task 9) */,
    period: "Oct 2025, Dec 2025",
    caseStudySlug: "case-studies/un-operational-dashboard",
    caseStudyLabel: "Designing Operational Clarity →",
    highlights: [
      "**Designed a high-fidelity operational dashboard** for the UN ICT division, translating complex multi-team workflows into clear data visualisations and role-based analytics interfaces.",
      "**Delivered within an 8-week contract**, from stakeholder interviews and IA definition through interactive prototype and annotated engineering handoff specs.",
      "**Mapped 6+ operational domains** into a unified interface, making siloed data accessible and legible to both technical and non-technical users across the organisation.",
      "**Created reusable component patterns** for a high-stakes enterprise environment with strict accessibility and multi-role usage requirements.",
    ],
  },
  {
    title: "UX/UI Designer",
    company: "VML",
    period: "Feb 2023, Feb 2024",
    logoSrc: "/images/logos/vml.png",
    highlights: [
      "**Designed across multiple industry verticals**, mobile-native apps, digital products, and client-facing platforms from wireframes through production-ready high-fidelity prototypes.",
      "**Grounded decisions in research**, UX benchmarking, usability evaluations, and user interviews to challenge assumptions before committing to a design direction.",
      "**Partnered directly with engineering** on design QA and handoff documentation to close the gap between design intent and built output.",
      "**Contributed to new business pitches**, translating complex briefs into clear UX frameworks within tight turnaround timelines.",
    ],
  },
  /* Pre-design roles (Elleta, 21 Jul, via Cowork): public on her
     LinkedIn by her choice; names scoped in _private/nda-employers.txt
     to this surface + ResumeModal only. Highlights are TODO(elleta)
     content slots and render NOTHING until her words land (21 Jul
     rule). TODO(elleta): Co.Lab vs Allianz order is a guess pending
     months; reorder freely. */
  {
    title: "Frontend Developer",
    company: "Co.Lab" /* TODO(elleta): exact entry wording is yours */,
    period: "Feb 2022, Mar 2022",
    highlights: [],
  },
  {
    title: "DevOps Engineer",
    company: "Allianz Technology" /* TODO(elleta): exact entry wording is yours */,
    period: "Jun 2022, Sep 2022",
    highlights: [],
  },
  {
    title: "Client Account Manager",
    company: "ADP" /* TODO(elleta): exact entry wording is yours */,
    period: "Dec 2020, Jan 2022",
    highlights: [],
  },
  {
    /* Combined earlier-roles entry per Dirk's advice (Elleta, 21 Jul).
       TODO(elleta): confirm the ecological fashion brand name. */
    title: "Earlier career",
    company:
      "Partner Business Manager, SELLBYTEL Group (2014 - 2020); Junior Fashion Designer, ecological fashion brand internship (2016); B2B & Consumer Sales Representative, Apple (2011 - 2013)",
    period: "",
    highlights: [],
  },
];

const education = [
  {
    period: "Nov 2022, Jan 2023",
    name: "Ironhack",
    degree: "UX/UI Design",
    logo: "/images/logos/Ironhack.png",
    description: "Intensive 9-month bootcamp covering end-to-end UX/UI design, user research, information architecture, interaction design, prototyping, and usability testing.",
  },
  {
    /* filled from her LinkedIn (Elleta, 21 Jul, via Cowork) */
    period: "Apr 2021, Jan 2022",
    name: "SheCodes",
    degree: "Frontend Developer, Information Technology",
    logo: undefined,
    description: "Responsive web apps: HTML, CSS, JavaScript, React.",
  },
  {
    period: "2012, 2013",
    name: "IDEP Barcelona",
    degree: "Postgraduate, Fashion Design and Image",
    logo: undefined,
    description: "",
  },
  {
    period: "2005, 2009",
    name: "Arizona State University",
    degree: "BSc Design, Interior Architecture, 3.9 GPA",
    logo: "/images/logos/ASU-logo.png",
    description: "Foundation in design principles, visual communication, typography, and creative problem-solving across digital and physical media.",
  },
];

interface ExperienceSectionProps {
  onResumeClick?: () => void;
}

export default function ExperienceSection({ onResumeClick }: ExperienceSectionProps) {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <SectionShell id="experience">
      <SectionHeader
        label="Track Record"
        title="Experience"
        actions={
          onResumeClick ? (
            <Button onClick={onResumeClick} variant="primary">
              Download Resume
              <Icon name="Download" size="sm" />
            </Button>
          ) : null
        }
      />

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
        {roles.map((role, i) => (
          <ExperienceCard
            key={role.title + role.company}
            {...role}
            isOpen={expanded === i}
            onToggle={() => setExpanded(expanded === i ? null : i)}
          />
        ))}
      </div>

      <div style={{ marginTop: "var(--spacing-16)" }}>
        {/* no label: it duplicated the title word-for-word (D4 rhythm) */}
        <SectionHeader title="Education" />
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
          {education.map((edu) => (
            <Card key={edu.name} innerClassName="!p-0 overflow-hidden">
              <div className="flex w-full items-center gap-4 p-6">
                <LogoContainer src={edu.logo} alt={edu.name} size={48} />
                <div className="min-w-0 flex-1">
                  <span className="heading-item" style={{ display: "block" }}>
                    {edu.name}
                  </span>
                  <div className="mt-1 text-[length:var(--typography-font-size-sm)] leading-relaxed text-[color:var(--color-ink-muted)]">
                    {edu.period ? `${edu.degree} · ${edu.period}` : edu.degree}
                  </div>
                </div>
              </div>
              {edu.description && (
                <div className="border-t border-[color:var(--color-border-soft)] px-6 pb-6 pt-4">
                  <p className="card-body">
                    {edu.description}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}