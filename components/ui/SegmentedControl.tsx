"use client";

import { Icon, type IconName } from "@/components/ui/Icon";

/**
 * §7: mutually exclusive views (CARDS / MAP / TABLE). One connected,
 * flat control; single-select; immediate apply. Tab moves between
 * segments, Enter/Space selects (plain buttons, NOT arrow-key radio).
 * aria-current marks the active segment. Segments may carry a leading
 * Iconoir icon (decorative, aria-hidden); the text label always stays.
 * `sentence` sets the labels in sentence case, Geist, no tracking
 * (Work and Learning, 19 Sep 2026); the default stays the caps cut.
 */
export function SegmentedControl({
  options,
  value,
  onChange,
  label,
  sentence = false,
}: {
  options: { value: string; label: string; icon?: IconName }[];
  value: string;
  onChange: (v: string) => void;
  label: string;
  /** sentence-case labels instead of the tracked caps */
  sentence?: boolean;
}) {
  return (
    <ul className={sentence ? "seg-control seg-control--sentence" : "seg-control"} aria-label={label}>
      {options.map((o) => (
        <li key={o.value}>
          <button
            data-component="SegmentedControl"
            type="button"
            aria-current={value === o.value ? "true" : undefined}
            onClick={() => onChange(o.value)}
          >
            {o.icon && <Icon name={o.icon} size="sm" />}
            {o.label}
          </button>
        </li>
      ))}
    </ul>
  );
}
