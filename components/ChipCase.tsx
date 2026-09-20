import CaseSection from "@/components/CaseSection";
import ExampleFrame from "@/components/ExampleFrame";
import LinkedPhrase from "@/components/LinkedPhrase";
import ShotZones, { type Zone } from "@/components/ShotZones";
import { Button } from "@/components/ui/Button";
import type { CaseStudy } from "@/lib/content";

/**
 * CHIP, on the case-study article pattern (Elleta, 20 Sep 2026;
 * approved mock case-study-chip-mock.html, section list approved in the
 * inbox, Part N item 2).
 *
 * Three sections, one idea each. CHIP is the case that annotates real
 * screenshots rather than recreated DOM, so its examples are crops of
 * her own hackathon build with percent-positioned zones over them
 * (ShotZones). Her own project on her own systems, so nothing here is a
 * client's: the hero's NDA line says exactly that.
 *
 * Zone geometry is copied from the mock, percent for percent.
 */
const INBOX: Zone[] = [
  { k: "caught", n: 1, left: 2.41, top: 5.45, width: 23.65, height: 8.69 },
  { k: "draft", n: 2, left: 8.34, top: 30.3, width: 74.72, height: 15.56 },
  { k: "approve", n: 3, left: 87.3, top: 5.66, width: 10.49, height: 28.69 },
];

const MAP: Zone[] = [
  { k: "score", n: 1, left: 21.74, top: 5.19, width: 56.35, height: 13.7 },
  { k: "red", n: 2, left: 27.03, top: 22.1, width: 21.92, height: 27.85 },
  { k: "drift", n: 3, left: 3.11, top: 22.1, width: 21.83, height: 31.27 },
];

const LOG: Zone[] = [
  { k: "counts", n: 1, left: 0, top: 0, width: 100, height: 43.97 },
  { k: "entry", n: 2, left: 0, top: 60, width: 70.17, height: 39.41 },
];

export default function ChipCase({ cs }: { cs: CaseStudy }) {
  void cs;
  return (
    <>
      <CaseSection
        index="01"
        kicker="The rule"
        heading="The agent never moves silently."
        phrases={["caught", "draft", "approve"]}
        figure={
          <ExampleFrame path="chip / bridge" caption="The approve inbox, from the hackathon build.">
            <ShotZones
              src="/images/case-studies/chip-approve-inbox.webp"
              alt="CHIP's approve inbox: drift alerts, each with a drafted fix and Approve, Decline and Triage buttons"
              width={1200}
              height={387}
              zones={INBOX}
            />
          </ExampleFrame>
        }
      >
        <p>
          CHIP scans my repos, Figma and Storybook. It{" "}
          <LinkedPhrase k="caught">catches the drift</LinkedPhrase>,{" "}
          <LinkedPhrase k="draft">drafts a fix</LinkedPhrase>, and then waits:{" "}
          <LinkedPhrase k="approve">nothing happens until I approve it</LinkedPhrase>.
        </p>
        <p>
          An agent reads what you wrote, not what you meant. So{" "}
          <strong>the human stays in the judgement layer</strong>, and every action is logged.
        </p>
      </CaseSection>

      <CaseSection
        index="02"
        kicker="My own systems"
        heading="Run it on my systems, not a client's."
        flip
        phrases={["score", "red", "drift"]}
        figure={
          <ExampleFrame path="chip / system map" caption="The system map, pointed at my own work.">
            <ShotZones
              src="/images/case-studies/chip-system-map.webp"
              alt="CHIP's system map: BELLA's surfaces scored, with drift and critical tags"
              width={1095}
              height={905}
              zones={MAP}
            />
          </ExampleFrame>
        }
      >
        <p>
          A course chapter treats a design system like a car: a check-engine light and a ten-station
          inspection. I pointed it at my own design system, portfolio and content engine, and{" "}
          <LinkedPhrase k="score">scored each on agent-readiness</LinkedPhrase>.
        </p>
        <p>
          The map shows <LinkedPhrase k="red">where it is critical</LinkedPhrase> and{" "}
          <LinkedPhrase k="drift">where it drifts</LinkedPhrase>. <strong>NDA-clean</strong>, and
          more honest.
        </p>
        <p className="case-section__action">
          <Button
            href="/demos/chip-bridge/index.html"
            newTab
            ariaLabel="Open the live CHIP prototype (opens in a new tab)"
          >
            Open the live prototype
          </Button>
        </p>
      </CaseSection>

      <CaseSection
        index="03"
        kicker="In public"
        heading="Build it in public, labelled a prototype."
        phrases={["counts", "entry"]}
        figure={
          <ExampleFrame path="chip / friction log" caption="The friction log, kept in public.">
            <ShotZones
              src="/images/case-studies/chip-friction-log.webp"
              alt="CHIP's friction log: counts of open, resolved and wishlist entries, and the first entry"
              width={1200}
              height={510}
              zones={LOG}
            />
          </ExampleFrame>
        }
      >
        <p>
          Honesty beats polish. The{" "}
          <LinkedPhrase k="counts">friction is counted in the open</LinkedPhrase>: what is still
          open, what is fixed, what is a wish.
        </p>
        <p>
          And each entry says <LinkedPhrase k="entry">what broke, in my own words</LinkedPhrase>, so
          the next version fixes <strong>real problems</strong>.
        </p>
      </CaseSection>

      <section className="case-close" aria-labelledby="case-close-heading">
        <div>
          <p className="text-code case-section__kicker">What changed</p>
          <h2 id="case-close-heading" className="case-section__heading">
            A human in control while the machine moves fast.
          </h2>
        </div>
        <div>
          <p>
            The hard part is not the tokens. <strong>That is the work I want to do with a team:</strong>{" "}
            design-system rigour, plus the guardrails that let AI move fast without losing the human
            call.
          </p>
          <p className="case-close__learned">
            Credit: the AI and design systems course by Brad Frost, Ian Frost and TJ Pitre.
          </p>
        </div>
      </section>
    </>
  );
}
