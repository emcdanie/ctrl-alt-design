import type { ReactNode } from "react";
import Card from "@/components/ui/Card";
import { ResumeButton } from "@/components/ResumeModal";
import { Icon } from "@/components/ui/Icon";
import { WORK_ITEMS } from "@/lib/workLibrary";

/* Experience on About (step 3, 18 Sep 2026): expandable rows that match
   the CV. Summary: company, a Current tag, role, dates, a chevron. Open:
   "What I did", then related case studies. Native <details>, so it
   works without JS and keyboard/AT get disclosure semantics for free.

   This file is one of the two NDA-exempt surfaces (constitution §7):
   employer and engagement names live HERE and in ResumeModal only, so
   the About "Good company" grid reads its names from this data rather
   than typing them anywhere else. */

type Row = {
  company: string;
  role: string;
  dates: string;
  current?: boolean;
  /** one muted line under the role: the clients behind the work */
  clients?: string;
  /** bullets; <strong> marks the key phrase to scan for */
  did: ReactNode[];
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
    did: [
      "Built a Figma component library aligned with reusable web components and a multi-theme architecture.",
      "Translated an existing code-based design system into production-ready Figma components.",
      "Explored AI-enabled governance workflows for design-system compliance and automation.",
    ],
    related: ["brad-frost"],
  },
  {
    company: "Mango",
    role: "Design Systems Specialist",
    dates: "Apr to Jul 2026",
    did: [
      <>Brought AI into Mango&apos;s design-system work for the first time. With <strong>Claude, Figma MCP and Code Connect</strong> I automated audits and made components machine-readable, so I could ship far more in a few months while keeping Mango&apos;s design system up to date.</>,
      <>Built the tooling and documentation the team needed to <strong>adopt Code Connect themselves</strong>, so design-to-code parity didn&apos;t depend on me.</>,
      <>Owned cross-platform component governance across <strong>web, iOS and Android</strong> within Mango&apos;s design system, during a leadership transition.</>,
      "Defined, governed and released reusable components across shared Figma libraries, documented in Zeroheight.",
      "Led accessibility and dark-mode audits, and defined design-system metrics for adoption, coverage, efficiency and quality.",
    ],
  },
  {
    company: "BizAway",
    role: "Product & Design Systems Designer",
    dates: "Jul 2024 to Feb 2026",
    clients: "Clients included Air France and WeRoad.",
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
    clients: "Client: Riyad Bank.",
    did: [
      "Designed enterprise banking and SaaS platform experiences for digital clients.",
      "Ran user research and usability testing to validate complex workflows.",
    ],
  },
];

/* "Good company": each org's own mark (public/logos/<file>.svg),
   inlined in currentColor so it takes the theme's muted ink. Marks fit
   one box (the grid sets its size); `scale` shrinks a mark that reads
   too heavy in it. `lockup` sets live text beside an emblem that has no
   words of its own. The name is the accessible label. */
export type Org = { name: string; file: string; scale?: number; lockup?: string[] };

export const WORKED_WITH: Org[] = [
  { name: "Brad Frost Web", file: "brad-frost" },
  { name: "Mango", file: "mango" },
  { name: "United Nations Geneva", file: "un-geneva", lockup: ["United Nations", "Geneva"] },
  { name: "Air France", file: "air-france" },
  { name: "Riyad Bank", file: "riyad-bank" },
  { name: "WeRoad", file: "weroad" },
  { name: "BizAway", file: "bizaway" },
  { name: "VML", file: "vml", scale: 0.62 },
];

const bySlug = (slug: string) => WORK_ITEMS.find((w) => w.href.endsWith(`/${slug}`));

export default function ExperienceSection() {
  return (
    <>
      <div className="xp-list">
        {EXPERIENCE.map((r) => (
          <details key={r.company} className="xp">
            <summary className="xp__summary">
              {/* DOM order is reading order: company, role, dates, clients.
                  The grid puts the dates in the right-hand column. */}
              <span className="xp__company">
                {r.company}
                {r.current ? (
                  <>
                    {" "}
                    <span className="xp__current">Current</span>
                  </>
                ) : null}
              </span>
              <span className="xp__role">{r.role}</span>
              <span className="xp__dates">{r.dates}</span>
              {r.clients ? <span className="text-meta xp__clients">{r.clients}</span> : null}
              <Icon name="NavArrowDown" size="sm" className="xp__chev" />
            </summary>
            <div className="xp__body">
              <p className="xp__label">What I did</p>
              <ul className="section-list">
                {r.did.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
              {r.related?.length ? (
                <>
                  <p className="xp__label">Related work</p>
                  <div className="xp__related">
                    {r.related.map((slug) => {
                      const w = bySlug(slug);
                      if (!w) return null;
                      return (
                        <Card
                          key={slug}
                          href={w.href}
                          media={
                            w.cover ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={w.cover} alt="" className="xp__thumb" />
                            ) : undefined
                          }
                        >
                          <p className="xp__rel-kicker">Case study</p>
                          <p className="xp__rel-title">{w.title}</p>
                          <p className="xp__rel-cta">Read it →</p>
                        </Card>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </div>
          </details>
        ))}
      </div>
      <ResumeButton />
    </>
  );
}
