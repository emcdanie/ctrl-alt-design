import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseStudyHero from "@/components/CaseStudyHero";
import ArtifactPlaceholder from "@/components/ArtifactPlaceholder";
import { Body, PullQuote, Section } from "@/components/CaseStudyTypography";
import Link from "next/link";
import { getCaseStudy, getAdjacentStudies } from "@/data/caseStudies";
import { notFound } from "next/navigation";

export default function FiltersDecisionSupportPage() {
  const cs = getCaseStudy("filters-decision-support-system");
  if (!cs) notFound();

  const { prev, next } = getAdjacentStudies("filters-decision-support-system");

  const metadata = [
    { label: "Year", value: cs.year },
    { label: "Role", value: cs.metrics?.role ?? "" },
    { label: "Team", value: cs.metrics?.team ?? "" },
    { label: "Timeline", value: cs.timeline },
    { label: "Scope", value: cs.scope },
  ].filter((m) => m.value);

  return (
    <CaseStudyLayout>
      <CaseStudyHero
        eyebrow={`${cs.category} · ${cs.year}`}
        title={cs.title}
        intro={cs.description}
        metadata={metadata}
        tags={cs.tags}
        media={{ type: "image", src: cs.heroImage, alt: cs.title }}
      />

      {/* Divider */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ borderTop: "1px solid rgba(26,24,20,0.1)" }} />
      </div>

      {/* Content */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "64px 24px 80px" }}>

        <Section eyebrow="OVERVIEW" heading="Rethinking Filters as a Decision-Support System">
          <Body>
            Most products treat filters as a feature. A set of checkboxes, a dropdown, maybe a few chips
            along the top of a results list. What they rarely are, by design, is a decision-support
            system — a structured way to help users narrow a large problem space toward something meaningful.
          </Body>
          <Body>
            This case study explores the intersection of filtering interface design, design system
            thinking, and cognitive load. It draws on a complex SaaS platform context where multiple
            booking flows and internal tooling were evolving in parallel, and where filtering had
            accumulated into something fragmented and inconsistent across the product.
          </Body>
        </Section>

        <Section eyebrow="CONTEXT" heading="Project Context">
          <Body>
            That distinction matters more than it might appear. When filtering is designed as a feature,
            the goal is to surface controls — to give users access to the parameters available. When
            filtering is designed as a decision-support system, the goal is to help users move from
            uncertainty to choice with as little friction as possible. These are meaningfully different
            design objectives.
          </Body>
          <Body>
            The business goals were straightforward: help users find what they need faster, reduce
            support overhead from user confusion, and create a filtering pattern that could scale as
            the product grew. What became clear, quickly, was that the visible interface problems were
            symptoms of a deeper structural issue.
          </Body>
        </Section>

        <Section eyebrow="ROLE" heading="My Role">
          <Body>
            I led the investigation and redesign of the filtering system. This included auditing
            existing filter patterns across product flows, mapping inconsistencies and their downstream
            effects, defining a system-level pattern architecture, and working directly with engineering
            to ensure the redesigned patterns could be implemented and reused reliably.
          </Body>
          <Body>
            This was not a project with a dedicated design systems team. It required building the case
            for the work while doing it — and making that case to both design and engineering leadership
            in terms that connected to real product outcomes, not just aesthetic improvements.
          </Body>
        </Section>

        <Section eyebrow="THE PROBLEM" heading="Capability Without Clarity Is Just a Different Kind of Friction">
          <Body>
            At first glance, the filtering interfaces across the product looked inconsistent but
            manageable. Filter chips in one flow looked different from filter chips in another. Sort
            controls weren&apos;t positioned consistently. Some filters preserved their active state
            clearly; others gave no visible signal that they were applied at all.
          </Body>
          <Body>
            The instinct was to clean it up visually and standardise the components. But a more
            important question kept surfacing: if we fix how the filters look, will they actually
            become easier to use?
          </Body>
          <PullQuote>
            &ldquo;Consider a user who wants to find a reasonably priced flight arriving before noon. The
            filter panel exposes simultaneously: price range, outbound departure time, return departure
            time, number of stops, airline, layover duration, baggage allowance, refundability, and
            booking class. The interface has more capability than it has clarity — and capability
            without clarity is just a different kind of friction.&rdquo;
          </PullQuote>
          <Body>
            The deeper issue wasn&apos;t visual inconsistency. It was that no shared mental model
            existed for what filtering should do — which meant every flow had developed its own
            answer to the same question. Without that shared model, fixing the surface wouldn&apos;t
            fix the experience.
          </Body>
        </Section>

        {/* ── Interactive Demo ── */}
        <section style={{ marginBottom: "80px" }}>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#8A8A8A",
            marginBottom: "12px",
          }}>
            INTERACTIVE DEMO
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 400,
            color: "#1A1A1A",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}>
            Explore the Filter System
          </h2>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "16px",
            color: "#4A4640",
            lineHeight: 1.7,
            marginBottom: "24px",
          }}>
            An annotated, interactive prototype showing the bottom-sheet filter pattern for flight
            search — demonstrating how progressive disclosure, active state clarity, and high-signal
            filter prioritisation work together.
          </p>
          <div style={{
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid rgba(26,24,20,0.1)",
            background: "#F8F7F4",
          }}>
            <iframe
              src="/demos/bizaway-filter-demo.html"
              style={{
                width: "100%",
                height: "700px",
                border: "none",
                display: "block",
              }}
              title="BizAway Filter Demo — Interactive Prototype"
              loading="lazy"
            />
          </div>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "#8A8480",
            lineHeight: 1.6,
            marginTop: "12px",
          }}>
            Click the annotation pins to hear narrated explanations of each design decision.
          </p>
        </section>

        <Section eyebrow="DESIGNING FOR COGNITION" heading="Reducing Cognitive Load Through Hierarchy">
          <Body>
            Before rethinking how filters look, it&apos;s worth being precise about what they&apos;re
            for. Filtering is fundamentally a narrowing operation: it takes a problem space too large
            to evaluate and makes it smaller. The design question isn&apos;t only which controls to
            surface, but how to help users apply them in the order that resolves uncertainty fastest.
          </Body>
          <Body>
            One pattern that appears consistently across well-designed filtering systems is the
            deliberate prioritisation of a small number of high-signal filters upfront — the criteria
            that resolve the most uncertainty for the most users most of the time. In travel products,
            that tends to be price and departure time. Presenting all filters at equal visual weight,
            with no grouping and no indication of which are most relevant, forces users to understand
            the filter panel before they can narrow the problem.
          </Body>
        </Section>

        <ArtifactPlaceholder
          title="Filter Architecture Diagram"
          description="Add a diagram showing the three-level filter architecture: atomic components, interaction patterns, and composition rules."
          aspectRatio="16/9"
          className="my-10"
        />

        <Section eyebrow="SYSTEM ARCHITECTURE" heading="Three Levels of the Filtering System">
          <Body>
            The redesigned system was designed at three levels. At the atomic level: individual filter
            components — chips, toggles, range sliders, multi-select panels — each with a clear
            contract for how they represent unset, active, and partially-active states. At the
            interaction pattern level: how filtering behaves — when results update, how active states
            are surfaced, how filters are cleared, what happens when results are empty. At the
            composition level: rules governing how filtering components relate to results, to each
            other, and to sort controls across different contexts.
          </Body>
          <Body>
            One of the more important system design decisions was treating filtering not as a bespoke
            solution for each screen or dataset, but as a reusable interaction pattern with a
            consistent contract across the product. Whether a user was filtering a list of bookings,
            a set of search results, or a data table in the internal tooling, the core behaviours
            would feel the same.
          </Body>
        </Section>

        <Section eyebrow="PROCESS" heading="How It Came Together">
          <Body>
            <strong>Pattern Audit.</strong> A focused audit of filtering interfaces across the key
            flows — mapping filter chips, sort controls, active state patterns, and empty states to
            surface where the same user need was being solved differently.
          </Body>
          <Body>
            <strong>Shared Mental Model.</strong> Defining what filtering should do across the product
            before redesigning any component — filtering as progressive narrowing, not data exposure.
          </Body>
          <Body>
            <strong>Three-Level Architecture.</strong> Designing the filtering system at atomic,
            interaction pattern, and composition levels rather than component by component.
          </Body>
          <Body>
            <strong>Governance &amp; Documentation.</strong> Documenting the user need each pattern
            addresses, the contexts it&apos;s appropriate in, and the criteria for deciding when a
            new filter type is warranted versus extending an existing one.
          </Body>
        </Section>

        <Section eyebrow="OUTCOMES" heading="A Shared Language, Not Just Better Components">
          <Body>
            Duplicated filter components consolidated into a smaller set of flexible, well-defined
            building blocks. Interaction patterns for multi-select filtering, range selection, sort
            integration, and empty states defined so that users encounter predictable behaviour across
            flows.
          </Body>
          <Body>
            The most important outcome was structural: a reusable filtering interaction pattern with
            a consistent contract across the product. Filtering went from something every flow handled
            differently to something the system knew how to do — and new flows could inherit rather
            than reinvent.
          </Body>
          <div style={{ marginTop: "32px" }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 20px",
              borderRadius: "999px",
              background: "#1A1814",
              color: "#EDE8DF",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              PROJECT COMPLETE · 2025
            </span>
          </div>
        </Section>

        {/* Prev / Next */}
        <div style={{ borderTop: "1px solid rgba(26,24,20,0.1)", paddingTop: "48px", marginBottom: "64px" }}>
          <div className="flex items-stretch justify-between gap-4">
            {prev ? (
              <Link href={`/case-studies/${prev.slug}`} className="group flex flex-col gap-1.5 max-w-[45%]">
                <span className="section-label">← Previous</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 600, color: "#1A1814", lineHeight: 1.3 }}>{prev.title}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#8A8480" }}>{prev.category}</span>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/case-studies/${next.slug}`} className="group flex flex-col items-end gap-1.5 max-w-[45%]">
                <span className="section-label">Next →</span>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "15px", fontWeight: 600, color: "#1A1814", lineHeight: 1.3, textAlign: "right" }}>{next.title}</span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#8A8480" }}>{next.category}</span>
              </Link>
            ) : <div />}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{ background: "#1A1814", borderRadius: "24px", padding: "56px 48px", display: "flex", flexDirection: "column", gap: "32px" }}
          className="md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", marginBottom: "10px" }}>Have a project in mind?</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.15, textTransform: "uppercase" }}>
              Open to full-time roles &<br />select freelance projects.
            </h2>
          </div>
          <Link
            href="/#contact"
            style={{ flexShrink: 0, background: "#EDE8DF", color: "#1A1814", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "13px", padding: "12px 24px", borderRadius: "999px", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}
          >
            Get in touch ↗
          </Link>
        </div>

      </div>
    </CaseStudyLayout>
  );
}
