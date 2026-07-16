"use client";

/**
 * §7: mutually exclusive views (TABLE / MAP / TIMELINE). One connected,
 * flat control; single-select; immediate apply. Tab moves between
 * segments, Enter/Space selects (plain buttons, NOT arrow-key radio).
 * aria-current marks the active segment.
 */
export function SegmentedControl({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <ul className="seg-control" aria-label={label}>
      {options.map((o) => (
        <li key={o.value}>
          <button
            type="button"
            aria-current={value === o.value ? "true" : undefined}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
