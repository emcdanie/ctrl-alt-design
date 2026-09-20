import CaseSection from "@/components/CaseSection";
import ExampleFrame from "@/components/ExampleFrame";
import LinkedPhrase from "@/components/LinkedPhrase";
import { Button } from "@/components/ui/Button";
import { CodeAlignment, LiveTokens, McpTranscript, NameMismatch } from "@/components/CodeFirstExamples";
import type { CaseStudy } from "@/lib/content";

/**
 * Code First, on the case-study article pattern (Elleta, 20 Sep 2026;
 * approved mock case-study-codefirst-mock.html, section list approved
 * in the inbox, Part N item 1).
 *
 * Four sections, one idea each, a short text column beside one framed
 * example, alternating sides. Every claim is her existing approved copy
 * from content/case-studies/brad-frost.ts and the mock; nothing new is
 * asserted. Section 04's label reads "Same discipline, here" (Part N).
 *
 * What left with the rebuild: the layer nav, "Run the journey", the caps
 * On system / Before toggle and the second prototype button.
 */
export default function CodeFirstV2({ cs }: { cs: CaseStudy }) {
  void cs;
  return (
    <>
      <CaseSection
        index="01"
        kicker="The mismatch"
        heading="Same button, two names."
        phrases={["fig", "sb", "gap"]}
        figure={
          <ExampleFrame
            path="figma ⇄ storybook / button"
            caption="Recreated and simplified from the real Button."
          >
            <NameMismatch />
          </ExampleFrame>
        }
      >
        <p>
          I opened the Figma file and the code side by side.{" "}
          <LinkedPhrase k="fig">Figma said &ldquo;Primary, Large&rdquo;</LinkedPhrase>.{" "}
          <LinkedPhrase k="sb">Storybook said variant: action, size: lg</LinkedPhrase>.
        </p>
        <p>
          Same component, different assumptions.{" "}
          <LinkedPhrase k="gap">A year of quiet drift</LinkedPhrase> had built up, and nobody
          noticed, because the system still looked right.
        </p>
      </CaseSection>

      <CaseSection
        index="02"
        kicker="Starting from code"
        heading="Read the code before touching Figma."
        flip
        phrases={["names", "chain"]}
        figure={
          <ExampleFrame path="alignment / button" caption="Figma now uses the code's names. Values recreated.">
            <CodeAlignment />
          </ExampleFrame>
        }
      >
        <p>
          Most design-system work starts in Figma. This one started in code, written by the person
          who coined Atomic Design.
        </p>
        <p>
          So I <LinkedPhrase k="names">renamed Figma to match the props</LinkedPhrase>, and before
          changing any colour I <LinkedPhrase k="chain">traced the whole token chain</LinkedPhrase>.
          Understand <strong>why it is built that way</strong> before you propose anything.
        </p>
      </CaseSection>

      <CaseSection
        index="03"
        kicker="AI in the loop"
        heading="Ask the codebase, not a guess."
        phrases={["q", "grounded", "human"]}
        figure={
          <ExampleFrame path="claude · mcp" caption="Recreated from the kind of questions I asked.">
            <McpTranscript />
          </ExampleFrame>
        }
      >
        <p>
          With Claude and MCP I could <LinkedPhrase k="q">ask structural questions</LinkedPhrase> and
          get <LinkedPhrase k="grounded">answers grounded in the actual code</LinkedPhrase>. Hours of
          manual tracing became minutes.
        </p>
        <p>
          The limits were useful too:{" "}
          <LinkedPhrase k="human">judgement still needed a human</LinkedPhrase>. The tool sped up the
          investigation. <strong>It did not replace the thinking.</strong>
        </p>
      </CaseSection>

      <CaseSection
        index="04"
        kicker="Same discipline, here"
        heading="On the site you're reading."
        flip
        phrases={["tokens", "gate"]}
        figure={
          <ExampleFrame path="this site / tokens (live)" caption="Live values from this page's stylesheet.">
            <LiveTokens />
          </ExampleFrame>
        }
      >
        <p>
          This portfolio runs the same way: <LinkedPhrase k="tokens">one token layer</LinkedPhrase>,
          one component per job, and{" "}
          <LinkedPhrase k="gate">a gate that fails the build on drift</LinkedPhrase>.
        </p>
        <p>The table reads its values live from this page. Switch the theme and watch them change.</p>
        <p className="case-section__action">
          <Button href="https://www.youtube.com/watch?v=w6bHNKU_Tn8&t=2376s" ariaLabel="Watch the session with Brad Frost and TJ Pitre (opens in a new tab)">
            Watch the session <span aria-hidden="true">↗</span>
          </Button>
        </p>
      </CaseSection>

      <section className="case-close" aria-labelledby="case-close-heading">
        <div>
          <p className="text-code case-section__kicker">What changed</p>
          <h2 id="case-close-heading" className="case-section__heading">
            Aligned, documented, maintainable.
          </h2>
        </div>
        <div>
          <p>
            Figma and Storybook match across the system. The token chain is written down, primitive
            to semantic to component. <strong>MCP became part of how I investigate a system.</strong>
          </p>
          <p className="case-close__learned">
            What I learned: reading code for design intent is a design skill. Drift is the default;
            alignment is a habit.
          </p>
        </div>
      </section>
    </>
  );
}
