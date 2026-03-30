import CaseStudyLayout from "@/components/CaseStudyLayout";
import CaseStudyShell from "@/components/CaseStudyShell";
import { Body, PullQuote, Section } from "@/components/CaseStudyTypography";

export default function BradFrostPage() {
  return (
    <CaseStudyLayout>
      <CaseStudyShell
        eyebrow="Design System Collaboration · 2024–2025"
        title="Code First"
        summary="What building Brad Frost's component system in reverse taught me about design — and why working code-first changes everything you pay attention to."
        metadata={[
          { label: "Year", value: "2024–2025" },
          { label: "Role", value: "Design System Collaborator" },
          { label: "Scope", value: "Component Architecture · Token Alignment · Figma–Storybook Integration · MCP" },
          { label: "Organisation", value: "Brad Frost Web — Maker Program" },
        ]}
        tags={["Design Systems", "Atomic Design", "Code-First", "AI Tooling"]}
        media={{ type: "video", src: "/videos/eddie.mp4" }}
      >

        <Section eyebrow="OVERVIEW" heading="Project Overview">
          <Body>
            I opened the Figma file and the code side by side. The button in Figma said &apos;Primary, Large.&apos; The button in Storybook said &apos;variant: action, size: lg.&apos; Same component. Different names. Different assumptions. And this was one of the simpler ones. Somewhere in the gap between those two descriptions, a year of quiet drift had accumulated — and nobody had noticed because the system still looked right, even though it no longer said the same thing in both places.
          </Body>
          <Body>
            This was Brad Frost&apos;s design system. The person who wrote Atomic Design. If alignment could drift here, in a system built on first principles by someone who literally invented the vocabulary — it could drift anywhere. That realisation reframed the entire project for me.
          </Body>
          <Body>
            Working as part of the Maker Program, the challenge wasn&apos;t to design a system and hand it off. It was to understand an existing, principled system deeply enough to contribute at the component and token level — to close the gap between Figma and code, and to explore whether AI tooling could make that kind of structural investigation fundamentally faster.
          </Body>
        </Section>

        <Section eyebrow="CONTEXT" heading="Starting From Code">
          <Body>
            Brad Frost&apos;s approach to design systems is rooted in Atomic Design — the idea that UIs are built from atoms to molecules to organisms, and that the smallest decisions compound upward. Working with his system meant operating in an environment where those principles were already embedded in the codebase, not aspirational documentation.
          </Body>
          <Body>
            The Maker Program is structured around real contribution: participants don&apos;t observe, they build. The expectation from day one was to read the existing codebase, understand how components were structured, identify gaps between design and implementation, and then close them — through Figma work, documentation, and direct collaboration with Brad and other contributors.
          </Body>
          <Body>
            This was a fundamentally different experience from owning a design system from scratch. Every decision had to be justified against an existing, principled structure rather than invented from first principles. That constraint turned out to be enormously useful.
          </Body>
        </Section>

        <Section eyebrow="MY ROLE" heading="Collaboration and Contribution">
          <Body>
            My work spanned three areas. The first was component archaeology: reading Storybook stories, tracing prop structures, and mapping how existing components composed. This wasn&apos;t glamorous work, but it was the prerequisite for everything else — you can&apos;t contribute to a design system you don&apos;t understand.
          </Body>
          <Body>
            The second was Figma alignment: rebuilding or updating Figma components to accurately reflect their code counterparts. This meant matching variant names to prop names, ensuring token usage was consistent, and eliminating the silent drift that accumulates when design and code evolve independently.
          </Body>
          <Body>
            The third was tooling: using Claude via MCP to interrogate system structure, surface token relationships, and accelerate the investigation work that would otherwise require extensive manual tracing. This was the most experimental part of the project and the one I learned the most from.
          </Body>
        </Section>

        <PullQuote>
          &quot;Working code-first changes what you pay attention to. You stop asking &apos;what should this look like?&apos; and start asking &apos;what does this actually do, and why?&apos;&quot;
        </PullQuote>

        <Section eyebrow="TECHNICAL WORK" heading="Token Alignment and Component Architecture">
          <Body>
            Token alignment was the most technically demanding part of the work. The system used a layered token structure — primitive values feeding into semantic aliases, which fed into component-level decisions. Understanding where a visual change should be made required tracing the full chain before touching anything.
          </Body>
          <Body>
            Several components had diverged between Figma and Storybook over time. Some were structural: variant names in Figma didn&apos;t match prop names in code, which made handoff ambiguous. Others were visual: spacing or color values had been updated in one place but not the other. The process of aligning these wasn&apos;t just cosmetic — it required understanding the intent behind each decision well enough to make the right reconciliation.
          </Body>
          <Body>
            Component architecture decisions in the codebase reflected years of atomic thinking. Certain patterns that I might have approached differently as a solo designer — like deeply nested composition patterns or explicit default prop handling — made more sense in context. That was a useful recalibration: understanding why a system is structured the way it is before proposing changes to it.
          </Body>
        </Section>

        <Section eyebrow="AI TOOLING" heading="Using Claude MCP for System Investigation">
          <Body>
            The most novel part of the project was using Claude&apos;s Model Context Protocol to assist with system investigation. MCP allows Claude to interact directly with local files and project structure, which made it possible to ask structural questions about the codebase — &quot;what components use this token?&quot;, &quot;where is this variant defined?&quot; — and get answers grounded in the actual code rather than hallucinated from training data.
          </Body>
          <Body>
            This changed the pace of investigation work significantly. Manual token tracing across a large component library can take hours. Using MCP to surface relationships and then verify them manually reduced that to minutes for most queries. The workflow settled into a pattern: use Claude to generate a structural hypothesis, verify it against the source, then act on it.
          </Body>
          <Body>
            The limits were also instructive. MCP is powerful for surfacing structure, but it doesn&apos;t replace understanding. Queries that required design judgement — &quot;is this the right token for this context?&quot; — still needed a human answer. The tooling accelerated investigation; it didn&apos;t replace thinking.
          </Body>
        </Section>

        <PullQuote>
          &quot;The best use of AI in design system work isn&apos;t generating components — it&apos;s accelerating the investigation that good system decisions depend on.&quot;
        </PullQuote>

        {/* Live Demo Video */}
        <section style={{ marginBottom: "72px", marginTop: "64px" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "#8A8A8A", marginBottom: "12px" }}>
            Live Demo
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 400, color: "#1A1A1A", lineHeight: 1.2, marginBottom: "16px" }}>
            Connecting the System to AI in Real Time
          </h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "16px", color: "#2C2C2C", lineHeight: 1.7, marginBottom: "24px" }}>
            To explore how AI tools could interact with a live design system, we connected the Figma component library to an MCP workflow and tested it in real time — alongside Brad Frost and TJ Pitre.
          </p>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", borderRadius: "16px", overflow: "hidden", background: "#0A0A0A", boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
            <iframe
              src="https://www.youtube.com/embed/w6bHNKU_Tn8?start=2376"
              title="Brad Frost, Elleta McDaniel & TJ Pitre — Connecting Figma Design System to MCP"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#8A8A8A", marginTop: "12px", lineHeight: 1.5 }}>
            Recorded session with Brad Frost, TJ Pitre, and Elleta McDaniel — starts at the MCP integration demo (39:36).
          </p>
        </section>

        <Section eyebrow="KEY LEARNINGS" heading="Key Learnings">
          <Body>
            <strong>Code-first is a design skill.</strong> Reading a codebase to understand design intent requires the same analytical rigour as reading a user research report. The information is just encoded differently.
          </Body>
          <Body>
            <strong>Token discipline is a long-term investment.</strong> Systems that maintain strict token layering are significantly easier to update consistently. The upfront cost of doing this well pays back compoundingly as the system scales.
          </Body>
          <Body>
            <strong>Figma–Storybook alignment requires active maintenance.</strong> Drift is the default state; alignment requires deliberate process. The question isn&apos;t whether it will drift — it&apos;s whether you&apos;ve built the habit of closing the gap.
          </Body>
          <Body>
            <strong>AI tooling changes what&apos;s feasible in investigation.</strong> MCP-assisted system investigation made structural questions answerable in minutes that would previously have taken hours. That changes what you can reasonably attempt in a bounded project.
          </Body>
        </Section>

        <Section eyebrow="REFLECTION" heading="Reflection">
          <Body>
            This project shifted my intuition about where design system work actually happens. The highest-value work isn&apos;t in the Figma file — it&apos;s in the alignment between design intent and implementation reality. That alignment requires a designer who can read code, trace decisions, and understand a system on its own terms before proposing changes to it.
          </Body>
          <Body>
            Working with Brad&apos;s system was the most rigorous design system experience I&apos;ve had precisely because there was no greenfield freedom. Every decision was in conversation with something that already existed and had been thought through. That constraint is, I think, the most realistic version of design system work at scale — and the one worth getting good at.
          </Body>
        </Section>

      </CaseStudyShell>
    </CaseStudyLayout>
  );
}
