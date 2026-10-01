"use client";

import { useRouter } from "next/navigation";
import OverlayNav from "@/components/OverlayNav";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import { CaseRowList } from "@/components/CaseRow";
import TokenInspector from "@/components/TokenInspector";
import { MatrixView } from "@/components/WorkLibrary";
import { Button } from "@/components/ui/Button";
import { POSITIONING } from "@/lib/copy";
import Heading from "@/components/ui/Heading";
import { HOME_CASES } from "@/content/cases";
import Link from "next/link";

/* The fast lane (two-speed flow): the four-minute version, composed
 * ONLY from existing components. The discovery lane (constellation,
 * deep cases, Point of View) stays untouched; nobody is forced through
 * either door. */

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

      {/* the same lead three as Home, in the same order and rows (24 Sep audit, B6) */}
      <Section id="quick-cases" label="Closest look, three cases">
        <CaseRowList rows={HOME_CASES} />
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
