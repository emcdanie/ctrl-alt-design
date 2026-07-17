"use client";

/**
 * §7: multi-select filter. Flat outline pill; selected = filled.
 * Real button with aria-pressed. Never a raised keycap.
 */
export function FilterChip({
  pressed,
  onClick,
  children,
  ariaLabel,
  className,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
  /** modifier class (e.g. the condensed explore variant) */
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className ? `filter-chip ${className}` : "filter-chip"}
      aria-pressed={pressed}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
