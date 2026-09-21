import CaseSection from "@/components/CaseSection";
import Container from "@/components/layout/Container";
import ExampleFrame from "@/components/ExampleFrame";
import LinkedPhrase from "@/components/LinkedPhrase";
import DriftStatusBoard from "@/components/DriftStatusBoard";
import { Button } from "@/components/ui/Button";
import { AuditChain, ButtonGrave, RolloutChain, TokenCascade } from "@/components/DriftExamples";
import type { CaseStudy } from "@/lib/content";

/**
 * From Drift to Foundation, on the case-study article pattern (Elleta,
 * 20 Sep 2026; approved mock case-study-drift-mock-v4.html).
 *
 * The article shape: five sections, one idea each, a short text column
 * beside one framed example, alternating sides, then the close. Every
 * claim is her existing approved copy from
 * content/case-studies/design-system-transformation.ts, shortened to
 * two or three paragraphs a section. Nothing new is asserted.
 *
 * What left with the rebuild (Part C item 6): the layer nav, the caps
 * labels, the reading-progress chrome around the beats, and the second
 * prototype button. The four beats keep their order and their meaning:
 * 01 the drift, 02 the audit, 03 tokens, 04 governance, and 05 how it
 * got built (Elleta's corrected copy, Part P, 21 Sep).
 */
export default function DriftV2({ cs }: { cs: CaseStudy }) {
  const lessons = cs.blocks?.find((b) => b.kind === "lessons") as { text: string } | undefined;
  const proto = cs.demoLinks?.at(-1);

  return (
    <>
      <CaseSection
        index="01"
        kicker="The drift"
        heading="Seventeen buttons that all did the same job."
        phrases={["corners", "weights", "click"]}
        figure={
          <ExampleFrame
            path="audit / buttons"
            caption="17 near-identical buttons from one product, side by side. Recreated."
          >
            <ButtonGrave />
          </ExampleFrame>
        }
      >
        <p>
          A B2B travel platform: flights, hotels, rail and car rental, all growing at once. Every
          sprint added one more local fix.
        </p>
        <p>
          They had <LinkedPhrase k="corners">different corners</LinkedPhrase>,{" "}
          <LinkedPhrase k="weights">different weights</LinkedPhrase>, and in the end{" "}
          <LinkedPhrase k="click">no one could tell what was clickable</LinkedPhrase>.
        </p>
        {/* ONE prototype action, directly after the paragraph it belongs
            to (Part C item 6). The case carried two links to the same
            recreation, v1 and v2; the newest one stands for both. */}
        {proto && (
          <p className="case-section__action">
            <Button href={proto.href} newTab ariaLabel="Open the live prototype (opens in a new tab)">
              Open the live prototype
            </Button>
          </p>
        )}
      </CaseSection>

      <CaseSection
        index="02"
        kicker="The audit"
        heading="One undocumented decision, three problems."
        flip
        phrases={["chip", "sort", "empty"]}
        figure={
          <ExampleFrame
            path="audit / search flow"
            caption="One decision nobody wrote down, rippling into three places. Recreated."
          >
            <AuditChain />
          </ExampleFrame>
        }
      >
        <p>
          I audited search, results, booking and forms, looking for the same need solved different
          ways.
        </p>
        <p>
          The <LinkedPhrase k="chip">filter chip existed four ways</LinkedPhrase>. That forced{" "}
          <LinkedPhrase k="sort">different sort positions</LinkedPhrase>, which broke the{" "}
          <LinkedPhrase k="empty">empty states</LinkedPhrase>.
        </p>
        <p>
          The audit turned <strong>&quot;it looks inconsistent&quot; into &quot;this costs us time, here is the evidence&quot;</strong>.
        </p>
      </CaseSection>

      <CaseSection
        index="03"
        kicker="Tokens under everything"
        heading="Decide once, and let it travel."
        phrases={["found", "sem", "comp"]}
        figure={
          <ExampleFrame path="tokens / cascade" caption="Recreated concept of the token cascade.">
            <TokenCascade />
          </ExampleFrame>
        }
      >
        <p>
          Instead of a button holding a hard-coded colour, it points at a named decision that says
          what the colour is <strong>for</strong>.
        </p>
        <p>
          The <LinkedPhrase k="found">foundation holds the raw value</LinkedPhrase>, the{" "}
          <LinkedPhrase k="sem">semantic layer says what it is for</LinkedPhrase>, and the{" "}
          <LinkedPhrase k="comp">component only reads the meaning</LinkedPhrase>.
        </p>
        <p>
          Try Break the link: the button keeps a colour the code no longer explains. Nobody notices,
          because the screen still looks fine.
        </p>
      </CaseSection>

      <CaseSection
        index="04"
        kicker="Governance"
        heading="Status, not enforcement."
        flip
        phrases={["status", "propose"]}
        figure={
          <ExampleFrame
            path="system hub / status"
            caption="Status in words and a shape, never colour alone. Recreated."
          >
            <DriftStatusBoard />
          </ExampleFrame>
        }
      >
        <p>
          The hard part is not building the system, it is stopping it from splitting again. Every
          component carried a <LinkedPhrase k="status">status anyone could read</LinkedPhrase>, and
          there was a{" "}
          <LinkedPhrase k="propose">low-friction way to propose changes</LinkedPhrase>.
        </p>
        <p>
          When an engineer reached for a pattern and found it <strong>already solved</strong>, the
          system earned its credibility.
        </p>
      </CaseSection>

      <CaseSection
        index="05"
        kicker="How it got built"
        heading="Nobody asked for a system."
        phrases={["built", "dev", "build", "cto"]}
        figure={
          <ExampleFrame
            path="rollout / how it happened"
            caption="How the system went from one designer's side project to every team's. Recreated."
          >
            <RolloutChain />
          </ExampleFrame>
        }
      >
        <p>
          When I proposed one, the answer was that it wasn&apos;t necessary. Docs and changelogs
          weren&apos;t either. I was working across six teams on the new platform while fixing the
          legacy one, so <LinkedPhrase k="built">I built it for myself</LinkedPhrase>.
        </p>
        <p>
          I had <LinkedPhrase k="dev">one developer from the start</LinkedPhrase>. He was already
          looking after the Figma library, so the system was a natural next step for him. I taught
          him the tokens and <LinkedPhrase k="build">we built the first components together</LinkedPhrase>.
        </p>
        <p>
          Around November I showed the work and was asked to{" "}
          <LinkedPhrase k="cto">present it to the CTO</LinkedPhrase>. After that I had a team.
        </p>
        <p>
          <strong>
            Not everyone was sold. It got easier with senior developers who wanted to build it with
            me. Later the system moved to every product team, and only approved changes reached
            code.
          </strong>
        </p>
      </CaseSection>

      <section className="l-section section--ruled case-close" aria-labelledby="case-close-heading">
        <Container className="case-close__grid">
          <div>
            <p className="text-code case-section__kicker">What changed</p>
            <h2 id="case-close-heading" className="case-section__heading">
              A shared language, not a cleanup.
            </h2>
          </div>
          <div>
            <p>
              Duplicated components became a smaller set of flexible building blocks, and the UI
              stopped being whatever the last sprint produced.{" "}
              <strong>
                The audit and the business case won investment for a dedicated design-systems team.
              </strong>
            </p>
            <p className="case-close__learned">
              What I learned: {lessons?.text?.split(/(?<=\.)\s/)[0] ??
                "inconsistency is rarely the root problem, it is a symptom of missing structure and undocumented decisions."}
            </p>
            <p className="case-close__learned">
              Next time: build the team first, name every component together, and get senior
              developers on board before building.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
