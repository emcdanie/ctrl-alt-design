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
    <div className={`flex flex-col justify-between gap-4 sm:flex-row sm:items-end ${className}`.trim()}>
      <div className={contentClassName}>
        {label ? <p className="section-label mb-3">{label}</p> : null}
        <h2
          className="font-display leading-tight text-[#1A1814]"
          style={{ fontSize: "clamp(32px, 5vw, 48px)" }}
        >
          {title}
        </h2>
        {description ? (
          <p
            className="mt-3 max-w-xl text-[16px] leading-[1.72] text-[#6B6560] md:text-[17px]"
            style={{ letterSpacing: "0.01em" }}
          >
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}