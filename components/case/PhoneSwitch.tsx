"use client";

import { useState, type ReactNode } from "react";
import styles from "./Case.module.css";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

/* Two or three peers, one in view at a time, on a phone (job P, 7 Oct 2026):
   the site's SegmentedControl above the active item. Tab reaches the
   segments, Enter or Space picks, aria-current marks the pick, and the
   picked item is announced politely when it changes. */
export default function PhoneSwitch({ label, items, below }: { label: string; /** always in view under the switched item */ below?: ReactNode; items: { key: string; label: string; node: ReactNode }[] }) {
  const [at, setAt] = useState(items[0].key);
  const on = items.find((i) => i.key === at) ?? items[0];
  return (
    <div className={styles.switchBox}>
      <SegmentedControl label={label} sentence value={at} onChange={setAt} options={items.map((i) => ({ value: i.key, label: i.label }))} />
      <div aria-live="polite">{on.node}</div>
      {below}
    </div>
  );
}
