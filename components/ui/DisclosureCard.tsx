"use client";

import { useId, useState, type ReactNode } from "react";
import Card from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

export interface DisclosureCardProps {
  /** identity colour passed through to Card */
  accent?: string;
  /** always-visible header row (left of the chevron) */
  header: ReactNode;
  /** expandable body */
  children: ReactNode;
  /** controlled mode: pass isOpen + onToggle (accordion behaviour) */
  isOpen?: boolean;
  onToggle?: () => void;
  /** uncontrolled mode initial state */
  defaultOpen?: boolean;
  className?: string;
}

/**
 * THE disclosure card: an expandable row on the shared animated-border
 * Card primitive. Consolidates the pattern previously implemented twice
 * (ExperienceCard's bespoke glass shell and the inline LearningCard on
 * the About page). Controlled or uncontrolled; the whole header row is
 * the toggle button (44px+ target).
 */
export default function DisclosureCard({
  accent,
  header,
  children,
  isOpen,
  onToggle,
  defaultOpen = false,
  className,
}: DisclosureCardProps) {
  const [selfOpen, setSelfOpen] = useState(defaultOpen);
  const open = isOpen ?? selfOpen;
  const toggle = onToggle ?? (() => setSelfOpen((o) => !o));
  const bodyId = useId();

  return (
    <Card accent={accent} className={className} innerClassName="!p-0 overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={toggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 bg-transparent p-6 text-left"
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">{header}</div>
        <Icon
          name="NavArrowDown"
          size="md"
          className={`shrink-0 text-[color:var(--color-ink-muted)] transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {open && (
        <div
          id={bodyId}
          className="border-t border-[color:var(--color-border-soft)] px-6 pb-6"
        >
          {children}
        </div>
      )}
    </Card>
  );
}
