"use client";

interface Role {
  title: string;
  company: string;
  period: string;
  highlights: string[];
}

const roles: Role[] = [
  {
    title: "Product Designer — Design Systems",
    company: "Brad Frost Web (Maker Program)",
    period: "Oct 2025 — Present",
    highlights: [
      "Building a scalable Figma component library aligned with Brad Frost's Atomic Design methodology, contributing to a production-ready design system used across client web interfaces.",
      "Defining reusable UI components and interaction patterns to support consistent implementation, with direct input into accessibility standards and usage documentation.",
      "Contributing to design system governance: component ownership criteria, documentation structure, and the framework for deciding when to extend the system versus build feature-specific solutions.",
    ],
  },
  {
    title: "UX/UI Designer — Product & Design Systems",
    company: "BizAway",
    period: "Jul 2024 — Feb 2026",
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
    highlights: [
      "Designed a high-fidelity dashboard prototype supporting operational transparency across multiple UN teams — translating complex organisational workflows into clear data visualisations and interactive analytics interfaces.",
      "Conducted stakeholder interviews and requirements gathering across technical and non-technical users to define information architecture and layout structure.",
      "Created modular UI components and scalable layout patterns suited to a high-stakes, multi-role enterprise environment with strict accessibility and usability requirements.",
    ],
  },
  {
    title: "UX/UI Designer",
    company: "VML",
    period: "Feb 2023 — Feb 2024",
    highlights: [
      "Designed mobile-native interfaces and digital products for client-facing applications, from wireframes through high-fidelity prototypes.",
      "Conducted UX research, benchmarking, and usability evaluations; collaborated cross-functionally with product managers and developers to ensure consistent implementation of user-centred designs.",
    ],
  },
];

interface ExperienceSectionProps {
  onResumeClick?: () => void;
}

export default function ExperienceSection({ onResumeClick }: ExperienceSectionProps) {
  return (
    <section id="experience" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="section-label mb-3">— Track Record</p>
            <h2 className="font-display font-normal text-[48px] text-[#1A1814] leading-tight">
              Experience
            </h2>
          </div>
          {onResumeClick && (
            <button
              onClick={onResumeClick}
              className="text-[13px] font-medium text-[#1A1814] border border-[#1A1814]/20 rounded-full px-5 py-2 hover:bg-[#1A1814] hover:text-[#EDE8DF] transition-colors cursor-pointer hidden sm:block"
            >
              Open full resume ↗
            </button>
          )}
        </div>

        {/* Roles */}
        <div className="divide-y divide-[#1A1814]/8">
          {roles.map((role) => (
            <div key={role.title + role.company} className="py-8 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 sm:gap-8">
              {/* Left — period */}
              <div className="pt-0.5">
                <span className="text-[13px] text-[#8A8480] font-medium">{role.period}</span>
              </div>

              {/* Right — role + highlights */}
              <div>
                <div className="mb-3">
                  <h3 className="font-display font-semibold text-[22px] text-[#1A1814] leading-snug">
                    {role.title}
                  </h3>
                  <span className="text-[15px] text-[#8A8480]">{role.company}</span>
                </div>
                <ul className="space-y-2">
                  {role.highlights.map((h) => (
                    <li key={h} className="text-[16px] text-[#4A4640] leading-relaxed flex gap-2">
                      <span className="text-[#8A8480] flex-shrink-0 mt-0.5">—</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mt-16">
          <h2 className="font-display font-normal text-[48px] text-[#1A1814] leading-tight mb-10">
            Education
          </h2>
          <div className="divide-y divide-[#1A1814]/8">
            <div className="py-8 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 sm:gap-8">
              <div className="pt-0.5">
                <span className="text-[13px] text-[#8A8480] font-medium">2022 — 2023</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-[22px] text-[#1A1814] leading-snug">
                  Ironhack
                </h3>
                <span className="text-[15px] text-[#8A8480]">UX/UI Design</span>
              </div>
            </div>
            <div className="py-8 grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 sm:gap-8">
              <div className="pt-0.5">
                <span className="text-[13px] text-[#8A8480] font-medium">2005 — 2009</span>
              </div>
              <div>
                <h3 className="font-display font-semibold text-[22px] text-[#1A1814] leading-snug">
                  Arizona State University
                </h3>
                <span className="text-[15px] text-[#8A8480]">Bachelors of Science in Design, GPA: 3.9/4.0</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
