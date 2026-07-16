"use client";

import Link from "next/link";
import LogoContainer from "@/components/LogoContainer";
import { Icon } from "@/components/ui/Icon";

function BoldLead({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-bold text-[color:var(--color-ink)]">
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
      className={`overflow-hidden rounded-[var(--radius-2xl)] border [backdrop-filter:blur(var(--bella-blur-lg))] [-webkit-backdrop-filter:blur(var(--bella-blur-lg))] transition-all duration-300 ${
        isOpen
          ? "border-[color:var(--color-semantic-border-glass-edge)] bg-gradient-to-b from-white/82 to-white/70 shadow-[0_16px_40px_var(--color-alpha-shadow-warm-08),0_4px_12px_var(--color-alpha-shadow-warm-05),inset_0_1px_0_var(--color-alpha-glass-90)]"
          : "border-[color:var(--color-semantic-border-glass-edge)] bg-gradient-to-b from-white/72 to-white/58 shadow-[0_8px_24px_var(--color-alpha-shadow-warm-04),0_1px_4px_var(--color-alpha-shadow-warm-03),inset_0_1px_0_rgba(255,255,255,0.8)] hover:-translate-y-0.5 hover:from-white/80 hover:to-white/68 hover:shadow-[0_14px_34px_var(--color-alpha-shadow-warm-08),0_4px_10px_var(--color-alpha-shadow-warm-04)]"
      }`}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 bg-transparent p-6 text-left"
      >
        <div className="flex min-w-0 items-center gap-4">
          <LogoContainer src={logoSrc} alt={company} bg={logoBg} size={48} />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-[length:var(--typography-font-size-base)] font-semibold leading-[1.3] text-[color:var(--color-ink)] md:text-[length:var(--typography-font-size-lg)]">
                {title}
              </span>
              {isCurrent && (
                <span className="rounded-full bg-[color:var(--color-semantic-background-inverse)] px-2.5 py-1 text-[length:var(--typography-font-size-tag)] font-bold uppercase tracking-[0.1em] text-[color:var(--color-semantic-text-inverse)]">
                  NOW
                </span>
              )}
            </div>
            <div className="mt-1 text-[length:var(--typography-font-size-sm)] leading-relaxed text-[color:var(--color-ink-muted)]">
              {company} · {period}
            </div>
          </div>
        </div>

        <Icon
          name="NavArrowDown"
          size="md"
          className={`shrink-0 text-[color:var(--color-ink-muted)] transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-black/6 px-6 pb-6 pt-0">
          <ul className="flex flex-col gap-3 pt-5">
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-[length:var(--typography-font-size-base)] leading-[1.75] text-[#4A4640]">
                <span className="mt-[1px] shrink-0 text-[#B8B1AA]">, </span>
                <span>
                  <BoldLead text={h} />
                </span>
              </li>
            ))}
          </ul>

          {caseStudySlug && (
            <Link
              href={`/${caseStudySlug}`}
              className="mt-5 inline-flex items-center gap-1.5 text-[length:var(--typography-font-size-tag)] font-semibold text-[color:var(--color-ink)] underline decoration-black/25 underline-offset-4 transition-all duration-200 hover:decoration-black/60 hover:opacity-100"
            >
              {caseStudyLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}