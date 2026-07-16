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
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      className="filter-chip"
      aria-pressed={pressed}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
