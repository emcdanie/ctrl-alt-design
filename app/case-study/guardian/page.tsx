import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import OverlayNav from "@/components/OverlayNav";
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
  { label: "YEAR", value: "2026" },
  { label: "ROLE", value: "Concept Lead — Interaction & Strategy" },
  { label: "TEAM", value: "5 Designers, 2 Developers" },
  { label: "TIMELINE", value: "1 week (Hackathon)" },
  { label: "SCOPE", value: "AI UX, Design System Governance, Figma Plugin Concept" },
  { label: "TOOLS", value: "Figma, Figma Make, React, Claude MCP" },
];

const tags = ["Design Systems", "AI UX", "Hackathon", "Governance"];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)",
      fontSize: "11px",
      fontWeight: 500,
      textTransform: "uppercase" as const,
      letterSpacing: "0.12em",
      color: "#8A8A8A",
      marginBottom: "12px",
    }}>
      {children}
    </p>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: "var(--font-display)",
      fontSize: "clamp(28px, 4vw, 40px)",
      fontWeight: 400,
      color: "#1A1A1A",
      lineHeight: 1.1,
      marginBottom: "20px",
      marginTop: "0",
    }}>
      {children}
    </h2>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-body)",
      fontSize: "16px",
      fontWeight: 400,
      color: "#2C2C2C",
      lineHeight: 1.7,
      marginBottom: "20px",
    }}>
      {children}
    </p>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote style={{
      fontFamily: "var(--font-display)",
      fontSize: "clamp(20px, 2.5vw, 26px)",
      fontStyle: "italic",
      color: "#2C2C2C",
      borderLeft: "3px solid #1A1A1A",
      paddingLeft: "24px",
      paddingTop: "16px",
      paddingBottom: "16px",
      background: "#F9F8F5",
      borderRadius: "4px",
      margin: "40px 0",
    }}>
      {children}
    </blockquote>
  );
}

function Section({ eyebrow, heading, children }: {
  eyebrow: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: "80px" }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <H2>{heading}</H2>
      {children}
    </section>
  );
}

export default function GuardianPage() {
  return (
    <main style={{ background: "#EDE8DF", minHeight: "100vh" }}>
      <CustomCursor />
      <OverlayNav />

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
          <source src="/videos/hackathon-showreel.mp4" type="video/mp4" />
        </video>
        {/* Play icon overlay fallback */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "rgba(255,255,255,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 4l12 6-12 6V4z" fill="white" />
            </svg>
          </div>
        </div>
      </div>

      {/* Back button (fixed floating) */}
      <Link
        href="/#work"
        className="hover:opacity-75 transition-opacity duration-150"
        style={{
          position: "fixed",
          bottom: "28px",
          left: "28px",
          zIndex: 50,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          fontWeight: 600,
          color: "#EDE8DF",
          textDecoration: "none",
          background: "#1A1814",
          borderRadius: "999px",
          padding: "10px 20px",
          letterSpacing: "0.02em",
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
        }}
      >
        ← All work
      </Link>

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
            <Eyebrow>HACKATHON CONCEPT · 2026</Eyebrow>
            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "#1A1A1A",
              margin: "0 0 16px 0",
            }}>
              From Isolation to Interpretation
            </h1>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "18px",
              color: "#666666",
              lineHeight: 1.6,
            }}>
              Designing a Context-Aware Design System Guardian
            </p>
          </div>

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
            title="Overview artifact"
            description="Insert supporting screenshot for the project overview."
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
            title="Interaction artifact"
            description="Insert screenshot of the interaction flow or console state."
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

          <Section eyebrow="LEARNINGS" heading="Key Learnings">
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
            {" "}(1) Guardian Loop circular diagram — Observe, Interpret, Communicate, Learn.
            {" "}(2) FigPal state map — idle, alert, thinking, success.
            {" "}(3) Design ↔ Code console annotated screenshot.
            {" "}(4) System Health Dashboard F1-style signals overview.
          </div>

        </article>
      </div>
    </main>
  );
}
