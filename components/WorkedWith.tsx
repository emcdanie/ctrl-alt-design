import { WORKED_WITH } from "@/components/ExperienceSection";

/* "Good company" (step 3, 18 Sep 2026): company names as plain text in
   a ruled grid, no logos. Names come from ExperienceSection, the
   NDA-exempt data. */
export default function WorkedWith() {
  return (
    <ul className="worked-with">
      {WORKED_WITH.map((name) => (
        <li key={name} className="worked-with__name">
          {name}
        </li>
      ))}
    </ul>
  );
}
