"use client";

import { Icon } from "@/components/ui/Icon";

/** §7: single-choice option lists (SORT). Styled native select. */
export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="select-control">
      <span>{label}</span>
      <span className="select-control__field">
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon name="NavArrowDown" size="sm" className="select-control__chevron" />
      </span>
    </label>
  );
}
