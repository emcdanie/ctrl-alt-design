import type { ReactNode } from "react";

interface SectionHeaderProps {
  label?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function SectionHeader({
  label,
  title,
  description,
  actions,
  className = "",
  contentClassName = "",
}: SectionHeaderProps) {
  return (
    <div className={`layout-header flex flex-col justify-between gap-4 sm:flex-row sm:items-end ${className}`.trim()}>
      <div className={contentClassName}>
        {label ? <p className="section-label mb-3">{label}</p> : null}
        <h2 className="heading-section">{title}</h2>
        {description ? (
          <p className="body-lg mt-3 max-w-xl" style={{ color: "var(--color-muted)" }}>
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}