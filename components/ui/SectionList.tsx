import type { ReactNode } from "react";

/* The list a Section's body can carry: one column, or two from the
   fifth item. Moved out of the old components/Section.tsx (Elleta,
   20 Sep 2026, Part E item 4) when that file's Section was replaced
   everywhere by components/layout/Section; this was the only part of
   it still doing a job. */
export default function SectionList({ items }: { items: ReactNode[] }) {
  return (
    <ul className={items.length > 4 ? "section-list section-list--cols" : "section-list"}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
