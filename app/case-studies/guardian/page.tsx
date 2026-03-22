import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseStudyHero from "@/components/CaseStudyHero";
import { Body, PullQuote, Section } from "@/components/CaseStudyTypography";
import ArtifactPlaceholder from "@/components/ArtifactPlaceholder";

export default function GuardianPage() {
  return (
    <CaseStudyLayout>
      <CaseStudyHero
        eyebrow="Hackathon Concept · 2026"
        title="From Isolation to Interpretation"
        intro="Designing a Context-Aware Design System Guardian — an AI-assisted concept that detects drift, surfaces contextual guidance, and helps teams make confident system decisions without leaving their workflow."
        metadata={[
          { label: "Year", value: "2026" },
          { label: "Role", value: "Concept Lead — Interaction & Strategy" },
          { label: "Scope", value: "AI UX · Design System Governance · Figma Plugin Concept" },
          { label: "Organisation", value: "Into Design Systems Hackathon (sponsored by Figma)" },
        ]}
        tags={["Design Systems", "AI UX", "Hackathon", "Governance"]}
        media={{ type: "video", src: "/videos/hackathon-showreel.mp4" }}
      />

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px 120px" }}>

        <Section eyebrow="OVERVIEW" heading="Project Overview">
          <Body>
            Design systems are meant to create consistency and speed across products. But as teams grow and products evolve, maintaining alignment becomes increasingly difficult. Components are modified. Tokens are overridden. Patterns are recreated instead of reused. And by the time anyone notices, the cost of reversing the drift is already significant.
          </Body>
          <Body>
            During the Into Design Systems Hackathon (2026), sponsored by Figma, a team of eight designers and developers came together around a problem they had all lived personally: design system interpretation happens in isolation, and the consequences only surface at the moments — handoff, review, production — when change is hardest.
          </Body>
          <Body>
            The question the project set out to answer was not "how do we document better?" It was: what if the design system could be present at the moment decisions are actually made? This became Guardian — an AI-assisted concept designed to detect drift, surface contextual guidance, and help teams make confident system decisions without leaving their workflow.
          </Body>
        </Section>

        <ArtifactPlaceholder
          title="Overview Artifact"
          description="Add a supporting screenshot that grounds the project overview in a concrete visual."
          aspectRatio="16/9"
          className="my-10"
        />

        <Section eyebrow="THE PROBLEM" heading="Spotting the Gap">
          <Body>
            Most design systems fail not because they are poorly built, but because they are difficult to apply consistently under pressure. Three groups were operating with incomplete information and no shared feedback loop. Designers didn't always know what existed, what was permitted, or what had already drifted. Developers didn't know which components were canonical or when to extend versus rebuild. And the design system team had no visibility into what was being used, reused, or silently reinvented — until something surfaced in a review.
          </Body>
          <Body>
            The insight that reframed the entire project: documentation alone doesn't change behaviour. Real-time feedback does. Teams don't break design systems intentionally — they break them because they are moving fast, the system isn't present, and there is no signal telling them anything has gone wrong until it is expensive to fix.
          </Body>
          <PullQuote>
            "The core problem wasn't a documentation gap. It was a feedback gap. Governance was arriving too late, at the highest possible cost."
          </PullQuote>
        </Section>

        <Section eyebrow="MY ROLE" heading="Concept Lead">
          <Body>
            I led the concept direction, interaction model, and narrative framing throughout the project. This included facilitating early problem definition, shaping the HMW framework, developing the FigPal interaction concept, and guiding the team through a series of Figma Make prototypes toward a coherent, demo-ready experience. A significant part of the work was convergence — turning five distinct partial flows into one shared story that designers and developers could both build from.
          </Body>
        </Section>

        <Section eyebrow="RESEARCH" heading="Investigation & Research">
          <Body>
            Early sessions on the FigJam board surfaced a large volume of valid pain points across all three groups. The risk at this stage was fragmentation: every team member had lived a slightly different version of the problem, and there was a strong pull toward solving all of them simultaneously. Working through How Might We statements — anchored in a Vitaly Friedman-style frame that prioritised behaviour change over feature invention — helped the team converge on a shared north star.
          </Body>
          <Body>
            The framing that held: viewed from three angles, the same problem was actually one broken feedback loop. Design, code, and the system were operating in parallel rather than in a continuous, informed circle. The goal wasn't control, enforcement, or better dashboards. It was context, feedback, and learning — delivered at the moment decisions were being made.
          </Body>
          <Body>
            Existing tools in this space shared a common characteristic: they were reactive. A designer had to know what to ask, leave their workflow to ask it, and interpret the answer independently. This became the clearest differentiator: most design system tools answer questions. Guardian intervenes at the moment decisions are made.
          </Body>
        </Section>

        <Section eyebrow="STRATEGY" heading="Design Strategy">
          <Body>
            The strategy had two interlocking parts. The first was defining what Guardian was not: not a linter, not a chatbot, not a blocking governance tool, not a dashboard for managers. The second was naming the actual pattern: situated system intelligence. A persistent, context-aware presence that lives where work happens, observes real decisions as they are made, and intervenes only when there is a genuine, high-confidence signal worth surfacing.
          </Body>
          <Body>
            Governance + Growth = Guardian. Governance: helping teams apply existing guidance consistently and as intended. Growth: identifying gaps, edge cases, and emerging needs so the system evolves based on real usage. Guardian as the mechanism connecting the two — making interpretation visible while work is being created, not after it has been delivered.
          </Body>
        </Section>

        <Section eyebrow="ARCHITECTURE" heading="Concept Architecture">
          <Body>
            Guardian operates across three layers. Detection: analysing design and implementation artifacts to identify potential drift before it becomes structural. Contextual feedback: surfacing guidance at the moment of decision rather than at review — not blocking work, but explaining it. Learning: capturing decisions and edge cases so the system can evolve intentionally. Repeated snowflakes signal missing variants. Frequent overrides signal token gaps. This is how governance becomes proactive rather than reactive.
          </Body>
        </Section>

        <Section eyebrow="INTERACTION DESIGN" heading="Interaction Design Decisions">
          <Body>
            The interaction concept centred on Figma's existing FigPal extended into a context-aware guardian. FigPal was designed as an entry point, not a container — small, present, and quiet in its idle state, hovering just above the canvas toolbar. The character had emotional range across states (idle, alert, thinking, success) but the animations served function rather than personality. The most important constraint was restraint: FigPal would only speak when there was a genuine signal.
          </Body>
          <Body>
            Engaging with a FigPal signal opened a full-width, bottom-docked console inspired by VS Code's terminal model. Inside the console, the same underlying diff data could be viewed three ways — Design, Variants, and Code — so that the same conversation could happen with designers, developers, and system owners without requiring a separate tool.
          </Body>
          <PullQuote>
            "The console was not a chat interface. It was a reconciliation surface — a place where design intent and code reality could be seen side by side, disagreements named, and decisions recorded."
          </PullQuote>
          <Body>
            After reviewing a drift signal, the user could choose to align with the system, propose a system evolution, or proceed with a known deviation — each choice captured with context and surfaced to the relevant team.
          </Body>
        </Section>

        <ArtifactPlaceholder
          title="Interaction Artifact"
          description="Add a screenshot of the interaction flow or console state to document behavior."
          aspectRatio="16/9"
          className="my-10"
        />

        <Section eyebrow="PROTOTYPE" heading="Prototype and Feasibility">
          <Body>
            To explore technical feasibility in parallel, the development team built a working prototype using AI-driven analysis, a bot interface connected to system data, and a lightweight monitoring layer. This demonstrated that the concept could integrate with existing Figma workflows rather than requiring designers to manage a separate tool.
          </Body>
        </Section>

        <Section eyebrow="PROCESS" heading="Collaboration and Process">
          <Body>
            The process itself became a design constraint. Roles were separated clearly: designers owned the screens and narrative, developers evaluated feasibility and architecture, and a shared canon — a single agreed flow, explicit definitions, a set of non-negotiables — served as the system everyone worked from. The most useful facilitation principle was resisting the pull toward premature detail. Holding the boundary — this is a design-time tool, not a global update mechanism — prevented the concept from expanding beyond what could be demonstrated or defended.
          </Body>
        </Section>

        <Section eyebrow="OUTCOMES" heading="Outcomes">
          <Body>
            The final demo showed a coherent, believable experience: a designer working in Figma receives a non-blocking signal from FigPal, engages with a bottom console surfacing the exact differences between their design and the system, makes a deliberate decision, and sends a note to development — all without leaving the canvas.
          </Body>
          <Body>
            The concept demonstrated three things: real-time in-context guidance is architecturally feasible within Figma's plugin model; design-to-code comparison can be surfaced meaningfully for designers; and governance doesn't require enforcement — making decisions visible and intentional is sufficient to change behaviour.
          </Body>
        </Section>

        <Section eyebrow="KEY LEARNINGS" heading="Key Learnings">
          <Body>
            <strong>Governance needs visibility before it needs rules.</strong> Teams struggle to follow design systems when there is no clear signal about when things diverge. Making drift visible is the prerequisite for everything else.
          </Body>
          <Body>
            <strong>Education is more effective than enforcement.</strong> Providing contextual explanations at the moment of decision helps teams understand the reasoning behind system choices and builds long-term alignment rather than short-term compliance.
          </Body>
          <Body>
            <strong>Design systems are living systems.</strong> Capturing decisions and deliberate deviations allows a system to grow without losing coherence.
          </Body>
        </Section>

        <Section eyebrow="REFLECTION" heading="Reflection">
          <Body>
            The most useful reframe on this project was recognising that the design system problem is not, at its core, a tooling problem. It is a communication problem that happens to live inside tools. Documentation doesn't change behaviour because reading documentation is not part of the flow state where decisions actually get made.
          </Body>
          <Body>
            If I were starting this again, I would invest earlier in defining the line between drift and evolution. That single question — is this an intentional system change or an accidental deviation? — is the axis around which all the governance logic turns.
          </Body>
          <PullQuote>
            "The best governance is invisible. It works because the right choice was always easier than the wrong one."
          </PullQuote>
        </Section>

        <div style={{ background: "#F5F4F1", borderLeft: "3px solid #CCCCCC", padding: "20px 24px", borderRadius: "4px", fontFamily: "var(--font-body)", fontSize: "13px", color: "#666666", lineHeight: 1.6, marginTop: "64px" }}>
          <strong style={{ color: "#2C2C2C" }}>Visual assets to add:</strong>
          {" "}(1) Guardian Loop circular diagram — Observe, Interpret, Communicate, Learn.
          {" "}(2) FigPal state map — idle, alert, thinking, success.
          {" "}(3) Design ↔ Code console annotated screenshot.
          {" "}(4) System Health Dashboard F1-style signals overview.
        </div>

      </div>
    </CaseStudyLayout>
  );
}
