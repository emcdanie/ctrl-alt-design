import SectionHeader from "@/components/ui/SectionHeader";

/* Experience on the minimal About (about-rebuild lock, 18 Sep 2026):
   plain text lines, company · role · years, then "Full CV →". No cards,
   no accordions; the detail lives in ResumeModal.

   This file is one of the two NDA-exempt surfaces (constitution §7):
   employer and engagement names live HERE and in ResumeModal only, so
   the About "Worked with" row reads its names and logo paths from this
   data rather than typing them anywhere else. */

const lines = [
  { company: "Brad Frost Web", role: "Product Designer, Design Systems", years: "2025 to present" },
  { company: "elleta.design", role: "Design Systems Consultant for Mango and UN Geneva", years: "2025 to present" },
  { company: "BizAway", role: "UX/UI Designer, Product & Design Systems", years: "2024 to 2026" },
  { company: "VML", role: "UX/UI Designer", years: "2023 to 2024" },
  { company: "Allianz Technology", role: "DevOps Engineer", years: "2022" },
  { company: "ADP", role: "Client Account Manager", years: "2020 to 2022" },
];

/* "Worked with": official logo files only (press/brand page or
   Wikimedia Commons), never drawn or recreated; sources are listed in
   the PR. `src` absent = the name renders as text (no official file,
   use restricted, or approval pending). `ratio` = the file's viewBox
   width / height, so every mark renders at one height. */
export const WORKED_WITH: { name: string; src?: string; ratio?: number }[] = [
  /* no official file exists (bradfrost.com draws its logo in CSS) */
  { name: "Brad Frost Web" },
  /* no press/brand page or Commons file; only the site-header SVG */
  { name: "BizAway" },
  /* official press kit, BLACK Wordmark VML.svg, viewBox 1770 x 612 */
  { name: "VML", src: "/logos/vml.svg", ratio: 1770 / 612 },
  /* UN emblem use is restricted (GA resolution 92(I)); name as text */
  { name: "UN Geneva" },
  /* text until Elleta confirms her written approval covers the logo */
  { name: "Mango" },
];

export default function ExperienceSection({ onResumeClick }: { onResumeClick: () => void }) {
  return (
    <section id="experience" className="layout-section-tight">
      <div className="page-container">
        <SectionHeader title="Experience" />
        <ul className="exp-lines">
          {lines.map((l) => (
            <li key={l.company} className="exp-lines__row">
              <span className="exp-lines__company">{l.company}</span>
              <span aria-hidden="true"> · </span>
              <span>{l.role}</span>
              <span aria-hidden="true"> · </span>
              <span className="exp-lines__years">{l.years}</span>
            </li>
          ))}
        </ul>
        <button type="button" className="text-action" onClick={onResumeClick}>
          Full CV →
        </button>
      </div>
    </section>
  );
}
