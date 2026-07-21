import type { ReactNode } from "react";
import Heading from "@/components/ui/Heading";

interface SectionHeaderProps {
  label?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
  /** fixed-dark grounds (the contact footer): swap to on-dark inks */
  inverse?: boolean;
  /** display tier; "hero" for a page's ONE deliberate scale moment */
  tier?: "section" | "hero" | "page";
  /** accent segment forwarded to Heading (iris accent word) */
  accent?: ReactNode;
  /** anchor id forwarded to the Heading element (section maps) */
  id?: string;
}

export default function SectionHeader({
  label,
  title,
  description,
  actions,
  className = "",
  contentClassName = "",
  inverse = false,
  tier = "section",
  accent,
  id,
}: SectionHeaderProps) {
  return (
    <div className={`layout-header flex flex-col justify-between gap-4 sm:flex-row sm:items-end ${className}`.trim()}>
      <div className={contentClassName}>
        {label ? (
          <p
            className="section-label mb-3"
            style={inverse ? { color: "var(--ink-on-dark-muted)" } : undefined}
          >
            {label}
          </p>
        ) : null}
        <Heading
          tier={tier}
          as="h2"
          id={id}
          accent={accent}
          className={inverse ? "display-heading--inverse" : ""}
        >
          {title}
        </Heading>
        {description ? (
          <p
            className="body-lg mt-3 max-w-xl"
            style={{ color: inverse ? "var(--ink-on-dark-body)" : "var(--color-muted)" }}
          >
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}