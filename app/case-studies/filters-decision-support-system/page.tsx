import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseStudyShell from "@/components/CaseStudyShell";
import { Body, PullQuote, Section } from "@/components/CaseStudyTypography";
import PrototypeEmbed from "@/components/PrototypeEmbed";
import { getCaseStudy, getAdjacentStudies } from "@/lib/content";
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
      <CaseStudyShell
        eyebrow={`${cs.category} · ${cs.year}`}
        title={cs.title}
        summary="Designing a decision-support system for complex B2B travel booking — where search, filtering, and results operate as one integrated flow rather than three separate features."
        metadata={metadata}
        tags={cs.tags}
        media={{ type: "image", src: cs.heroImage }}
        demoLinks={cs.demoLinks}
        liveUrl={cs.liveUrl || undefined}
        prev={prev}
        next={next}
      >

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

        {/* ── Prototype Journey ── */}
        <section style={{ marginBottom: "72px" }}>
          <p className="section-label" style={{ marginBottom: "12px" }}>PROTOTYPE JOURNEY</p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 400,
              color: "#1A1A1A",
              lineHeight: 1.2,
              marginBottom: "12px",
            }}
          >
            From Exploration to Decision System
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              color: "var(--color-muted)",
              lineHeight: 1.7,
              maxWidth: "600px",
              marginBottom: "32px",
            }}
          >
            These prototypes trace the evolution of the search and filtering system — from early
            pattern exploration through to the final integrated decision flow.
          </p>

          {/* Step 1 */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px" }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--color-muted)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                01 · Early Exploration
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "var(--color-muted)",
                lineHeight: 1.6,
                marginBottom: "12px",
                maxWidth: "520px",
              }}
            >
              Initial search interface patterns — testing how users approach travel queries and
              understanding baseline interaction models.
            </p>
            <a
              href="/demos/bizaway-search.html"
              target="_blank"
              rel="noopener noreferrer"
              className="demo-link"
            >
              <span style={{ fontSize: "14px" }}>↗</span> BizAway Search Prototype
            </a>
          </div>

          {/* Step 2 */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px" }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--color-muted)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                02 · Filter Interaction Experiments
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "var(--color-muted)",
                lineHeight: 1.6,
                marginBottom: "12px",
                maxWidth: "520px",
              }}
            >
              Exploring faceted filtering mechanics — how constraints combine, how state is
              communicated, and how users recover from over-filtering.
            </p>
            <a
              href="/demos/bizaway-filter-demo.html"
              target="_blank"
              rel="noopener noreferrer"
              className="demo-link"
            >
              <span style={{ fontSize: "14px" }}>↗</span> BizAway Filter Demo
            </a>
          </div>

          {/* Step 3 — Final prototype */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "6px" }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--color-muted)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                03 · Final Decision System
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                color: "var(--color-muted)",
                lineHeight: 1.6,
                marginBottom: "16px",
                maxWidth: "520px",
              }}
            >
              The complete integrated prototype — search, filtering, comparison, and booking
              operating as one unified decision flow with AI-assisted search and policy awareness.
            </p>
          </div>
          <PrototypeEmbed
            src="/demos/ctrl-travel-v2.html"
            title="ctrl+travel — Search & Filtering System"
            height="700px"
          />
        </section>

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

      </CaseStudyShell>
    </CaseStudyLayout>
  );
}
