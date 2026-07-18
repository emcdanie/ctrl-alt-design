"use client";

import { useRouter } from "next/navigation";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";
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
      <section
        className="layout-section"
        style={{ paddingTop: "calc(var(--header-height) + var(--spacing-16))" }}
      >
        <div className="layout-container">
          <PageHeader eyebrow="The quick version" title="Four minutes" />
          <p className="body-lg" style={{ maxWidth: "600px" }}>
            I design {POSITIONING} for complex, multi-role B2B and enterprise products.
            The three pieces below carry the argument; the matrix shows the coverage;
            the inspector proves the discipline. Prefer to wander?{" "}
            <Link href="/work" className="footer-nav-link" style={{ color: "var(--color-accent-ink)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
              Browse the full library
            </Link>
            .
          </p>

          {/* Top 3 cases, the library's own default order */}
          <section aria-labelledby="quick-cases" style={{ marginTop: "var(--spacing-16)" }}>
            <p className="section-label mb-3" id="quick-cases">Closest look, three cases</p>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "var(--spacing-6)",
                alignItems: "stretch",
              }}
            >
              {TOP_CASES.map((i) => (
                <li key={i.id}>
                  <CaseCard item={i} />
                </li>
              ))}
            </ul>
          </section>

          {/* Skills coverage at a glance; headers jump into the filtered library.
              D3 (Pass D): the page's ONE Unique-energy moment, the same words
              at display scale with the accent treatment. */}
          <section aria-labelledby="quick-matrix" style={{ marginTop: "var(--spacing-16)" }}>
            <Heading tier="page" as="h2" id="quick-matrix" accent="to the work." className="mb-6">
              Skills, mapped
            </Heading>
            <MatrixView
              caseFilters={[]}
              skillFilters={[]}
              toggleCase={(id) => router.push(`/work?case=${id}`)}
              toggleSkill={(slug) => router.push(`/work?skill=${slug}`)}
            />
          </section>

          {/* The proof: this site runs on tokens */}
          <section aria-labelledby="quick-proof" style={{ marginTop: "var(--spacing-16)" }}>
            <p className="section-label mb-3" id="quick-proof">I read code, and this site proves it</p>
            <TokenInspector />
            <p className="body-base" style={{ marginTop: "var(--spacing-3)", color: "var(--color-ink-muted)" }}>
              Live values from this site&apos;s own token layer.{" "}
              <Link href="/design-system" className="touch-inline" style={{ color: "var(--color-accent-ink)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
                The full system
              </Link>
              .
            </p>
          </section>

          {/* CTA, the page's one primary */}
          <section style={{ marginTop: "var(--spacing-16)", display: "flex", alignItems: "center", gap: "var(--spacing-4)", flexWrap: "wrap" }}>
            <Button href="/contact" variant="primary">
              Get in touch
              <span aria-hidden="true">→</span>
            </Button>
            <p className="body-base" style={{ margin: 0, color: "var(--color-ink-muted)" }}>
              Open to full-time roles and select freelance projects.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
