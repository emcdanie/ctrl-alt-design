"use client";

import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
  did: string[];
  /** case-study slugs (the last segment of a WORK_ITEMS href) */
  related?: string[];
};

export const EXPERIENCE: Row[] = [
  {
    company: "Mango",
    role: "Design Systems Specialist",
    /* end month unknown yet (Elleta, 18 Sep 2026) */
    dates: "Apr 2026 to 2026",
    did: [
      "Brought AI into Mango's design-system work for the first time. With Claude, Figma MCP and Code Connect I automated audits and made components machine-readable, so I could ship far more in a few months while keeping Mango's design system up to date.",
      "Built the tooling and documentation the team needed to adopt Code Connect themselves, so design-to-code parity didn't depend on me.",
      "Owned cross-platform component governance across web, iOS and Android within Mango's design system, during a leadership transition.",
      "Defined, governed and released reusable components across shared Figma libraries, documented in Zeroheight.",
      "Led accessibility and dark-mode audits, and defined design-system metrics for adoption, coverage, efficiency and quality.",
    ],
  },
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
    company: "BizAway",
    role: "Product & Design Systems Designer",
    dates: "2024 to 2026",
    did: [
      "Built the company's first design system from scratch (tokens, components, themes), with AI in mind from day one, and integrated the tokens into production with engineering.",
      "Wrote the documentation even when I was told it wasn't important, because a system nobody can read is a system nobody uses.",
      "Led the UX transformation of a legacy SaaS travel platform: booking, admin, finance and multi-role dashboards.",
      "Designed and shipped end-to-end booking flows for flights and cars: search, filters, seat maps, upsells and post-booking.",
    ],
    related: ["design-system-transformation"],
  },
  {
    company: "United Nations Geneva",
    role: "Product & Design Systems Designer",
    dates: "2025 to 2026",
    did: [
      "Defined user roles, permission structures and dashboard frameworks for a multi-stakeholder institutional platform.",
      "Designed scalable information architecture for operational workflows across departments.",
      "Delivered interactive prototypes for executive review and funding discussions.",
    ],
  },
  {
    company: "VML",
    role: "UX/UI Designer",
    dates: "2023 to 2024",
    did: [
      "Designed enterprise banking and SaaS platform experiences for digital clients.",
      "Ran user research and usability testing to validate complex workflows.",
    ],
  },
];

/* "Good company": each org's own mark, painted with the theme ink as a
   CSS mask at one height. `ratio` = the file's viewBox width / height.
   The name is the accessible label. */
export const WORKED_WITH: { name: string; src: string; ratio: number }[] = [
  { name: "Brad Frost Web", src: "/logos/brad-frost.svg", ratio: 5272 / 2193 },
  { name: "BizAway", src: "/logos/bizaway.svg", ratio: 499 / 119 },
  { name: "VML", src: "/logos/vml.svg", ratio: 62 / 19 },
  { name: "Mango", src: "/logos/mango.svg", ratio: 2000 / 350 },
  { name: "United Nations Geneva", src: "/logos/un-geneva.svg", ratio: 109 / 91.4 },
];

const bySlug = (slug: string) => WORK_ITEMS.find((w) => w.href.endsWith(`/${slug}`));

export default function ExperienceSection({ onResumeClick }: { onResumeClick: () => void }) {
  return (
    <>
      <div className="xp-list">
        {EXPERIENCE.map((r) => (
          <details key={r.company} className="xp">
            <summary className="xp__summary">
              <span className="xp__who">
                <span className="xp__company">
                  {r.company}
                  {r.current ? <span className="xp__current">Current</span> : null}
                </span>
                <span className="xp__role">{r.role}</span>
              </span>
              <span className="xp__dates">{r.dates}</span>
              <Icon name="NavArrowDown" size="sm" className="xp__chev" />
            </summary>
            <div className="xp__body">
              <p className="xp__label">What I did</p>
              <ul className="section-list">
                {r.did.map((d) => (
                  <li key={d}>{d}</li>
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
      <Button className="xp__cv" onClick={onResumeClick}>
        <Icon name="Page" size="sm" />
        View CV
      </Button>
    </>
  );
}
