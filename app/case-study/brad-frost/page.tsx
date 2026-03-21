import CaseStudyShell from "@/components/CaseStudyShell";
import { Eyebrow, H2, Body, PullQuote, Section } from "@/components/CaseStudyTypography";
import ArtifactPlaceholder from "@/components/ArtifactPlaceholder";

const TAG_COLORS = [
  { bg: "#E8F2FA", color: "#2A6A9E" },
  { bg: "#F0EDF8", color: "#5C4A9A" },
  { bg: "#FDF3E3", color: "#9A6020" },
  { bg: "#EBF5EC", color: "#2A7A32" },
  { bg: "#FAF0EC", color: "#9A4020" },
  { bg: "#F5EDF5", color: "#8A3A8A" },
];
function tagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

const sidebar = [
  { label: "YEAR", value: "2024–2025" },
  { label: "ROLE", value: "Design System Collaborator" },
  { label: "TEAM", value: "Brad Frost Web Maker Program" },
  { label: "TIMELINE", value: "Oct 2024 – Jan 2025" },
  { label: "SCOPE", value: "Component Architecture, Token Alignment, Figma–Storybook Integration, MCP" },
  { label: "TOOLS", value: "Figma, Storybook, Claude, MCP" },
];

const tags = ["Design Systems", "Atomic Design", "Code-First", "AI Tooling"];


export default function BradFrostPage() {
  return (
    <CaseStudyShell>

      {/* Hero */}
      <div style={{
        width: "100%",
        aspectRatio: "16/9",
        maxHeight: "80vh",
        background: "#0A0A1C",
        position: "relative",
        overflow: "hidden",
      }}>
        <video
          autoPlay muted loop playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src="/videos/eddie.mov" type="video/mp4" />
        </video>
      </div>

      {/* Content area */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "64px 40px",
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        gap: "80px",
        alignItems: "start",
      }}>

        {/* Sidebar */}
        <aside style={{ position: "sticky", top: "100px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {sidebar.map(({ label, value }) => (
              <div key={label}>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.12em",
                  color: "#8A8A8A",
                  marginBottom: "4px",
                }}>
                  {label}
                </div>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  color: "#1A1A1A",
                  lineHeight: 1.4,
                }}>
                  {value}
                </div>
              </div>
            ))}

            {/* Tags — coloured */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
              {tags.map(tag => {
                const c = tagColor(tag);
                return (
                  <span key={tag} style={{ display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: "999px", fontFamily: "var(--font-body)", fontSize: "12px", fontWeight: 500, background: c.bg, color: c.color, letterSpacing: "0.02em" }}>
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <article style={{ maxWidth: "720px" }}>

          {/* Title */}
          <div style={{ marginBottom: "64px" }}>
            <Eyebrow>DESIGN SYSTEM COLLABORATION · 2024–2025</Eyebrow>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "#1A1A1A",
              margin: "0 0 16px 0",
            }}>
              Code First
            </h1>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              color: "#666666",
              lineHeight: 1.6,
            }}>
              What Building Brad Frost's Component System in Reverse Taught Me About Design
            </p>
          </div>

          <Section eyebrow="OVERVIEW" heading="Project Overview">
            <Body>
              Most design system work starts in Figma. A designer builds a component library, documents the decisions, and then — sometimes — works with engineering to align implementation. The gap between design intent and code reality is treated as a translation problem: something to bridge after the fact.
            </Body>
            <Body>
              This project inverted that entirely. Working as part of Brad Frost's Maker Program, I joined a project where the code already existed. The challenge wasn't to design a system and hand it off — it was to understand an existing system deeply enough to contribute meaningfully at the component and token level, bring Figma into alignment with code reality, and use AI tooling to close the loop between the two.
            </Body>
            <Body>
              The result was a period of some of the most technically specific design system work I've done: reverse-engineering token relationships, rebuilding Figma components to match Storybook stories, and using Claude's Model Context Protocol to surface system structure that would otherwise require hours of manual investigation.
            </Body>
          </Section>

          <ArtifactPlaceholder
            title="Figma/Storybook Alignment Artifact"
            description="Add a screenshot showing Figma components aligned with their Storybook counterparts."
            aspectRatio="16/9"
            className="my-10"
          />

          <Section eyebrow="CONTEXT" heading="Starting From Code">
            <Body>
              Brad Frost's approach to design systems is rooted in Atomic Design — the idea that UIs are built from atoms to molecules to organisms, and that the smallest decisions compound upward. Working with his system meant operating in an environment where those principles were already embedded in the codebase, not aspirational documentation.
            </Body>
            <Body>
              The Maker Program is structured around real contribution: participants don't observe, they build. The expectation from day one was to read the existing codebase, understand how components were structured, identify gaps between design and implementation, and then close them — through Figma work, documentation, and direct collaboration with Brad and other contributors.
            </Body>
            <Body>
              This was a fundamentally different experience from owning a design system from scratch. Every decision had to be justified against an existing, principled structure rather than invented from first principles. That constraint turned out to be enormously useful.
            </Body>
          </Section>

          <Section eyebrow="MY ROLE" heading="Collaboration and Contribution">
            <Body>
              My work spanned three areas. The first was component archaeology: reading Storybook stories, tracing prop structures, and mapping how existing components composed. This wasn't glamorous work, but it was the prerequisite for everything else — you can't contribute to a design system you don't understand.
            </Body>
            <Body>
              The second was Figma alignment: rebuilding or updating Figma components to accurately reflect their code counterparts. This meant matching variant names to prop names, ensuring token usage was consistent, and eliminating the silent drift that accumulates when design and code evolve independently.
            </Body>
            <Body>
              The third was tooling: using Claude via MCP to interrogate system structure, surface token relationships, and accelerate the investigation work that would otherwise require extensive manual tracing. This was the most experimental part of the project and the one I learned the most from.
            </Body>
          </Section>

          <PullQuote>
            "Working code-first changes what you pay attention to. You stop asking 'what should this look like?' and start asking 'what does this actually do, and why?'"
          </PullQuote>

          <Section eyebrow="TECHNICAL WORK" heading="Token Alignment and Component Architecture">
            <Body>
              Token alignment was the most technically demanding part of the work. The system used a layered token structure — primitive values feeding into semantic aliases, which fed into component-level decisions. Understanding where a visual change should be made required tracing the full chain before touching anything.
            </Body>
            <Body>
              Several components had diverged between Figma and Storybook over time. Some were structural: variant names in Figma didn't match prop names in code, which made handoff ambiguous. Others were visual: spacing or color values had been updated in one place but not the other. The process of aligning these wasn't just cosmetic — it required understanding the intent behind each decision well enough to make the right reconciliation.
            </Body>
            <Body>
              Component architecture decisions in the codebase reflected years of atomic thinking. Certain patterns that I might have approached differently as a solo designer — like deeply nested composition patterns or explicit default prop handling — made more sense in context. That was a useful recalibration: understanding why a system is structured the way it is before proposing changes to it.
            </Body>
          </Section>

          <Section eyebrow="AI TOOLING" heading="Using Claude MCP for System Investigation">
            <Body>
              The most novel part of the project was using Claude's Model Context Protocol to assist with system investigation. MCP allows Claude to interact directly with local files and project structure, which made it possible to ask structural questions about the codebase — "what components use this token?", "where is this variant defined?" — and get answers grounded in the actual code rather than hallucinated from training data.
            </Body>
            <Body>
              This changed the pace of investigation work significantly. Manual token tracing across a large component library can take hours. Using MCP to surface relationships and then verify them manually reduced that to minutes for most queries. The workflow settled into a pattern: use Claude to generate a structural hypothesis, verify it against the source, then act on it.
            </Body>
            <Body>
              The limits were also instructive. MCP is powerful for surfacing structure, but it doesn't replace understanding. Queries that required design judgement — "is this the right token for this context?" — still needed a human answer. The tooling accelerated investigation; it didn't replace thinking.
            </Body>
          </Section>

          <ArtifactPlaceholder
            title="MCP Workflow Artifact"
            description="Add a screenshot of the MCP-assisted investigation flow for token and structure analysis."
            aspectRatio="16/9"
            className="my-10"
          />

          <PullQuote>
            "The best use of AI in design system work isn't generating components — it's accelerating the investigation that good system decisions depend on."
          </PullQuote>

          <Section eyebrow="LEARNINGS" heading="Key Learnings">
            <Body>
              <strong>Code-first is a design skill.</strong> Reading a codebase to understand design intent requires the same analytical rigour as reading a user research report. The information is just encoded differently.
            </Body>
            <Body>
              <strong>Token discipline is a long-term investment.</strong> Systems that maintain strict token layering are significantly easier to update consistently. The upfront cost of doing this well pays back compoundingly as the system scales.
            </Body>
            <Body>
              <strong>Figma–Storybook alignment requires active maintenance.</strong> Drift is the default state; alignment requires deliberate process. The question isn't whether it will drift — it's whether you've built the habit of closing the gap.
            </Body>
            <Body>
              <strong>AI tooling changes what's feasible in investigation.</strong> MCP-assisted system investigation made structural questions answerable in minutes that would previously have taken hours. That changes what you can reasonably attempt in a bounded project.
            </Body>
          </Section>

          {/* ── Live Demo Video ────────────────────────────────── */}
          <section style={{ marginBottom: "72px" }}>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 500,
              textTransform: "uppercase" as const,
              letterSpacing: "0.12em",
              color: "#8A8A8A",
              marginBottom: "12px",
            }}>
              LIVE DEMO
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(22px, 3vw, 32px)",
              fontWeight: 400,
              color: "#1A1A1A",
              lineHeight: 1.2,
              marginBottom: "16px",
            }}>
              Connecting the System to AI in Real Time
            </h2>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "16px",
              color: "#2C2C2C",
              lineHeight: 1.7,
              marginBottom: "24px",
            }}>
              To explore how AI tools could interact with a live design system, we connected the Figma component library to an MCP workflow and tested it in real time — alongside Brad Frost and TJ Pitre. This session demonstrates how AI can interrogate system structure, surface token relationships, and close the loop between design and code.
            </p>
            {/* YouTube embed */}
            <div style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              borderRadius: "16px",
              overflow: "hidden",
              background: "#0A0A0A",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}>
              <iframe
                src="https://www.youtube.com/embed/w6bHNKU_Tn8?start=2376"
                title="Brad Frost, Elleta McDaniel & TJ Pitre — Connecting Figma Design System to MCP"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </div>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              color: "#8A8A8A",
              marginTop: "12px",
              lineHeight: 1.5,
            }}>
              Recorded session with Brad Frost, TJ Pitre, and Elleta McDaniel — starts at the MCP integration demo (39:36).
            </p>
          </section>

          <Section eyebrow="REFLECTION" heading="Reflection">
            <Body>
              This project shifted my intuition about where design system work actually happens. The highest-value work isn't in the Figma file — it's in the alignment between design intent and implementation reality. That alignment requires a designer who can read code, trace decisions, and understand a system on its own terms before proposing changes to it.
            </Body>
            <Body>
              Working with Brad's system was the most rigorous design system experience I've had precisely because there was no greenfield freedom. Every decision was in conversation with something that already existed and had been thought through. That constraint is, I think, the most realistic version of design system work at scale — and the one worth getting good at.
            </Body>
          </Section>

          {/* Visual assets annotation */}
          <div style={{
            background: "#F5F4F1",
            borderLeft: "3px solid #CCCCCC",
            padding: "20px 24px",
            borderRadius: "4px",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            color: "#666666",
            lineHeight: 1.6,
          }}>
            <strong style={{ color: "#2C2C2C" }}>Visual assets to add:</strong>
            {" "}(1) Figma component library screenshot — aligned variant/prop structure.
            {" "}(2) Storybook component side-by-side with Figma counterpart.
            {" "}(3) Token layer diagram — primitive → semantic → component.
            {" "}(4) MCP workflow screenshot — terminal + design output.
          </div>

        </article>
      </div>
    </CaseStudyShell>
  );
}
