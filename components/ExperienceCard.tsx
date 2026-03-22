"use client";

import Link from "next/link";
import LogoContainer from "@/components/LogoContainer";

function BoldLead({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-bold text-[#1A1814]">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export interface ExperienceCardProps {
  title: string;
  company: string;
  period: string;
  isCurrent?: boolean;
  highlights: string[];
  logoSrc?: string;
  logoBg?: string;
  caseStudySlug?: string;
  caseStudyLabel?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ExperienceCard({
  title,
  company,
  period,
  isCurrent,
  highlights,
  logoSrc,
  logoBg,
  caseStudySlug,
  caseStudyLabel,
  isOpen,
  onToggle,
}: ExperienceCardProps) {
  return (
    <div
      className={`overflow-hidden rounded-[22px] border transition-all duration-300 ${
        isOpen
          ? "border-black/8 bg-white/78 shadow-[0_16px_40px_rgba(44,24,16,0.08),0_4px_12px_rgba(44,24,16,0.05)]"
          : "border-black/6 bg-white/54 shadow-[0_8px_24px_rgba(44,24,16,0.04),0_1px_4px_rgba(44,24,16,0.03)] hover:-translate-y-0.5 hover:bg-white/70 hover:shadow-[0_14px_34px_rgba(44,24,16,0.07),0_4px_10px_rgba(44,24,16,0.04)]"
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 bg-transparent px-5 py-5 text-left md:px-6 md:py-6"
      >
        <div className="flex min-w-0 items-center gap-4">
          <LogoContainer src={logoSrc} alt={company} bg={logoBg} size={44} />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-[16px] font-semibold leading-[1.3] text-[#1A1814] md:text-[17px]">
                {title}
              </span>
              {isCurrent && (
                <span className="rounded-full bg-[#1A1814] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                  NOW
                </span>
              )}
            </div>
            <div className="mt-1 text-[14px] leading-relaxed text-[#8A8480]">
              {company} · {period}
            </div>
          </div>
        </div>

        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className={`shrink-0 text-[#8A8480] transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
          aria-hidden="true"
        >
          <path
            d="M4.5 7l4.5 4.5L13.5 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="border-t border-black/6 px-5 pb-6 pt-0 md:px-6 md:pb-7">
          <ul className="flex flex-col gap-3 pt-5">
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-[1.75] text-[#4A4640]">
                <span className="mt-[1px] shrink-0 text-[#B8B1AA]">—</span>
                <span>
                  <BoldLead text={h} />
                </span>
              </li>
            ))}
          </ul>

          {caseStudySlug && (
            <Link
              href={`/${caseStudySlug}`}
              className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1A1814] underline decoration-black/25 underline-offset-4 transition-all duration-200 hover:decoration-black/60 hover:opacity-100"
            >
              {caseStudyLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}