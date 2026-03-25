import CaseStudyLayout from "@/components/CaseStudyLayout";
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
      {/* ── Hero ── */}
      <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-28 md:px-8 md:pb-12 md:pt-36">
        <div className="max-w-[620px]">
          <p className="section-label mb-6">{cs.category} · {cs.year}</p>

          <h1 className="mb-6 font-[var(--font-display)] text-[clamp(40px,5.5vw,72px)] font-bold leading-[1.02] tracking-[-0.03em] text-[var(--color-ink)]">
            {cs.title}
          </h1>

          <p className="mb-10 text-[clamp(16px,1.5vw,19px)] leading-[1.75] text-[var(--color-muted)]">
            Designing a decision-support system for complex B2B travel booking — where search, filtering, and results operate as one integrated flow rather than three separate features.
          </p>

          <dl className="mb-8 space-y-4 border-b border-[var(--color-border-soft)] pb-8">
            {metadata.map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-5"
              >
                <dt className="min-w-[100px] text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)] opacity-70">
                  {label}
                </dt>
                <dd className="m-0 max-w-[440px] text-[13.5px] leading-[1.7] text-[var(--color-ink)]">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-2.5">
            {cs.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border px-3.5 py-1.5 text-[11px] font-semibold leading-[1.5] tracking-[0.04em] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                style={{
                  background: "rgba(26,24,20,0.04)",
                  color: "#4A4640",
                  borderColor: "rgba(44, 24, 16, 0.08)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ borderTop: "1px solid rgba(26,24,20,0.1)" }} />
      </div>

      {/* ── Short introduction ── */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 0" }}>
        <Section eyebrow="INTRODUCTION" heading="The Problem Wasn&apos;t the Controls">
          <Body>
            When users struggle with a filtering interface, the instinct is to fix the controls — redesign
            the dropdowns, restyle the chips, reposition the search bar. But on a B2B travel platform
            managing flights, hotels, rail, and car rentals across multiple booking verticals, the
            controls were not the real problem. They technically worked.
          </Body>
          <Body>
            The real problem was conceptual. Search, filters, and results had been designed as three
            separate features — built at different times, by different teams, with different assumptions
            about user intent. But users experienced them as a single decision flow: start with intent,
            narrow the options, compare trade-offs, choose. The interface did not reflect that experience.
          </Body>
        </Section>
      </div>

      {/* ── Prototype — primary artifact, near the top ── */}
      <div style={{ padding: "48px 24px 0" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", marginBottom: "24px" }}>
          <p className="section-label" style={{ marginBottom: "12px" }}>TRY THE PROTOTYPE</p>
          <h2
            className="heading-subsection"
            style={{ marginBottom: "12px" }}
          >
            Explore the Decision System
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              color: "var(--color-muted)",
              lineHeight: 1.7,
              maxWidth: "600px",
            }}
          >
            This interactive prototype explores a different model of travel search — one where search,
            filtering, and results operate as a single decision system. Experiment with filters,
            compare options, and observe how the interface communicates trade-offs between price,
            duration, and travel policy constraints.
          </p>
        </div>
        <PrototypeEmbed
          src="/demos/ctrl-travel-v2.html"
          title="ctrl+travel — Search & Filtering System"
          height="700px"
        />
      </div>

      {/* ── Deep narrative — back to narrow column ── */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "64px 24px 80px" }}>

        <Section eyebrow="CONTEXT" heading="A Platform That Outgrew Its Patterns">
          <Body>
            BizAway is a B2B travel management platform used by companies across Europe to book and
            manage business travel. When I joined, the product had scaled quickly — flights, car
            rentals, hotels, trains — but each vertical had developed its own approach to search,
            filtering, and results presentation. There was no shared vocabulary for how a user
            should move from intent to decision.
          </Body>
          <Body>
            Users needed to explore many options quickly, understand pricing constraints, see company
            policy restrictions, and compare travel combinations — often across verticals in a single
            booking session. The fragmentation was not just a visual problem. It was a cognitive one.
            Every time a user moved between verticals, they had to relearn how to find what they needed.
          </Body>
        </Section>

        <Section eyebrow="THE DECISION PROBLEM" heading="Capability Without Clarity">
          <Body>
            Consider a user who wants to find a reasonably priced flight arriving before noon.
            A typical filter panel for this task might expose simultaneously: price range, outbound
            departure time, return departure time, number of stops, airline, layover duration,
            baggage allowance, refundability, and booking class.
          </Body>
          <PullQuote>
            &ldquo;The interface had more capability than it had clarity — and capability without
            clarity is just a different kind of friction.&rdquo;
          </PullQuote>
          <Body>
            The problem was not that the controls were broken. The problem was that they had been
            designed as isolated data-exposure mechanisms rather than as parts of a decision flow.
            There was no progressive structure to the exploration. No prioritisation of what mattered
            first. No feedback loop between what the user had done and what remained possible.
            Filtering was a feature. It needed to become a system.
          </Body>
        </Section>

        <Section eyebrow="SEARCH AS THE ENTRY POINT" heading="Starting With Intent, Not Parameters">
          <Body>
            In most travel interfaces, the search bar and the filter panel are visually and functionally
            separate. The user types a destination, hits search, and then switches cognitive modes
            to operate a completely different set of controls. The redesign treats search as the
            opening act of the same decision flow that filters continue.
          </Body>
          <Body>
            The prototype explores a natural-language search input that parses user intent into
            structured parameters. A query like &ldquo;business class London Monday refundable&rdquo;
            becomes visible, editable filter chips — making the system&apos;s interpretation transparent
            and correctable. The user stays in one mental model throughout: expressing intent,
            seeing interpretation, refining constraints, evaluating options.
          </Body>
        </Section>

        <Section eyebrow="FACETED FILTERING" heading="Multiple Constraints, Considered Together">
          <Body>
            Faceted filtering — the ability to narrow results along multiple independent dimensions
            simultaneously — is well-established in e-commerce but underused in complex enterprise
            products. The challenge is not implementing it. The challenge is deciding which facets
            matter, in what order, and how they interact.
          </Body>
          <Body>
            For travel booking, the most decision-relevant facets are price, departure time,
            number of stops, airline, and class. But there is a second layer that enterprise
            travel adds: policy compliance. A flight might be the cheapest option and still be
            wrong if it exceeds the company&apos;s travel policy. The faceted model here layers
            business constraints alongside personal preference — treating policy not as a blocker
            that appears at checkout but as a visible dimension of every result.
          </Body>
        </Section>

        <Section eyebrow="VISIBLE FILTER STATE" heading="Always Knowing Where You Are">
          <Body>
            One of the most common failures in filtering interfaces is invisible state. The user
            applies three filters, sees 12 results, and cannot quickly answer: which filters are
            active? How many results existed before? What happens if I remove one? This uncertainty
            makes exploration feel risky rather than fluid.
          </Body>
          <Body>
            The redesign makes filter state continuously visible through several mechanisms: active
            filters change visual state immediately, a persistent result count updates in real time,
            preset filter combinations (Direct, Within Policy, Cheapest, Business) provide common
            starting points, and individual filter values can be cleared independently or all at once.
            The goal is to make the user feel safe experimenting — because the cost of reversing
            any decision is visibly low.
          </Body>
        </Section>

        <Section eyebrow="PROGRESSIVE REFINEMENT" heading="From Broad to Specific, Not All at Once">
          <Body>
            Progressive filtering means that users begin with a broad view and narrow gradually,
            rather than being asked to specify all criteria upfront. This aligns with how people
            actually make travel decisions: they start with a rough sense of what they need and
            refine as they see what is available.
          </Body>
          <Body>
            The prototype supports this through layered entry points. The AI search input accepts
            vague intent. Preset filter buttons offer common constraint packages with a single click.
            Individual faceted filters allow granular control. And the compare function lets users
            hold two or three options side by side once they have narrowed sufficiently. Each layer
            is available, but none is required — the user decides how deep to go based on the
            complexity of their decision.
          </Body>
        </Section>

        <Section eyebrow="REVERSIBLE EXPLORATION" heading="Making It Safe to Experiment">
          <Body>
            A well-designed filtering system should feel like a conversation, not a commitment.
            Every constraint the user applies should be easy to see, easy to modify, and easy to
            undo. This is what Vitaly Friedman describes as reversible exploration — the principle
            that users engage more confidently with complex systems when they know they can always
            step back.
          </Body>
          <Body>
            In the prototype, this manifests as instant feedback on every interaction. Toggling a
            filter immediately updates the result count and the visible results. Clearing all filters
            resets to the full set. The compare function allows adding and removing flights without
            losing the broader search context. There is no dead-end state where the user has to
            start over. The system remembers where they were and makes it easy to adjust course.
          </Body>
        </Section>

        <Section eyebrow="WHAT THE PROTOTYPE DEMONSTRATES" heading="Patterns in Practice">
          <Body>
            <strong>Search and filtering as one flow.</strong> The AI search input, filter strip,
            preset buttons, and sort controls are not separate features — they are different entry
            points into the same narrowing operation. The user can start with any of them and
            the system responds coherently.
          </Body>
          <Body>
            <strong>Policy as a visible dimension.</strong> Travel policy compliance appears on every
            result card — green for within policy, amber for near limit. This turns an institutional
            constraint into a scannable attribute, not a surprise rejection at checkout.
          </Body>
          <Body>
            <strong>Structured comparison.</strong> The compare function generates an AI-assisted
            side-by-side analysis with pros, cons, and a recommendation. This supports the final
            stage of the decision: not just finding options, but choosing between them with confidence.
          </Body>
          <Body>
            <strong>Progressive booking.</strong> Selecting a flight opens a booking panel with
            pre-filled traveller details, a seat map with preference memory, and a price breakdown —
            reducing the transition from decision to action.
          </Body>
        </Section>

        <Section eyebrow="REFLECTION" heading="What I Would Do Next">
          <Body>
            The system thinking behind this work — progressive disclosure, faceted filtering,
            visible state, reversible exploration — still holds. The patterns are sound. But the
            input model still assumes users know which parameters matter. The search input accepts
            natural language, but the underlying model is still translating intent into the
            system&apos;s vocabulary rather than the user&apos;s.
          </Body>
          <Body>
            If I were extending this today, I would invest in two areas. First, adaptive defaults:
            learning from booking patterns to pre-populate search with likely parameters, so the
            system starts closer to the answer for repeat travellers. Second, constraint negotiation:
            when no results match all criteria, rather than showing an empty state, surfacing which
            constraint could be relaxed to unlock the most options — and letting the user make
            that trade-off explicitly.
          </Body>
          <Body>
            The goal is not a smarter search bar. It is a system that understands the shape of the
            decision and meets the user where they are within it — whether that is a vague intent,
            a specific requirement, or a comparison between two close options. That is the gap between
            a good filtering interface and a genuine decision-support system.
          </Body>
        </Section>

        {/* ── Additional demos ── */}
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

        <div style={{ marginTop: "32px", marginBottom: "48px" }}>
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

        {/* ── Prev / Next ── */}
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

        {/* ── CTA ── */}
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
