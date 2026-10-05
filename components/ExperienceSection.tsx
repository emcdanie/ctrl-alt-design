import type { ReactNode } from "react";
import AccordionItem from "@/components/ui/Accordion";
import { TextLink } from "@/components/ui/TextLink";
import { WORK_ITEMS } from "@/lib/workLibrary";
import s from "./ExperienceSection.module.css";

/* Track record on About (site v3, Figma 403:7256, 4 Oct 2026; was the
   18 Sep accordion in one panel). One card per role, all collapsed:
   the trigger holds dates, company (a Current tag on the current role)
   and title, with a chevron; under it, always shown, the role's one
   outcome line and its case link where one exists. The chevron opens
   the clients line and up to three "What I did" lines.

   This file is one of the two NDA-exempt surfaces (constitution §7):
   employer and engagement names live HERE and in ResumeModal only, so
   any About line that names an employer (the Kindness proof below)
   renders from this file rather than typing the name anywhere else. */

type Row = {
  company: string;
  role: string;
  dates: string;
  current?: boolean;
  /** one muted line under the role: the clients behind the work */
  clients?: string;
  /** bullets; <strong> marks the key phrase to scan for. About shows
   *  the first three, so lead with the strongest */
  did: ReactNode[];
  /** the one outcome line shown on the collapsed row (About, site v3) */
  outcome: string;
  /** case-study slugs (the last segment of a WORK_ITEMS href) */
  related?: string[];
};

/* newest first by end date; dates match LinkedIn ("to" stands in for
   the en dash the copy rule bans) */
export const EXPERIENCE: Row[] = [
  {
    company: "Brad Frost Web",
    role: "AI-Assisted Design Systems Engineer · Maker Program",
    dates: "Oct 2025 to now",
    current: true,
    outcome: "Built a Figma component library aligned with reusable web components and a multi-theme architecture.",
    did: [
      "Built a Figma component library aligned with reusable web components and a multi-theme architecture.",
      "Translated an existing code-based design system into production-ready Figma components.",
      "Explored AI-enabled governance workflows for design-system compliance and automation.",
    ],
    related: ["brad-frost"],
  },
  {
    company: "A global fashion retailer",
    role: "Design Systems Specialist",
    dates: "Apr to Jul 2026",
    outcome: "Brought AI into the retailer's design-system work for the first time.",
    did: [
      <>Brought AI into the retailer&apos;s design-system work for the first time. With <strong>Claude, Figma MCP and Code Connect</strong> I automated audits and made components machine-readable, so I could ship far more in a few months while keeping the retailer&apos;s design system up to date.</>,
      <>Built the tooling and documentation the team needed to <strong>adopt Code Connect themselves</strong>, so design-to-code parity didn&apos;t depend on me.</>,
      <>Owned cross-platform component governance across <strong>web, iOS and Android</strong> within the retailer&apos;s design system, during a leadership transition.</>,
      "Defined, governed and released reusable components across shared Figma libraries, documented in Zeroheight.",
      "Led accessibility and dark-mode audits, and defined design-system metrics for adoption, coverage, efficiency and quality.",
    ],
    related: ["federated"],
  },
  {
    company: "A B2B travel platform",
    role: "Product & Design Systems Designer",
    dates: "Jul 2024 to Feb 2026",
    clients: "Clients included an airline and a travel start-up.",
    outcome: "Built the company's first design system from scratch (tokens, components, themes), with AI in mind from day one.",
    did: [
      <>Built the company&apos;s <strong>first design system from scratch</strong> (tokens, components, themes), with AI in mind from day one, and integrated the tokens into production with engineering.</>,
      <><strong>Wrote the documentation</strong> even when I was told it wasn&apos;t important, because a system nobody can read is a system nobody uses.</>,
      "Led the UX transformation of a legacy SaaS travel platform: booking, admin, finance and multi-role dashboards.",
      "Designed and shipped end-to-end booking flows for flights and cars: search, filters, seat maps, upsells and post-booking.",
    ],
    related: ["design-system-transformation"],
  },
  {
    company: "United Nations Geneva",
    role: "UX / Product Designer",
    dates: "Oct to Dec 2025",
    outcome: "Defined user roles, permission structures and dashboard frameworks for a multi-stakeholder institutional platform.",
    did: [
      "Defined user roles, permission structures and dashboard frameworks for a multi-stakeholder institutional platform.",
      "Designed scalable information architecture for operational workflows across departments.",
      "Delivered interactive prototypes for executive review and funding discussions.",
    ],
  },
  {
    company: "VML",
    role: "UX/UI Designer",
    dates: "Feb 2023 to Feb 2024",
    clients: "Client: a bank in the Gulf.",
    outcome: "Designed enterprise banking and SaaS platform experiences for digital clients.",
    did: [
      "Designed enterprise banking and SaaS platform experiences for digital clients.",
      "Ran user research and usability testing to validate complex workflows.",
    ],
  },
];

const bySlug = (slug: string) => WORK_ITEMS.find((w) => w.href.endsWith(`/${slug}`));

/** House rules, Kindness: its proof names an employer, so it renders
 *  from this file (constitution §7). Copy from Figma 403:7256. */
export function KindnessProof({ className = "" }: { className?: string }) {
  return <p className={className}>Proof: at a B2B travel platform I wrote the documentation even when I was told it wasn&apos;t important.</p>;
}

export default function ExperienceSection() {
  return (
    <div className={s.list}>
      {EXPERIENCE.map((r) => (
        <AccordionItem
          key={r.company}
          className={s.row}
          heading={
            <>
              {/* DOM order is reading order: dates, company, role. The
                  spaces keep the button's name from running words
                  together. */}
              <span className={s.dates}>{r.dates}</span>{" "}
              <span className={s.company}>
                {r.company}
                {r.current ? (
                  <>
                    <span className="sr-only">, current role</span>{" "}
                    <span className={s.current} aria-hidden="true">
                      Current
                    </span>
                  </>
                ) : null}
              </span>{" "}
              <span className={s.role}>{r.role}</span>
            </>
          }
          peek={
            <div className={s.peek}>
              <p className={s.outcome}>{r.outcome}</p>
              {r.related?.map((slug) => {
                const w = bySlug(slug);
                return w ? (
                  <p key={slug} className={s.caseLink}>
                    <TextLink href={w.href}>Case study: {w.title} →</TextLink>
                  </p>
                ) : null;
              })}
            </div>
          }
        >
          <div className={s.body}>
            {r.clients ? <p className={s.clients}>{r.clients}</p> : null}
            <ul className={s.did}>
              {r.did.slice(0, 3).map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        </AccordionItem>
      ))}
    </div>
  );
}
