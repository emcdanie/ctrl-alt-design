import { TextLink } from "@/components/ui/TextLink";
import { WORK_ITEMS } from "@/lib/workLibrary";
import s from "./ExperienceSection.module.css";

/* Track record on About — compact timeline (Option B, Elleta, 9 Oct 2026;
   supersedes the accordion from site v3 4 Oct). One row per role, no
   descriptions, no expand. Desktop: date col · company+role · case link.
   Phone: date / company+pill / role / case link, stacked.

   This file is one of the two NDA-exempt surfaces (constitution §7):
   employer and engagement names live HERE and in ResumeModal only. */

type Row = {
  company: string;
  role: string;
  dates: string;
  current?: boolean;
  /** case-study slugs (the last segment of a WORK_ITEMS href) */
  related?: string[];
};

/* newest first by end date; dates match LinkedIn */
export const EXPERIENCE: Row[] = [
  {
    company: "Brad Frost Web",
    role: "AI-Assisted Design Systems Engineer · Maker Program",
    dates: "Oct 2025 to now",
    current: true,
    related: ["brad-frost"],
  },
  {
    company: "A global fashion retailer",
    role: "Design Systems Specialist",
    dates: "Apr to Jul 2026",
    related: ["federated"],
  },
  {
    company: "A B2B travel platform",
    role: "Product & Design Systems Designer",
    dates: "Jul 2024 to Feb 2026",
    related: ["design-system-transformation"],
  },
  {
    company: "United Nations Geneva",
    role: "UX / Product Designer",
    dates: "Oct to Dec 2025",
  },
  {
    company: "VML",
    role: "UX/UI Designer",
    dates: "Feb 2023 to Feb 2024",
  },
];

const bySlug = (slug: string) =>
  WORK_ITEMS.find((w) => w.href.endsWith(`/${slug}`));

/** House rules, Kindness: its proof names an employer, so it renders
 *  from this file (constitution §7). Copy from Figma 403:7256. */
export function KindnessProof({ className = "" }: { className?: string }) {
  return (
    <p className={className}>
      Proof: at a B2B travel platform I wrote the documentation even when I was
      told it wasn&apos;t important.
    </p>
  );
}

export default function ExperienceSection() {
  return (
    <div className={s.timeline}>
      {EXPERIENCE.map((r) => {
        const caseItem = r.related?.[0] ? bySlug(r.related[0]) : null;
        return (
          <div key={r.company} className={s.entry}>
            <span className={s.dates}>{r.dates}</span>
            <div className={s.content}>
              <p className={s.company}>
                {r.company}
                {r.current ? (
                  <>
                    <span className="sr-only">, current role</span>
                    <span className={s.nowPill} aria-hidden="true">
                      Now
                    </span>
                  </>
                ) : null}
              </p>
              <p className={s.role}>{r.role}</p>
            </div>
            <div className={s.caseCol}>
              {caseItem ? (
                <TextLink href={caseItem.href}>
                  Case study <span aria-hidden="true">→</span>
                </TextLink>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
