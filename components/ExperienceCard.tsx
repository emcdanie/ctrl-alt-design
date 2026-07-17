"use client";

import Link from "next/link";
import LogoContainer from "@/components/LogoContainer";
import DisclosureCard from "@/components/ui/DisclosureCard";
import { BoldText } from "@/lib/richtext";

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

/* Role entry on the shared DisclosureCard (animated-border Card). */
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
    <DisclosureCard
      isOpen={isOpen}
      onToggle={onToggle}
      header={
        <>
          <LogoContainer src={logoSrc} alt={company} bg={logoBg} size={48} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-body text-[length:var(--typography-font-size-base)] font-semibold leading-[1.3] text-[color:var(--color-ink)] md:text-[length:var(--typography-font-size-lg)]">
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
        </>
      }
    >
      <ul className="flex flex-col gap-3 pt-5">
        {highlights.map((h, i) => (
          <li
            key={i}
            className="flex gap-3 text-[length:var(--typography-font-size-base)] leading-[1.75] text-[color:var(--color-ink-soft)]"
          >
            <span className="mt-[1px] shrink-0 text-[color:var(--color-ink-muted)]">, </span>
            <span>
              <BoldText text={h} strongClassName="font-bold text-[color:var(--color-ink)]" />
            </span>
          </li>
        ))}
      </ul>

      {caseStudySlug && (
        <Link
          href={`/${caseStudySlug}`}
          className="mt-5 inline-flex items-center gap-1.5 text-[length:var(--typography-font-size-tag)] font-semibold text-[color:var(--color-ink)] underline decoration-[color:var(--color-border-medium)] underline-offset-4 transition-all duration-200 hover:decoration-[color:var(--color-ink-muted)] hover:opacity-100"
        >
          {caseStudyLabel}
        </Link>
      )}
    </DisclosureCard>
  );
}
