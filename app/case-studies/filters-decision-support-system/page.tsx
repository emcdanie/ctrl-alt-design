import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseStudyHero from "@/components/CaseStudyHero";
import { Body, PullQuote, Section } from "@/components/CaseStudyTypography";
import PrototypeEmbed from "@/components/PrototypeEmbed";
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

        <Section eyebrow="OVERVIEW" heading="Rethinking Search & Filtering as Decision Support">
          <Body>
            Most products treat search and filtering as separate features. A text input here,
            some checkboxes there, maybe a few chips along the top of a results list. What they
            rarely are, by design, is a decision-support system — a structured way to help users
            move from a vague intent to a confident choice.
          </Body>
          <Body>
            This case study explores the intersection of search UX, filtering architecture,
            and cognitive load within a complex B2B travel platform. Multiple booking flows
            and internal tooling were evolving in parallel, and the way users found and
            compared options had accumulated into something fragmented and inconsistent.
          </Body>
        </Section>

        <Section eyebrow="CONTEXT" heading="A Platform That Grew Faster Than Its Patterns">
          <Body>
            BizAway is a B2B travel management platform used by companies to book and manage
            business travel. When I joined, the product had scaled quickly — flights, car rentals,
            hotels, trains — but each vertical had developed its own approach to search, filtering,
            and results presentation.
          </Body>
          <Body>
            Users needed to explore many options quickly, understand pricing constraints, see company
            policy restrictions, and compare travel combinations. The business goals were clear: help
            users find what they need faster, reduce support overhead from confusion, and create
            patterns that could scale as the product grew. What became clear quickly was that the
            visible interface problems were symptoms of a deeper structural issue.
          </Body>
        </Section>

        <Section eyebrow="ROLE" heading="My Role">
          <Body>
            I led the investigation and redesign of the search and filtering system. This included
            auditing existing patterns across product flows, mapping inconsistencies and their
            downstream effects, defining a system-level architecture, and working directly with
            engineering to ensure the redesigned patterns could be implemented and reused reliably.
          </Body>
          <Body>
            This was not a project with a dedicated design systems team. It required building the case
            for the work while doing it — and making that case to both design and engineering leadership
            in terms that connected to real product outcomes, not just aesthetic improvements.
          </Body>
        </Section>

        <Section eyebrow="THE PROBLEM" heading="Capability Without Clarity Is Just a Different Kind of Friction">
          <Body>
            At first glance, the interfaces across the product looked inconsistent but manageable.
            Filter chips in one flow looked different from another. Sort controls weren&apos;t
            positioned consistently. Search inputs behaved differently across verticals. Some
            filters preserved their active state clearly; others gave no visible signal at all.
          </Body>
          <Body>
            The instinct was to clean it up visually and standardise the components. But a more
            important question kept surfacing: if we fix how things look, will they actually
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
            existed for what search and filtering should do as a system — which meant every flow
            had developed its own answer to the same questions. Filters behaved inconsistently,
            search states were unclear, results cards lacked hierarchy, and booking constraints
            appeared too late in the flow.
          </Body>
        </Section>

        <Section eyebrow="SYSTEM THINKING" heading="Three Levels of the Search & Filtering System">
          <Body>
            The redesigned system was designed at three levels. At the atomic level: individual
            components — search inputs, filter chips, toggles, range sliders, results cards — each
            with a clear contract for how they represent their states. At the interaction pattern
            level: how search and filtering behave together — when results update, how active
            states are surfaced, how constraints are communicated, what happens when results are empty.
            At the composition level: rules governing how these components relate to each other across
            different booking verticals.
          </Body>
          <Body>
            One of the more important decisions was treating search and filtering not as bespoke
            solutions for each screen, but as a reusable interaction pattern with a consistent
            contract across the product. Whether a user was searching flights, filtering car rentals,
            or comparing hotel options, the core behaviours would feel the same. Many of these
            patterns later informed the broader design system thinking for the product.
          </Body>
        </Section>

      </div>

      {/* ── Embedded Prototype — breaks out of narrow column ── */}
      <div style={{ padding: "0 24px 64px" }}>
        <Section eyebrow="INTERACTIVE PROTOTYPE" heading="Explore the Search & Filtering System">
          <PrototypeEmbed
            src="/demos/ctrl-travel-v2.html"
            title="ctrl+travel — Search & Filtering System"
            description="This interactive prototype explores how search, filters, and results can work as a unified decision-support system rather than isolated interface elements. Try adjusting filters, sorting results, and exploring different booking options to see how the system responds."
            height="700px"
          />
        </Section>
      </div>

      {/* Back to narrow column */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px 80px" }}>

        <Section eyebrow="KEY IDEAS EXPLORED" heading="What the Prototype Demonstrates">
          <Body>
            <strong>Progressive filter disclosure.</strong> Rather than presenting every filter
            at equal weight, the system surfaces high-signal filters first — the criteria that
            resolve the most uncertainty for the most users. Price and departure time appear
            prominently; niche filters are accessible but not competing for attention.
          </Body>
          <Body>
            <strong>Results card hierarchy.</strong> Each result card is structured so the most
            decision-relevant information — price, duration, policy compliance — is scannable
            without expanding. Secondary details are available but don&apos;t compete with
            the primary comparison task.
          </Body>
          <Body>
            <strong>Constraint surfacing.</strong> Company policy restrictions and booking
            constraints appear in context alongside results, not as surprise blockers at
            checkout. Users can see what&apos;s compliant before they commit.
          </Body>
          <Body>
            <strong>Unified search + filter flow.</strong> Search and filtering are treated as
            a continuous narrowing operation rather than separate interface concerns. The user
            moves from intent to options to choice through a single coherent flow.
          </Body>
        </Section>

        <Section eyebrow="IF I DESIGNED THIS TODAY" heading="Where This Goes Next">
          <Body>
            The system thinking behind this work — reusable patterns, progressive disclosure,
            structured constraint messaging — still holds. But the input model assumed users
            already knew which parameters mattered.
          </Body>
          <Body>
            If I were designing this today, I&apos;d introduce an AI-assisted search layer where
            users could describe their intent in natural language — &ldquo;find the fastest flight
            to Berlin under &euro;400 that complies with my company policy&rdquo; — and the system
            would translate that into structured filters, surface constraints proactively, and learn
            from the patterns of experienced travel managers to suggest smarter defaults.
          </Body>
          <Body>
            The filtering system would still do the heavy lifting underneath. But the entry
            point would shift from &ldquo;understand these controls&rdquo; to &ldquo;tell me what
            you need.&rdquo; That&apos;s the gap between a good filtering system and a genuine
            decision-support tool.
          </Body>
        </Section>

        <Section eyebrow="PROCESS" heading="How It Came Together">
          <Body>
            <strong>Pattern Audit.</strong> A focused audit of search and filtering interfaces across
            the key flows — mapping filter chips, sort controls, search inputs, active state patterns,
            and empty states to surface where the same user need was being solved differently.
          </Body>
          <Body>
            <strong>Shared Mental Model.</strong> Defining what search and filtering should do across
            the product before redesigning any component — search and filtering as progressive
            narrowing, not data exposure.
          </Body>
          <Body>
            <strong>Three-Level Architecture.</strong> Designing the system at atomic, interaction
            pattern, and composition levels rather than component by component.
          </Body>
          <Body>
            <strong>Governance &amp; Documentation.</strong> Documenting the user need each pattern
            addresses, the contexts it&apos;s appropriate in, and the criteria for deciding when a
            new component is warranted versus extending an existing one.
          </Body>
        </Section>

        <Section eyebrow="OUTCOMES" heading="A Shared Language, Not Just Better Components">
          <Body>
            Duplicated components consolidated into a smaller set of flexible, well-defined
            building blocks. Interaction patterns for search, multi-select filtering, range
            selection, sort integration, and empty states defined so that users encounter
            predictable behaviour across flows.
          </Body>
          <Body>
            The most important outcome was structural: a reusable search and filtering interaction
            pattern with a consistent contract across the product. These flows went from something
            every vertical handled differently to something the system knew how to do — and new
            flows could inherit rather than reinvent.
          </Body>
          <div style={{ marginTop: "40px", marginBottom: "32px" }}>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#8A8A8A",
              marginBottom: "16px",
            }}>
              ADDITIONAL DEMOS
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <a
                href="/demos/bizaway-search.html"
                target="_blank"
                rel="noopener noreferrer"
                className="demo-link"
              >
                <span aria-hidden>↗</span> BizAway search prototype
              </a>
              <a
                href="/demos/bizaway-filter-demo.html"
                target="_blank"
                rel="noopener noreferrer"
                className="demo-link"
              >
                <span aria-hidden>↗</span> BizAway filter demo
              </a>
            </div>
          </div>

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
