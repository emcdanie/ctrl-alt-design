"use client";

import { useState } from "react";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import ExperienceSection, { education } from "@/components/ExperienceSection";
import ResumeModal from "@/components/ResumeModal";
import ClientsBar from "@/components/ClientsBar";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import TestimonialSection from "@/components/TestimonialSection";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { social } from "@/lib/social";

/* About, rebuilt Southleft-style (specs/about-rebuild/design.md, CONCEPT
   LOCK 18 Sep 2026). Spine, in order: statement hero, Clients bar, where
   I am now, principles, credentials, experience + View CV, testimonials,
   contact. Her copy verbatim wherever it exists; the two lines that are
   assembled rather than hers (the hero statement, "Where I am now") are
   marked TODO(elleta) for review. Receipts and missing credentials are
   TODO(elleta) slots that render NOTHING until she writes them. */

/* ── Beat 4: what I won't compromise on ─────────────────────────
   Her three theses (the former How-I-solve-problems cards), verbatim.
   Card voice: Geist on the ONE shared .card-statement recipe. */
const PRINCIPLES = [
  {
    pre: "Systems are ",
    accentWord: "agreements,",
    post: " not component libraries.",
    accent: "var(--case-drift-text)",
    body: "A component library is an artefact. The system is the set of agreements around it: what counts as a pattern, who decides, when to extend versus build. When only the artefact exists, every team renegotiates those agreements ad hoc, and that is where drift starts.",
    receipt: { text: "" /* TODO(elleta): the one decision it cost or earned */, caseHref: "", caseLabel: "" },
  },
  {
    pre: "",
    accentWord: "Governance",
    post: " is what stops the drift.",
    accent: "var(--case-guardian-text)",
    body: "Drift is not a tooling failure; it is a decision-making failure. Naming, token structure, and contribution flow are governance surfaces. The systems that hold are the ones where the cheap path and the correct path are the same path.",
    receipt: { text: "" /* TODO(elleta): the one decision it cost or earned */, caseHref: "", caseLabel: "" },
  },
  {
    pre: "I read ",
    accentWord: "code,",
    post: " so design and engineering stay honest.",
    accent: "var(--case-code-first-text)",
    body: "Parity between Figma and production is a claim that has to be checked in both directions. Reading the code, tokens, props, rendered output, is how I keep the design side accountable to what actually ships, and vice versa.",
    receipt: { text: "" /* TODO(elleta): the one decision it cost or earned */, caseHref: "", caseLabel: "" },
    applied: { href: "/case-studies/design-system-transformation", label: "See it applied: From Drift to Foundation →" },
  },
];

function StatementCard({
  p,
  children,
}: {
  p: { pre: string; accentWord: string; post: string; accent: string; body: string };
  children?: React.ReactNode;
}) {
  return (
    <article className="thesis-band trace-host" style={{ "--cc": p.accent } as React.CSSProperties}>
      <h3 className="card-statement" style={{ margin: "0 0 var(--spacing-4)" }}>
        {p.pre}
        <span style={{ color: p.accent }}>{p.accentWord}</span>
        {p.post}
      </h3>
      <p className="card-body" style={{ margin: 0, flex: 1 }}>{p.body}</p>
      {children}
    </article>
  );
}

/* The receipt disclosure (TokenAnnotation pattern: trigger button,
   aria-expanded/aria-controls, no animation). Renders ONLY when the
   receipt text exists. */
function Receipt({ receipt, accent, id }: { receipt: { text: string; caseHref?: string; caseLabel?: string }; accent: string; id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: "var(--spacing-4)" }}>
      <button type="button" className="tok-annotation__trigger" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        Receipt
      </button>
      {open && (
        <div id={id} className="tok-annotation__panel">
          <p className="card-body" style={{ margin: 0 }}>{receipt.text}</p>
          {receipt.caseHref && (
            <Link href={receipt.caseHref} style={{ color: accent, fontFamily: "var(--font-body)", fontSize: "var(--typography-font-size-sm)", fontWeight: 600, display: "inline-flex", marginTop: "var(--spacing-2)" }}>
              {receipt.caseLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Beat 5: credentials ─────────────────────────────────────────
   Moved up from the learning accordion: named issuers and dates, linked
   where there is proof on the site. Entries marked `pending` have no
   source in the repo yet and render nothing. */
interface Credential {
  title: string;
  issuer: string;
  type: "course" | "workshop" | "conference" | "hackathon";
  year: string;
  link?: { label: string; href: string };
  pending?: boolean;
}

const CREDENTIALS: Credential[] = [
  { title: "Brad Frost Web Maker Program", issuer: "Brad Frost", type: "course", year: "2024-2025", link: { label: "Code First case study", href: "/case-studies/brad-frost" } },
  { title: "Design Tokens Course", issuer: "Romina Kavčič, The Design System Guide", type: "course", year: "2025", link: { label: "From Drift to Foundation", href: "/case-studies/design-system-transformation" } },
  { title: "Into Design Systems", issuer: "Into Design Systems Conference", type: "conference", year: "2025 & 2026", link: { label: "Design System Case Study", href: "/case-studies/design-system-transformation" } },
  { title: "Smart Interface Design Patterns", issuer: "Vitaly Friedman / Smashing Magazine", type: "workshop", year: "2025" },
  { title: "Designing Complex UIs in the Age of AI", issuer: "Vitaly Friedman / Smashing Magazine", type: "workshop", year: "2026", link: { label: "See it live: the System page", href: "/design-system" } },
  /* from the CHIP case: "Five days, solo, for the Anthropic Claude Code hackathon" */
  { title: "Claude Code hackathon", issuer: "Anthropic", type: "hackathon", year: "2026", link: { label: "CHIP case study", href: "/case-studies/chip" } },
  /* TODO(elleta): named in the lock, no source in the repo yet: year,
     exact title, and a link if one is public. Render once filled. */
  { title: "SmashingConf", issuer: "Smashing Magazine", type: "conference", year: "", pending: true },
  { title: "TJ Pitre's Smashing workshop", issuer: "Smashing Magazine", type: "workshop", year: "", pending: true },
];

function CredentialTile({ title, issuer, type, year, link }: { title: string; issuer: string; type?: string; year: string; link?: { label: string; href: string } }) {
  return (
    <Card className="h-full">
      <div className="credential">
        <div className="credential__meta">
          {/* education tiles sit under their own label: no type tag */}
          {type && <span className="tag" style={{ textTransform: "uppercase" }}>{type}</span>}
          {year && <span className="card-meta">{year}</span>}
        </div>
        <h3 className="heading-item" style={{ margin: 0 }}>{title}</h3>
        <p className="card-meta" style={{ margin: 0 }}>{issuer}</p>
        {link && (
          <Link
            href={link.href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              minHeight: "var(--spacing-touch-target)",
              marginTop: "auto",
              fontFamily: "var(--font-body)",
              fontSize: "var(--typography-font-size-sm)",
              fontWeight: 600,
              color: "var(--color-accent-ink)",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            → {link.label}
          </Link>
        )}
      </div>
    </Card>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default function AboutPage() {
  const [resumeOpen, setResumeOpen] = useState(false);
  return (
    <main id="main-content" className="page-shell min-h-screen text-[var(--color-ink-soft)]">
      <OverlayNav />

      <div className="relative">
        {/* 1. Statement hero. TODO(elleta): the statement is assembled
            from her bio line ("so the system stays true on both sides of
            handoff"); confirm or replace. */}
        <section className="layout-section-tight" style={{ paddingTop: "calc(var(--header-height) + var(--spacing-12))" }}>
          <div className="page-container">
            <div className="grid grid-cols-1 items-center gap-[var(--grid-gap)] lg:grid-cols-[1fr_auto]">
              <div>
                <PageHeader eyebrow="About" title="Design systems that stay true on" accent="both sides of handoff." />
                <p className="body-lg" style={{ maxWidth: "640px" }}>
                  I design{" "}
                  <strong style={{ fontWeight: 600, color: "var(--color-ink)" }}>AI-enabled design systems</strong>{" "}
                  for complex, multi-role B2B and enterprise products. Tokens, components, and the
                  governance that keeps them from drifting. I read code, trace how components
                  actually behave in production, and work with engineers directly.
                </p>
              </div>

              <div className="photo-bubble justify-self-center lg:justify-self-end">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/thumbnails/Me.jpeg" alt="Elleta, portrait" />
              </div>
            </div>

            {/* 2. Clients bar */}
            <div style={{ marginTop: "var(--spacing-12)" }}>
              <ClientsBar />
            </div>
          </div>
        </section>

        {/* 3. Where I am now. TODO(elleta): assembled from facts on the
            site (Barcelona, the Brad Frost Web contract, BELLA, CHIP);
            confirm the wording. */}
        <section id="now" className="layout-section-tight">
          <div className="page-container">
            <SectionHeader label="Now" title="Where I am" accent="now." />
            <p className="body-lg about-now" style={{ maxWidth: "640px" }}>
              Based in Barcelona. Right now I&apos;m contracting with Brad Frost Web on his component
              system, and building{" "}
              <Link href="/design-system" className="touch-inline">BELLA</Link>, the system behind this
              site, and <Link href="/case-studies/chip" className="touch-inline">CHIP</Link>, the agent
              that watches it for drift, in public.
            </p>
          </div>
        </section>

        {/* 4. What I won't compromise on */}
        <section id="principles" className="layout-section-tight">
          <div className="page-container">
            <SectionHeader label="Principles" title="What I won't" accent="compromise on." />
            <div className="thesis-row">
              {PRINCIPLES.map((p, i) => (
                <StatementCard key={p.accentWord} p={p}>
                  {p.receipt.text.trim() !== "" && <Receipt receipt={p.receipt} accent={p.accent} id={`principle-receipt-${i}`} />}
                  {p.applied && (
                    <Link
                      href={p.applied.href}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        marginTop: "var(--spacing-4)",
                        fontFamily: "var(--font-body)",
                        fontSize: "var(--typography-font-size-sm)",
                        fontWeight: 600,
                        color: "var(--cc)",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                        minHeight: "var(--spacing-touch-target)",
                      }}
                    >
                      {p.applied.label}
                    </Link>
                  )}
                </StatementCard>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Credentials (education folded in) */}
        <section id="credentials" className="layout-section-tight">
          <div className="page-container">
            {/* no label: it would repeat the title word for word (D4 rhythm) */}
            <SectionHeader title="Credentials" />
            <div className="credentials-grid">
              {CREDENTIALS.filter((c) => !c.pending).map((c) => (
                <CredentialTile key={c.title} {...c} />
              ))}
            </div>
            <p className="section-label" style={{ margin: "var(--spacing-12) 0 var(--spacing-4)" }}>
              Education
            </p>
            <div className="credentials-grid">
              {education.map((e) => (
                <CredentialTile key={e.name} title={e.degree} issuer={e.name} year={e.period} />
              ))}
            </div>
          </div>
        </section>

        {/* 6. Experience + View CV */}
        <ExperienceSection onResumeClick={() => setResumeOpen(true)} />
        <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />

        {/* 7. Testimonials (always visible) */}
        <TestimonialSection />

        {/* 8. Contact: the page's one ask. Copy email lands with parent
            spine item 2 (which also retires /contact and redirects here);
            until then the message form is the channel. */}
        <section id="contact" className="layout-section-tight">
          <div className="page-container">
            <SectionHeader label="Contact" title="Open to full-time roles &" accent="select freelance projects." />
            <p className="body-lg" style={{ maxWidth: "600px" }}>
              I&apos;m at my best on hard problems with people who care about getting them right.
            </p>
            <div className="about-contact__actions">
              <Button variant="primary" href="/contact">
                Send a message <Icon name="ArrowRight" size="sm" />
              </Button>
              <Button href={social.linkedin}>
                LinkedIn <Icon name="OpenNewWindow" size="sm" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
