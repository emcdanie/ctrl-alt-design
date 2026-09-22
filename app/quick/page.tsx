"use client";

import { useRouter } from "next/navigation";
import OverlayNav from "@/components/OverlayNav";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import CaseCard from "@/components/CaseCard";
import TokenInspector from "@/components/TokenInspector";
import { MatrixView } from "@/components/WorkLibrary";
import { Button } from "@/components/ui/Button";
import { POSITIONING } from "@/lib/copy";
import Heading from "@/components/ui/Heading";
import { WORK_ITEMS } from "@/lib/workLibrary";
import Link from "next/link";

/* The fast lane (two-speed flow): the four-minute version, composed
 * ONLY from existing components. The discovery lane (constellation,
 * deep cases, Point of View) stays untouched; nobody is forced through
 * either door. */

const TOP_CASES = [...WORK_ITEMS]
  .sort((a, b) => {
    const ra = a.rank ?? 99;
    const rb = b.rank ?? 99;
    if (ra !== rb) return ra - rb;
    if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
    return b.yearStart - a.yearStart;
  })
  .slice(0, 3);

export default function QuickPage() {
  const router = useRouter();
  return (
    <main id="main-content">
      <OverlayNav />
      <Section id="quick" labelledBy="quick-title">
        <SectionHeader
          as="h1"
          id="quick-title"
          kicker="The quick version"
          heading="Four minutes"
          lead={
            <>
              I design {POSITIONING} for complex, multi-role B2B and enterprise products. The three pieces below
              carry the argument; the matrix shows the coverage; the inspector proves the discipline. Prefer to
              wander? <Link href="/work">Browse the full library</Link>.
            </>
          }
        />
      </Section>

      {/* Top 3 cases, the library's own default order */}
      <Section id="quick-cases" label="Closest look, three cases">
        <ul className="home-work-row reveal-group">
          {TOP_CASES.map((i) => (
            <li key={i.id}>
              <CaseCard item={i} />
            </li>
          ))}
        </ul>
      </Section>

      {/* Skills coverage at a glance; headers jump into the filtered library */}
      <Section id="quick-matrix" label="Skills, mapped">
        <SectionHeader id="quick-matrix-title" heading="Skills, mapped" accent="to the work." />
        <MatrixView
          caseFilters={[]}
          skillFilters={[]}
          toggleCase={(id) => router.push(`/work?case=${id}`)}
          toggleSkill={(slug) => router.push(`/work?skill=${slug}`)}
        />
      </Section>

      {/* The proof: this site runs on tokens */}
      <Section id="quick-proof" label="I read code, and this site proves it">
        <TokenInspector />
        <p className="quick-proof-note">
          Live values from this site&apos;s own token layer. <Link href="/design-system">The full system</Link>.
        </p>
      </Section>

      {/* CTA, the page's one primary. Its own label, not the hero's:
          two regions sharing a name fails axe landmark-unique. */}
      <Section id="quick-cta" label="Work together">
        <p className="quick-cta">
          <Button href="/contact" variant="primary">
            Let&rsquo;s talk
            <span aria-hidden="true">&rarr;</span>
          </Button>
          <span className="quick-cta__note">Open to full-time roles and select freelance projects.</span>
        </p>
      </Section>
    </main>
  );
}
